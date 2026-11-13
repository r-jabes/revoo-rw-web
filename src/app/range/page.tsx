import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { PageHero, PageSection } from "@/components/page/PageHero";
import { RangeCompare } from "@/components/range/RangeCompare";
import { RangeModelLinks, RangeSwitcher } from "@/components/range/RangeSwitcher";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, rangeItemListJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Range",
  description: "The REVOO electric two-wheeler range: A12, A11, C35Y and E52. International specifications.",
  path: "/range",
});

export default function RangePage() {
  return (
    <>
      <JsonLd
        data={[
          rangeItemListJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Range", path: "/range" },
          ]),
        ]}
      />
      <PageHero
        id="range"
        eyebrow="02 · The range"
        title="Choose your REVOO."
        lead={
          <>
            Four electric two-wheelers for different journeys. Figures shown are official international specifications.
            Rwanda versions will be confirmed model by model. <Tag confidence="international" />
          </>
        }
        labelledBy="range-title"
      />

      <PageSection className="pb-24 md:pb-36" labelledBy="range-title">
        <div className="container-x">
          <RangeSwitcher />
        </div>
      </PageSection>

      <PageSection id="compare" className="pb-24 md:pb-40" labelledBy="compare-title">
        <div className="container-x">
          <div className="grid gap-8 border-t border-[color:var(--fg)] pt-24 md:pt-36 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="t-label text-[color:var(--accent-text)]">Compare</p>
              <h2 id="compare-title" className="t-display t-h1 mt-6 max-w-[14ch]">
                Side by side.
              </h2>
            </div>
            <p className="t-body self-end text-[color:var(--muted)] lg:col-span-4 lg:col-start-9">
              The same measures across the range. Open a model for the full specification list.
            </p>
          </div>
          <div className="mt-14 md:mt-20">
            <RangeCompare />
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-[color:var(--line)] pt-10">
            <RangeModelLinks />
            <ButtonLink href="/contact#test-ride" variant="ink">
              Book a test ride
            </ButtonLink>
          </div>
        </div>
      </PageSection>
    </>
  );
}
