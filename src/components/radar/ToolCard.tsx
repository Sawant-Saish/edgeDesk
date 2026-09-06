"use client";

import { useState } from "react";
import type { RadarRecommendation, ScoreBreakdown } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

interface ToolCardProps {
  recommendation: RadarRecommendation;
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <span className="w-24 shrink-0 text-[var(--color-text-dim)]">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
        <div
          className="h-full bg-[var(--color-accent)] rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-[var(--color-text-muted)]">{value}</span>
    </div>
  );
}

function ScoreBreakdownPanel({ breakdown }: { breakdown: ScoreBreakdown }) {
  return (
    <div className="mt-4 space-y-2 border-t border-[var(--color-border)] pt-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)] mb-3">
        Score breakdown
      </p>
      <ScoreBar label="Niche" value={breakdown.nicheMatch} max={35} />
      <ScoreBar label="Skills" value={breakdown.skillOverlap} max={30} />
      <ScoreBar label="ROI" value={breakdown.roi} max={25} />
      <ScoreBar label="Novelty" value={breakdown.noveltyBonus} max={10} />
    </div>
  );
}

export function ToolCard({ recommendation }: ToolCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { rank, tool, score, scoreBreakdown, why } = recommendation;

  const rankStyles =
    rank === 1
      ? "border-[var(--color-accent)] text-[var(--color-accent)]"
      : "border-[var(--color-border)] text-[var(--color-text-muted)]";

  return (
    <Card accent={rank === 1} className="relative">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border font-mono text-lg font-bold ${rankStyles}`}
        >
          #{rank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-[var(--color-text)]">
              {tool.name}
            </h3>
            <Tag>{tool.category}</Tag>
            <Tag variant="accent">ROI {tool.roiScore}/10</Tag>
          </div>

          <p className="mb-2 text-sm text-[var(--color-text-muted)]">
            {tool.oneLiner}
          </p>

          <p className="mb-3 text-sm leading-relaxed text-[var(--color-text)]">
            <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider">
              Why this tool →{" "}
            </span>
            {why}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-[var(--color-text-dim)]">
              Score: {score.toFixed(1)}
            </span>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--color-accent)] hover:underline"
            >
              Visit site →
            </a>
            <button
              type="button"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="font-mono text-xs text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
            >
              [{showBreakdown ? "hide" : "show"} breakdown]
            </button>
          </div>

          {showBreakdown && <ScoreBreakdownPanel breakdown={scoreBreakdown} />}
        </div>
      </div>
    </Card>
  );
}
