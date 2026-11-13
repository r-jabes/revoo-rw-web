import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Tag } from "@/components/ui/Tag";
import { ArrowRight } from "@/components/ui/Icons";
import { PageHero, PageSection } from "@/components/page/PageHero";
import { models, type Model } from "@/data/models";
import { PROTOTYPE } from "@/lib/flags";

function ModelStage({ model }: { model: Model }) {
  if (model.image) {
    return (
      <>
        <Picture
          asset={model.image}
          priority
          sizes="(min-width:1024px) 62vw, 94vw"
          imgClassName="mx-auto h-auto w-full max-w-5xl select-none"
        />
        <div
          aria-hidden
          className="mx-auto mt-[-1.5%] h-5 w-[80%] max-w-4xl rounded-[50%] bg-[radial-gradient(closest-side,rgba(14,15,17,0.28),rgba(14,15,17,0))]"
        />
      </>
    );
  }
  return (
    <div className="relative mx-auto grid aspect-[1.353] w-full max-w-5xl place-items-center border border-dashed border-[color:var(--line)]">
      <span
        aria-hidden
        className="t-display text-[clamp(5rem,16vw,12rem)] text-transparent [-webkit-text-stroke:1.5px_var(--line)]"
      >
        {model.code}
      </span>
      {PROTOTYPE && (
        <span className="t-label absolute bottom-5 left-5 right-5 text-[color:var(--muted)]">
          {model.imageNote ?? "High-resolution render requested from REVOO"}
        </span>
      )}
    </div>
  );
}

export function ModelPageView({ model }: { model: Model }) {
  const others = models.filter((m) => m.slug !== model.slug);
  const battery = model.specs.find((s) => s.key === "battery");
  const charge = model.specs.find((s) => s.key === "charge");
  const range = model.specs.find((s) => s.key === "range");

  const accordion = model.specs.map((s, i) => ({
    id: s.key,
    index: String(i + 1).padStart(2, "0"),
    title: s.label,
    content: (
      <div>
        <p className="t-spec-value text-[clamp(1.25rem,1rem+0.9vw,1.85rem)]">{s.value}</p>
        {s.note && <p className="mt-3 text-[0.875rem] text-[color:var(--muted)]">{s.note}</p>}
        <p className="t-label mt-4 text-[0.625rem] text-[color:var(--muted)]">
          International specification <Tag confidence={model.specConfidence} />
        </p>
      </div>
    ),
  }));

  return (
    <>
      <PageHero
        id="model"
        eyebrow={model.series}
        title={
          <>
            REVOO {model.code}
          </>
        }
        lead={
          <>
            {model.tagline}. {model.intro} <Tag confidence={model.specConfidence} />
          </>
        }
        labelledBy="model-title"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact#test-ride">Book a test ride</ButtonLink>
          <ButtonLink href="/range#compare" variant="outline">
            Compare the range
          </ButtonLink>
        </div>
      </PageHero>

      <PageSection className="pb-16 md:pb-24">
        <div className="container-x">
          <ModelStage model={model} />
        </div>
      </PageSection>

      {/* Headline facts */}
      <PageSection className="pb-20 md:pb-28">
        <div className="container-x">
          <dl className="grid gap-px border-t border-[color:var(--fg)] sm:grid-cols-3">
            {(
              [
                ["Top speed", model.headline.topSpeed],
                ["Range", model.headline.range],
                ["Battery", model.headline.battery],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="border-b border-[color:var(--line)] py-8 sm:border-b-0 sm:pr-8">
                <dt className="t-label text-[color:var(--muted)]">{label}</dt>
                <dd className="t-display t-h2 mt-4">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="t-label mt-6 text-[0.625rem] text-[color:var(--muted)]">
            Availability in Rwanda <Tag confidence={model.availabilityConfidence} />
          </p>
        </div>
      </PageSection>

      {/* Specs */}
      <PageSection id="specs" className="pb-24 md:pb-36" labelledBy="specs-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="t-label text-[color:var(--accent-text)]">Specifications</p>
            <h2 id="specs-title" className="t-display t-h2 mt-5 max-w-[12ch]">
              The numbers.
            </h2>
            <p className="t-body mt-6 max-w-sm text-[color:var(--muted)]">
              Official international figures. Confirm the Rwanda variant before purchase.
            </p>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={accordion} defaultOpen={model.specs[0]?.key ?? null} />
          </div>
        </div>
      </PageSection>

      {/* Battery & charging */}
      <PageSection theme="dark" id="battery" className="py-24 md:py-36" labelledBy="battery-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="t-label text-[color:var(--accent-text)]">Battery &amp; charging</p>
            <h2 id="battery-title" className="t-display t-h2 mt-5 max-w-[14ch]">
              Power for the day.
            </h2>
          </div>
          <dl className="lg:col-span-6 lg:col-start-7">
            {[battery, range, charge].filter(Boolean).map((s) => (
              <div key={s!.key} className="border-t border-[color:var(--line)] py-6 last:border-b">
                <dt className="t-label text-[color:var(--muted)]">{s!.label}</dt>
                <dd className="t-spec-value mt-2 text-[clamp(1.15rem,1rem+0.7vw,1.6rem)]">{s!.value}</dd>
                {s!.note && <dd className="mt-2 text-[0.8125rem] text-[color:var(--muted)]">{s!.note}</dd>}
              </div>
            ))}
            <p className="mt-6 text-[0.8125rem] text-[color:var(--muted)]">
              Charges from a standard household outlet in Rwanda. <Tag confidence="confirmed-rw" /> Which battery
              chemistry ships with each model is to be confirmed. <Tag confidence="tbc" />
            </p>
          </dl>
        </div>
      </PageSection>

      {/* Colourways */}
      {model.colourways.length > 0 && (
        <PageSection className="py-20 md:py-28" labelledBy="colour-title">
          <div className="container-x">
            <p className="t-label text-[color:var(--accent-text)]">Colour</p>
            <h2 id="colour-title" className="t-display t-h2 mt-5">
              As shown.
            </h2>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {model.colourways.map((c) => (
                <li key={c.name} className="flex items-center gap-5 border-t border-[color:var(--line)] pt-6">
                  <span
                    aria-hidden
                    className="h-10 w-10 shrink-0 border border-[color:var(--line)]"
                    style={{ background: c.hex }}
                  />
                  <div>
                    <p className="t-h3">{c.name}</p>
                    <p className="t-label mt-1 text-[0.625rem] text-[color:var(--muted)]">{c.hex}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="t-label mt-8 text-[0.625rem] text-[color:var(--muted)]">
              Colourways shown are from official international renders. Rwanda stock colours are to be confirmed{" "}
              <Tag confidence="tbc" />
            </p>
          </div>
        </PageSection>
      )}

      {/* Enquiry */}
      <PageSection theme="dark" className="py-24 md:py-36" labelledBy="enquire-title">
        <div className="container-x flex flex-col gap-10 border-t border-[color:var(--line)] pt-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="t-label text-[color:var(--accent-text)]">Next step</p>
            <h2 id="enquire-title" className="t-display t-h1 mt-5 max-w-[14ch]">
              Ride the {model.code}.
            </h2>
            <p className="t-body mt-6 max-w-md text-[color:var(--muted)]">
              Tell us you are interested in the {model.code} and arrange a test ride in Kigali.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`/contact?model=${model.slug}#test-ride`}>Enquire about {model.code}</ButtonLink>
            <ButtonLink href="/range" variant="outline">
              Back to the range
            </ButtonLink>
          </div>
        </div>
      </PageSection>

      {/* Other models */}
      <PageSection className="py-20 md:py-28" labelledBy="others-title">
        <div className="container-x">
          <h2 id="others-title" className="t-label text-[color:var(--muted)]">
            Also in the range
          </h2>
          <ul className="mt-8">
            {others.map((m) => (
              <li key={m.slug} className="border-t border-[color:var(--line)] last:border-b">
                <Link
                  href={`/range/${m.slug}`}
                  className="group flex flex-wrap items-baseline justify-between gap-4 py-7"
                >
                  <span>
                    <span className="t-label text-[color:var(--accent-text)]">{m.series}</span>
                    <span className="t-display t-h2 mt-2 block">{m.code}</span>
                    <span className="mt-2 block text-[color:var(--muted)]">{m.tagline}</span>
                  </span>
                  <span className="t-label inline-flex items-center gap-2 border-b border-transparent pb-1 transition-colors group-hover:border-[color:var(--fg)]">
                    View {m.code}
                    <ArrowRight className="h-4 w-4 transition-transform duration-[var(--dur-micro)] group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>
    </>
  );
}
