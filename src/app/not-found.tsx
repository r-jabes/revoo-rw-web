import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/page/PageHero";

export default function NotFound() {
  return (
    <PageHero
      id="not-found"
      eyebrow="404"
      title="Off route."
      lead="That page does not exist. Head back to the start and pick up the ride."
      labelledBy="not-found-title"
    >
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/range" variant="outline">
          Explore the range
        </ButtonLink>
      </div>
    </PageHero>
  );
}
