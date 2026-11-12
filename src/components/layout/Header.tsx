"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, primaryCta } from "@/data/nav";
import { facts } from "@/data/facts";
import { useHeaderState } from "@/hooks/useHeaderState";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { hidden, theme, scrolled } = useHeaderState(open);

  const headerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // ── Sliding nav indicator ────────────────────────────────
  const navRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number; visible: boolean }>({
    x: 0,
    w: 0,
    visible: false,
  });

  const moveIndicatorTo = useCallback((el: HTMLElement | null) => {
    if (!el || !navRef.current) {
      setIndicator((s) => ({ ...s, visible: false }));
      return;
    }
    const nav = navRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicator({ x: r.left - nav.left, w: r.width, visible: true });
  }, []);

  const resetIndicator = useCallback(() => {
    const el = navRef.current?.querySelector<HTMLElement>('a[aria-current="page"]') ?? null;
    moveIndicatorTo(el);
  }, [moveIndicatorTo]);

  useLayoutEffect(() => {
    resetIndicator();
    window.addEventListener("resize", resetIndicator);
    return () => window.removeEventListener("resize", resetIndicator);
  }, [pathname, resetIndicator]);

  // ── Mobile menu: close on route change, lock scroll, Esc, focus management ──
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    firstLinkRef.current?.focus({ preventScroll: true });
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === "Tab" && headerRef.current) {
      const focusables = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>(
          '#site-menu a[href], #site-menu button, #menu-toggle, #header-logo',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const menuTheme = open ? "dark" : theme;

  return (
    <div ref={headerRef} onKeyDown={onKeyDown}>
    <header
      data-theme={menuTheme}
      className={`fixed inset-x-0 top-0 z-50 text-[color:var(--fg)] transition-[transform,background-color,border-color] duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled && !open ? "bg-[color:var(--bg)] border-b border-[color:var(--line)]" : "border-b border-transparent"}`}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link id="header-logo" href="/" aria-label="REVOO Rwanda, home" className="relative shrink-0">
          <Logo height={20} />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden xl:block">
          <ul
            ref={navRef}
            className="relative flex items-center gap-9"
            onMouseLeave={resetIndicator}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) resetIndicator();
            }}
          >
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}
                    onFocus={(e) => moveIndicatorTo(e.currentTarget)}
                    className="t-label !text-[0.75rem] block py-3 tracking-[0.14em]"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-1 left-0 h-0.5 bg-[color:var(--accent-text)] transition-[transform,width,opacity] duration-[var(--dur-ui)] ease-[var(--ease-out-expo)]"
              style={{
                width: indicator.w,
                transform: `translateX(${indicator.x}px)`,
                opacity: indicator.visible ? 1 : 0,
              }}
            />
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href={primaryCta.href} variant="primary" className="max-sm:!hidden !min-h-10">
            {primaryCta.label}
          </ButtonLink>

          {/* Mobile / tablet menu toggle */}
          <button
            id="menu-toggle"
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="relative grid h-11 w-11 place-items-center xl:hidden"
          >
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-0.5 w-6 bg-current transition-all duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-6 bg-current transition-all duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

    </header>

      {/* Full-screen menu */}
      <div
        id="site-menu"
        inert={!open}
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-[color:var(--color-ink)] text-[color:var(--color-paper)] transition-[clip-path] duration-[700ms] ease-[var(--ease-out-expo)] xl:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center pt-[var(--header-h)]">
          <ul className="flex flex-col">
            {mainNav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="overflow-hidden border-b border-white/15 first:border-t">
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                    className={`group flex items-baseline gap-4 py-4 transition-transform duration-[700ms] ease-[var(--ease-out-expo)] ${
                      open ? "translate-y-0" : "translate-y-full"
                    }`}
                  >
                    <span className="t-label w-8 text-steel">{item.caption}</span>
                    <span
                      className={`t-display text-[clamp(2.25rem,min(12vw,8.5svh),5rem)] transition-colors group-hover:text-green ${
                        active ? "text-green" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div
          className="container-x flex flex-col gap-5 pb-8 transition-opacity duration-500 ease-out"
          style={{ opacity: open ? 1 : 0, transitionDelay: open ? "520ms" : "0ms" }}
        >
          <ButtonLink href={primaryCta.href} variant="primary" onClick={() => setOpen(false)}>
            {primaryCta.label}
          </ButtonLink>
          <a
            href={facts.rwanda.instagram.value}
            target="_blank"
            rel="noopener noreferrer"
            className="t-label text-steel hover:text-green"
          >
            Instagram {facts.rwanda.instagramHandle.value} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
