import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Range",
  description: "The REVOO electric two-wheeler range: A12, A11, C35Y and E52.",
  path: "/range",
});

export default function RangePage() {
  return (
    <PagePlaceholder
      eyebrow="02 · The range"
      title="The REVOO range"
      note="Showroom page. Built in Phase 5 (immersive model switcher using the approved A12, A11, C35Y and E52 set)."
    />
  );
}
