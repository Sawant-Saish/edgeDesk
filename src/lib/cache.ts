import type { RadarResponse } from "@/lib/types";

const cache = new Map<string, RadarResponse>();
const MAX_CACHE_SIZE = 100;

export function getRadarCacheKey(input: {
  niche: string;
  skills: string[];
  alreadyUsing: string[];
}): string {
  const normalized = {
    niche: input.niche,
    skills: [...input.skills].map((s) => s.toLowerCase().trim()).sort(),
    alreadyUsing: [...input.alreadyUsing].sort(),
  };
  return JSON.stringify(normalized);
}

export function getCachedRadar(key: string): RadarResponse | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  return { ...entry, cached: true };
}

export function setCachedRadar(key: string, result: RadarResponse): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, { ...result, cached: false });
}
