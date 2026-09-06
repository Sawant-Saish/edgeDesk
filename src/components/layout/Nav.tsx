"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/radar", label: "Tool Radar" },
  { href: "/simulator", label: "Simulator" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors rounded-[var(--radius-sm)]
              ${
                isActive
                  ? "text-[var(--color-accent)] bg-[var(--color-accent-muted)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }
            `}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
