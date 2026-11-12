# REVOO Rwanda — Implementation Plan

**Status:** Phase 1 complete, awaiting approval · **Workspace:** fresh (empty) project

## 1. Stack (verified current on 12 Nov 2026)

| Layer | Choice | Version seen on npm | Note |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.4.x | Needs Node ≥ 20.9; machine has Node 26 |
| UI | React | 19.3 | |
| Language | TypeScript | **pin 5.x** | npm shows 7.x as latest; will test compatibility with Next 16 at scaffold time and pin the safe version |
| Styling | Tailwind CSS v4 + CSS variables for tokens | 4.3 | |
| Animation | **GSAP + ScrollTrigger** | 3.15.1 | "Standard no-charge" licence; re-check before launch |
| Fonts | Archivo (variable, width axis), Inter, JetBrains Mono via `next/font` | n/a | Self-hosted, OFL |
| Images | `sharp` pipeline, AVIF + WebP, `next/image` | 0.35 | |
| 3D | Not in v1. Three.js / R3F only as an approved optional add-on | three 0.187, r3f 9.8 | Dynamic import, WebGL fallback |
| Smooth scroll | **Not used** (native scroll + ScrollTrigger) | n/a | Fewer pinned-section bugs on iOS/Instagram browser |
| Framer Motion | **Not used** | n/a | GSAP + CSS cover all needs; saves bundle |
| Forms | Native + small validator; `submitEnquiry()` stub ready for later API | n/a | No backend in prototype |
| Hosting target | Vercel-compatible static/SSG | n/a | |

## 2. Information architecture

| Route | Purpose |
|---|---|
| `/` | Cinematic home: Entrance → Discovery → Showroom → Engineering → Technology → City → Support → Final CTA |
| `/motorcycles` | Showroom (immersive product switcher + comparison) |
| `/motorcycles/[slug]` | Product page per model (`a12`, `a11`, `c35y`, `e52` subject to asset review) |
| `/technology` | Electric tech in plain language + full component explorer |
| `/about` | REVOO global story + Rwanda presence (confirmed facts only) |
| `/support` | FAQ, charging, maintenance/service process, warranty (TBC flag) |
| `/contact` | Showrooms, enquiry/test-ride form, map placeholder |
| `/legal/privacy`, `/legal/terms` | Basic placeholders so footer links never dead-end |
| `/sitemap.xml`, `/robots.txt`, `/not-found` | SEO and polish |

Main nav: **Home · Motorcycles · Technology · About REVOO · Support · Contact** + green **Book a test ride**.

## 3. Source structure

```text
src/
  app/                 routes, layouts, metadata, sitemap, robots
  components/
    layout/            Header, MobileMenu, Footer, SkipLink
    hero/              HeroStage, HeadlineLayers, WheelDisc, GroundShadow, Loader
    showroom/          ModelStage, ModelRail, SpecRows, EnquiryCTA
    engineering/       BlueprintStage, ComponentTabs, Annotation
    animations/        MotoStage (journey), Reveal, SplitText, useGsapContext
    ui/                Button, Field, Accordion, Tabs, Tag(TBC), Icon
  sections/            Home sections composed from components
  data/                assets.ts, models.ts, facts.ts, faq.ts, locations.ts, nav.ts
  hooks/               useReducedMotion, useMatchMedia, useInView, useHeaderState
  lib/                 gsap.ts (single registration), images.ts, seo.ts, validate.ts
  styles/              tokens.css, typography.css, globals.css
public/
  images/ (hero, models, lifestyle, brand, derived), models/ (reserved), videos/, icons/, fonts/
scripts/
  images.mjs           sharp pipeline: cut-out cleanup, AVIF/WebP, blurhash
  extract-edges.mjs    builds the blueprint linework from the official render
doc/  (this folder)
```

## 4. The truth layer

`src/data/facts.ts` is the single source for every claim. Each fact has `value`, `confidence: 'confirmed-rw' | 'international' | 'tbc'`, `source`. UI helpers render:
- confirmed → plain,
- international → "International specification" caption,
- tbc → muted **TBC** tag (visible only when `NEXT_PUBLIC_PROTOTYPE=1`; at launch, tbc items are removed or replaced by real data).

No spec, price, warranty, phone or WhatsApp is hardcoded into components.

## 5. Phases and gates (each phase ends with: summary, limitations, files changed, commit message, then **wait for approval**)

| Phase | Scope | Exit criteria |
|---|---|---|
| **1: Research & planning** *(this deliverable)* | 5 docs + creative direction | Your approval + answers to §7 |
| **2: Design foundation** | Scaffold; tokens; fonts; layout (header/menu/footer); UI kit; asset pipeline; cleaned hero cut-outs; truth layer; git init | Style-guide route renders; Lighthouse sanity; no console errors |
| **3: Homepage visuals (static-first)** | All home sections laid out and convincing **without** motion | Looks finished at 4 breakpoints with animations off |
| **4: Signature animations** | Hero entrance → journey timeline → showroom switching → blueprint skeleton; reduced-motion + mobile variants | 60 fps on mid-range Android profile; reduced-motion parity |
| **5: Other pages** | Motorcycles, product pages, Technology, About, Support, Contact, legal; links all live | No dead links (automated crawl) |
| **6: Functionality & refinement** | Forms + validation + states, SEO/JSON-LD/sitemap, accessibility pass, a11y tests | Forms usable by keyboard/screen reader; axe clean |
| **7: QA** | Cross-device screenshots, console errors, CWV, link check, image check, polish | Report with fixes applied |

## 6. Performance and quality budgets

- LCP ≤ 2.5 s on simulated Moto G-class/4G; CLS < 0.05; INP < 200 ms.
- Initial JS (gzip) target ≤ 170 KB on home, excluding images; GSAP + ScrollTrigger ≈ 45 KB gz.
- Hero asset: AVIF ≤ 220 KB at 1600 w; others lazy.
- Automated checks: Lighthouse CI on home and one product page; axe-core; broken-link crawl; screenshot matrix 1920/1440/1024/768/390.

## 7a. Decisions recorded (12 Nov 2026)

| Decision | Choice |
|---|---|
| Theme | Light studio hero → dark engineering lab → light city |
| Skeleton | Blueprint derived from REVOO's official render (generic 3D only if client later asks) |
| Terminology | **"Electric two-wheelers"** in headlines; model pages may say "electric scooter" where accurate |
| Prototype labels | **Show** TBC / International-spec tags |
| Models in v1 | A12, A11, C35Y + E52 as flagship (flagged for better imagery) |
| Contact | **No live phone/WhatsApp links**; enquiry form + marked placeholders |
| Still open (default assumed) | Items 8–9 below: official imagery used in a private prototype only; git repo initialised at Phase 2 |

## 7. Original decision list (for reference)

1. **Light-studio hero → dark-lab engineering** (my recommendation, because REVOO's dark parts vanish on black), **or** full dark site as in your initial preference?
2. **Hero bike:** official **A12 red** side render (the only truly hero-grade assets are A12, A11, C35Y). Is this acceptable as the stand-in until REVOO supplies E52 flagship imagery?
3. **Skeleton route:** approve the **blueprint-from-official-render** route as primary (no generic 3D)? Add an optional generic CC0 3D exploded view later only if the client asks?
4. **Models to feature in v1:** A12, A11, C35Y with hero-grade renders, plus E52 (flagship, only medium-res imagery). OK to exclude Y-series/B12/A09/A10 for now (no usable imagery)?
5. **Terminology:** the products are step-through **electric scooters / two-wheelers**. Use "electric motorcycles" in headlines (per your brief and REVOO's own Instagram bio), or "electric scooters", or the neutral "electric two-wheelers"?
6. **Prototype labels:** show visible "TBC / International spec" tags in the prototype so the client sees we are not inventing facts (my recommendation), or hide them for a cleaner pitch?
7. **Phone/WhatsApp:** the only number found (+250 798 686 958, REVOO Sonatubes) is third-party-listed and unverified. Default plan: **no live phone/WhatsApp links**; the form and "TBC" placeholders instead. Confirm?
8. **Asset permission:** OK to use REVOO's official global-site imagery inside this private proposal prototype, on the understanding that written permission is needed before a public launch?
9. **Git/repo:** initialise a git repo in this folder at Phase 2 and commit per phase?

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Banner-derived 3/4 cut-outs look soft / have halos | Quality gate in Phase 2; fall back to side profile + blur transitions; request originals |
| Wheel-disc overlay looks fake | Evaluate on real render in Phase 3; remove if unconvincing |
| Pinned journey causes jank/jump on iOS Safari/Instagram in-app browser | `svh` units, `ignoreMobileResize`, shorter pins, mobile variant with crossfades, device testing |
| Over-polished page implies claims we can't support | Truth layer + TBC tags + docs |
| Official asset licensing | Prototype only; permission before launch; documented in inventory |
| TransSans not licensed for us | Archivo/Inter pairing; ask REVOO if TransSans can be supplied |
