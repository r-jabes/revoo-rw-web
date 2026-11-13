import type { ReactNode } from "react";

/**
 * Interior-page masthead. Same rhythm as the home eyebrows: mono index,
 * condensed headline, short lead. Server-rendered; no motion required.
 */
export function PageHero({
  id,
  eyebrow,
  title,
  lead,
  theme = "light",
  children,
  labelledBy,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  theme?: "light" | "dark";
  children?: ReactNode;
  labelledBy?: string;
}) {
  return (
    <header
      id={id}
      data-theme={theme}
      data-header-theme={theme}
      className="relative bg-[color:var(--bg)] text-[color:var(--fg)]"
    >
      <div className="container-x pb-14 pt-[calc(var(--header-h)+clamp(2.5rem,8svh,5rem))] md:pb-20">
        <p className="t-label text-[color:var(--accent-text)]">{eyebrow}</p>
        <h1 id={labelledBy} className="t-display t-h1 mt-8 max-w-[16ch]">
          {title}
        </h1>
        {lead && <div className="t-lead mt-8 max-w-2xl text-[color:var(--muted)]">{lead}</div>}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </header>
  );
}

/** Full-bleed page section that keeps the header theme in sync. */
export function PageSection({
  id,
  theme = "light",
  className = "",
  children,
  labelledBy,
}: {
  id?: string;
  theme?: "light" | "dark";
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
