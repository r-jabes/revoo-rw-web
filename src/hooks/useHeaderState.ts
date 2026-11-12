"use client";

import { useEffect, useState } from "react";

export type HeaderTheme = "light" | "dark";

/**
 * Header behaviour:
 *  - hidden while scrolling down (after 120px), shown when scrolling up
 *  - theme follows whichever [data-header-theme] section sits under the header
 */
export function useHeaderState(menuOpen: boolean) {
  const [hidden, setHidden] = useState(false);
  const [theme, setTheme] = useState<HeaderTheme>("light");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 8);

      if (!menuOpen) {
        const delta = y - lastY;
        if (y < 120) setHidden(false);
        else if (delta > 6) setHidden(true);
        else if (delta < -6) setHidden(false);
      }
      lastY = y;

      // Theme: first themed section containing the line 40px below the viewport top.
      const probe = 40;
      const sections = document.querySelectorAll<HTMLElement>("[data-header-theme]");
      let next: HeaderTheme | null = null;
      sections.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) next = (el.dataset.headerTheme as HeaderTheme) ?? null;
      });
      setTheme(next ?? "light");
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [menuOpen]);

  return { hidden: hidden && !menuOpen, theme, scrolled };
}
