"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { engineeringJourney } from "./engineering";
import { heroEntrance, heroScroll } from "./hero";
import { playIntro } from "./intro";
import { sectionMotion } from "./sections";
import { expose, flag, isLowPower } from "./shared";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The homepage motion controller. Renders only the brand-intro panel; every
 * other element it animates is already in the server HTML.
 *
 *   matchMedia
 *     reduce        → nothing runs: the page is its final state
 *     no-preference → hero entrance, hero→discovery drive-on, section reveals,
 *                     engineering skeleton, city drive-in
 *       desktop (≥1024px) adds the wheel-disc blur, floor sweep and the iris
 *       low-power devices skip the disc overlay and the iris
 *
 * Journey, in order: Entrance (hero) → Discovery (drive-on) → Showroom (arrivals)
 * → Engineering (skeleton, exit left) → City (drive-in). The A12 and C35Y both face
 * left, so everything arrives from the right and leaves to the left.
 */
export function HomeMotion() {
  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) {
          // Reduced motion (possibly toggled after load): show the final state, never hide anything.
          flag("motion-on");
          flag("intro-done");
          return;
        }

        const opts = { desktop, lowPower: isLowPower() };
        const hero = heroEntrance(opts);

        // Everything below the fold is set up AFTER the entrance, so SplitText, trigger
        // measuring and fonts/refresh never compete with the signature animation for the
        // main thread. Input ends the entrance at once, which then runs this immediately.
        let stopSections = () => {};
        let started = false;
        const refresh = () => ScrollTrigger.refresh();
        let disposed = false;
        const setupRest = () => {
          if (started || disposed) return;
          started = true;
          // ctx.add: this runs after the matchMedia callback returned, so it must be
          // re-attached to the context or its triggers would never be reverted.
          ctx.add(() => {
            heroScroll(opts);
            stopSections = sectionMotion(opts);
            engineeringJourney(opts);
          });
          // Layout settles after webfonts and images: re-measure once.
          document.fonts?.ready.then(() => !disposed && refresh());
          window.addEventListener("load", refresh, { once: true });
          expose("ScrollTrigger", ScrollTrigger);
        };
        let safety = 0;
        if (hero) {
          hero.whenDone(setupRest);
          safety = window.setTimeout(setupRest, 7000); // safety net (e.g. background tab)
        } else {
          setupRest();
        }
        playIntro(() => hero?.play());

        return () => {
          disposed = true;
          hero?.dispose();
          window.clearTimeout(safety);
          stopSections();
          window.removeEventListener("load", refresh);
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div
      data-intro=""
      aria-hidden="true"
      className="intro fixed inset-0 z-[90] place-items-center bg-ink text-paper"
    >
      <div className="relative">
        <span className="line-mask">
          <span data-intro="word" className="t-display block text-[clamp(3.5rem,13vw,9rem)] leading-[0.9]">
            REVOO
          </span>
        </span>
        <span
          data-intro="bar"
          className="absolute -bottom-4 left-0 h-px w-full origin-left bg-green"
        />
      </div>
    </div>
  );
}
