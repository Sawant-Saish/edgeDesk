"use client";

import type { Tool } from "@/lib/types";

interface ToolsAlreadyUsingProps {
  tools: Tool[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function ToolsAlreadyUsing({
  tools,
  selected,
  onChange,
}: ToolsAlreadyUsingProps) {
  function toggle(toolId: string) {
    if (selected.includes(toolId)) {
      onChange(selected.filter((id) => id !== toolId));
    } else {
      onChange([...selected, toolId]);
    }
  }

  const sorted = [...tools].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-text-dim)]">
        Tools you already use
      </p>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
        {sorted.map((tool) => {
          const isSelected = selected.includes(tool.id);
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => toggle(tool.id)}
              className={`
                px-3 py-1.5 text-xs font-mono rounded-[var(--radius-sm)] border transition-colors
                ${
                  isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-dim)]"
                }
              `}
            >
              {tool.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-[var(--color-text-dim)]">
        Selected tools are excluded from recommendations.
      </p>
    </div>
  );
}
