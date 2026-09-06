import { Tag } from "@/components/ui/Tag";

const focusAreas = [
  "Multi-Agent Workflows",
  "Knowledge Retrieval & RAG",
  "Intelligent Analytics",
  "Workspace Automation",
];

interface TrackCardProps {
  trackNumber?: string;
}

export function TrackCard({ trackNumber = "01" }: TrackCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
      {/* Background track number */}
      <span
        className="pointer-events-none absolute right-4 top-2 text-[7rem] font-bold leading-none text-[var(--color-accent)] opacity-10 select-none"
        aria-hidden="true"
      >
        {trackNumber}
      </span>

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border-accent)] bg-[var(--color-bg-elevated)]">
            <span className="text-xl" role="img" aria-label="robot">
              🤖
            </span>
          </div>
        </div>

        <h2 className="mb-2 text-xl font-bold uppercase tracking-tight text-[var(--color-text)]">
          AI for Business &amp; Productivity
        </h2>
        <p className="mb-6 max-w-lg text-sm leading-relaxed text-[var(--color-text-muted)]">
          Build intelligent solutions that help freelancers automate, optimize,
          and make better client decisions.
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {focusAreas.map((area) => (
            <Tag key={area}>{area}</Tag>
          ))}
        </div>

        <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-[var(--color-accent)]">▸</span>
            Tool/Trend Radar — ranked AI &amp; productivity recommendations
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-[var(--color-accent)]">▸</span>
            Client-Scenario Simulator — practice difficult client conversations
          </li>
        </ul>
      </div>
    </div>
  );
}
