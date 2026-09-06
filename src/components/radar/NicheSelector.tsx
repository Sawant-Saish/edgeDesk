"use client";

import { NICHES, type Niche } from "@/lib/types";

interface NicheSelectorProps {
  niche: Niche;
  skills: string;
  onNicheChange: (niche: Niche) => void;
  onSkillsChange: (skills: string) => void;
}

export function NicheSelector({
  niche,
  skills,
  onNicheChange,
  onSkillsChange,
}: NicheSelectorProps) {
  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="niche"
          className="mb-2 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-dim)]"
        >
          Your niche
        </label>
        <select
          id="niche"
          value={niche}
          onChange={(e) => onNicheChange(e.target.value as Niche)}
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
        >
          {NICHES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="skills"
          className="mb-2 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-dim)]"
        >
          Your skills
        </label>
        <input
          id="skills"
          type="text"
          value={skills}
          onChange={(e) => onSkillsChange(e.target.value)}
          placeholder="e.g. seo, blogging, email-copy"
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        <p className="mt-2 text-xs text-[var(--color-text-dim)]">
          Comma-separated. Used for skill-overlap scoring against the dataset.
        </p>
      </div>
    </div>
  );
}
