import demoData from "@/data/demo-profile.json";
import type { FreelancerProfile, Niche } from "@/lib/types";

const VALID_NICHES: Niche[] = [
  "writer",
  "designer",
  "developer",
  "marketer",
  "researcher",
  "pm",
];

function isValidNiche(value: string): value is Niche {
  return VALID_NICHES.includes(value as Niche);
}

export function getDemoProfile(): FreelancerProfile {
  const data = demoData as {
    niche: string;
    skills: string[];
    alreadyUsing: string[];
  };

  return {
    niche: isValidNiche(data.niche) ? data.niche : "writer",
    skills: data.skills,
    alreadyUsing: data.alreadyUsing,
  };
}
