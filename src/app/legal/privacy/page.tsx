import { PageHero, PageSection } from "@/components/page/PageHero";
import { Tag } from "@/components/ui/Tag";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy",
  description: "Privacy information for the REVOO Rwanda website.",
  path: "/legal/privacy",
  noindex: true,
});

const sections = [
  {
    title: "Who we are",
    body: "The legal entity that operates REVOO Rwanda, its registered address and data-protection contact must be supplied by REVOO before this policy can be published.",
  },
  {
    title: "What this site collects",
    body: "At launch, the enquiry form is expected to collect your name, contact details, model of interest and message, only for responding to you. Analytics and cookies, if any, will be listed here once chosen.",
  },
  {
    title: "How we use it",
    body: "To answer enquiries, arrange test rides and improve the site. We will not invent marketing uses beyond what REVOO's counsel approves.",
  },
  {
    title: "Sharing",
    body: "Whether data is shared with service partners (for example Carlcare or a hosting provider) is to be confirmed.",
  },
  {
    title: "Your rights",
    body: "Rwandan data-protection rights and how to exercise them will be stated once counsel drafts the final policy.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy."
        lead={
          <>
            Placeholder policy for the design prototype. The final privacy notice must be supplied by REVOO Rwanda&apos;s
            legal entity before launch. <Tag confidence="tbc" />
          </>
        }
        labelledBy="privacy-title"
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
