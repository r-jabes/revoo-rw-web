import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { PageHero, PageSection } from "@/components/page/PageHero";
import { faq } from "@/data/faq";
import { facts } from "@/data/facts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Support",
  description: "Charging, maintenance, warranty and frequently asked questions for REVOO riders in Rwanda.",
  path: "/support",
});

export default function SupportPage() {
  const steps = facts.service.process.value;
  const promises = facts.service.promises.value;
  const formats = facts.service.formats.value;

  const items = faq.map((f, i) => ({
    id: f.id,
    index: String(i + 1).padStart(2, "0"),
    title: f.question,
    content: (
      <div className="space-y-4">
        {f.answer.map((p) => (
          <p key={p} className="t-body max-w-2xl text-[color:var(--muted)]">
            {p}
          </p>
        ))}
        <p className="t-label text-[0.625rem]">
          <Tag confidence={f.confidence} />
        </p>
      </div>
    ),
  }));

  return (
    <>
      <PageHero
        id="support"
        eyebrow="05 · Support"
        title="Ownership & support."
        lead={
          <>
            Charging at home, a clear service path, and honest answers. Rwanda-specific warranty and branch details are
            confirmed as REVOO supplies them. <Tag confidence="international" />
          </>
        }
        labelledBy="support-title"
      />

      <PageSection id="faq" className="pb-24 md:pb-36" labelledBy="faq-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="t-label text-[color:var(--accent-text)]">FAQ</p>
            <h2 id="faq-title" className="t-display t-h2 mt-5 max-w-[12ch]">
              Questions, answered.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={items} defaultOpen={faq[0]?.id ?? null} allowMultiple />
          </div>
        </div>
      </PageSection>

      <PageSection theme="dark" id="charging" className="py-24 md:py-36" labelledBy="charging-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="t-label text-[color:var(--accent-text)]">Charging</p>
            <h2 id="charging-title" className="t-display t-h1 mt-6 max-w-[16ch]">
              {facts.rwanda.chargingHome.value}.
            </h2>
            <p className="t-body mt-8 max-w-md text-[color:var(--muted)]">
              {facts.rwanda.chargingPortable.value}. Reconfirm what ships with each model today.{" "}
              <Tag confidence="confirmed-rw" />
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="t-label mb-6 text-[color:var(--muted)]">What we know</h3>
            <ul className="space-y-5">
              <li className="border-t border-[color:var(--line)] pt-5">
                <p className="t-h3">Household outlet</p>
                <p className="mt-2 text-[0.9375rem] text-[color:var(--muted)]">
                  Confirmed for REVOO Rwanda. No special infrastructure required at home.
                </p>
              </li>
              <li className="border-t border-[color:var(--line)] pt-5">
                <p className="t-h3">No swap network</p>
                <p className="mt-2 text-[0.9375rem] text-[color:var(--muted)]">
                  REVOO does not operate battery-swap stations. Public charge points in Rwanda are to be confirmed{" "}
                  <Tag confidence="tbc" />
                </p>
              </li>
              <li className="border-t border-[color:var(--line)] pt-5 last:border-b last:pb-5">
                <p className="t-h3">Charge times</p>
                <p className="mt-2 text-[0.9375rem] text-[color:var(--muted)]">
                  International specs: roughly 6–9 h graphene, 3–3.5 h lithium (LFP), by model.{" "}
                  <Tag confidence="international" />
                </p>
              </li>
            </ul>
          </div>
        </div>
      </PageSection>

      <PageSection id="service" className="py-24 md:py-40" labelledBy="service-title">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="t-label text-[color:var(--accent-text)]">Service</p>
              <h2 id="service-title" className="t-display t-h1 mt-6 max-w-[16ch]">
                From booking to handover.
              </h2>
            </div>
            <p className="t-body self-end text-[color:var(--muted)] lg:col-span-4 lg:col-start-9">
              REVOO&apos;s global service programme. Rwanda branch details are confirmed showroom by showroom.{" "}
              <Tag confidence="international" />
            </p>
          </div>

          <ol className="mt-16 grid sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s} className="border-t border-[color:var(--line)] py-8 pr-6 lg:py-10">
                <span className="t-label text-[color:var(--accent-text)]">{String(i + 1).padStart(2, "0")}</span>
                <p className="t-display t-h3 mt-6">{s}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-12 border-t border-[color:var(--line)] pt-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h3 className="t-label mb-6 text-[color:var(--muted)]">What the programme promises</h3>
              <ul className="space-y-4">
                {promises.map((p) => (
                  <li key={p} className="flex gap-4">
                    <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-[color:var(--accent-text)]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <h3 className="t-label mb-6 text-[color:var(--muted)]">Three kinds of REVOO location</h3>
              <ul>
                {formats.map((f) => (
                  <li
                    key={f.name}
                    className="grid gap-1 border-t border-[color:var(--line)] py-5 last:border-b sm:grid-cols-[12rem_1fr] sm:gap-8"
                  >
                    <p className="t-display t-h3">{f.name}</p>
                    <p className="text-[color:var(--muted)]">{f.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.8125rem] text-[color:var(--muted)]">
                Which formats operate in Rwanda is to be confirmed <Tag confidence="tbc" />
              </p>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection theme="dark" id="warranty" className="py-24 md:py-36" labelledBy="warranty-title">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="t-label text-[color:var(--accent-text)]">Warranty</p>
            <h2 id="warranty-title" className="t-display t-h1 mt-6 max-w-[18ch]">
              {facts.rwanda.warranty.value}.
            </h2>
            <p className="t-body mt-8 max-w-xl text-[color:var(--muted)]">
              {facts.rwanda.warranty.note} <Tag confidence="tbc" />
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:col-start-9 lg:justify-end">
            <ButtonLink href="/contact">Contact support</ButtonLink>
            <ButtonLink href="/contact#test-ride" variant="outline">
              Book a test ride
            </ButtonLink>
          </div>
        </div>
      </PageSection>
    </>
  );
}
