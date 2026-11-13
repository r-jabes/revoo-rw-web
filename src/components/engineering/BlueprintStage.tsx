import { Picture } from "@/components/ui/Picture";
import { assets } from "@/data/assets";
import type { EngComponent } from "@/data/home";

/**
 * Blueprint of the A12, traced from REVOO's official render.
 *
 * Canvas units: 1000 wide. The bike occupies BH units of height, with padding
 * above/below for leader labels. All component positions are fractions of the
 * bike image, so replacing the render only needs the anchors updating.
 *
 * Motion hooks (Phase 4). The server-rendered markup IS the final, assembled
 * state, so no-JS / reduced-motion visitors get a complete diagram. The scroll
 * timeline (src/components/motion/engineering.ts) finds these by `data-eng`:
 *   paint     full-colour render that cross-fades into the linework
 *   grid      drafting grid, frame and ground line
 *   lines     linework group, revealed by the `wipe` clip rect (+ `scan` line)
 *   body / front / rear   the same linework split so the wheels can be "exploded"
 *   ghost     wheel construction circles (stay behind as guides when exploded)
 *   battery / controller  illustrative component volumes
 *   marker    numbered marker faces
 */
const W = 1000;
const BH = 739; // 1000 * (2136 / 2890)
const PT = 95;
const PB = 115;
const H = PT + BH + PB;

const X = (fx: number) => fx * W;
const Y = (fy: number) => PT + fy * BH;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

const a12 = assets.models.a12.side;
const anchors = a12.anchors!;
const lines = assets.derived.a12Lines;

/** The wipe clip reaches this far left of the frame so an exploded front wheel is not shaved off. */
const WIPE_PAD = 60;

/** Wheel split radius: slightly outside the tyre so the fender/fork stubs travel with the wheel. */
const SPLIT = 1.06;

interface Props {
  components: EngComponent[];
  activeId: string;
  onSelect: (id: string) => void;
}

function wheelCircles(active: EngComponent) {
  const f = anchors.frontWheel;
  const r = anchors.rearWheel;
  const out: { cx: number; cy: number; r: number }[] = [];
  const s = active.shape;
  if (s.kind === "wheel") {
    const w = s.wheel === "front" ? f : r;
    out.push({ cx: X(w.x), cy: Y(w.y), r: w.r * W * s.scale });
  } else if (s.kind === "wheels") {
    out.push({ cx: X(f.x), cy: Y(f.y), r: f.r * W * s.scale });
    out.push({ cx: X(r.x), cy: Y(r.y), r: r.r * W * s.scale });
  }
  return out;
}

export function BlueprintStage({ components, activeId, onSelect }: Props) {
  const active = components.find((c) => c.id === activeId)!;
  const first = active.points[0];

  // Leader: from first marker, vertical to the label row, then horizontal to the clamped label x.
  const rowY = active.labelSide === "top" ? PT * 0.42 : H - PB * 0.42;
  const labelFx = Math.min(0.8, Math.max(0.2, first.x));
  const leader = `M ${X(first.x)} ${Y(first.y)} V ${rowY} H ${X(labelFx)}`;

  const wheels = [anchors.frontWheel, anchors.rearWheel];
  const imgBox = { x: 0, y: PT, width: W, height: BH };

  return (
    <div data-eng-stage className="relative w-full select-none" style={{ aspectRatio: `${W} / ${H}` }}>
      {/* Full-colour render: only visible during the scroll intro, then it gives way to the linework */}
      <div
        aria-hidden
        data-eng="paint"
        className="absolute left-0 w-full overflow-hidden opacity-0"
        style={{ top: pct(PT, H), height: pct(BH, H) }}
      >
        <Picture asset={a12} sizes="(min-width:1024px) 58vw, 92vw" className="block h-full w-full" imgClassName="h-full w-full" />
      </div>

      {/* Drafting layer */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
        focusable="false"
      >
        <defs>
          <pattern id="bp-grid-minor" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 H 0 V 50" fill="none" stroke="var(--color-paper)" strokeOpacity="0.07" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </pattern>
          <pattern id="bp-grid-major" width="250" height="250" patternUnits="userSpaceOnUse">
            <path d="M 250 0 H 0 V 250" fill="none" stroke="var(--color-paper)" strokeOpacity="0.16" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </pattern>

          {/* Left-to-right reveal of the linework (the rect's width is animated) */}
          <clipPath id="bp-wipe" clipPathUnits="userSpaceOnUse">
            <rect data-eng="wipe" x={-WIPE_PAD} y={-20} width={W + WIPE_PAD} height={H + 40} />
          </clipPath>

          {/* Each wheel travels with its own disc of linework */}
          {wheels.map((w, i) => (
            <clipPath key={i} id={`bp-wheel-${i}`} clipPathUnits="userSpaceOnUse">
              <circle cx={X(w.x)} cy={Y(w.y)} r={w.r * W * SPLIT} />
            </clipPath>
          ))}
          {/* ...and the body is the same art with both discs cut out (only applied while exploded) */}
          <mask id="bp-body" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
            <rect width={W} height={H} fill="#fff" />
            {wheels.map((w, i) => (
              <circle key={i} cx={X(w.x)} cy={Y(w.y)} r={w.r * W * SPLIT} fill="#000" />
            ))}
          </mask>
        </defs>

        <g data-eng="grid">
          <rect width={W} height={H} fill="url(#bp-grid-minor)" />
          <rect width={W} height={H} fill="url(#bp-grid-major)" />
          <rect
            x={0}
            y={0}
            width={W}
            height={H}
            fill="none"
            stroke="var(--color-paper)"
            strokeOpacity="0.28"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Ground line */}
          <line
            x1={0}
            x2={W}
            y1={Y(anchors.groundY)}
            y2={Y(anchors.groundY)}
            stroke="var(--color-paper)"
            strokeOpacity="0.45"
            strokeWidth="1"
            strokeDasharray="10 6"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* Traced linework (official render → edge detection). Revealed by the wipe clip. */}
        <g clipPath="url(#bp-wipe)" data-eng="lines" opacity="0.92">
          <image data-eng="body" href={lines.src} {...imgBox} preserveAspectRatio="none" />
          {wheels.map((w, i) => (
            <g key={i} data-eng={i === 0 ? "front" : "rear"} clipPath={`url(#bp-wheel-${i})`} visibility="hidden">
              <image href={lines.src} {...imgBox} preserveAspectRatio="none" />
            </g>
          ))}
        </g>

        {/* Wheel construction: tyre, rim, centre cross. Stays put as a ghost guide when exploded. */}
        <g data-eng="ghost">
          {wheels.map((w, i) => (
            <g key={i} stroke="var(--color-paper)" strokeOpacity="0.5" fill="none" vectorEffect="non-scaling-stroke">
              <circle cx={X(w.x)} cy={Y(w.y)} r={w.r * W} strokeWidth="1" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
              <circle cx={X(w.x)} cy={Y(w.y)} r={w.r * W * 0.62} strokeWidth="1" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
              <path
                d={`M ${X(w.x) - 14} ${Y(w.y)} H ${X(w.x) + 14} M ${X(w.x)} ${Y(w.y) - 14} V ${Y(w.y) + 14}`}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </g>

        {/* Illustrative component volumes (position not published by REVOO) */}
        {components
          .filter((c) => c.illustrative && c.shape.kind === "box")
          .map((c) => {
            const s = c.shape as Extract<EngComponent["shape"], { kind: "box" }>;
            const on = c.id === activeId;
            return (
              <rect
                key={c.id}
                data-eng={c.id}
                x={X(s.x)}
                y={Y(s.y)}
                width={s.w * W}
                height={s.h * BH}
                fill={on ? "var(--color-green)" : "none"}
                fillOpacity={on ? 0.14 : 0}
                stroke={on ? "var(--color-green)" : "var(--color-paper)"}
                strokeOpacity={on ? 1 : 0.35}
                strokeWidth="1.25"
                strokeDasharray="7 5"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

        {/* Active highlight: wheel rings / dots */}
        <g data-eng="active">
        {wheelCircles(active).map((c, i) => (
          <circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill="var(--color-green)"
            fillOpacity="0.12"
            stroke="var(--color-green)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {active.shape.kind === "dot" &&
          active.points.map((p, i) => (
            <circle
              key={i}
              cx={X(p.x)}
              cy={Y(p.y)}
              r={active.shape.kind === "dot" ? active.shape.r : 0}
              fill="var(--color-green)"
              fillOpacity="0.12"
              stroke="var(--color-green)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Leader to label */}
        <path data-eng="leader" d={leader} fill="none" stroke="var(--color-green)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />

        {/* Scan line that rides the wipe edge (invisible at rest) */}
        <line
          data-eng="scan"
          x1={0}
          x2={0}
          y1={PT * 0.5}
          y2={H - PB * 0.35}
          stroke="var(--color-green)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          opacity="0"
        />
      </svg>

      {/* Markers: real buttons so the diagram is keyboard and screen-reader operable */}
      {components.flatMap((c) =>
        c.points.map((p, i) => {
          const on = c.id === activeId;
          return (
            <button
              key={`${c.id}-${i}`}
              type="button"
              aria-pressed={on}
              aria-label={`${c.index} ${c.label}${c.illustrative ? " (illustrative position)" : ""}`}
              onClick={() => onSelect(c.id)}
              className="group absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center outline-offset-0"
              style={{ left: pct(X(p.x), W), top: pct(Y(p.y), H) }}
            >
              <span
                aria-hidden
                data-eng="marker"
                className={`t-label grid h-[1.125rem] w-[1.125rem] place-items-center border text-[0.5rem] transition-colors duration-[var(--dur-micro)] sm:h-6 sm:w-6 sm:text-[0.625rem] ${
                  on
                    ? "border-green bg-green text-ink"
                    : "border-[color:var(--color-paper)]/70 bg-ink text-paper group-hover:border-green group-hover:text-green"
                }`}
              >
                {c.index}
              </span>
            </button>
          );
        }),
      )}

      {/* Active label */}
      <div
        data-eng="label"
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 bg-ink px-3 py-1.5 text-center"
        style={{ left: pct(X(labelFx), W), top: pct(rowY, H) }}
      >
        <p className="t-label whitespace-nowrap text-green">
          {active.index} · {active.label}
        </p>
        {active.illustrative && (
          <p className="t-label mt-0.5 whitespace-nowrap text-[0.5625rem] text-[color:var(--muted)]">
            Illustrative layout
          </p>
        )}
      </div>
    </div>
  );
}
