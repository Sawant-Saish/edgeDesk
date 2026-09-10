const SkillGapResult = require('./skillGap.model');
const { roleById, isValidRoleId } = require('./roleRequirements.data');
const { skillById } = require('./skillTaxonomy.data');
const { callLLM } = require('../shared/llmClient');
const resumeService = require('../resume/resume.service');

/**
 * DETERMINISTIC set-difference. No LLM involved in the math.
 */
function computeGap(userSkillIds, requiredSkillIds) {
  const userSet = new Set(userSkillIds);
  const matchedSkills = requiredSkillIds.filter((id) => userSet.has(id));
  const missingSkills = requiredSkillIds.filter((id) => !userSet.has(id));
  const matchPercentage =
    requiredSkillIds.length === 0
      ? 0
      : Math.round((matchedSkills.length / requiredSkillIds.length) * 100);

  return { matchedSkills, missingSkills, matchPercentage };
}

async function explainGap({ roleName, matchedSkills, missingSkills }) {
  const matchedNames = matchedSkills.map((id) => skillById[id]?.displayName || id);
  const missingNames = missingSkills.map((id) => skillById[id]?.displayName || id);

  try {
    const result = await callLLM({
      systemPrompt: `Given this matched skills list and this missing skills list for the role "${roleName}", write a 1-2 sentence
encouraging but honest explanation for a junior freelancer. Do not mention any skill not in these two lists.
Return ONLY: { "explanationText": "..." }
ONLY valid JSON, no other text.`,
      userPrompt: JSON.stringify({ matched: matchedNames, missing: missingNames }),
      responseSchema: 'gapExplanation',
      maxRetries: 1,
      temperature: 0,
    });
    return result.data.explanationText;
  } catch {
    return `You match ${matchedNames.length} required skills for ${roleName}. Focus next on: ${missingNames.slice(0, 4).join(', ') || 'none'}.`;
  }
}

async function getSkillGap({ userId, skillProfileId, targetRoleId }) {
  if (!isValidRoleId(targetRoleId)) {
    const err = new Error('targetRoleId must be one of the fixed role dropdown values.');
    err.code = 'invalid_role';
    err.statusCode = 400;
    throw err;
  }

  const profile = await resumeService.getProfileForUser(skillProfileId, userId);
  if (!profile) {
    const err = new Error('Skill profile not found.');
    err.code = 'not_found';
    err.statusCode = 404;
    throw err;
  }

  const role = roleById[targetRoleId];
  const userSkillIds = profile.extractedSkills.map((s) => s.skillId);
  const { matchedSkills, missingSkills, matchPercentage } = computeGap(
    userSkillIds,
    role.requiredSkillIds
  );

  const explanationText = await explainGap({
    roleName: role.displayName,
    matchedSkills,
    missingSkills,
  });

  await SkillGapResult.create({
    userId,
    targetRoleId,
    missingSkills,
    matchedSkills,
    matchPercentage,
    explanationText,
  });

  return {
    targetRoleId,
    matchPercentage,
    matchedSkills,
    missingSkills,
    explanationText,
  };
}

module.exports = {
  computeGap,
  getSkillGap,
};
