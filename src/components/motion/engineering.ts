import { gsap } from "@/lib/gsap";
import { expose, qs, qsa } from "./shared";

/**
 * ENGINEERING: the skeleton (Priority 3) inside the journey (stage C → D → E).
 *
 * Entry, scrubbed by scroll (reversible), in timeline units 0–10:
 *   0.0–2.6   the real render drives in from the right (power3.out)
 *   0.3–2.3   blueprint grid fades up
 *   3.2–6.0   linework is drawn in by a left-to-right wipe with a green scan line;
 *             the colour render is wiped out behind it (raster art: mask wipe, not strokes)
 *   4.6–6.0   wheel construction rings appear
 *   6.0–7.7   EXPLODE: wheels slide ±34 along the ground axis, battery drops, controller lifts
 *   8.0–9.4   REASSEMBLE
 *   8.6–10    markers, label and leader settle in → identical to the static markup
 *
 * Exit (desktop): the colour render returns and drives out to the left (stage E), the way it came.
 * The iris (desktop, capable devices): the dark lab opens as a circle around the stage.
 */
interface Options {
  desktop: boolean;
  lowPower: boolean;
}

const W = 1000; // BlueprintStage viewBox width
const EXPLODE = 34;
const WIPE_PAD = 60; // keep in sync with BlueprintStage
const SEAM_ON = 5.95;
const SEAM_OFF = 9.5;

export function engineeringJourney({ desktop, lowPower }: Options) {
  const stage = qs("[data-eng-stage]");
  const section = qs("#engineering");
  if (!stage || !section) return;
  const root = stage.closest("figure")?.parentElement as HTMLElement | null;
  if (!root) return;

  const paint = qs("[data-eng='paint']", stage);
  const paintIn = paint ? qs("picture", paint) : null;
  const wipe = qs("[data-eng='wipe']", stage);
  const scan = qs("[data-eng='scan']", stage);
  const linesG = qs("[data-eng='lines']", stage);
  const body = qs("[data-eng='body']", stage);
  const front = qs("[data-eng='front']", stage);
  const rear = qs("[data-eng='rear']", stage);
  const grid = qs("[data-eng='grid']", stage);
  const ghost = qs("[data-eng='ghost']", stage);
  const battery = qs("[data-eng='battery']", stage);
  const controller = qs("[data-eng='controller']", stage);
  const markers = qsa("[data-eng='marker']", stage);
  const label = qs("[data-eng='label']", stage);
  const leader = qs("[data-eng='leader']", stage);
  const active = qs("[data-eng='active']", stage);
  if (!paint || !paintIn || !wipe || !linesG || !body || !front || !rear) return;

  const scrub = lowPower ? 0.4 : 0.7;
  const slide = () => stage.offsetWidth * 0.78;
  const uiOut = [grid, ghost, battery, controller, label, leader, active].filter(Boolean) as Element[];

  // ── EXIT (desktop only). Created first so the entry's from-values win at creation. ──
  if (desktop) {
    const out = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root, start: "bottom 45%", end: "bottom 0%", scrub, invalidateOnRefresh: true },
    });
    out
      .fromTo(uiOut, { opacity: 1 }, { opacity: 0, duration: 1.4, immediateRender: false }, 0)
      .fromTo(markers, { opacity: 1 }, { opacity: 0, duration: 1.0, immediateRender: false }, 0)
      .fromTo(linesG, { opacity: 0.92 }, { opacity: 0, duration: 2.0, immediateRender: false }, 0.3)
      .fromTo(
        paint,
        { clipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 2.0, immediateRender: false },
        0.3,
      )
      .fromTo(
        paintIn,
        { x: 0 },
        { x: () => -stage.offsetWidth * 1.15, duration: 3.5, ease: "power2.in", immediateRender: false },
        2.5,
      );
  }

  // ── ENTRY ──
  let seam = false;
  const setSeam = (on: boolean) => {
    if (on === seam) return;
    seam = on;
    // Exploded: the body art has the wheel discs cut out and the wheel groups carry them.
    // Assembled: one single clean image, so there is never a hairline seam at rest.
    if (on) body.setAttribute("mask", "url(#bp-body)");
    else body.removeAttribute("mask");
    gsap.set([front, rear], { visibility: on ? "visible" : "hidden" });
  };

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: root, start: "top 85%", end: "top -5%", scrub, invalidateOnRefresh: true },
    onUpdate: () => {
      const t = tl.time();
      setSeam(t > SEAM_ON && t < SEAM_OFF);
    },
  });

  // colour render arrives
  tl.fromTo(paint, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" }, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.01 }, 0)
    .fromTo(paintIn, { x: slide }, { x: 0, duration: 2.6, ease: "power3.out" }, 0)
    // blueprint grid
    .fromTo(grid, { opacity: 0 }, { opacity: 1, duration: 2.0, ease: "power1.out" }, 0.3)
    // linework drawn in
    .fromTo(wipe, { attr: { width: WIPE_PAD } }, { attr: { width: W + WIPE_PAD }, duration: 2.8 }, 3.2)
    .fromTo(paint, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 100%)", duration: 2.8, immediateRender: false }, 3.2);

  if (scan) {
    tl.fromTo(scan, { opacity: 0, attr: { x1: 0, x2: 0 } }, { opacity: 1, duration: 0.2 }, 3.2)
      .to(scan, { attr: { x1: W, x2: W }, duration: 2.8 }, 3.2)
      .to(scan, { opacity: 0, duration: 0.25 }, 5.8);
  }
  if (ghost) tl.fromTo(ghost, { opacity: 0 }, { opacity: 1, duration: 1.4 }, 4.6);

  // explode → reassemble
  tl.fromTo(front, { x: 0, y: 0 }, { x: -EXPLODE, y: 6, duration: 1.7, ease: "power2.out" }, 6.0)
    .fromTo(rear, { x: 0, y: 0 }, { x: EXPLODE, y: 6, duration: 1.7, ease: "power2.out" }, 6.0)
    .to([front, rear], { x: 0, y: 0, duration: 1.4, ease: "power3.inOut" }, 8.0);
  if (battery) {
    tl.fromTo(battery, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.5 }, 5.6)
      .to(battery, { y: 30, duration: 1.7, ease: "power2.out" }, 6.0)
      .to(battery, { y: 0, duration: 1.4, ease: "power3.inOut" }, 8.0);
  }
  if (controller) {
    tl.fromTo(controller, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.5 }, 5.6)
      .to(controller, { y: -30, duration: 1.7, ease: "power2.out" }, 6.0)
      .to(controller, { y: 0, duration: 1.4, ease: "power3.inOut" }, 8.0);
  }

  // settle: markers pop in one by one, then label + leader
  // (one tween per marker: a stagger would only pre-hide the first one)
  markers.forEach((m, i) =>
    tl.fromTo(
      m,
      { autoAlpha: 0, scale: 0.3, transformOrigin: "50% 50%" },
      { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(2)" },
      8.6 + i * 0.12,
    ),
  );
  const tail = [label, leader, active].filter(Boolean) as Element[];
  if (tail.length) tl.fromTo(tail, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 9.2);
  tl.set({}, {}, 10); // fix total length at 10

  expose("eng", tl);

  // ── IRIS: desktop on capable devices ──
  if (desktop && !lowPower) {
    const centre = () => {
      const s = section.getBoundingClientRect();
      const r = root.getBoundingClientRect();
      return { x: s.width / 2, y: r.top - s.top + root.offsetHeight * 0.12, w: s.width, h: s.height };
    };
    const at = () => `50% ${centre().y}px`;
    const rad = () => {
      const c = centre();
      return Math.hypot(Math.max(c.x, c.w - c.x), Math.max(c.y, c.h - c.y)) + 40;
    };
    gsap.fromTo(
      section,
      { clipPath: () => `circle(0px at ${at()})` },
      {
        clipPath: () => `circle(${rad()}px at ${at()})`,
        ease: "power1.in",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 0%",
          scrub: 0.6,
          invalidateOnRefresh: true,
          // once fully open, drop the clip so nothing keeps repainting
          onLeave: () => gsap.set(section, { clearProps: "clipPath" }),
        },
      },
    );
  }
}
