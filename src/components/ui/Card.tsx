interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}

export function Card({ children, className = "", accent = false }: CardProps) {
  return (
    <div
      className={`
        rounded-[var(--radius-md)] border bg-[var(--color-bg-card)] p-6
        ${accent ? "border-[var(--color-border-accent)]" : "border-[var(--color-border)]"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
