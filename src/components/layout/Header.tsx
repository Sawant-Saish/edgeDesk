import Link from "next/link";
import { Nav } from "./Nav";

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border-accent)] bg-[var(--color-bg-elevated)]">
            <span className="text-lg" role="img" aria-label="robot">
              🤖
            </span>
          </div>
          <div>
            <span className="block text-sm font-bold tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
              EdgeDesk
            </span>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
              Freelancer AI Co-pilot
            </span>
          </div>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
