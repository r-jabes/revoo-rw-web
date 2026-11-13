import { Tag } from "@/components/ui/Tag";
import { ArrowUpRight } from "@/components/ui/Icons";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { PageHero, PageSection } from "@/components/page/PageHero";
import { facts } from "@/data/facts";
import { locations } from "@/data/locations";
import { PROTOTYPE } from "@/lib/flags";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact REVOO Rwanda, find a showroom or book a test ride in Kigali.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        id="contact"
        eyebrow="06 · Contact"
        title="Find us in Kigali."
        lead="Book a test ride, ask about a model, or visit a showroom. Phone and WhatsApp numbers will appear here once REVOO Rwanda confirms them."
        labelledBy="contact-title"
      />

      <PageSection id="visit" className="pb-20 md:pb-28" labelledBy="visit-title">
        <div className="container-x">
          <div className="grid gap-12 border-t border-[color:var(--fg)] pt-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h2 id="visit-title" className="t-display t-h2">
                Showrooms.
              </h2>
              <p className="t-body mt-6 max-w-sm text-[color:var(--muted)]">
                Only Remera is confirmed on REVOO Rwanda&apos;s channels. Map pins stay off until addresses are
                verified.
              </p>
              <a
                href={facts.rwanda.instagram.value ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label mt-8 inline-flex items-center gap-2 border-b border-[color:var(--fg)] pb-1"
              >
                Instagram {facts.rwanda.instagramHandle.value}
                <ArrowUpRight className="h-4 w-4" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            <ul className="lg:col-span-6 lg:col-start-7">
              {locations.map((l) => (
                <li key={l.id} className="border-t border-[color:var(--line)] py-7 last:border-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="t-display t-h3">{l.name}</h3>
                    <Tag confidence={l.existence} />
                  </div>
                  <p className="mt-3 text-[0.875rem] text-[color:var(--muted)]">{l.note}</p>
                  <dl className="mt-5 grid gap-4 text-[0.9375rem] sm:grid-cols-2">
                    <div>
                      <dt className="t-label text-[0.625rem] text-[color:var(--muted)]">Address</dt>
                      <dd className="mt-1">
                        {l.address ?? <span className="text-[color:var(--muted)]">To be confirmed</span>}
                      </dd>
                    </div>
                    <div>
                      <dt className="t-label text-[0.625rem] text-[color:var(--muted)]">Opening hours</dt>
                      <dd className="mt-1">
                        {l.hours ?? <span className="text-[color:var(--muted)]">To be confirmed</span>}
                      </dd>
                    </div>
                    <div>
                      <dt className="t-label text-[0.625rem] text-[color:var(--muted)]">Phone</dt>
                      <dd className="mt-1 text-[color:var(--muted)]">
                        To be confirmed <Tag confidence="tbc" />
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>

          {/* Map placeholder — never invent a pin */}
          <div
            className="mt-14 grid min-h-[14rem] place-items-center border border-dashed border-[color:var(--line)] md:mt-20 md:min-h-[18rem]"
            role="img"
            aria-label="Map placeholder. Exact showroom coordinates to be confirmed by REVOO Rwanda."
          >
            <div className="px-6 text-center">
              <p className="t-label text-[color:var(--accent-text)]">Map</p>
              <p className="t-body mt-3 max-w-sm text-[color:var(--muted)]">
                Exact coordinates will be added when REVOO confirms each address.{" "}
                <Tag confidence="tbc" />
              </p>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection theme="dark" id="test-ride" className="py-24 md:py-40" labelledBy="form-title">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="t-label text-[color:var(--accent-text)]">Enquire</p>
            <h2 id="form-title" className="t-display t-h1 mt-6 max-w-[12ch]">
              Book a test ride.
            </h2>
            <p className="t-body mt-8 max-w-md text-[color:var(--muted)]">
              Tell us which model you are interested in. A REVOO Rwanda advisor will confirm a time at the Remera
              branch.
            </p>
            {PROTOTYPE && (
              <p className="t-label mt-8 text-[0.625rem] text-[color:var(--muted)]">
                No clickable phone or WhatsApp link until REVOO verifies the numbers. You can still leave an email or
                phone on the form so the team can call you back.
              </p>
            )}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <EnquiryForm />
          </div>
        </div>
      </PageSection>
    </>
  );
}
