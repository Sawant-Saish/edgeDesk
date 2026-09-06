import { NextResponse } from "next/server";
import { getCachedRadar, getRadarCacheKey, setCachedRadar } from "@/lib/cache";
import { USER_MESSAGES } from "@/lib/errors";
import { rankTools } from "@/lib/radar/score-tools";
import { loadTools } from "@/lib/tools-loader";
import type { Niche, RadarInput, RadarResponse } from "@/lib/types";
import { NICHES } from "@/lib/types";

const VALID_NICHES = new Set(NICHES.map((n) => n.value));

function parseBody(body: unknown): RadarInput | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object" };
  }

  const { niche, skills, alreadyUsing } = body as Record<string, unknown>;

  if (!niche || typeof niche !== "string" || !VALID_NICHES.has(niche as Niche)) {
    return { error: "Invalid or missing niche" };
  }

  if (!Array.isArray(skills)) {
    return { error: "skills must be an array of strings" };
  }

  if (!Array.isArray(alreadyUsing)) {
    return { error: "alreadyUsing must be an array of tool ids" };
  }

  const parsedSkills = skills
    .filter((s): s is string => typeof s === "string")
    .map((s) => s.trim())
    .filter(Boolean);

  const parsedAlreadyUsing = alreadyUsing
    .filter((s): s is string => typeof s === "string")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    niche: niche as Niche,
    skills: parsedSkills,
    alreadyUsing: parsedAlreadyUsing,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseBody(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const cacheKey = getRadarCacheKey(parsed);
    const cached = getCachedRadar(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const tools = loadTools();
    const { retrievedCount, recommendations } = rankTools(parsed, tools);

    const response: RadarResponse = {
      input: parsed,
      retrievedCount,
      recommendations: recommendations.map((rec, index) => ({
        ...rec,
        rank: index + 1,
      })),
      cached: false,
    };

    setCachedRadar(cacheKey, response);

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: USER_MESSAGES.serverError },
      { status: 500 }
    );
  }
}
