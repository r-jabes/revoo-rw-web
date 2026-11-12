import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About REVOO",
  description: "The REVOO story and its presence in Rwanda.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PagePlaceholder
      eyebrow="04 · About REVOO"
      title="Move beyond"
      note="Company background, mission and local presence (confirmed facts only). Built in Phase 5."
    />
  );
}
