import type { ToolCategory, Niche } from "@/lib/types";

const NICHE_CATEGORY_WEIGHTS: Record<Niche, Partial<Record<ToolCategory, number>>> = {
  writer: { writing: 1.0, research: 0.5, "pm-crm": 0.3 },
  designer: { design: 1.0, dev: 0.3, writing: 0.2 },
  developer: { dev: 1.0, design: 0.3, "pm-crm": 0.4, research: 0.2 },
  marketer: { writing: 0.8, design: 0.6, "pm-crm": 0.7, research: 0.4 },
  researcher: { research: 1.0, writing: 0.5, "pm-crm": 0.3 },
  pm: { "pm-crm": 1.0, research: 0.5, dev: 0.4, writing: 0.3 },
};

export function getCategoryWeight(niche: Niche, category: ToolCategory): number {
  return NICHE_CATEGORY_WEIGHTS[niche][category] ?? 0;
}

export function getCategoryWeights(niche: Niche): Partial<Record<ToolCategory, number>> {
  return NICHE_CATEGORY_WEIGHTS[niche];
}
