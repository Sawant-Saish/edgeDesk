import toolsData from "@/data/tools.json";
import type { Tool, ToolsDataset, ToolCategory, Niche } from "./types";

const VALID_CATEGORIES: ToolCategory[] = [
  "writing",
  "design",
  "dev",
  "research",
  "pm-crm",
];

const VALID_NICHES: Niche[] = [
  "writer",
  "designer",
  "developer",
  "marketer",
  "researcher",
  "pm",
];

function validateTool(tool: Tool, index: number): void {
  if (!tool.id || !tool.name) {
    throw new Error(`Tool at index ${index} is missing id or name`);
  }

  if (!VALID_CATEGORIES.includes(tool.category)) {
    throw new Error(`Tool "${tool.id}" has invalid category: ${tool.category}`);
  }

  if (!tool.niches?.length) {
    throw new Error(`Tool "${tool.id}" must have at least one niche`);
  }

  for (const niche of tool.niches) {
    if (!VALID_NICHES.includes(niche)) {
      throw new Error(`Tool "${tool.id}" has invalid niche: ${niche}`);
    }
  }

  if (!tool.skills?.length) {
    throw new Error(`Tool "${tool.id}" must have at least one skill`);
  }

  if (tool.roiScore < 1 || tool.roiScore > 10) {
    throw new Error(`Tool "${tool.id}" roiScore must be between 1 and 10`);
  }

  if (!tool.whyTemplates?.default) {
    throw new Error(`Tool "${tool.id}" must have whyTemplates.default`);
  }
}

function validateDataset(data: ToolsDataset): Tool[] {
  if (!data.tools?.length) {
    throw new Error("tools.json must contain at least one tool");
  }

  const ids = new Set<string>();
  for (let i = 0; i < data.tools.length; i++) {
    const tool = data.tools[i];
    validateTool(tool, i);

    if (ids.has(tool.id)) {
      throw new Error(`Duplicate tool id: ${tool.id}`);
    }
    ids.add(tool.id);
  }

  return data.tools;
}

const validatedTools = validateDataset(toolsData as unknown as ToolsDataset);

export function loadTools(): Tool[] {
  return validatedTools;
}

export function getToolById(id: string): Tool | undefined {
  return validatedTools.find((tool) => tool.id === id);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return validatedTools.filter((tool) => tool.category === category);
}

export function getToolCount(): number {
  return validatedTools.length;
}
