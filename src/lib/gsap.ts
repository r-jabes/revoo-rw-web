"use client";

/**
 * Single GSAP registration point. Import { gsap, ScrollTrigger } from here,
 * never from "gsap" directly, so plugins register exactly once.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  // Mobile address-bar show/hide must not retrigger layout-heavy refreshes.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

registerGsap();

export { gsap, ScrollTrigger };

/** Shared motion tokens (mirror of CSS custom properties). */
export const motion = {
  ease: {
    entrance: "power4.out",
    ui: "expo.out",
    soft: "power2.out",
    inOut: "power3.inOut",
  },
  dur: { micro: 0.22, ui: 0.56, hero: 2.6 },
  stagger: { chars: 0.04, lines: 0.08 },
} as const;
