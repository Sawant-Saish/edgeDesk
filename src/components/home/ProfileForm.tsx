"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ResumeUpload } from "@/components/home/ResumeUpload";
import { NicheSelector } from "@/components/radar/NicheSelector";
import { ToolsAlreadyUsing } from "@/components/radar/ToolsAlreadyUsing";
import { skillsFromString, skillsToString } from "@/lib/storage";
import type { FreelancerProfile, Niche, Tool } from "@/lib/types";

interface ProfileFormProps {
  profile: FreelancerProfile;
  tools: Tool[];
  onSave: (data: {
    niche: Niche;
    skills: string[];
    alreadyUsing: string[];
    resumeFileName?: string;
    resumeText?: string;
    resumeParsedAt?: string;
  }) => void;
  onReset: () => void;
}

export function ProfileForm({
  profile,
  tools,
  onSave,
  onReset,
}: ProfileFormProps) {
  const [niche, setNiche] = useState(profile.niche);
  const [skills, setSkills] = useState(skillsToString(profile.skills));
  const [alreadyUsing, setAlreadyUsing] = useState(profile.alreadyUsing);
  const [resumeMeta, setResumeMeta] = useState({
    resumeFileName: profile.resumeFileName,
    resumeText: profile.resumeText,
    resumeParsedAt: profile.resumeParsedAt,
  });
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      niche,
      skills: skillsFromString(skills),
      alreadyUsing: alreadyUsing.filter((id) => tools.some((t) => t.id === id)),
      ...resumeMeta,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ResumeUpload
        profile={profile}
        onParsed={(data) => {
          setNiche(data.niche);
          setSkills(skillsToString(data.skills));
          setAlreadyUsing(
            data.alreadyUsing.filter((id) => tools.some((t) => t.id === id))
          );
          setResumeMeta({
            resumeFileName: data.resumeFileName,
            resumeText: data.resumeText,
            resumeParsedAt: data.resumeParsedAt,
          });
        }}
      />
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
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary">
          {saved ? "Saved ✓" : "Save Profile →"}
        </Button>
        <Button type="button" variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
