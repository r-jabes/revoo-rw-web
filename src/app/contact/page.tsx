import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact REVOO Rwanda, find a showroom or book a test ride.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div id="test-ride">
      <PagePlaceholder
        eyebrow="06 · Contact"
        title="Book a test ride"
        note="Showrooms, enquiry and test-ride form. Built in Phases 5 and 6."
      />
    </div>
  );
}
