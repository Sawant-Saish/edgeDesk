"use client";

import type { Scenario, ScenarioDifficulty } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";

interface ScenarioPickerProps {
  scenarios: Scenario[];
  selectedId: string | null;
  onSelect: (scenario: Scenario) => void;
  disabled?: boolean;
}

const difficultyVariant: Record<
  ScenarioDifficulty,
  "default" | "accent" | "outline"
> = {
  easy: "outline",
  medium: "default",
  hard: "accent",
};

export function ScenarioPicker({
  scenarios,
  selectedId,
  onSelect,
  disabled = false,
}: ScenarioPickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {scenarios.map((scenario) => {
        const isSelected = selectedId === scenario.id;
        return (
          <button
            key={scenario.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(scenario)}
            className={`
              text-left rounded-[var(--radius-md)] border p-4 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-text-dim)]"
              }
            `}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-[var(--color-text)]">
                {scenario.title}
              </span>
              <Tag variant={difficultyVariant[scenario.difficulty]}>
                {scenario.difficulty}
              </Tag>
            </div>
            <p className="text-xs font-mono text-[var(--color-text-dim)] mb-1">
              {scenario.clientName}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
              {scenario.openingMessage}
            </p>
          </button>
        );
      })}
    </div>
  );
}
