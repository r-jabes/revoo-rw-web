import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { Tag } from "@/components/ui/Tag";
import { facts } from "@/data/facts";
import { Eyebrow, Section } from "./Section";

export function Support() {
  const steps = facts.service.process.value;
  const promises = facts.service.promises.value;
  const formats = facts.service.formats.value;
  return (
    <Section id="support" theme="light" labelledBy="support-title" className="pb-24 md:pb-40">
      <div className="container-x">
        <div className="grid gap-8 border-t border-[color:var(--fg)] pt-24 md:pt-40 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow n="07" label="Support" />
            <h2 id="support-title" className="t-display t-h1 mt-8 max-w-[20ch]">
              From booking to handover.
            </h2>
          </div>
          <p data-reveal className="t-body self-end text-[color:var(--muted)] lg:col-span-4 lg:col-start-9">
            REVOO&apos;s global service programme follows six steps. Service details for Rwanda are confirmed branch
            by branch. <Tag confidence="international" />
          </p>
        </div>

        <ol className="mt-16 grid sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} data-reveal className="border-t border-[color:var(--line)] py-8 pr-6 lg:py-10">
              <span className="t-label text-[color:var(--accent-text)]">{String(i + 1).padStart(2, "0")}</span>
              <p className="t-display t-h3 mt-6">{s}</p>
            </li>
          ))}
        </ol>

        <div className="grid gap-12 border-t border-[color:var(--line)] pt-14 lg:grid-cols-12 lg:gap-8">
          <div data-reveal className="lg:col-span-5">
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
          <div data-reveal className="lg:col-span-6 lg:col-start-7">
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
            <Link href="/support" className="t-label mt-8 inline-flex items-center gap-3 border-b border-[color:var(--fg)] pb-1">
              Ownership and support
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
