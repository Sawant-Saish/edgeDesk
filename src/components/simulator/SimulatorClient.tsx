"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ChatWindow } from "@/components/simulator/ChatWindow";
import { FeedbackPanel } from "@/components/simulator/FeedbackPanel";
import { ScenarioPicker } from "@/components/simulator/ScenarioPicker";
import { useFreelancerProfile } from "@/hooks/useFreelancerProfile";
import { parseApiError, USER_MESSAGES } from "@/lib/errors";
import { NICHES } from "@/lib/types";
import type {
  AdaptationState,
  ChatMessage,
  FeedbackResponse,
  Scenario,
} from "@/lib/types";

interface SimulatorClientProps {
  scenarios: Scenario[];
}

export function SimulatorClient({ scenarios }: SimulatorClientProps) {
  const { profile, updateProfile } = useFreelancerProfile();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [lastAdaptation, setLastAdaptation] = useState<AdaptationState | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  const nicheLabel =
    NICHES.find((n) => n.value === profile.niche)?.label ?? profile.niche;

  function selectScenario(scenario: Scenario) {
    setSelectedScenario(scenario);
    setMessages([
      {
        role: "client",
        content: scenario.openingMessage,
        timestamp: Date.now(),
      },
    ]);
    setLastAdaptation(null);
    setFeedback(null);
    setFeedbackError(null);
    setChatError(null);
    updateProfile({ lastScenarioId: scenario.id });
  }

  async function handleSend(userMessage: string) {
    if (!selectedScenario) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setChatError(null);

    try {
      const res = await fetch("/api/simulator/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          messages: messages,
          userMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setChatError(parseApiError(data, USER_MESSAGES.chatFailed));
        return;
      }

      setLastAdaptation(data.adaptationNote);
      setMessages((prev) => [
        ...prev,
        {
          role: "client",
          content: data.clientReply,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setChatError(USER_MESSAGES.network);
    } finally {
      setLoading(false);
    }
  }

  async function handleEndSession() {
    if (!selectedScenario) return;

    const fullTranscript = messages;
    setFeedbackLoading(true);
    setFeedbackError(null);

    try {
      const res = await fetch("/api/simulator/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          messages: fullTranscript,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackError(parseApiError(data, USER_MESSAGES.feedbackFailed));
        return;
      }

      setFeedback(data as FeedbackResponse);
    } catch {
      setFeedbackError(USER_MESSAGES.network);
    } finally {
      setFeedbackLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--radius-sm)] border border-[var(--color-border-accent)] bg-[var(--color-accent-muted)] px-4 py-3">
          <p className="text-sm text-[var(--color-text-muted)]">
            Practicing as a{" "}
            <span className="font-mono text-[var(--color-accent)]">
              {nicheLabel.toLowerCase()}
            </span>{" "}
            freelancer — the client scenarios apply to any niche, but your profile
            carries across the app.
          </p>
      </div>

      <Card>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-text-dim)]">
          Choose a scenario
        </h2>
        <ScenarioPicker
          scenarios={scenarios}
          selectedId={selectedScenario?.id ?? null}
          onSelect={selectScenario}
          disabled={loading || feedbackLoading}
        />
      </Card>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card accent={!!selectedScenario}>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Live Conversation
            </h2>
            {chatError && (
              <p className="mb-4 font-mono text-sm text-[var(--color-accent)]">
                {chatError}
              </p>
            )}
            <ChatWindow
              scenario={selectedScenario}
              messages={messages}
              loading={loading}
              lastAdaptation={lastAdaptation}
              onSend={handleSend}
              onEndSession={handleEndSession}
              feedbackLoading={feedbackLoading}
            />
          </Card>
        </div>

        <div className="lg:col-span-2">
          <FeedbackPanel
            feedback={feedback}
            loading={feedbackLoading}
            error={feedbackError}
          />
          <p className="mt-4 font-mono text-xs text-[var(--color-text-dim)] leading-relaxed">
            Two-agent flow: client agent adapts per turn. Coach agent runs once at
            session end.
          </p>
        </div>
      </div>
    </div>
  );
}
