import { Accordion } from "@/components/ui/Accordion";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Picture } from "@/components/ui/Picture";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { assets } from "@/data/assets";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Style guide",
  description: "Internal design-system reference.",
  path: "/styleguide",
  noindex: true,
});

const swatches = [
  { name: "ink", hex: "#0e0f11", cls: "bg-ink text-paper", note: "Dark surface · text on light" },
  { name: "graphite", hex: "#1b1d20", cls: "bg-graphite text-paper", note: "Raised dark surface" },
  { name: "steel", hex: "#8a8f96", cls: "bg-steel text-ink", note: "Muted text on dark only" },
  { name: "mist", hex: "#cfcfcb", cls: "bg-mist text-ink", note: "Lines and floors on light" },
  { name: "paper", hex: "#f2f1ed", cls: "bg-paper text-ink", note: "Light surface" },
  { name: "green", hex: "#00a74a", cls: "bg-green text-ink", note: "Official accent. INK text only (6.0:1)" },
  { name: "green-deep", hex: "#007a36", cls: "bg-green-deep text-white", note: "White text 5.5:1 · green text on light" },
];

function Section({
  id,
  title,
  theme = "light",
  children,
}: {
  id: string;
  title: string;
  theme?: "light" | "dark";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-theme={theme}
      data-header-theme={theme}
      className="bg-[color:var(--bg)] py-20 text-[color:var(--fg)]"
    >
      <div className="container-x">
        <h2 className="t-label mb-10 border-b border-[color:var(--line)] pb-4 text-[color:var(--accent-text)]">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <Section id="intro" title="00 · REVOO Rwanda design system">
        <h1 className="t-display t-mega mt-16">Style guide</h1>
        <p className="t-lead mt-6">
          Internal reference for Phase 2. Scroll: the header switches theme to follow each section beneath it.
        </p>
      </Section>

      <Section id="colour" title="01 · Colour" theme="light">
        <ul className="grid grid-cols-2 gap-px bg-[color:var(--line)] md:grid-cols-4">
          {swatches.map((s) => (
            <li key={s.name} className={`${s.cls} flex min-h-40 flex-col justify-between p-5`}>
              <span className="t-label">{s.name}</span>
              <span>
                <span className="t-label block">{s.hex}</span>
                <span className="mt-1 block text-[0.8125rem] leading-snug">{s.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="type" title="02 · Typography" theme="dark">
        <p className="t-label mb-3 text-steel">t-mega · Archivo condensed</p>
        <p className="t-display t-mega">Move beyond</p>
        <p className="t-label mb-3 mt-12 text-steel">t-h1</p>
        <p className="t-display t-h1">Engineered for the next generation</p>
        <p className="t-label mb-3 mt-12 text-steel">t-h2</p>
        <p className="t-display t-h2">Designed to be understood</p>
        <p className="t-label mb-3 mt-12 text-steel">t-h3 / t-wide</p>
        <p className="t-display t-h3">Motor, battery, controller</p>
        <p className="t-wide mt-3">Expanded width label</p>
        <p className="t-label mb-3 mt-12 text-steel">t-lead / t-body</p>
        <p className="t-lead max-w-2xl">Lead paragraph set in Inter for clear reading on every screen size.</p>
        <p className="t-body mt-4 max-w-2xl">
          Body copy. Specifications shown in this prototype are official international figures unless tagged, and must
          be confirmed for Rwanda before launch.
        </p>
        <p className="t-label mb-3 mt-12 text-steel">t-spec-value</p>
        <p className="t-spec-value">72V · 3000W · 100 km</p>
      </Section>

      <Section id="buttons" title="03 · Buttons" theme="light">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/range" variant="primary">
            Primary
          </ButtonLink>
          <ButtonLink href="/range" variant="ink">
            Ink
          </ButtonLink>
          <ButtonLink href="/range" variant="outline">
            Outline
          </ButtonLink>
          <ButtonLink href="/range" variant="ghost">
            Ghost
          </ButtonLink>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div data-theme="dark" className="mt-8 flex flex-wrap items-center gap-4 bg-[color:var(--bg)] p-8">
          <ButtonLink href="/range" variant="primary">
            Primary
          </ButtonLink>
          <ButtonLink href="/range" variant="paper">
            Paper
          </ButtonLink>
          <ButtonLink href="/range" variant="outline">
            Outline
          </ButtonLink>
          <ButtonLink href="/range" variant="ghost">
            Ghost
          </ButtonLink>
        </div>
      </Section>

      <Section id="tags" title="04 · Evidence tags (prototype only)" theme="light">
        <p className="t-body mb-6 max-w-2xl">
          Every unverified fact carries a visible marker in the prototype. Set NEXT_PUBLIC_PROTOTYPE=0 to hide them.
        </p>
        <div className="flex flex-wrap gap-4">
          <Tag confidence="confirmed-rw" />
          <Tag confidence="international" />
          <Tag confidence="tbc" />
        </div>
      </Section>

      <Section id="forms" title="05 · Form fields" theme="light">
        <form className="grid max-w-3xl gap-6 md:grid-cols-2" noValidate>
          <Input label="Full name" name="name" required autoComplete="name" />
          <Input label="Email" name="email" type="email" required error="Enter a valid email address." />
          <Select label="Model of interest" name="model" defaultValue="">
            <option value="" disabled>
              Choose a model
            </option>
            <option>A12</option>
            <option>A11</option>
            <option>C35Y</option>
            <option>E52</option>
          </Select>
          <Input label="Phone (optional)" name="phone" type="tel" hint="We will never call without your request." />
          <div className="md:col-span-2">
            <Textarea label="Message" name="message" rows={4} />
          </div>
        </form>
      </Section>

      <Section id="accordion" title="06 · Accordion and tabs" theme="dark">
        <div className="grid gap-16 lg:grid-cols-2">
          <Accordion
            defaultOpen="motor"
            items={[
              { id: "motor", index: "01", title: "Motor", content: "Hub motor details appear here per model." },
              { id: "battery", index: "02", title: "Battery", content: "Battery details appear here per model." },
              { id: "charging", index: "03", title: "Charging", content: "Charging details appear here per model." },
            ]}
          />
          <Tabs
            label="Example tabs"
            items={[
              { id: "a", label: "Overview", panel: <p className="t-body">Overview panel content.</p> },
              { id: "b", label: "Specs", panel: <p className="t-body">Specs panel content.</p> },
              { id: "c", label: "Gallery", panel: <p className="t-body">Gallery panel content.</p> },
            ]}
          />
        </div>
      </Section>

      <Section id="assets" title="07 · Hero-grade asset on light" theme="light">
        <div className="mx-auto max-w-5xl">
          <Picture asset={assets.models.a12.side} sizes="(min-width:1024px) 1024px, 92vw" />
        </div>
        <p className="t-label mt-6 text-[color:var(--muted)]">
          Official REVOO A12 render · shadow stripped · private prototype use
        </p>
      </Section>
    </>
  );
}
