import {
  DEFAULT_PROFILE,
  PROFILE_STORAGE_KEY,
  type FreelancerProfile,
  type Niche,
} from "@/lib/types";

function isValidNiche(value: unknown): value is Niche {
  return (
    value === "writer" ||
    value === "designer" ||
    value === "developer" ||
    value === "marketer" ||
    value === "researcher" ||
    value === "pm"
  );
}

export function skillsToString(skills: string[]): string {
  return skills.join(", ");
}

export function skillsFromString(raw: string): string[] {
  return raw
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function loadProfile(): FreelancerProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;

    const parsed = JSON.parse(raw) as Partial<FreelancerProfile>;

    return {
      niche: isValidNiche(parsed.niche) ? parsed.niche : DEFAULT_PROFILE.niche,
      skills: Array.isArray(parsed.skills)
        ? parsed.skills.filter((s): s is string => typeof s === "string")
        : DEFAULT_PROFILE.skills,
      alreadyUsing: Array.isArray(parsed.alreadyUsing)
        ? parsed.alreadyUsing.filter((s): s is string => typeof s === "string")
        : DEFAULT_PROFILE.alreadyUsing,
      lastRadarAt:
        typeof parsed.lastRadarAt === "string" ? parsed.lastRadarAt : undefined,
      lastScenarioId:
        typeof parsed.lastScenarioId === "string"
          ? parsed.lastScenarioId
          : undefined,
      resumeFileName:
        typeof parsed.resumeFileName === "string"
          ? parsed.resumeFileName
          : undefined,
      resumeText:
        typeof parsed.resumeText === "string" ? parsed.resumeText : undefined,
      resumeParsedAt:
        typeof parsed.resumeParsedAt === "string"
          ? parsed.resumeParsedAt
          : undefined,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: FreelancerProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}
