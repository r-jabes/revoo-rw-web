import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Tag } from "@/components/ui/Tag";
import { models, type Model } from "@/data/models";
import { PROTOTYPE } from "@/lib/flags";
import { Eyebrow, Section } from "./Section";

function ModelImage({ model }: { model: Model }) {
  if (model.image) {
    return (
      <Picture
        asset={model.image}
        sizes="(min-width:1024px) 42vw, 92vw"
        imgClassName="h-auto w-full transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] group-hover:translate-x-2"
      />
    );
  }
  // No usable render yet (E52). Honest placeholder, never a substitute bike.
  return (
    <div className="relative grid aspect-[1.353] w-full place-items-center border border-dashed border-[color:var(--line)]">
      <span
        aria-hidden
        className="t-display text-[clamp(4rem,12vw,9rem)] text-transparent [-webkit-text-stroke:1.5px_var(--line)]"
      >
        {model.code}
      </span>
      {PROTOTYPE && (
        <span className="t-label absolute bottom-3 left-3 right-3 text-[color:var(--muted)]">
          High-resolution render requested from REVOO
        </span>
      )}
    </div>
  );
}

export function Showroom() {
  return (
    <Section id="showroom" theme="light" labelledBy="showroom-title" className="pb-24 md:pb-40">
      <div className="container-x">
        <div className="grid gap-8 border-t border-[color:var(--fg)] pt-24 md:pt-40 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow n="03" label="The range" />
            <h2 id="showroom-title" className="t-display t-h1 mt-8 max-w-[14ch]">
              Choose your REVOO.
            </h2>
          </div>
          <p className="t-body self-end text-[color:var(--muted)] lg:col-span-4 lg:col-start-9">
            Four electric two-wheelers for different journeys. Figures shown are official international
            specifications. Rwanda versions will be confirmed model by model. <Tag confidence="international" />
          </p>
        </div>

        <ul className="mt-16 md:mt-24">
          {models.map((m, i) => (
            <li key={m.slug} className="border-t border-[color:var(--line)] last:border-b">
              <Link
                href={`/range/${m.slug}`}
                className="group grid gap-6 py-10 md:py-12 lg:grid-cols-12 lg:items-center lg:gap-8"
              >
                <div className="lg:col-span-5">
                  <p className="t-label flex items-center gap-3 text-[color:var(--muted)]">
                    <span className="text-[color:var(--accent-text)]">{String(i + 1).padStart(2, "0")}</span>
                    {m.series}
                  </p>
                  <h3 className="t-display t-h1 mt-4">{m.code}</h3>
                  <p className="t-lead mt-3 text-[color:var(--muted)]">{m.tagline}</p>

                  <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-[color:var(--line)] pt-5">
                    <div>
                      <dt className="t-label text-[color:var(--muted)]">Top speed</dt>
                      <dd className="t-spec-value mt-1.5">{m.headline.topSpeed}</dd>
                    </div>
                    <div>
                      <dt className="t-label text-[color:var(--muted)]">Range</dt>
                      <dd className="t-spec-value mt-1.5">{m.headline.range}</dd>
                    </div>
                    <div>
                      <dt className="t-label text-[color:var(--muted)]">Battery</dt>
                      <dd className="t-spec-value mt-1.5 text-[0.9375rem] leading-tight">
                        {m.headline.battery.split(" · ").map((b) => (
                          <span key={b} className="block whitespace-nowrap">
                            {b}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </dl>

                  <p className="t-label mt-8 inline-flex items-center gap-3 border-b border-transparent pb-1 transition-colors group-hover:border-[color:var(--fg)]">
                    View {m.code}
                    <ArrowRight className="h-4 w-4 transition-transform duration-[var(--dur-micro)] group-hover:translate-x-1" />
                  </p>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <ModelImage model={m} />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <p className="t-body max-w-md text-[color:var(--muted)]">
            Not sure which fits your day? Compare the full range side by side.
          </p>
          <ButtonLink href="/range" variant="ink">
            See the whole range
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
