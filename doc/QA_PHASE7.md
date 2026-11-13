# Phase 7 QA report — REVOO Rwanda prototype

**Date:** 13 Nov 2026  
**Commit baseline:** post Phase 6 (`5b06f34`) + Phase 7 polish  
**Environment:** production build (`next start`), Microsoft Edge headless CDP, unthrottled LAN

## Summary

| Check | Result |
|---|---|
| Broken-link crawl | Pass — all seeded routes + `/icon`, `/apple-icon`, `/manifest.webmanifest`, Instagram |
| axe-core (serious/critical) | Pass — `/`, `/range`, `/range/a12`, `/technology`, `/about`, `/support`, `/contact` |
| Image registry | Pass — 25 registered files present; largest 1600w AVIF **78.5 KB** (budget ≤ 220 KB) |
| Screenshot matrix | 20 PNGs — home / range / A12 / contact × 1920·1440·1024·768·390 |
| Console errors | Pass (favicon 404 fixed by Phase 7 icons) |
| CWV (indicative) | Within budget on sampled pages (see below) |

## Core Web Vitals (indicative)

Headless Edge, no CPU/network throttle. Not a substitute for field Lighthouse or CrUX.

| Page | Viewport | LCP | CLS |
|---|---|---|---|
| `/` | desktop 1440 | 0.67 s | 0.000 |
| `/` | mobile 390 | 0.31 s | 0.000 |
| `/range` | desktop | 0.26 s | 0.000 |
| `/range` | mobile | 0.09 s | 0.000 |
| `/range/a12` | desktop | 0.11 s | 0.000 |
| `/range/a12` | mobile | 0.08 s | 0.000 |
| `/contact` | desktop | 0.06 s | 0.000 |
| `/contact` | mobile | 0.06 s | 0.000 |

**Budgets (plan §6):** LCP ≤ 2.5 s · CLS < 0.05 · INP < 200 ms (INP not measured in this harness).

## Fixes applied in Phase 7

1. **Favicon / app icons** — `app/icon.tsx`, `app/apple-icon.tsx` (REVOO green “R”); ends favicon 404 noise.
2. **Open Graph default** — `app/opengraph-image.tsx` + `app/manifest.ts`.
3. **Lazy blueprint on home** — `EngineeringExplorer` code-split via `next/dynamic` (SSR retained).
4. **Image check script** — `npm run images:check`.
5. **QA harness** — `npm run qa` (screenshot matrix + CWV + console).
6. **Dead code** — removed unused `PagePlaceholder`.

## Known limitations (honest)

- CWV numbers are **lab / unthrottled**; real mid-range Android + 4G will be slower — re-check on device before launch.
- E52 still has no high-res render (dashed placeholder).
- Enquiry form has no live backend.
- Prototype remains **noindex** while `NEXT_PUBLIC_PROTOTYPE` ≠ `0`.
- Legal pages are counsel placeholders.
- No live phone / WhatsApp until REVOO confirms numbers.
- Full Lighthouse CI not wired into a hosted pipeline (local Edge harness only).

## How to re-run

```bash
npm run build && npx next start -p 3001
npm run crawl -- --port 3001
npm run a11y -- --port 3001
npm run images:check
npm run qa -- --port 3001
```

Screenshots and `report.json` land in `%TEMP%/revoo-qa/`.
