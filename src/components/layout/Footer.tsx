import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Tag } from "@/components/ui/Tag";
import { ArrowUpRight } from "@/components/ui/Icons";
import { mainNav, legalNav } from "@/data/nav";
import { facts } from "@/data/facts";
import { locations } from "@/data/locations";
import { models } from "@/data/models";
import { PROTOTYPE } from "@/lib/flags";

export function Footer() {
  return (
    <footer data-theme="dark" data-header-theme="dark" className="border-t border-[color:var(--line)] bg-[color:var(--bg)] text-[color:var(--fg)]">
      <div className="container-x pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 border-b border-[color:var(--line)] pb-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Logo height={26} />
            <p className="t-lead mt-6 !text-[color:var(--muted)]">{facts.brand.positioning}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3">
            <div>
              <h2 className="t-label mb-5 text-steel">Explore</h2>
              <ul className="space-y-3">
                {mainNav.slice(1).map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="link-wipe">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="t-label mb-5 text-steel">The range</h2>
              <ul className="space-y-3">
                {models.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/range/${m.slug}`} className="link-wipe">
                      {m.code}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h2 className="t-label mb-5 text-steel">Visit</h2>
              <ul className="space-y-3">
                {locations.map((l) => (
                  <li key={l.id} className="flex flex-wrap items-center gap-2">
                    <span>{l.name}</span>
                    <Tag confidence={l.addressConfidence} />
                  </li>
                ))}
                <li>
                  <a
                    href={facts.rwanda.instagram.value ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-wipe inline-flex items-center gap-1.5"
                  >
                    Instagram {facts.rwanda.instagramHandle.value}
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-3 text-[0.8125rem] leading-relaxed text-[color:var(--muted)]">
            {PROTOTYPE && (
              <p>
                <strong className="font-semibold text-[color:var(--fg)]">Design concept.</strong> This is a proposal
                prototype for REVOO Rwanda, not yet an official website. Specifications are official international
                figures and must be confirmed for Rwanda before launch.
              </p>
            )}
            <p>© {new Date().getFullYear()} REVOO. REVOO is a registered brand of its respective owner.</p>
          </div>
          <ul className="flex gap-6 text-[0.8125rem]">
            {legalNav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-wipe">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
