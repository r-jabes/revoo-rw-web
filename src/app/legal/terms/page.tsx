import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms",
  description: "Terms of use for the REVOO Rwanda website.",
  path: "/legal/terms",
  noindex: true,
});

export default function TermsPage() {
  return (
    <PagePlaceholder
      eyebrow="Legal"
      title="Terms"
      note="Placeholder. Terms of use must be supplied by REVOO Rwanda's legal entity before launch."
    />
  );
}
