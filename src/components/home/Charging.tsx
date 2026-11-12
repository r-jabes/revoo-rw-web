import { Tag } from "@/components/ui/Tag";
import { facts } from "@/data/facts";
import { a12Batteries } from "@/data/home";
import { PROTOTYPE } from "@/lib/flags";
import { Eyebrow, Section } from "./Section";

export function Charging() {
  const home = facts.rwanda.chargingHome;
  return (
    <Section id="charging" theme="dark" labelledBy="charging-title" className="pb-24 md:pb-40">
      <div className="container-x">
        <div className="grid gap-8 border-t border-[color:var(--line)] pt-24 md:pt-40 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow n="05" label="Charging" />
            <h2 id="charging-title" className="t-display t-h1 mt-8 max-w-[20ch]">
              Plug into what&apos;s already there.
            </h2>
          </div>
        </div>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="t-display t-h2">{home.value}.</p>
            <p className="t-body mt-6 max-w-sm text-[color:var(--muted)]">
              Charge at home or wherever there is a socket.
              {PROTOTYPE && (
                <span className="t-label mt-4 block text-[0.625rem]">
                  Rwanda-confirmed · {home.source} · reconfirm before launch
                </span>
              )}
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <table className="w-full border-collapse text-left">
              <caption className="t-label mb-5 text-left text-[color:var(--muted)]">
                REVOO A12 · two battery options <Tag confidence={a12Batteries.confidence} />
              </caption>
              <thead>
                <tr className="border-t border-[color:var(--line)]">
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
                    <td className="t-spec-value py-5 pr-4 align-baseline text-[clamp(1.25rem,1rem+0.8vw,1.75rem)]">
                      {r.graphene}
                    </td>
                    <td className="t-spec-value py-5 align-baseline text-[clamp(1.25rem,1rem+0.8vw,1.75rem)]">
                      {r.lithium}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-[color:var(--line)]">
                  <td colSpan={3} className="pt-5 text-[0.8125rem] leading-relaxed text-[color:var(--muted)]">
                    Range is a test-condition estimate. Which battery versions are sold in Rwanda is to be confirmed{" "}
                    <Tag confidence="tbc" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
}
