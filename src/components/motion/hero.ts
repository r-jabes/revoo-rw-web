import { assets } from "@/data/assets";
import { gsap } from "@/lib/gsap";
import { expose, flag, hasFlag, qs, qsa } from "./shared";

/**
 * HERO: "The Entrance" (Priority 1).
 *
 * The A12 faces LEFT, so it drives in from the right edge and brakes to rest.
 * Beats (desktop seconds; mobile runs the same beats at ~0.62x):
 *   0.05  eyebrow
 *   0.10  headline lines rise out of their masks, behind the bike
 *   0.20  bike drives in (power4.out, scale 1.06 → 1, slight nose-dive that relaxes)
 *         wheel discs spin and blur, then dissolve into the real wheels
 *         shadow starts long and thin, tightens as the bike slows
 *         speed streaks + floor light sweep fade out as it slows
 *   1.95  settle: the suspension dips ~7px and recovers, shadow tightens with it
 *   1.50  hairline draws, support copy and CTAs rise
 *   2.30  index
 */

let played = false;

interface Options {
  desktop: boolean;
  lowPower: boolean;
}

export interface HeroHandle {
  /** Starts the entrance (called when the brand intro hands off). */
  play: () => void;
  /** Runs once the entrance has finished (or was skipped by input). */
  whenDone: (cb: () => void) => void;
  /** Removes anything the entrance added to the DOM (wheel discs, listeners). Safe to call twice. */
  dispose: () => void;
}

/** Builds the pre-state and a paused timeline. Returns a handle, or null when it shows the final state. */
export function heroEntrance({ desktop, lowPower }: Options): HeroHandle | null {
  const moto = qs("[data-moto]");
  if (!moto) return null;

  const skipEntrance = played || hasFlag("motion-failed") || window.scrollY > window.innerHeight * 0.4;
  if (skipEntrance) {
    flag("motion-on");
    return null;
  }

  const eyebrow = qs("[data-hero='eyebrow']");
  const lines = qsa("[data-hero='line']");
  const shadow = qs("[data-moto-shadow]", moto);
  const streaks = qsa("[data-hero='speed'] > span", moto);
  const sweep = qs("[data-hero='sweep']");
  const rule = qs("[data-hero='rule']");
  const rise = qsa("[data-hero='rise']");
  const index = qs("[data-hero='index']");
  const img = qs<HTMLImageElement>("img", moto);

  const vw = window.innerWidth;
  const T = desktop ? 1 : 0.62; // time scale
  const motoRect = moto.getBoundingClientRect();
  const travel = desktop ? vw - motoRect.left + 40 : vw * 0.7;

  // Pair filled + outlined copies so each headline line moves as one
  const half = Math.ceil(lines.length / 2);
  const pairs = Array.from({ length: half }, (_, i) => [lines[i], lines[i + half]].filter(Boolean));

  // ── Pre-state (GSAP takes over from the CSS [data-pre] hide, then we drop that rule) ──
  gsap.set(eyebrow, { autoAlpha: 0, y: 14 });
  gsap.set(lines, { autoAlpha: 1, yPercent: 112 });
  gsap.set(moto, { autoAlpha: 1, x: travel, scale: 1.06, transformOrigin: "50% 100%" });
  gsap.set(shadow, { scaleX: 1.7, scaleY: 0.5, opacity: 0.55, x: travel * 0.04 + 40, transformOrigin: "50% 50%" });
  gsap.set(streaks, { scaleX: 0, opacity: 0 });
  gsap.set(sweep, { x: vw * 1.45, opacity: 0 });
  gsap.set(rule, { autoAlpha: 1, scaleY: 0 });
  // opacity only: the CTAs must stay in the tab order while they fade in
  gsap.set(rise, { visibility: "visible", opacity: 0, y: 26 });
  gsap.set(index, { autoAlpha: 0 });
  flag("motion-on");

  // ── Wheel discs: real wheel pixels, rotated + blurred, dissolving into the static wheel ──
  const discs: HTMLElement[] = [];
  const spinners: HTMLElement[] = [];
  const a = assets.models.a12.side.anchors;
  if (img && a && !lowPower && desktop) {
    const w = img.offsetWidth;
    const h = img.offsetHeight;
    [a.frontWheel, a.rearWheel].forEach((wheel) => {
      const R = wheel.r * w;
      const disc = document.createElement("div");
      disc.setAttribute("aria-hidden", "true");
      Object.assign(disc.style, {
        position: "absolute",
        left: `${img.offsetLeft + wheel.x * w - R}px`,
        top: `${img.offsetTop + wheel.y * h - R}px`,
        width: `${2 * R}px`,
        height: `${2 * R}px`,
        borderRadius: "50%",
        overflow: "hidden",
        zIndex: "15",
        pointerEvents: "none",
      });
      const spin = document.createElement("div");
      Object.assign(spin.style, { position: "absolute", inset: "0" });
      const copy = document.createElement("img");
      copy.alt = "";
      copy.src = img.currentSrc || img.src;
      Object.assign(copy.style, {
        position: "absolute",
        maxWidth: "none",
        width: `${w}px`,
        height: `${h}px`,
        left: `${R - wheel.x * w}px`,
        top: `${R - wheel.y * h}px`,
      });
      spin.appendChild(copy);
      disc.appendChild(spin);
      moto.appendChild(disc);
      discs.push(disc);
      spinners.push(spin);
    });
  }
  // Rolling without slip: angle = distance / radius. Rounded to whole turns so the disc lands
  // exactly on the static wheel and the hand-over is invisible.
  const radius = a ? a.frontWheel.r * (img?.offsetWidth ?? 800) : 90;
  const turns = Math.max(1, Math.round(travel / radius / (Math.PI * 2)));
  const spin = -360 * turns; // moving left = counter-clockwise

  // ── Timeline ──
  const done: Array<() => void> = [];
  const s = (n: number) => n * T;
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power4.out" },
    onComplete: () => {
      played = true;
      discs.forEach((d) => d.remove());
      cleanup();
      done.forEach((cb) => cb());
      done.length = 0;
    },
  });

  tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: s(0.7), ease: "power3.out" }, s(0.05));
  pairs.forEach((pair, i) => {
    tl.to(pair, { yPercent: 0, duration: s(1.15), ease: "power4.out" }, s(0.12 + i * 0.1));
  });

  // The bike
  tl.to(moto, { x: 0, scale: 1, duration: s(2.4) }, s(0.2));
  tl.to(moto, { rotation: -1.1, duration: s(0.8), ease: "sine.inOut" }, s(0.95)).to(
    moto,
    { rotation: 0, duration: s(1.0), ease: "power2.out" },
    s(1.75),
  );
  // Settle: suspension dip, then recover
  tl.to(moto, { y: 7, duration: s(0.16), ease: "power2.in" }, s(1.95)).to(
    moto,
    { y: 0, duration: s(0.75), ease: "elastic.out(1, 0.55)" },
    s(2.11),
  );

  // Shadow: long and thin while moving, tightens at rest
  tl.to(shadow, { scaleX: 1, scaleY: 1, opacity: 1, x: 0, duration: s(2.4), ease: "power3.out" }, s(0.2));
  tl.to(shadow, { scaleX: 0.93, duration: s(0.16), ease: "power2.in" }, s(1.95)).to(
    shadow,
    { scaleX: 1, duration: s(0.75), ease: "elastic.out(1, 0.55)" },
    s(2.11),
  );

  // Wheel discs
  if (spinners.length) {
    tl.fromTo(spinners, { rotation: 0 }, { rotation: spin, duration: s(2.4), ease: "power4.out" }, s(0.2));
    // Desaturated + darkened so the rotating copy of the fender reads as blurred rubber, not a red patch
    const base = "grayscale(1) brightness(0.55)";
    tl.fromTo(discs, { filter: `${base} blur(11px)` }, { filter: `${base} blur(1px)`, duration: s(1.5), ease: "power1.out" }, s(0.2));
    tl.fromTo(discs, { opacity: 0.95 }, { opacity: 0, duration: s(0.85), ease: "power1.inOut" }, s(0.5));
  }

  // Speed: streaks trail (they drift slower than the bike, so they smear behind it), then fade
  if (streaks.length) {
    tl.fromTo(
      streaks,
      { x: -travel * 0.82 },
      { x: 0, duration: s(2.0), ease: "power3.out", stagger: s(0.03) },
      s(0.2),
    );
    tl.fromTo(
      streaks,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 0.38, duration: s(0.45), ease: "power2.out", stagger: s(0.05) },
      s(0.3),
    ).to(streaks, { opacity: 0, duration: s(0.9), ease: "power1.in", stagger: s(0.04) }, s(0.85));
  }
  // Floor light sweep (desktop)
  if (desktop) {
    tl.to(sweep, { x: vw * 0.1, duration: s(2.0), ease: "power2.out" }, s(0.25));
    tl.to(sweep, { opacity: 0.75, duration: s(0.5), ease: "none" }, s(0.25)).to(
      sweep,
      { opacity: 0, duration: s(0.9), ease: "power1.in" },
      s(1.1),
    );
  }

  // Support copy
  tl.to(rule, { scaleY: 1, duration: s(0.9), ease: "power3.inOut" }, s(1.45));
  tl.to(rise, { opacity: 1, y: 0, duration: s(0.9), stagger: s(0.1), ease: "power3.out" }, s(1.55));
  tl.to(index, { autoAlpha: 1, duration: s(0.6), ease: "power2.out" }, s(2.3));

  // Never block: any input jumps to the end state.
  const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
  const finishNow = () => tl.progress(1);
  events.forEach((e) => window.addEventListener(e, finishNow, { once: true, passive: true }));
  function cleanup() {
    events.forEach((e) => window.removeEventListener(e, finishNow));
  }
  tl.eventCallback("onInterrupt", cleanup);

  expose("hero", tl);
  return {
    play: () => void tl.play(),
    whenDone: (cb) => (tl.progress() >= 1 ? cb() : void done.push(cb)),
    dispose: () => {
      discs.forEach((d) => d.remove());
      cleanup();
    },
  };
}

/**
 * HERO → DISCOVERY: as the hero scrolls away the bike keeps driving on (same direction it
 * arrived), the headline drifts up slower than the page. Native scroll, no pinning.
 */
export function heroScroll({ desktop }: Options) {
  const moto = qs("[data-moto]");
  const copy = qsa("[data-hero='copy']");
  if (!moto) return;
  const trigger = { trigger: "#hero", start: "top top", end: "bottom top", scrub: 0.8 } as const;

  // force3D promotes each to its own compositor layer, so the huge headline is not repainted per frame
  gsap.to(moto, { xPercent: desktop ? -16 : -10, ease: "none", force3D: true, scrollTrigger: trigger });
  gsap.to(copy, { yPercent: desktop ? -14 : -8, ease: "none", force3D: true, scrollTrigger: trigger });
}
