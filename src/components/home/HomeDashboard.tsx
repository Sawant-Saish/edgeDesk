"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadDemoButton } from "@/components/demo/LoadDemoButton";
import { ProfileForm } from "@/components/home/ProfileForm";
import { DemoProgress } from "@/components/layout/DemoProgress";
import { useFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { skillsToString } from "@/lib/storage";
import { NICHES, type Tool } from "@/lib/types";
import { Tag } from "@/components/ui/Tag";

interface HomeDashboardProps {
  tools: Tool[];
  toolCount: number;
}

export function HomeDashboard({ tools, toolCount }: HomeDashboardProps) {
  const { profile, updateProfile, resetProfile } = useFreelancerProfile();

  const nicheLabel =
    NICHES.find((n) => n.value === profile.niche)?.label ?? profile.niche;

  const profileKey = `${profile.niche}|${profile.skills.join(",")}|${profile.alreadyUsing.join(",")}`;

  return (
    <>
      <DemoProgress />

      <Card accent className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            Live demo
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            One click loads a writer profile and jumps to Tool Radar — see{" "}
            <code className="font-mono text-xs text-[var(--color-text-dim)]">DEMO_SCRIPT.md</code>{" "}
            for the full 2–3 min walkthrough.
          </p>
        </div>
        <LoadDemoButton className="shrink-0" />
      </Card>

      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        <Card accent>
          <h2 className="mb-1 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            Step 1 — Your Profile
          </h2>
          <p className="mb-6 text-sm text-[var(--color-text-muted)]">
            Set once — Radar and Simulator pick this up automatically.
          </p>

          <ProfileForm
            key={profileKey}
            profile={profile}
            tools={tools}
            onSave={(data) => updateProfile(data)}
            onReset={resetProfile}
          />
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-text-dim)]">
              Current session
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-text-muted)]">Niche</dt>
                <dd className="font-mono text-[var(--color-text)]">{nicheLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-text-muted)]">Skills</dt>
                <dd className="font-mono text-[var(--color-text)] text-right">
                  {skillsToString(profile.skills) || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-text-muted)]">Last radar run</dt>
                <dd className="font-mono text-[var(--color-text-dim)]">
                  {profile.lastRadarAt
                    ? new Date(profile.lastRadarAt).toLocaleString()
                    : "Not yet"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-text-muted)]">Last scenario</dt>
                <dd className="font-mono text-[var(--color-text-dim)]">
                  {profile.lastScenarioId ?? "Not yet"}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
                Dataset
              </h3>
              <Tag variant="accent">{toolCount} tools</Tag>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              Curated AI &amp; productivity tools ranked by niche, skills, and ROI.
            </p>
          </Card>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-[var(--color-text-dim)]">
          Continue your workflow
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col">
            <Tag className="mb-4 self-start">Step 2</Tag>
            <h3 className="mb-2 text-lg font-bold text-[var(--color-text)]">
              Tool / Trend Radar
            </h3>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Your profile pre-fills the form. Get 2–3 ranked tool recommendations
              with score breakdowns.
            </p>
            <Button href="/radar" variant="primary">
              Run Radar →
            </Button>
          </Card>

          <Card className="flex flex-col">
            <Tag className="mb-4 self-start">Step 3</Tag>
            <h3 className="mb-2 text-lg font-bold text-[var(--color-text)]">
              Client-Scenario Simulator
            </h3>
            <p className="mb-6 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Practice client boundaries as a {nicheLabel.toLowerCase()}. Two-agent
              chat with post-session coaching.
            </p>
            <Button href="/simulator" variant="secondary">
              Start Practice →
            </Button>
          </Card>
        </div>
      </section>
    </>
  );
}
