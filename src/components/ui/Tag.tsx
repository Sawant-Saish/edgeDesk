interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
}

const variants = {
  default: "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border)]",
  accent: "bg-[var(--color-accent-muted)] text-[var(--color-accent)] border-[var(--color-border-accent)]",
  outline: "bg-transparent text-[var(--color-text)] border-[var(--color-border)]",
};

export function Tag({ children, variant = "outline", className = "" }: TagProps) {
  return (
    <span
      className={`
        inline-block px-3 py-1.5 text-xs font-mono uppercase tracking-wider
        border rounded-[var(--radius-sm)]
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
