import { ButtonLink } from "@/components/ui/Button";
import { Section } from "./Section";

export function FinalCta() {
  return (
    <Section id="start" theme="dark" labelledBy="start-title" className="overflow-hidden py-28 md:py-44">
      <div className="container-x">
        <p data-reveal className="t-label text-[color:var(--accent-text)]">Your move</p>
        <h2 id="start-title" className="t-display t-mega mt-8">
          Move{" "}
          <br />
          beyond.
        </h2>
        <div data-reveal className="mt-14 flex flex-col gap-8 border-t border-[color:var(--line)] pt-10 md:flex-row md:items-center md:justify-between">
          <p className="t-lead max-w-md">
            Tell us which model you are interested in and arrange a test ride.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact#test-ride">Book a test ride</ButtonLink>
            <ButtonLink href="/range" variant="outline">
              Explore the range
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
