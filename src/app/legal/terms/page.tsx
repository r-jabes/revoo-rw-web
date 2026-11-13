import { PageHero, PageSection } from "@/components/page/PageHero";
import { Tag } from "@/components/ui/Tag";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of use",
  description: "Terms of use for the REVOO Rwanda website.",
  path: "/legal/terms",
  noindex: true,
});

const sections = [
  {
    title: "About this prototype",
    body: "This site is a design concept for REVOO Rwanda. Specifications shown are official international figures unless marked otherwise, and are not a binding offer for Rwanda.",
  },
  {
    title: "No offer to sell",
    body: "Nothing on these pages is a price quote, warranty contract or availability guarantee. Current Rwanda pricing and model lists must come from REVOO Rwanda.",
  },
  {
    title: "Intellectual property",
    body: "REVOO marks, product names and official imagery belong to their respective owners. This prototype uses them only for a private client pitch unless REVOO grants broader permission.",
  },
  {
    title: "Limitation",
    body: "The pitch team and REVOO accept no liability for decisions made solely on prototype content. Confirm every figure with REVOO Rwanda before purchase or publication.",
  },
  {
    title: "Governing terms",
    body: "The binding terms of use, governing law and contact for legal notices will be supplied by REVOO Rwanda's counsel before public launch.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of use."
        lead={
          <>
            Placeholder terms for the design prototype. Replace with counsel-approved copy before launch.{" "}
            <Tag confidence="tbc" />
          </>
        }
        labelledBy="terms-title"
      />
      <PageSection className="pb-24 md:pb-36">
        <div className="container-x max-w-3xl">
          <ol className="border-t border-[color:var(--fg)]">
            {sections.map((s, i) => (
              <li key={s.title} className="border-b border-[color:var(--line)] py-8">
                <p className="t-label text-[color:var(--accent-text)]">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="t-display t-h3 mt-4">{s.title}</h2>
                <p className="t-body mt-4 text-[color:var(--muted)]">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="t-label mt-10 text-[0.625rem] text-[color:var(--muted)]">
            This page is noindexed. It exists so footer links never dead-end during the pitch.
          </p>
        </div>
      </PageSection>
    </>
  );
}
