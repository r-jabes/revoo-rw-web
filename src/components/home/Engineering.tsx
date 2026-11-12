import { EngineeringExplorer } from "@/components/engineering/EngineeringExplorer";
import { Eyebrow, Section } from "./Section";

export function Engineering() {
  return (
    <Section id="engineering" theme="dark" labelledBy="engineering-title" className="py-24 md:py-40">
      <div className="container-x">
        <div className="mb-16 grid gap-8 md:mb-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow n="04" label="Engineering" />
            <h2 id="engineering-title" className="t-display t-h1 mt-8 max-w-[14ch]">
              Inside the machine.
            </h2>
          </div>
          <p className="t-body self-end text-[color:var(--muted)] lg:col-span-4 lg:col-start-9">
            A REVOO taken apart on paper. Choose a part to see what it does, with the figures REVOO publishes for the
            A12.
          </p>
        </div>
        <EngineeringExplorer />
      </div>
    </Section>
  );
}
