import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Support",
  description: "Charging, maintenance, warranty and frequently asked questions for REVOO riders.",
  path: "/support",
});

export default function SupportPage() {
  return (
    <PagePlaceholder
      eyebrow="05 · Support"
      title="Ownership & support"
      note="FAQ, charging, maintenance and service process. Built in Phase 5."
    />
  );
}
