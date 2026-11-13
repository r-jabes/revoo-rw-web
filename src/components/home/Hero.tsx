import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { assets } from "@/data/assets";
import { Section } from "./Section";

const LINES = ["The future", "doesn't wait."];

/**
 * Motion hooks (see src/components/motion/hero.ts). Everything marked `data-pre`
 * is hidden by CSS only while JS is pending (src/styles/motion.css). The markup
 * itself is the final state: without JS, or with reduced motion, nothing moves
 * and nothing is hidden.
 */

/** One masked headline line. The mask lets the line rise out of a clip box. */
function Line({ children }: { children: string }) {
  return (
    <span className="line-mask">
      <span className="block" data-hero="line" data-pre>
        {children}
      </span>
    </span>
  );
}

/**
 * Headline block. Rendered twice at identical positions: once filled (behind the
 * bike) and once outlined (in front of it), so type and machine interlock.
 */
function HeroCopy({ outline = false }: { outline?: boolean }) {
  return (
    <div className="container-x pt-[calc(var(--header-h)+clamp(1.5rem,5svh,3.5rem))]">
      <p
        className={`t-label mb-5 text-[color:var(--accent-text)] ${outline ? "invisible" : ""}`}
        {...(outline ? {} : { "data-hero": "eyebrow", "data-pre": "" })}
      >
        REVOO Rwanda · Electric two-wheelers
      </p>
      {outline ? (
        <p aria-hidden className="t-display t-mega text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)]">
          {LINES.map((l) => (
            <Line key={l}>{l}</Line>
          ))}
        </p>
      ) : (
        <h1 className="t-display t-mega">
          {LINES.map((l) => (
            <Line key={l}>{l}</Line>
          ))}
        </h1>
      )}
    </div>
  );
}

/** Speed streaks trail the bike (it faces left, so they sit behind it on the right). Desktop only. */
const STREAKS = [
  { top: "34%", w: "62%" },
  { top: "47%", w: "88%" },
  { top: "58%", w: "50%" },
  { top: "69%", w: "100%" },
  { top: "81%", w: "70%" },
];

export function Hero() {
  return (
    <Section id="hero" theme="light" className="isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Studio: wall (paper) and floor, one horizon hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[24svh] overflow-hidden bg-[color-mix(in_srgb,var(--color-mist)_45%,var(--color-paper))]"
      >
        {/* Floor light sweep: a soft highlight that travels with the bike, then is gone */}
        <span
          data-hero="sweep"
          className="absolute -left-[30%] top-0 h-full w-[30%] -skew-x-[24deg] bg-[color:var(--color-paper)] opacity-0 blur-xl"
        />
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-[24svh] h-px bg-[color:var(--line)]" />

      {/* Layer 0: filled headline */}
      <div className="relative z-0" data-hero="copy">
        <HeroCopy />
      </div>

      {/* Layer 1: the bike */}
      <div
        data-moto
        data-pre
        className="pointer-events-none relative z-10 mt-auto px-[3vw] lg:absolute lg:inset-auto lg:bottom-[calc(24svh-6.5svh)] lg:right-[3vw] lg:px-0 lg:w-[min(62vw,calc(66svh*1.353))]"
      >
        {/* Streaks live behind the bike */}
        <div aria-hidden data-hero="speed" className="absolute left-[94%] top-0 z-0 hidden h-full w-[48%] lg:block">
          {STREAKS.map((s) => (
            <span
              key={s.top}
              className="absolute left-0 h-px origin-left bg-[color:var(--fg)] opacity-0"
              style={{ top: s.top, width: s.w }}
            />
          ))}
        </div>
        <Picture
          asset={assets.models.a12.side}
          priority
          sizes="(min-width:1024px) 62vw, 120vw"
          imgClassName="relative z-10 h-auto w-full select-none"
        />
        {/* Ground shadow: the single permitted radial, tied to the tyre contact line */}
        <div
          aria-hidden
          data-moto-shadow
          className="absolute bottom-[-1.4%] left-[5%] z-0 h-[5%] w-[90%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(14,15,17,0.34),rgba(14,15,17,0))]"
        />
      </div>

      {/* Layer 2: outlined headline over the bike */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-20" data-hero="copy">
        <HeroCopy outline />
      </div>

      {/* Supporting copy + actions: bottom-left with a vertical hairline */}
      <div className="container-x relative z-30 mt-6 pb-8 lg:mt-auto lg:pb-[max(2.5rem,5svh)]">
        <div className="relative flex max-w-lg flex-col gap-6 pl-5">
          <span
            aria-hidden
            data-hero="rule"
            data-pre
            className="absolute left-0 top-0 h-full w-px origin-top bg-[color:var(--fg)]"
          />
          <p className="t-lead" data-hero="rise" data-pre>
            Discover a smarter way to move.
          </p>
          <div className="flex flex-wrap gap-3" data-hero="rise" data-pre>
            <ButtonLink href="/range">Explore the range</ButtonLink>
            <ButtonLink href="/contact#test-ride" variant="outline">
              Find your REVOO
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Index + scroll cue */}
      <p
        data-hero="index"
        data-pre
        className="t-label absolute bottom-[max(2.5rem,5svh)] right-[var(--gutter)] z-30 hidden items-center gap-3 lg:flex"
      >
        <span className="text-[color:var(--accent-text)]">01</span>
        <span aria-hidden className="h-px w-8 bg-[color:var(--fg)]" />
        <span>07</span>
        <span className="sr-only">Scroll to continue</span>
      </p>
    </Section>
  );
}
