import { gsap } from "@/lib/gsap";
import { flag, hasFlag, qs } from "./shared";

/**
 * Brand intro: wordmark mask-reveal (CSS, so it needs no JS), then the panel lifts away. About 1 s,
 * played once per session, skipped for reduced motion, repeat visits and
 * mid-page reloads. It never waits for any image.
 *
 * `handoff` fires while the panel is still lifting so the hero entrance
 * overlaps it (no dead time, and the bike image is already in flight).
 */
export function playIntro(handoff: () => void): gsap.core.Timeline | null {
  const panel = qs("[data-intro]");
  const skip =
    !panel ||
    hasFlag("intro-seen") ||
    hasFlag("intro-done") ||
    hasFlag("motion-failed") ||
    window.scrollY > 80;

  if (skip) {
    flag("intro-done");
    handoff();
    return null;
  }

  const word = qs("[data-intro='word']");
  let handed = false;
  const hand = () => {
    if (handed) return;
    handed = true;
    handoff();
  };

  const finish = () => {
    hand();
    flag("intro-done");
    try {
      sessionStorage.setItem("revoo:intro", "1");
    } catch {
      /* private mode: harmless, intro simply plays again next visit */
    }
    off();
  };

  // The CSS reveal (word + bar) takes ~0.65 s from page start. Hold only for what is left of it.
  const wait = Math.max(0, 0.62 - performance.now() / 1000);
  const tl = gsap.timeline({ onComplete: finish, delay: wait });
  tl.call(hand, [], 0.02)
    // (opacity only: the CSS animation owns the word's transform)
    .to(word, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0)
    .to(panel, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.5, ease: "power4.inOut" }, 0.08);

  // Any input fast-forwards it: never make anyone wait for a logo.
  const fast = () => tl.timeScale(4);
  const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
  events.forEach((e) => window.addEventListener(e, fast, { once: true, passive: true }));
  const off = () => events.forEach((e) => window.removeEventListener(e, fast));
  tl.eventCallback("onInterrupt", off);

  return tl;
}
