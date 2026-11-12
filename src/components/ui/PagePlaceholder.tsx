import { ButtonLink } from "./Button";

/** Temporary page body used until the page is built (Phase 5). Keeps every nav link alive. */
export function PagePlaceholder({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <section data-header-theme="light" className="container-x flex min-h-[70svh] flex-col justify-end pb-20 pt-40">
      <p className="t-label mb-6 text-[color:var(--accent-text)]">{eyebrow}</p>
      <h1 className="t-display t-h1 max-w-[14ch]">{title}</h1>
      <p className="t-lead mt-8">{note}</p>
      <div className="mt-10">
        <ButtonLink href="/" variant="ink">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
