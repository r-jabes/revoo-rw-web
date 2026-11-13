import dynamic from "next/dynamic";
import { Eyebrow, Section } from "./Section";

/**
 * Blueprint explorer is below the fold on home — load it in a separate chunk
 * so the hero path stays lean. SSR kept so no-JS / crawlers still see the diagram.
 */
const EngineeringExplorer = dynamic(
  () =>
    import("@/components/engineering/EngineeringExplorer").then((m) => ({
      default: m.EngineeringExplorer,
    })),
  {
    ssr: true,
    loading: () => (
      <div
        className="min-h-[min(70svh,36rem)] border border-dashed border-[color:var(--line)]"
        aria-hidden
      />
    ),
  },
);

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
