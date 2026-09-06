import Link from "next/link";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { TrackCard } from "@/components/layout/TrackCard";
import { getToolCount, loadTools } from "@/lib/tools-loader";

const tools = loadTools();
const toolCount = getToolCount();

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
          EdgeDesk
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-text)] md:text-4xl">
          Your AI co-pilot for freelancing
        </h1>
        <p className="max-w-2xl text-[var(--color-text-muted)] leading-relaxed">
          Set your profile once, discover the highest-ROI tools in your niche,
          then practice the client conversations that usually take years to learn.
        </p>
      </section>

      <HomeDashboard tools={tools} toolCount={toolCount} />

      <section className="mb-12">
        <TrackCard />
      </section>

      <footer className="border-t border-[var(--color-border)] pt-8 text-center">
        <p className="font-mono text-xs text-[var(--color-text-dim)]">
          EdgeDesk · AI for Business &amp; Productivity ·{" "}
          <Link href="/radar" className="text-[var(--color-accent)] hover:underline">
            Run Tool Radar
          </Link>
          {" · "}
          <Link href="/simulator" className="text-[var(--color-accent)] hover:underline">
            Practice Clients
          </Link>
        </p>
      </footer>
    </div>
  );
}
