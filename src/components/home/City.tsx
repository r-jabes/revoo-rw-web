import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Tag } from "@/components/ui/Tag";
import { assets } from "@/data/assets";
import { cityFacts } from "@/data/home";
import { locations } from "@/data/locations";
import { PROTOTYPE } from "@/lib/flags";
import { Eyebrow, Section } from "./Section";

/** Deterministic generic skyline (outline only). Not a real place. */
const buildings = [
  { x: 40, w: 150, h: 250, l: 0 },
  { x: 150, w: 110, h: 330, l: 1 },
  { x: 250, w: 190, h: 210, l: 0 },
  { x: 420, w: 120, h: 370, l: 1 },
  { x: 530, w: 170, h: 260, l: 0 },
  { x: 690, w: 130, h: 320, l: 1 },
  { x: 810, w: 200, h: 230, l: 0 },
  { x: 990, w: 120, h: 390, l: 1 },
  { x: 1100, w: 180, h: 270, l: 0 },
  { x: 1270, w: 140, h: 340, l: 1 },
  { x: 1400, w: 190, h: 240, l: 0 },
];

function Skyline() {
  return (
    <svg
      viewBox="0 0 1600 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      focusable="false"
      className="absolute inset-x-0 bottom-0 h-full w-full"
    >
      {([1, 0] as const).map((layer) => (
        <g key={layer} data-city={layer ? "far" : "near"}>
      {buildings
        .filter((b) => b.l === layer)
        .map((b, i) => {
          const y = 420 - b.h;
          const rows = Math.floor(b.h / 38);
          return (
            <g key={i} data-layer={b.l} opacity={b.l ? 0.5 : 1}>
              <rect
                x={b.x}
                y={y}
                width={b.w}
                height={b.h}
                fill="var(--color-paper)"
                stroke="var(--color-ink)"
                strokeOpacity="0.3"
                strokeWidth="1.25"
                vectorEffect="non-scaling-stroke"
              />
              {Array.from({ length: rows }).map((_, r) => (
                <line
                  key={r}
                  x1={b.x + 14}
                  x2={b.x + b.w - 14}
                  y1={y + 24 + r * 38}
                  y2={y + 24 + r * 38}
                  stroke="var(--color-ink)"
                  strokeOpacity="0.14"
                  strokeWidth="1"
                  strokeDasharray="16 10"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          );
        })}
        </g>
      ))}
    </svg>
  );
}

export function City() {
  return (
    <Section id="city" theme="light" labelledBy="city-title" className="py-24 md:py-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow n="06" label="The city" />
            <h2 id="city-title" className="t-display t-h1 mt-8 max-w-[14ch]">
              Made for the city.
            </h2>
          </div>
          <p data-reveal className="t-body self-end text-[color:var(--muted)] lg:col-span-4 lg:col-start-9">
            A step-through frame, hydraulic suspension and ground clearance for everyday streets. Shown here: the
            C35Y.
          </p>
        </div>
      </div>

      {/* Street scene: generic illustration, not a real location */}
      <div data-city="scene" className="relative mt-14 aspect-[4/3] w-full overflow-hidden border-y border-[color:var(--line)] sm:aspect-[16/9] lg:mt-20 lg:aspect-[16/8]">
        <div className="absolute inset-x-0 bottom-[26%] top-0">
          <Skyline />
        </div>
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[26%] border-t border-[color:var(--fg)] bg-[color-mix(in_srgb,var(--color-mist)_55%,var(--color-paper))]"
        >
          <div
            data-city="road"
            className="absolute inset-x-0 top-[58%] h-px opacity-40 [background-image:repeating-linear-gradient(90deg,var(--fg)_0_28px,transparent_28px_56px)]"
          />
        </div>
        <div className="absolute bottom-[calc(26%-3%)] left-1/2 z-10 w-[min(88%,46rem)] -translate-x-1/2">
          <div data-city="bike" className="relative">
            <Picture asset={assets.models.c35y.side} sizes="(min-width:1024px) 46rem, 88vw" />
            <div
              aria-hidden
              data-city="shadow"
              className="absolute bottom-[-2%] left-[6%] h-[6%] w-[88%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(14,15,17,0.3),rgba(14,15,17,0))]"
            />
          </div>
        </div>
        <p className="t-label absolute bottom-3 left-[var(--gutter)] z-10 text-[0.625rem] text-[color:var(--muted)]">
          Illustration · not a real location
        </p>
      </div>

      <div className="container-x">
        <dl data-reveal className="mt-14 grid gap-px border-t border-[color:var(--line)] sm:grid-cols-3">
          {cityFacts.map((f) => (
            <div key={f.label} className="border-b border-[color:var(--line)] py-6 sm:border-b-0 sm:pr-8">
              <dt className="t-label text-[color:var(--muted)]">{f.label}</dt>
              <dd className="t-display t-h3 mt-3">{f.value}</dd>
              <dd className="mt-2 text-[0.8125rem] text-[color:var(--muted)]">
                {f.note} <Tag confidence="international" />
              </dd>
            </div>
          ))}
        </dl>

        {/* Visit: real-world presence gets headline treatment */}
        <div data-reveal className="mt-24 grid gap-10 border-t border-[color:var(--fg)] pt-14 md:mt-36 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="t-label text-[color:var(--accent-text)]">Visit REVOO</p>
            <h3 className="t-display t-h2 mt-5">Find us in Kigali.</h3>
            <div className="mt-8">
              <ButtonLink href="/contact#test-ride">Book a test ride</ButtonLink>
            </div>
          </div>
          <ul className="lg:col-span-6 lg:col-start-7">
            {locations.map((l) => (
              <li key={l.id} className="border-t border-[color:var(--line)] py-6 last:border-b">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="t-display t-h3">{l.name}</p>
                  {l.existence !== "confirmed-rw" && <Tag confidence={l.existence} />}
                  {l.existence === "confirmed-rw" && PROTOTYPE && (
                    <span className="t-label text-[0.625rem] text-[color:var(--accent-text)]">
                      Branch confirmed by REVOO Rwanda
                    </span>
                  )}
                </div>
                <dl className="mt-4 grid gap-x-8 gap-y-2 text-[0.9375rem] sm:grid-cols-2">
                  <div>
                    <dt className="t-label text-[0.625rem] text-[color:var(--muted)]">Address</dt>
                    <dd>{l.address ?? <span className="text-[color:var(--muted)]">To be confirmed</span>}</dd>
                  </div>
                  <div>
                    <dt className="t-label text-[0.625rem] text-[color:var(--muted)]">Opening hours</dt>
                    <dd>{l.hours ?? <span className="text-[color:var(--muted)]">To be confirmed</span>}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
