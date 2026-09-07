import { complete } from "@/lib/simulator/llm";
import { loadTools } from "@/lib/tools-loader";
import type { Niche, ParsedResumeResponse, Tool } from "@/lib/types";

const VALID_NICHES: Niche[] = [
  "writer",
  "designer",
  "developer",
  "marketer",
  "researcher",
  "pm",
];

function buildSystemPrompt(tools: Tool[]): string {
  const toolList = tools.map((t) => `${t.id}: ${t.name}`).join(", ");

  return `You analyze freelancer resumes and portfolios to extract a structured profile.

Return JSON only with this exact shape:
{
  "niche": "writer" | "designer" | "developer" | "marketer" | "researcher" | "pm",
  "skills": ["skill1", "skill2"],
  "alreadyUsing": ["tool-id1", "tool-id2"],
  "summary": "One sentence describing the freelancer's focus."
}

Rules:
- niche must be the single best fit from the allowed values
- skills: 3-8 lowercase, hyphenated keywords relevant to freelancing (e.g. "seo", "email-copy", "react")
- alreadyUsing: only tool IDs from this list that the person clearly uses or mentions: ${toolList}
- If no tools are mentioned, return an empty alreadyUsing array
- summary: concise, professional, max 25 words`;
}

export function parseResumeJson(
  raw: string,
  tools: Tool[]
): ParsedResumeResponse {
  const validToolIds = new Set(tools.map((t) => t.id));

  try {
    const parsed = JSON.parse(raw) as Partial<ParsedResumeResponse>;

    const niche = VALID_NICHES.includes(parsed.niche as Niche)
      ? (parsed.niche as Niche)
      : "writer";

    const skills = Array.isArray(parsed.skills)
      ? parsed.skills
          .filter((s): s is string => typeof s === "string")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 12)
      : [];

    const alreadyUsing = Array.isArray(parsed.alreadyUsing)
      ? parsed.alreadyUsing
          .filter((id): id is string => typeof id === "string")
          .filter((id) => validToolIds.has(id))
          .slice(0, 10)
      : [];

    const summary =
      typeof parsed.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : "Freelancer profile extracted from uploaded document.";

    return {
      niche,
      skills: skills.length > 0 ? skills : ["general"],
      alreadyUsing,
      summary,
    };
  } catch {
    return {
      niche: "writer",
      skills: ["general"],
      alreadyUsing: [],
      summary: "Freelancer profile extracted from uploaded document.",
    };
  }
}

export async function analyzeResumeText(
  text: string
): Promise<ParsedResumeResponse> {
  const tools = loadTools();
  const trimmed = text.trim();

  if (!trimmed) {
    throw new Error("Document is empty or could not be read.");
  }

  const excerpt = trimmed.slice(0, 12_000);

  const raw = await complete({
    system: buildSystemPrompt(tools),
    messages: [
      {
        role: "user",
        content: `Analyze this resume/document and extract the freelancer profile:\n\n${excerpt}`,
      },
    ],
    maxTokens: 400,
    jsonMode: true,
    temperature: 0.3,
  });

  return parseResumeJson(raw, tools);
}
