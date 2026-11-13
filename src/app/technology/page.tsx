import { EngineeringExplorer } from "@/components/engineering/EngineeringExplorer";
import { PageHero, PageSection } from "@/components/page/PageHero";
import { Tag } from "@/components/ui/Tag";
import { ButtonLink } from "@/components/ui/Button";
import { a12Batteries } from "@/data/home";
import { facts } from "@/data/facts";
import { PROTOTYPE } from "@/lib/flags";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Technology",
  description: "How a REVOO electric two-wheeler works: hub motor, battery, charging and everyday ownership.",
  path: "/technology",
});

const pillars = [
  {
    n: "01",
    title: "Hub motor",
    body: "Power sits inside the rear wheel. There is no chain or belt to adjust, and no gearbox to maintain for everyday city riding.",
  },
  {
    n: "02",
    title: "Two battery chemistries",
    body: "International markets sell graphene and lithium (LFP) options. Charge times, weight and range differ. Which chemistry REVOO Rwanda stocks is still to be confirmed.",
  },
  {
    n: "03",
    title: "Household charging",
    body: `${facts.rwanda.chargingHome.value}. No battery-swap network is part of the REVOO offer.`,
  },
  {
    n: "04",
    title: "Built for the street",
    body: "Hydraulic suspension, vacuum tubeless tyres and ground clearance sized for everyday urban roads — not off-road drama.",
  },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        id="technology"
        eyebrow="03 · Technology"
        title="Inside the machine."
        lead="A REVOO is an electric scooter you can understand: a hub motor, a battery you charge at home, and parts that are numbered on the blueprint."
        labelledBy="tech-title"
      />

      <PageSection className="pb-24 md:pb-36">
        <div className="container-x">
          <ol className="grid border-t border-[color:var(--fg)] sm:grid-cols-2">
            {pillars.map((p) => (
              <li key={p.n} className="border-b border-[color:var(--line)] py-10 pr-8 sm:odd:border-r sm:odd:pr-10 sm:even:pl-10">
                <span className="t-label text-[color:var(--accent-text)]">{p.n}</span>
                <h2 className="t-display t-h3 mt-5">{p.title}</h2>
                <p className="t-body mt-4 max-w-md text-[color:var(--muted)]">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </PageSection>

      <PageSection theme="dark" id="blueprint" className="py-24 md:py-40" labelledBy="blueprint-title">
        <div className="container-x">
          <div className="mb-16 grid gap-8 md:mb-24 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="t-label text-[color:var(--accent-text)]">Blueprint</p>
              <h2 id="blueprint-title" className="t-display t-h1 mt-6 max-w-[14ch]">
                A12, taken apart on paper.
              </h2>
            </div>
            <p className="t-body self-end text-[color:var(--muted)] lg:col-span-4 lg:col-start-9">
              Linework traced from REVOO&apos;s official A12 render. Choose a part to see what it does, with the figures
              REVOO publishes internationally.
            </p>
          </div>
          <EngineeringExplorer />
        </div>
      </PageSection>

      <PageSection id="batteries" className="py-24 md:py-40" labelledBy="batt-title">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="t-label text-[color:var(--accent-text)]">A12 batteries</p>
              <h2 id="batt-title" className="t-display t-h2 mt-5 max-w-[14ch]">
                Graphene or lithium.
              </h2>
              <p className="t-body mt-6 max-w-sm text-[color:var(--muted)]">
                Two chemistries, different charge times and weights. Rwanda stock is to be confirmed{" "}
                <Tag confidence="tbc" />
              </p>
              {PROTOTYPE && (
                <p className="t-label mt-6 text-[0.625rem] text-[color:var(--muted)]">
                  Home charging confirmed for Rwanda · {facts.rwanda.chargingHome.source}
                </p>
              )}
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">A12 graphene versus lithium battery options</caption>
                <thead>
                  <tr className="border-t border-[color:var(--fg)]">
                    <th scope="col" className="sr-only">
                      Measure
                    </th>
                    <th scope="col" className="t-label py-4 pr-4 text-[color:var(--muted)]">
                      Graphene
                    </th>
                    <th scope="col" className="t-label py-4 text-[color:var(--accent-text)]">
                      Lithium (LFP)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {a12Batteries.rows.map((r) => (
                    <tr key={r.label} className="border-t border-[color:var(--line)]">
                      <th scope="row" className="t-label w-1/3 py-5 pr-4 align-baseline text-[color:var(--muted)]">
                        {r.label}
                      </th>
                      <td className="t-spec-value py-5 pr-4 align-baseline text-[clamp(1.15rem,1rem+0.6vw,1.5rem)]">
                        {r.graphene}
                      </td>
                      <td className="t-spec-value py-5 align-baseline text-[clamp(1.15rem,1rem+0.6vw,1.5rem)]">
                        {r.lithium}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-[color:var(--line)]">
                    <td colSpan={3} className="pt-5 text-[0.8125rem] leading-relaxed text-[color:var(--muted)]">
                      International A12 figures <Tag confidence={a12Batteries.confidence} />. Range is a test-condition
                      estimate.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-[color:var(--line)] pt-10">
            <p className="t-body max-w-md text-[color:var(--muted)]">
              Ready to see a model up close? The range page puts every REVOO side by side.
            </p>
            <ButtonLink href="/range" variant="ink">
              Explore the range
            </ButtonLink>
          </div>
        </div>
      </PageSection>
    </>
  );
}
