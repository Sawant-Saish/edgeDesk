const { z } = require('zod');

/**
 * Shared Zod schemas for LLM structured outputs.
 * Controllers/services must never trust LLM JSON until it passes here.
 */

const resumeExtractionSchema = z.object({
  skills: z
    .array(
      z.object({
        skillId: z.string().min(1),
        confidence: z.number().min(0).max(1),
        evidenceSnippet: z.string().max(200),
      })
    )
    .default([]),
  yearsExperience: z.number().min(0).max(50).default(0),
});

const gapExplanationSchema = z.object({
  explanationText: z.string().min(1).max(400),
});

const negotiationReplySchema = z.object({
  reply: z.string().min(1).max(500),
});

const negotiationScorecardSchema = z.object({
  finalAgreedPriceUSD: z.number().nullable(),
  clarityScore: z.number().min(0).max(10),
  boundaryScore: z.number().min(0).max(10),
  professionalismScore: z.number().min(0).max(10),
  summaryText: z.string().min(1).max(500),
});

const schemas = {
  resumeExtraction: resumeExtractionSchema,
  gapExplanation: gapExplanationSchema,
  negotiationReply: negotiationReplySchema,
  negotiationScorecard: negotiationScorecardSchema,
};

/**
 * Validate data against a named schema.
 * @returns {{ success: true, data } | { success: false, error: string }}
 */
function validateSchema(schemaName, data) {
  const schema = schemas[schemaName];
  if (!schema) {
    return { success: false, error: `Unknown schema: ${schemaName}` };
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
      .join('; ');
    return { success: false, error: message };
  }
  return { success: true, data: result.data };
}

module.exports = {
  schemas,
  validateSchema,
  resumeExtractionSchema,
  gapExplanationSchema,
  negotiationReplySchema,
  negotiationScorecardSchema,
};
