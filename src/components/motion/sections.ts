import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { qs, qsa } from "./shared";

/**
 * Section choreography for everything that is not the hero or the skeleton:
 * heading line-reveals, staggered rises, count-ups, the showroom arrivals and
 * the city scene (stage E). All "once" reveals except the scrubbed city drive.
 * Each rule only ever hides something that it also reveals.
 */
interface Options {
  desktop: boolean;
  lowPower: boolean;
}

export function sectionMotion({ desktop }: Options): () => void {
  const cleanups: Array<() => void> = [];

  // 1 ─ Headlines: lines rise out of masks (hero excluded: it has its own entrance)
  qsa("main h2").forEach((h) => {
    if (h.closest("#hero")) return;
    // The engineering section is revealed through an iris on desktop, so wait for it to open
    const start = h.closest("#engineering") && desktop ? "top 45%" : "top 88%";
    SplitText.create(h, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      aria: "auto",
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.09,
          ease: "power4.out",
          scrollTrigger: { trigger: h, start, once: true },
        }),
    });
  });

  // 2 ─ Generic rise-in for anything marked [data-reveal], batched so neighbours stagger
  const items = qsa("[data-reveal]");
  if (items.length) {
    // opacity (not autoAlpha): visibility:hidden would remove links from the tab order
    gsap.set(items, { opacity: 0, y: 30 });
    ScrollTrigger.batch(items, {
      start: "top 90%",
      once: true,
      interval: 0.1,
      batchMax: 6,
      onEnter: (els) =>
        gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: "power3.out", overwrite: true }),
    });
  }

  // 3 ─ Count-ups for figures ("10+", "12,000+ km", "2 yrs"). Years are left alone.
  qsa("[data-count]").forEach((el) => {
    const original = el.textContent ?? "";
    const m = original.match(/^(\d[\d,]*)([\s\S]*)$/);
    if (!m) return;
    const target = Number(m[1].replace(/,/g, ""));
    if (!Number.isFinite(target) || (target >= 1900 && target <= 2100 && !m[1].includes(","))) return;
    const fmt = (v: number) => `${Math.round(v).toLocaleString("en-US")}${m[2]}`;
    el.textContent = fmt(0);
    cleanups.push(() => {
      el.textContent = original;
    });
    const proxy = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () =>
        gsap.to(proxy, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = fmt(proxy.v);
          },
          onComplete: () => {
            el.textContent = original;
          },
        }),
    });
  });

  // 4 ─ Showroom: each bike drives in from the right as it enters
  qsa("[data-drive]").forEach((el) => {
    gsap.fromTo(
      el,
      // transform + opacity only: stays on the compositor, no paint per frame
      { xPercent: desktop ? 18 : 10, opacity: 0 },
      {
        xPercent: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        force3D: true,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );
  });

  // 5 ─ City (stage E): the street scrolls past as the C35Y drives in and parks
  const scene = qs("[data-city='scene']");
  if (scene) {
    const bike = qs("[data-city='bike']", scene);
    const shadow = qs("[data-city='shadow']", scene);
    const road = qs("[data-city='road']", scene);
    const near = qs("[data-city='near']", scene);
    const far = qs("[data-city='far']", scene);
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: scene, start: "top 90%", end: "bottom 55%", scrub: 0.8, invalidateOnRefresh: true },
    });
    // The bike faces left, so the world slides right past it
    if (far) tl.fromTo(far, { x: -30 }, { x: 30, duration: 1 }, 0);
    if (near) tl.fromTo(near, { x: -70 }, { x: 70, duration: 1 }, 0);
    if (road) tl.fromTo(road, { backgroundPositionX: "0px" }, { backgroundPositionX: "560px", duration: 1 }, 0);
    if (bike) tl.fromTo(bike, { x: () => scene.offsetWidth * 0.75 }, { x: 0, duration: 0.62, ease: "power3.out" }, 0);
    if (shadow) {
      tl.fromTo(shadow, { scaleX: 1.6, scaleY: 0.5, opacity: 0.5 }, { scaleX: 1, scaleY: 1, opacity: 1, duration: 0.62, ease: "power3.out" }, 0);
    }
  }

  return () => cleanups.forEach((fn) => fn());
}
