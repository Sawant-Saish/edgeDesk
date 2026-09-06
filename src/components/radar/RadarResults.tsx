"use client";

import type { RadarRecommendation } from "@/lib/types";
import { ToolCard } from "./ToolCard";

interface RadarResultsProps {
  results: RadarRecommendation[];
  retrievedCount: number;
  cached: boolean;
  loading?: boolean;
}

export function RadarResults({
  results,
  retrievedCount,
  cached,
  loading = false,
}: RadarResultsProps) {
  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-text-dim)] animate-pulse">
          Retrieving &amp; ranking tools...
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-[var(--color-text-muted)]">
          No recommendations yet. Fill in your profile and run the radar.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-dim)]">
          Retrieved {retrievedCount} tools → ranked top {results.length}
        </p>
        {cached && (
          <span className="font-mono text-xs text-[var(--color-accent)]">
            [cached result]
          </span>
        )}
      </div>

      <div className="space-y-4">
        {results.map((rec) => (
          <ToolCard key={rec.tool.id} recommendation={rec} />
        ))}
      </div>
    </div>
  );
}
