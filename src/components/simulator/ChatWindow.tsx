"use client";

import { useEffect, useRef } from "react";
import type { AdaptationState, ChatMessage, Scenario } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  scenario: Scenario | null;
  messages: ChatMessage[];
  loading: boolean;
  lastAdaptation: AdaptationState | null;
  onSend: (message: string) => void;
  onEndSession: () => void;
  feedbackLoading: boolean;
}

const adaptationLabels: Record<AdaptationState, string> = {
  escalated: "Client escalated — you caved",
  held: "Client eased off — boundary held",
  neutral: "Client holding steady",
};

export function ChatWindow({
  scenario,
  messages,
  loading,
  lastAdaptation,
  onSend,
  onEndSession,
  feedbackLoading,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("message") as HTMLTextAreaElement;
    const text = input.value.trim();
    if (!text || loading || !scenario) return;
    input.value = "";
    onSend(text);
  }

  if (!scenario) {
    return (
      <div className="flex h-96 items-center justify-center text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Select a scenario to start the conversation.
        </p>
      </div>
    );
  }

  const userTurns = messages.filter((m) => m.role === "user").length;

  return (
    <div className="flex h-[32rem] flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((msg, i) => (
          <MessageBubble
            key={`${msg.timestamp}-${i}`}
            role={msg.role}
            content={msg.content}
            clientName={msg.role === "client" ? scenario.clientName : undefined}
          />
        ))}
        {loading && (
          <p className="font-mono text-xs text-[var(--color-text-dim)] animate-pulse">
            Client is typing...
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {lastAdaptation && (
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
          [{adaptationLabels[lastAdaptation]}]
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          ref={inputRef}
          name="message"
          rows={2}
          disabled={loading || feedbackLoading}
          placeholder="Type your reply as the freelancer..."
          className="w-full resize-none rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-dim)] focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="primary" disabled={loading || feedbackLoading}>
            {loading ? "Sending..." : "Send →"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={userTurns < 2 || loading || feedbackLoading}
            onClick={onEndSession}
          >
            {feedbackLoading ? "Analyzing..." : "End Session & Get Feedback"}
          </Button>
        </div>
        {userTurns < 2 && (
          <p className="font-mono text-[10px] text-[var(--color-text-dim)]">
            Send at least 2 replies before ending the session.
          </p>
        )}
      </form>
    </div>
  );
}
