import { getWhyLine } from "./format-why";
import { getCategoryWeight } from "./match-niche";
import type {
  Niche,
  RadarInput,
  RadarRecommendation,
  ScoreBreakdown,
  Tool,
} from "@/lib/types";

const RETRIEVAL_CATEGORY_THRESHOLD = 0.3;

function normalizeToken(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}

function parseSkills(skills: string[]): string[] {
  return skills
    .flatMap((skill) => skill.split(/[,;]+/))
    .map(normalizeToken)
    .filter(Boolean);
}

function countSkillOverlap(userSkills: string[], toolSkills: string[]): number {
  if (userSkills.length === 0) return 0;

  let matches = 0;
  for (const userSkill of userSkills) {
    const matched = toolSkills.some(
      (toolSkill) =>
        toolSkill === userSkill ||
        toolSkill.includes(userSkill) ||
        userSkill.includes(toolSkill)
    );
    if (matched) matches++;
  }

  return matches;
}

function computeSkillOverlapScore(userSkills: string[], tool: Tool): number {
  const normalizedToolSkills = tool.skills.map(normalizeToken);
  const matches = countSkillOverlap(userSkills, normalizedToolSkills);
  const ratio = matches / Math.max(userSkills.length, 1);
  return Math.round(ratio * 30);
}

function computeNicheMatchScore(niche: Niche, tool: Tool): number {
  let score = 0;

  if (tool.niches.includes(niche)) {
    score += 25;
  }

  const categoryWeight = getCategoryWeight(niche, tool.category);
  score += Math.round(categoryWeight * 10);

  return Math.min(score, 35);
}

function computeRoiScore(tool: Tool): number {
  return Math.round((tool.roiScore / 10) * 25);
}

function isRetrieved(niche: Niche, userSkills: string[], tool: Tool): boolean {
  if (tool.niches.includes(niche)) return true;

  const categoryWeight = getCategoryWeight(niche, tool.category);
  if (categoryWeight >= RETRIEVAL_CATEGORY_THRESHOLD) return true;

  const normalizedToolSkills = tool.skills.map(normalizeToken);
  return countSkillOverlap(userSkills, normalizedToolSkills) > 0;
}

function scoreTool(
  niche: Niche,
  userSkills: string[],
  tool: Tool
): { score: number; scoreBreakdown: ScoreBreakdown } {
  const nicheMatch = computeNicheMatchScore(niche, tool);
  const skillOverlap = computeSkillOverlapScore(userSkills, tool);
  const roi = computeRoiScore(tool);
  const noveltyBonus = 10;

  const score = nicheMatch + skillOverlap + roi + noveltyBonus;

  return {
    score,
    scoreBreakdown: { nicheMatch, skillOverlap, roi, noveltyBonus },
  };
}

export function rankTools(input: RadarInput, tools: Tool[]): {
  retrievedCount: number;
  recommendations: Omit<RadarRecommendation, "rank">[];
} {
  const userSkills = parseSkills(input.skills);
  const alreadyUsingSet = new Set(
    input.alreadyUsing.map((id) => id.toLowerCase())
  );

  const candidates = tools.filter((tool) => !alreadyUsingSet.has(tool.id));

  const retrieved = candidates.filter((tool) =>
    isRetrieved(input.niche, userSkills, tool)
  );

  const pool = retrieved.length > 0 ? retrieved : candidates;

  const scored = pool
    .map((tool) => {
      const { score, scoreBreakdown } = scoreTool(input.niche, userSkills, tool);
      return {
        tool,
        score,
        scoreBreakdown,
        why: getWhyLine(tool, input.niche),
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    retrievedCount: pool.length,
    recommendations: scored,
  };
}
