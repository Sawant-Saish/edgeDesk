import type { FeedbackResponse } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

interface FeedbackPanelProps {
  feedback: FeedbackResponse | null;
  loading?: boolean;
  error?: string | null;
}

const overallLabels: Record<FeedbackResponse["overall"], string> = {
  excellent: "Excellent",
  solid: "Solid",
  "needs-work": "Needs Work",
};

const overallVariant: Record<
  FeedbackResponse["overall"],
  "accent" | "default" | "outline"
> = {
  excellent: "accent",
  solid: "default",
  "needs-work": "outline",
};

export function FeedbackPanel({ feedback, loading, error }: FeedbackPanelProps) {
  if (loading) {
    return (
      <Card className="text-center py-8">
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-text-dim)] animate-pulse">
          Coach analyzing your session...
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card accent className="py-6">
        <p className="font-mono text-sm text-[var(--color-accent)]">{error}</p>
      </Card>
    );
  }

  if (!feedback) {
    return (
      <Card className="py-8 text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          End a session to get coaching feedback from the second AI agent.
        </p>
      </Card>
    );
  }

  return (
    <Card accent>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
          Coach Feedback
        </h3>
        <Tag variant={overallVariant[feedback.overall]}>
          {overallLabels[feedback.overall]}
        </Tag>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">
            What worked
          </p>
          <ul className="space-y-1">
            {feedback.whatWorked.map((item, i) => (
              <li key={i} className="flex gap-2 text-[var(--color-text-muted)]">
                <span className="text-[var(--color-accent)]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">
            Improve next time
          </p>
          <ul className="space-y-1">
            {feedback.improve.map((item, i) => (
              <li key={i} className="flex gap-2 text-[var(--color-text-muted)]">
                <span className="text-[var(--color-text-dim)]">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[var(--color-border)] pt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
            Veteran move
          </p>
          <p className="text-[var(--color-text)] leading-relaxed italic">
            &ldquo;{feedback.experiencedAlternative}&rdquo;
          </p>
        </div>
      </div>
    </Card>
  );
}
