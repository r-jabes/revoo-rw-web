import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Technology",
  description: "How a REVOO electric two-wheeler works: motor, battery, charging and everyday ownership.",
  path: "/technology",
});

export default function TechnologyPage() {
  return (
    <PagePlaceholder
      eyebrow="03 · Technology"
      title="Inside the machine"
      note="Technology page with the full component explorer. Built in Phase 5."
    />
  );
}
