import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ArrowUpRight } from "@/components/ui/Icons";
import { PageHero, PageSection } from "@/components/page/PageHero";
import { facts } from "@/data/facts";
import { locations } from "@/data/locations";
import { PROTOTYPE } from "@/lib/flags";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About REVOO",
  description: "The REVOO story, East Africa testing, and REVOO Rwanda's presence in Kigali.",
  path: "/about",
});

const milestones = [
  facts.brand.foundedGlobal,
  facts.brand.countries,
  facts.brand.eastAfricaTesting,
  facts.rwanda.warranty,
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        id="about"
        eyebrow="04 · About REVOO"
        title="Move beyond."
        lead={facts.brand.positioning}
        labelledBy="about-title"
      />

      <PageSection className="pb-24 md:pb-36">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h2 className="t-display t-h2 max-w-[16ch]">Electric mobility for the next generation.</h2>
            <p className="t-body mt-8 max-w-xl text-[color:var(--muted)]">
              REVOO builds step-through electric two-wheelers for everyday city riding. The brand was founded in{" "}
              {facts.brand.foundedGlobal.value} and is sold in {facts.brand.countries.value}.{" "}
              <Tag confidence="international" />
            </p>
            <p className="t-body mt-5 max-w-xl text-[color:var(--muted)]">
              {facts.brand.parent.value}. {facts.brand.parent.note} <Tag confidence="international" />
            </p>
          </div>
          <dl className="lg:col-span-5 lg:col-start-8">
            {milestones.map((f) => (
              <div
                key={f.figure}
                className="grid gap-2 border-t border-[color:var(--line)] py-6 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:items-baseline sm:gap-6"
              >
                <dt className="t-display whitespace-nowrap text-[clamp(2rem,1.5rem+1.4vw,3rem)] leading-none">
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
      </PageSection>

      <PageSection theme="dark" id="rwanda" className="py-24 md:py-40" labelledBy="rwanda-title">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <p className="t-label text-[color:var(--accent-text)]">REVOO Rwanda</p>
              <h2 id="rwanda-title" className="t-display t-h1 mt-6 max-w-[14ch]">
                Present in Kigali.
              </h2>
              <p className="t-body mt-8 max-w-xl text-[color:var(--muted)]">
                REVOO Rwanda exhibits and sells locally. The Remera branch is confirmed on REVOO Rwanda&apos;s own
                channels. Addresses, phones and opening hours will be published once REVOO supplies them.
              </p>
              <ul className="mt-10 space-y-4 text-[0.9375rem]">
                <li className="flex gap-4 border-t border-[color:var(--line)] pt-4">
                  <span className="t-label w-28 shrink-0 text-[color:var(--muted)]">Charging</span>
                  <span>
                    {facts.rwanda.chargingHome.value} <Tag confidence="confirmed-rw" />
                  </span>
                </li>
                <li className="flex gap-4 border-t border-[color:var(--line)] pt-4">
                  <span className="t-label w-28 shrink-0 text-[color:var(--muted)]">Service</span>
                  <span>
                    {facts.rwanda.serviceSupport.value} <Tag confidence="confirmed-rw" />
                  </span>
                </li>
                <li className="flex gap-4 border-t border-[color:var(--line)] pt-4 last:border-b last:pb-4">
                  <span className="t-label w-28 shrink-0 text-[color:var(--muted)]">Instagram</span>
                  <a
                    href={facts.rwanda.instagram.value ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-wipe inline-flex items-center gap-1.5"
                  >
                    {facts.rwanda.instagramHandle.value}
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              </ul>
              {PROTOTYPE && (
                <p className="t-label mt-8 text-[0.625rem] text-[color:var(--muted)]">
                  2023 press also quoted a price band for three exhibited models. Those figures are dated and are not
                  shown here as current pricing.
                </p>
              )}
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <h3 className="t-label mb-6 text-[color:var(--muted)]">Branches</h3>
              <ul>
                {locations.map((l) => (
                  <li key={l.id} className="border-t border-[color:var(--line)] py-6 last:border-b">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <p className="t-display t-h3">{l.name}</p>
                      <Tag confidence={l.existence} />
                    </div>
                    <p className="mt-3 text-[0.875rem] text-[color:var(--muted)]">{l.note}</p>
                    <dl className="mt-4 grid gap-2 text-[0.875rem] sm:grid-cols-2">
                      <div>
                        <dt className="t-label text-[0.625rem] text-[color:var(--muted)]">Address</dt>
                        <dd>{l.address ?? <span className="text-[color:var(--muted)]">To be confirmed</span>}</dd>
                      </div>
                      <div>
                        <dt className="t-label text-[0.625rem] text-[color:var(--muted)]">Hours</dt>
                        <dd>{l.hours ?? <span className="text-[color:var(--muted)]">To be confirmed</span>}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-20 flex flex-wrap gap-3 border-t border-[color:var(--line)] pt-10">
            <ButtonLink href="/contact#test-ride">Book a test ride</ButtonLink>
            <ButtonLink href="/range" variant="outline">
              Explore the range
            </ButtonLink>
          </div>
        </div>
      </PageSection>
    </>
  );
}
