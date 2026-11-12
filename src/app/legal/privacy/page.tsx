import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy",
  description: "Privacy information for the REVOO Rwanda website.",
  path: "/legal/privacy",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <PagePlaceholder
      eyebrow="Legal"
      title="Privacy"
      note="Placeholder. The privacy policy must be supplied by REVOO Rwanda's legal entity before launch."
    />
  );
}
