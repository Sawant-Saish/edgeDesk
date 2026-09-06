interface MessageBubbleProps {
  role: "user" | "client";
  content: string;
  clientName?: string;
}

export function MessageBubble({ role, content, clientName }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[85%] rounded-[var(--radius-md)] px-4 py-3 text-sm leading-relaxed
          ${
            isUser
              ? "bg-[var(--color-accent-muted)] border border-[var(--color-border-accent)] text-[var(--color-text)]"
              : "bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]"
          }
        `}
      >
        {!isUser && clientName && (
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">
            {clientName}
          </p>
        )}
        <p>{content}</p>
      </div>
    </div>
  );
}
