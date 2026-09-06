import { RadarClient } from "@/components/radar/RadarClient";
import { DemoProgress } from "@/components/layout/DemoProgress";
import { UserProfileBar } from "@/components/shared/UserProfileBar";
import { Tag } from "@/components/ui/Tag";
import { loadTools } from "@/lib/tools-loader";

const tools = loadTools();

export default function RadarPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <DemoProgress />
      <UserProfileBar />

      <div className="mb-8">
        <Tag variant="accent" className="mb-4">Step 2 — Tool Radar</Tag>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Tool / Trend Radar
        </h1>
        <p className="max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
          Your profile pre-fills below. Get ranked AI &amp; productivity tool
          recommendations from our curated dataset of {tools.length} tools.
        </p>
      </div>

      <RadarClient tools={tools} />
    </div>
  );
}
