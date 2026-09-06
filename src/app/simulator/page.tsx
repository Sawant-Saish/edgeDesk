import { SimulatorClient } from "@/components/simulator/SimulatorClient";
import { DemoProgress } from "@/components/layout/DemoProgress";
import { UserProfileBar } from "@/components/shared/UserProfileBar";
import { Tag } from "@/components/ui/Tag";
import { loadScenarios } from "@/lib/scenarios-loader";

const scenarios = loadScenarios();

export default function SimulatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <DemoProgress />
      <UserProfileBar />

      <div className="mb-8">
        <Tag variant="accent" className="mb-4">Step 3 — Client Simulator</Tag>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Client-Scenario Simulator
        </h1>
        <p className="max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
          Practice difficult client conversations with an AI that adapts when you
          hold or cave on boundaries. Get post-session coaching feedback.
        </p>
      </div>

      <SimulatorClient scenarios={scenarios} />
    </div>
  );
}
