import type { ReactNode } from "react";

type Theme = "light" | "dark";

/** A themed full-width home section. `data-header-theme` lets the header follow it. */
export function Section({
  id,
  theme = "light",
  className = "",
  children,
  labelledBy,
}: {
  id: string;
  theme?: Theme;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-theme={theme}
      data-header-theme={theme}
      className={`relative bg-[color:var(--bg)] text-[color:var(--fg)] ${className}`}
    >
      {children}
    </section>
  );
}

/** Numbered mono eyebrow with a hairline: "02 / Discovery ———" */
export function Eyebrow({ n, label, className = "" }: { n: string; label: string; className?: string }) {
  return (
    <p className={`t-label flex items-center gap-4 ${className}`}>
      <span className="text-[color:var(--accent-text)]">{n}</span>
      <span aria-hidden className="h-px w-10 bg-[color:var(--line)]" />
      <span>{label}</span>
    </p>
  );
}
