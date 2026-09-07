"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { parseApiError, USER_MESSAGES } from "@/lib/errors";
import { skillsToString } from "@/lib/storage";
import type { FreelancerProfile, Niche, ParsedResumeResponse } from "@/lib/types";

const TEXT_EXTENSIONS = [".txt", ".md"];

interface ResumeUploadProps {
  profile: FreelancerProfile;
  onParsed: (data: {
    niche: Niche;
    skills: string[];
    alreadyUsing: string[];
    resumeFileName: string;
    resumeText: string;
    resumeParsedAt: string;
    summary: string;
  }) => void;
}

type UploadState = "idle" | "reading" | "analyzing" | "success" | "error";

export function ResumeUpload({ profile, onParsed }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function processFile(file: File) {
    setState("reading");
    setError(null);
    setSummary(null);

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const isTextFile = TEXT_EXTENSIONS.includes(ext);

    try {
      setState("analyzing");

      let response: Response;

      if (isTextFile) {
        const text = await file.text();
        response = await fetch("/api/profile/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, fileName: file.name }),
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        response = await fetch("/api/profile/parse-resume", {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(parseApiError(data, USER_MESSAGES.resumeParseFailed));
      }

      const parsed = data as ParsedResumeResponse & {
        resumeFileName: string;
        resumeText: string;
        resumeParsedAt: string;
      };

      setSummary(parsed.summary);
      setState("success");

      onParsed({
        niche: parsed.niche,
        skills: parsed.skills,
        alreadyUsing: parsed.alreadyUsing,
        resumeFileName: parsed.resumeFileName,
        resumeText: parsed.resumeText,
        resumeParsedAt: parsed.resumeParsedAt,
        summary: parsed.summary,
      });
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error ? err.message : USER_MESSAGES.resumeParseFailed
      );
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  const isLoading = state === "reading" || state === "analyzing";

  return (
    <div className="space-y-3">
      <div>
        <label
          className="mb-2 block font-mono text-xs uppercase tracking-widest text-[var(--color-text-dim)]"
        >
          Resume or portfolio
        </label>
        <p className="mb-3 text-xs text-[var(--color-text-dim)]">
          Upload a resume (.pdf, .txt, .md) — AI extracts your niche, skills,
          and tools to pre-fill the form below.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-[var(--radius-sm)] border border-dashed px-4 py-6 text-center transition-colors ${
          dragOver
            ? "border-[var(--color-accent)] bg-[var(--color-bg-elevated)]"
            : "border-[var(--color-border)] bg-[var(--color-bg-elevated)]/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
          disabled={isLoading}
        />

        {profile.resumeFileName && state !== "success" ? (
          <div className="space-y-2">
            <p className="font-mono text-sm text-[var(--color-text)]">
              {profile.resumeFileName}
            </p>
            {profile.resumeParsedAt && (
              <p className="text-xs text-[var(--color-text-dim)]">
                Last analyzed{" "}
                {new Date(profile.resumeParsedAt).toLocaleString()}
              </p>
            )}
          </div>
        ) : state === "success" ? (
          <div className="space-y-2">
            <p className="font-mono text-sm text-[var(--color-accent)]">
              ✓ Profile extracted
            </p>
            {summary && (
              <p className="text-xs text-[var(--color-text-muted)]">{summary}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            {isLoading
              ? state === "reading"
                ? "Reading document…"
                : "Analyzing with AI…"
              : "Drag & drop or choose a file"}
          </p>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={() => inputRef.current?.click()}
          >
            {isLoading ? "Working…" : profile.resumeFileName ? "Re-upload" : "Choose file"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-[var(--color-accent)]" role="alert">
          {error}
        </p>
      )}

      {profile.resumeFileName && profile.skills.length > 0 && state === "idle" && (
        <p className="text-xs text-[var(--color-text-dim)]">
          Current skills from profile: {skillsToString(profile.skills)}
        </p>
      )}
    </div>
  );
}
