"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NicheSelector } from "@/components/radar/NicheSelector";
import { RadarResults } from "@/components/radar/RadarResults";
import { ToolsAlreadyUsing } from "@/components/radar/ToolsAlreadyUsing";
import { useFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { parseApiError, USER_MESSAGES } from "@/lib/errors";
import { skillsFromString, skillsToString } from "@/lib/storage";
import type { Niche, RadarResponse, Tool } from "@/lib/types";

interface RadarFormProps {
  profileNiche: Niche;
  profileSkills: string[];
  profileAlreadyUsing: string[];
  tools: Tool[];
  onRun: (data: {
    niche: Niche;
    skills: string[];
    alreadyUsing: string[];
  }) => Promise<RadarResponse | null>;
  loading: boolean;
  error: string | null;
  result: RadarResponse | null;
}

function RadarForm({
  profileNiche,
  profileSkills,
  profileAlreadyUsing,
  tools,
  onRun,
  loading,
  error,
  result,
}: RadarFormProps) {
  const [niche, setNiche] = useState(profileNiche);
  const [skills, setSkills] = useState(skillsToString(profileSkills));
  const [alreadyUsing, setAlreadyUsing] = useState(profileAlreadyUsing);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onRun({
      niche,
      skills: skillsFromString(skills),
      alreadyUsing: alreadyUsing.filter((id) => tools.some((t) => t.id === id)),
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <NicheSelector
              niche={niche}
              skills={skills}
              onNicheChange={setNiche}
              onSkillsChange={setSkills}
            />

            <ToolsAlreadyUsing
              tools={tools}
              selected={alreadyUsing}
              onChange={setAlreadyUsing}
            />

            {error && (
              <p className="text-sm text-[var(--color-accent)] font-mono">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Ranking..." : "Run Radar →"}
            </Button>
          </form>
        </Card>

        <p className="mt-4 font-mono text-xs text-[var(--color-text-dim)] leading-relaxed">
          Pipeline: input → retrieve from {tools.length}-tool dataset → score by
          niche, skills &amp; ROI → return top 3. Profile auto-saves on run.
        </p>
      </div>

      <div className="lg:col-span-3">
        <Card accent={!!result}>
          <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            Ranked Recommendations
          </h2>
          <RadarResults
            results={result?.recommendations ?? []}
            retrievedCount={result?.retrievedCount ?? 0}
            cached={result?.cached ?? false}
            loading={loading}
          />
        </Card>
      </div>
    </div>
  );
}

interface RadarClientProps {
  tools: Tool[];
}

export function RadarClient({ tools }: RadarClientProps) {
  const { profile, updateProfile } = useFreelancerProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RadarResponse | null>(null);

  const profileKey = `${profile.niche}|${profile.skills.join(",")}|${profile.alreadyUsing.join(",")}`;

  async function handleRun(data: {
    niche: Niche;
    skills: string[];
    alreadyUsing: string[];
  }): Promise<RadarResponse | null> {
    setLoading(true);
    setError(null);

    updateProfile({
      niche: data.niche,
      skills: data.skills,
      alreadyUsing: data.alreadyUsing,
      lastRadarAt: new Date().toISOString(),
    });

    try {
      const res = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(parseApiError(responseData, USER_MESSAGES.radarFailed));
        return null;
      }

      const radarResult = responseData as RadarResponse;
      setResult(radarResult);
      return radarResult;
    } catch {
      setError(USER_MESSAGES.network);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return (
    <RadarForm
      key={profileKey}
      profileNiche={profile.niche}
      profileSkills={profile.skills}
      profileAlreadyUsing={profile.alreadyUsing}
      tools={tools}
      onRun={handleRun}
      loading={loading}
      error={error}
      result={result}
    />
  );
}
