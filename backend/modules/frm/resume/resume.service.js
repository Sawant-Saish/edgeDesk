const crypto = require('crypto');
const pdfParse = require('pdf-parse');
const SkillProfile = require('./resume.model');
const { callLLM, LLMValidationError } = require('../shared/llmClient');
const {
  getTaxonomyForPrompt,
  resolveSkillId,
  skillById,
} = require('../skillGap/skillTaxonomy.data');

async function extractTextFromPdf(buffer) {
  const result = await pdfParse(buffer);
  return (result.text || '').trim();
}

function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function buildExtractionSystemPrompt() {
  return `You extract skills from resume text. You may ONLY use skill names from this closed list: ${getTaxonomyForPrompt()}.
Do not invent skills that are not in this list. If the resume mentions a skill not in the list, ignore it.
For each skill you find, give a confidence score 0-1 and the exact sentence/phrase that justifies it.
Return ONLY valid JSON matching this shape, nothing else:
{ "skills": [{ "skillId": "...", "confidence": 0.0, "evidenceSnippet": "..." }], "yearsExperience": 0 }
If you are not confident about a skill, do not include it rather than guessing.
ONLY valid JSON, no other text.`;
}

/**
 * Map LLM skillIds through alias table; drop unknowns.
 */
function sanitizeSkills(skills) {
  const seen = new Set();
  const cleaned = [];
  const dropped = [];

  for (const item of skills || []) {
    const resolved = resolveSkillId(item.skillId);
    if (!resolved) {
      dropped.push(item.skillId);
      continue;
    }
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    cleaned.push({
      skillId: resolved,
      confidence: Math.max(0, Math.min(1, Number(item.confidence) || 0)),
      evidenceSnippet: String(item.evidenceSnippet || '').slice(0, 200),
    });
  }

  if (dropped.length) {
    console.warn('[resume.service] Dropped unknown skillIds:', dropped);
  }

  return cleaned;
}

async function processResumeText({ userId, text, sourceType }) {
  const rawText = String(text || '').trim();
  if (rawText.length < 40) {
    const err = new Error('Resume text too short to analyze.');
    err.code = 'extraction_failed';
    err.statusCode = 422;
    throw err;
  }

  const truncated = rawText.slice(0, 24000);
  const rawTextHash = hashText(truncated);

  const cached = await SkillProfile.findOne({ userId, rawTextHash }).sort({ createdAt: -1 });
  if (cached) {
    return formatProfile(cached);
  }

  let llmResult;
  try {
    llmResult = await callLLM({
      systemPrompt: buildExtractionSystemPrompt(),
      userPrompt: truncated,
      responseSchema: 'resumeExtraction',
      maxRetries: 1,
      temperature: 0,
    });
  } catch (err) {
    if (err instanceof LLMValidationError || err.name === 'LLMValidationError') {
      const e = new Error(
        'Could not confidently extract skills. Try pasting text instead of PDF.'
      );
      e.code = 'extraction_failed';
      e.statusCode = 422;
      throw e;
    }
    throw err;
  }

  const extractedSkills = sanitizeSkills(llmResult.data.skills);
  if (extractedSkills.length === 0) {
    const e = new Error(
      'Could not confidently extract skills. Try pasting text instead of PDF.'
    );
    e.code = 'extraction_failed';
    e.statusCode = 422;
    throw e;
  }

  const profile = await SkillProfile.create({
    userId,
    sourceType,
    rawTextHash,
    extractedSkills,
    yearsExperience: llmResult.data.yearsExperience || 0,
    extractionModel: llmResult.model,
  });

  return formatProfile(profile);
}

function formatProfile(profile) {
  const extractedSkills = profile.extractedSkills.map((s) => ({
    skillId: s.skillId,
    displayName: skillById[s.skillId]?.displayName || s.skillId,
    confidence: s.confidence,
    evidenceSnippet: s.evidenceSnippet,
  }));

  const lowConfidenceWarning = extractedSkills.some((s) => s.confidence < 0.55);

  return {
    skillProfileId: String(profile._id),
    extractedSkills,
    yearsExperience: profile.yearsExperience,
    lowConfidenceWarning,
  };
}

async function getProfileForUser(skillProfileId, userId) {
  return SkillProfile.findOne({ _id: skillProfileId, userId });
}

module.exports = {
  extractTextFromPdf,
  processResumeText,
  getProfileForUser,
  sanitizeSkills,
  formatProfile,
};
