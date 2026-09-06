"use client";

import Link from "next/link";
import { useFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { skillsToString } from "@/lib/storage";
import { NICHES } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";

export function UserProfileBar() {
  const { profile } = useFreelancerProfile();

  const nicheLabel =
    NICHES.find((n) => n.value === profile.niche)?.label ?? profile.niche;
  const skillsDisplay = skillsToString(profile.skills);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">
          Profile
        </span>
        <Tag variant="accent">{nicheLabel}</Tag>
        {skillsDisplay && (
          <span className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">
            {skillsDisplay}
          </span>
        )}
        {profile.alreadyUsing.length > 0 && (
          <span className="text-xs font-mono text-[var(--color-text-dim)]">
            · {profile.alreadyUsing.length} tools excluded
          </span>
        )}
      </div>
      <Link
        href="/"
        className="font-mono text-xs text-[var(--color-accent)] hover:underline shrink-0"
      >
        Edit profile →
      </Link>
    </div>
  );
}
