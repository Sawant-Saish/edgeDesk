import type { Niche, Tool } from "@/lib/types";

export function getWhyLine(tool: Tool, niche: Niche): string {
  return tool.whyTemplates[niche] ?? tool.whyTemplates.default;
}
