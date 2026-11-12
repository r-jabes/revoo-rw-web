import { Tag } from "@/components/ui/Tag";
import { facts } from "@/data/facts";
import { Eyebrow, Section } from "./Section";

const stats = [facts.brand.countries, facts.brand.eastAfricaTesting, facts.rwanda.warranty, facts.brand.foundedGlobal];

export function Discovery() {
  return (
    <Section id="discovery" theme="light" labelledBy="discovery-title" className="py-24 md:py-40">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Eyebrow n="02" label="Discovery" />
          <h2 id="discovery-title" className="t-display t-h1 mt-8 max-w-[14ch]">
            Not just another ride.
          </h2>
          <p className="t-lead mt-10 max-w-xl">{facts.brand.positioning}</p>
          <p className="t-body mt-5 max-w-xl text-[color:var(--muted)]">
            REVOO builds electric two-wheelers for everyday city riding, from the step-through A Series to the
            E Series flagship. Here is what stands behind the name.
          </p>
        </div>

        <dl className="lg:col-span-5 lg:col-start-8">
          {stats.map((f) => (
            <div
              key={f.figure}
              className="grid grid-cols-[minmax(0,1fr)] gap-2 border-t border-[color:var(--line)] py-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8"
            >
              <dt className="t-display whitespace-nowrap text-[clamp(2.25rem,1.6rem+1.6vw,3.25rem)] leading-none">
                {f.figure}
              </dt>
              <dd className="text-[0.9375rem] leading-snug text-[color:var(--muted)]">
                {f.caption} <Tag confidence={f.confidence} />
              </dd>
            </div>
          ))}
          <div className="border-t border-[color:var(--line)]" />
        </dl>
      </div>
    </Section>
  );
}
