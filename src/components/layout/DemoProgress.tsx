"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  { href: "/", label: "Set Profile", short: "1" },
  { href: "/radar", label: "Tool Radar", short: "2" },
  { href: "/simulator", label: "Practice Clients", short: "3" },
];

export function DemoProgress() {
  const pathname = usePathname();

  const currentIndex = steps.findIndex((step) =>
    step.href === "/" ? pathname === "/" : pathname.startsWith(step.href)
  );

  return (
    <nav
      aria-label="Demo progress"
      className="mb-8 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4"
    >
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-dim)]">
        Your workflow
      </p>
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isComplete = currentIndex > index;

          return (
            <li key={step.href} className="flex items-center gap-3 flex-1">
              <Link
                href={step.href}
                className={`
                  flex items-center gap-3 transition-colors group
                  ${isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"}
                `}
              >
                <span
                  className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs
                    ${
                      isActive
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                        : isComplete
                          ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                          : "border-[var(--color-border)] text-[var(--color-text-dim)]"
                    }
                  `}
                >
                  {isComplete ? "✓" : step.short}
                </span>
                <span className="text-sm font-medium group-hover:underline">
                  {step.label}
                </span>
              </Link>
              {index < steps.length - 1 && (
                <span
                  className="hidden sm:block flex-1 h-px bg-[var(--color-border)] mx-2"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
