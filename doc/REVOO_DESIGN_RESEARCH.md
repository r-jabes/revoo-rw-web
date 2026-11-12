# REVOO — Design Research & Proposed Visual Direction

**Date:** 12 November 2026 · **Status:** Phase 1 deliverable (awaiting approval)

## Method and honesty note

I opened each reference in a real browser, captured screenshots, read the accessibility tree and page structure, and extracted link maps. **What I could verify:** layout structure, section order, content hierarchy, navigation model, typography/colour character, interactive component inventory. **What I could not fully verify in this pass:** continuous scroll choreography, hover micro-motion and page transitions (static captures do not show timing). Where I describe motion for a reference below, it is marked *(inferred)*. The animation language proposed for REVOO is therefore **designed from first principles**, informed by the structural findings, not copied from any site.

**Reference note:** `vasmotors.com` currently serves the **Maeving® USA** storefront (British electric café racer). That is what I analysed as the "VAS Motors" reference.

---

## 1. What makes VAS Motors (Maeving USA) distinctive

Observed:
1. **Quiet header.** A thin announcement strip, then a header with only a spaced light-weight wordmark on the left and two icons (cart, hamburger) on the right. Everything else lives behind a menu. The product, not the chrome, owns the first screen.
2. **Full-bleed dark hero carousel**; the bike fills the frame, cropped confidently, lit with a soft floor glow. Dark charcoal background, so the hero image *is* the background.
3. **Text anchored bottom-left** with a **thin vertical hairline** beside it; small, letter-spaced **gold eyebrow** ("LIMITED PRODUCTION"), then a heavy white sans headline and one line of support copy.
4. **Square-cornered controls.** White rectangular CTA (no radius), square arrow buttons, **segmented line progress** with a "02 / 04" counter instead of dots. Precise, not "friendly".
5. **Model presentation without cards.** Models are rows of three terse facts (Top speed / Range / License) rather than feature-bubble cards.
6. **Content rhythm:** hero → editorial intro with four big stats → "Choose your…" models → rider problems/solutions → press quotes → showroom → numbered support (01–04) → FAQ accordions. Every block has a job, and the page reads like a magazine contents list.
7. **Credibility through specifics:** real address, phone, showroom, press quotes, warranty and handbook links; support is a first-class section.
8. **Restraint.** One accent colour (gold), one typeface family, generous negative space, no gradients, no glass.

*(inferred)* Slow crossfades between slides, restrained hover (underline/colour shift), no flashy page transitions.

**Translate:** the quiet chrome, bottom-left text with a hairline, square controls, segmented progress, row-based spec lists, numbered support block and the "every section earns its place" editorial discipline.

## 2. What makes Zero Motorcycles distinctive

Observed:
1. **Strong product identity through type:** heavy **condensed uppercase** display face for model names, nav, buttons, spec headings, versus light neutral body text. Instantly "engineering".
2. **Dark/light alternation:** dark immersive hero; a **white technical band** for the component explorer; dark footer. The alternation signals a shift from emotion to information.
3. **Single warm accent** (muted gold/tan) on dark; red used only for the announcement strip. Awwwards lists the palette as `#1E1E21` / `#565659`.
4. **Product page = a system:**
   - Hero with the bike, model name in the sticky header, **paired CTAs** ("Request a demo ride" / "Purchase now").
   - **360° viewer** (accessible: "Use arrow keys to rotate") and colour radio selector.
   - Spec strip (Model year · Speed · Range · Torque · Charge) at the top.
   - Alternating **editorial chapters** in accordion form (Designed to Inspire / Farther, Faster / Intelligent Connections…), each with a short claim headline and a paragraph.
   - **"Performance" component explorer**: horizontal tab row **Battery · Charger · Motor · Chassis · Brakes · Dash · Suspension · Wheels & Tires · Belt drive · Face/Headlight · Storage**, each with macro photography and a one-paragraph explanation. This is the most relevant precedent for our engineering section.
   - **Numbered spec accordion** (01 Range, 02 Motor, 03 Power system … 10 Warranty) so detail is available but never dumped.
5. **Navigation as product discovery:** a full-screen overlay with bikes grouped into lines (S / DS / X) and a persistent *Compare models* link. Dealer locator is a permanent top-bar item.
6. **Plain-spoken ownership pages:** financing, incentives, owners, events, contact. Owners are not an afterthought.

**Translate:** type-led identity, dark↔light chapter alternation, the component-explorer *interaction pattern* (tabs + one focused explanation), numbered spec accordion, paired CTAs, permanent dealer-locator.

## 3. Rivian (secondary: storytelling only)

Observed (structure): hero carousel across three vehicles with a paired **"Explore / Design yours"** CTA per vehicle; big declarative section headings ("Electric vehicles designed for adventure"); three-tab block (Technology · Performance · Design); a "find your Rivian" build-in-3D entry; local-presence cards with real hours ("Brooklyn, NY · Mon–Sun 10am–7pm"); an oversized split headline ("Get behind / the wheel"); charging story told in short claims plus a number; closing mission statement. *(inferred)* scroll-linked parallax and cinematic full-screen imagery.

**Translate:** the idea that **real-world presence (shop, hours, test drive) gets headline treatment**; one declarative claim per screen; oversized split headline typography; claims backed by a number, not adjectives.

## 4. Additional technical references

- **Radian (by UNCOMMON)** electric-motorcycle landing: product shown large and head-on against a neutral field; **scroll-driven single-word typography**; **hotspots** on the machine; reserve/configure CTA woven into the flow (source: CODE Barcelona case study, Jul 2026).
- **Zero's own 360 viewer and component explorer** (above).
- GSAP ScrollTrigger pinned-section storytelling, image sequences and R3F configurators are well-established patterns. I have **not** individually audited specific third-party showcase sites in this pass; implementation will rely on documented API behaviour rather than copying any site.
- **Licensing check:** GSAP (3.15.1) is distributed under GSAP's "standard no-charge licence" (npm `license` field: https://gsap.com/standard-license), so ScrollTrigger is usable without a paid plan. Re-verify the terms before commercial launch.
- **3D assets:** CC0 GLB scooters exist (generic, not REVOO). A real exploded view is **not available** from REVOO. See asset inventory §7.

---

## 5. Elements that should influence REVOO

| Source | Principle adopted |
|---|---|
| VAS/Maeving | Product owns the first screen; quiet header; hairline-anchored text block; square controls; row-based specs; numbered support; editorial restraint |
| Zero | Condensed display type as identity; dark/light chapter switching; component-explorer tabs; numbered spec accordion; paired CTAs; permanent dealer locator |
| Rivian | Declarative one-claim sections; local presence with hours; numbers over adjectives |
| Radian | Scroll-driven typography; hotspots |

## 6. Elements that must NOT be copied

- Maeving's gold-on-black palette, café-racer heritage tone, "limited edition" scarcity framing.
- Zero's exact header/overlay layout, spec-strip arrangement, bike-builder UI and copy.
- Rivian's layout, imagery treatment, adventure/outdoor narrative.
- Any wording from any reference (REVOO copy is written from REVOO's own facts).
- **Superbike drama.** REVOO sells practical urban scooters; a sci-fi or race tone would be dishonest and off-brand.
- Claims the references can make (torque curves, ride modes, OTA updates, Bosch MSC) because REVOO has **none documented**.

---

## 7. Proposed visual direction: "Studio → Lab → City"

**Concept line:** *REVOO. Move Beyond.* Positioning: *Electric mobility designed for the next generation of movement.*

**Journey metaphor:** the bike travels from a bright **studio** (hero, product), into a dark **lab** (engineering), and out into the **city** (everyday mobility). The background temperature carries the story: light → dark → light, a single continuous change tied to scroll, no abrupt resets.

**Why a light hero, not dark:** official REVOO renders have **black tyres, black floor, black seat** and many are white/pale. On near-black they lose their silhouette; on a warm light-grey studio they read perfectly, and they match the studio light of REVOO's own banners. The dark treatment is reserved for the engineering chapter, where blueprint linework glows. *(Decision flagged for your approval.)*

### 7.1 Colour system

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0E0F11` | Near-black: text, lab background |
| `--graphite` | `#1B1D20` | Dark surfaces |
| `--steel` | `#8A8F96` | Secondary text, hairlines (metallic grey) |
| `--mist` | `#CFCFCB` | Studio floor grey |
| `--paper` | `#F2F1ED` | Warm off-white, main light background |
| `--white` | `#FFFFFF` | Highlights, cards on dark |
| `--revoo-green` | `#00A74A` | **Official accent**: CTAs, active states, progress, annotation points |
| `--revoo-green-deep` | `#007A36` | Pressed state; green text on light |

**Contrast (calculated, WCAG):**
- Near-black text on `#00A74A`: **≈ 6.0:1 ✔** → green buttons use **ink text**.
- White on `#00A74A`: ≈ 3.2:1 ✘ (fails for body text) → never white body text on green.
- White on `#007A36`: ≈ 5.5:1 ✔ → deep green allowed with white text.
- Green `#00A74A` as *text on paper*: ≈ 2.9:1 ✘ → use `#007A36` for green text on light.
- Green on `#0E0F11`: ≈ 6.0:1 ✔ for text/lines on dark.

Green is an **accent only** (aim < 5% of any screen), so it reads as brand, not decoration.

### 7.2 Typography

| Role | Face | Why |
|---|---|---|
| Display (huge headlines, model names) | **Archivo**, variable, using the **width axis** (condensed ~62–75 for tall headlines; expanded ~112–125 for labels echoing the extended REVOO wordmark) | One family gives the "Zero-like condensed" energy **and** a wordmark-compatible extended style. SIL OFL, self-hosted via `next/font`. Replaces proprietary TransSans |
| Body & UI | **Inter** | Neutral, excellent small-size legibility, wide language coverage |
| Technical labels, annotations, spec codes | **JetBrains Mono** (or IBM Plex Mono) | Engineering feel without sci-fi |

Mobile rule: display text uses `clamp()` with a hard minimum so headlines wrap in ≤ 3 lines at 360 px; body ≥ 16 px.

### 7.3 Layout language

- 12-column grid, consistent 8 px spacing scale; large margins; **square corners (0–2 px radius)**; hairline rules (1 px) as the main structural device; no card shadows, no gradients except one subtle floor-light radial on the studio stage.
- Numbered sections (`01 / 02 / …`), mono micro-labels, bottom-left anchored text with a vertical hairline (VAS-inspired, restyled).
- Image treatments: masked reveal (clip-path), controlled scale on hover, no rounded masks.

### 7.4 Animation language

Principles: **mass and momentum** (the bike behaves like a physical object), **one hero motion per screen**, **everything reversible**, **never block content**.

| Token | Value |
|---|---|
| Entrance ease | `power4.out` (long deceleration) |
| UI ease | `power2.out` / `expo.out` |
| Durations | micro 0.2–0.35 s · UI 0.5–0.7 s · hero entrance ≈ 2.4–3.0 s |
| Stagger | 0.04–0.08 s for letters/lines |
| Scroll scrub | `scrub: 0.6–1` (slight smoothing), never raw 1:1 jitter |

**Signature motion detail, "settle":** when the bike arrives it **dips ~6–8 px and recovers** (suspension compression), while its ground shadow tightens and brightens. That single detail makes it feel heavy and real rather than a sliding PNG.

### 7.5 Hero concept: "The Entrance" (priority #1)

Asset: official A12-L side render (3500×2292, true transparency).

Timeline (desktop, ≈ 2.8 s, runs once on load; skippable):
1. **0.0 s** Brand loader finishes (REVOO wordmark mask-reveal, ≤ 1.2 s, does not wait for non-critical images).
2. **0.2 s** Giant condensed headline **THE FUTURE DOESN'T WAIT.** is revealed line-by-line *behind* where the bike will pass.
3. **0.4 – 2.4 s** The bike enters from off-screen left on a long ease-out. Layers:
   - **Bike** (bitmap) with slight scale 1.06 → 1 and a 1° forward lean that relaxes.
   - **Wheel discs**: circular crops of the real tyre/rim rotated by GSAP with **motion blur that decays** as speed falls, cross-fading to the true static wheel at rest (hides the lack of separated wheels).
   - **Ground shadow** stretches long and thin while moving, tightens at rest.
   - **Speed lines** (a few hairlines, parallax) and a soft light sweep along the floor; fade at rest.
4. **2.4 – 2.8 s** "Settle" dip; secondary text *"Discover a smarter way to move."* and CTAs **EXPLORE THE RANGE / FIND YOUR REVOO** rise in; a hairline and `01 / 06` index appear.
5. The bike passes **in front of** the filled headline and **behind** an outlined copy of it, so type and machine interlock.

**Mobile:** vertical composition, bike ≈ 88% width, shorter travel (from −30vw), no wheel overlay if device is low-power, 1.6 s total.
**Reduced motion:** bike and text appear in final state with a simple fade.
**No-JS / failed image:** server-rendered final-state markup; animation is progressive enhancement.

Honest limitation: with a single flat side render, **true wheel rotation cannot be physically correct**. The disc-overlay technique is a convincing cinematic trick at speed, and I'll test it on the actual render in Phase 3; if it looks cheap at rest, it is removed and we keep a blur-to-sharp entrance. Quality over gimmick.

### 7.6 The motorcycle's journey (priority #2)

One persistent "MotoStage" element on the home page drives the whole story with a single scroll-linked timeline (`gsap.matchMedia` for desktop / mobile / reduced-motion):

| Stage | Section | What happens to the bike | Background |
|---|---|---|---|
| **A: Entrance** | Hero | Enters, settles, large, low, centre-right | Warm studio (paper → mist) |
| **B: Discovery** | "Not just another ride" → Showroom | Hero pins; bike scales down and slides into the showroom stage; headline shifts from brand to product. 3/4 view takes over only if the cut-out quality passes review, otherwise the side profile continues | Studio holds |
| **C: Engineering** | "Inside the machine" | Studio **irises to charcoal** from the bike's position; bodywork fades to **blueprint linework** drawn from the same render's edges; components light up and are labelled | Lab (ink) |
| **D: Reassembly** | End of engineering | Blueprint parts re-converge; paint fades back to solid | Lab → studio |
| **E: Real-world** | "Made for the city" | Bike drives out right (reverse of entrance) while a city panel slides in; parallax street lines | City light |

Key design rule: **no cut, only transforms.** The same bike layer persists, so there is never a visual reset. On mobile, B–E use simpler pinned crossfades with the same colour story.

### 7.7 The engineering skeleton (priority #3)

**Primary route (recommended): blueprint derived from REVOO's own render.**
- Edge extraction of the A12-L alpha/luminance produces authentic line art at pixel accuracy; vector component overlays (wheels, **rear hub motor** (visible in the official render), battery bay, controller, brake discs, frame line, suspension) are hand-authored in SVG on top.
- Scroll sequence: body fades to ghost → linework draws (`stroke-dashoffset`) → components highlight one at a time (green point + mono label + 1-sentence plain-English explanation) → parts offset slightly outward ("exploded" by 10–40 px along their axes) → reassemble.
- Component copy limited to **documented facts** (hub motor, vector controller, disc/drum brakes, hydraulic suspension, vacuum tyres, battery chemistry options). Positions of undocumented parts (battery, controller) are drawn **schematically and labelled "Illustrative layout"**.
- Pros: perfectly consistent with REVOO's silhouette, tiny payload (SVG), instant load, works without WebGL, accessible, zero invented specs.

**Optional route (needs your approval): generic 3D exploded view.** A CC0 GLB scooter (Three.js/R3F, lazy-loaded behind an intersection observer, static fallback) could show true camera rotation and part separation. **Cost:** silhouette differs from REVOO; must be labelled "generic illustration"; heavier bundle; more risk to performance. I recommend we ship the primary route first and only add 3D if the client asks for it.

### 7.8 Interaction patterns

- **Header:** wordmark left; centre-right text nav with a sliding green underline indicator; right: **Book a test ride** (green); hamburger → **full-screen menu** (staggered link rise, big condensed links) on mobile. Header hides on scroll-down, returns on scroll-up; becomes inverted over dark sections.
- **Showroom:** one model dominates the viewport; a minimal vertical rail of model codes (`E52 · A12 · A11 · C35Y …`) with segmented progress; outgoing bike slides out with a brief blur while incoming slides in on the same easing; spec **rows** (not cards) update with a number-roll; keyboard arrows and swipe supported; **model-detail** CTA and **enquiry** CTA persistent.
- **Product pages:** Zero-style structure: hero → intro → numbered spec accordion (01 Range, 02 Motor, 03 Battery & charging …) → gallery → colours (only official ones) → enquiry/test ride.
- **Component explorer** (technology page): Zero-style tab row, with our blueprint as the visual.
- **Forms:** inline validation, visible focus, loading/success/error states; no backend (hooks left for later integration).
- **Micro-interactions:** arrow-translate on CTA hover, clip-path image hover, underline wipes, magnetic effect **off** (distracting).

---

## 8. Achieving sophistication with usability and performance

- **Progressive enhancement:** final-state HTML first; animation layers on top. Reduced-motion and no-JS get a complete, static, beautiful page.
- **Images:** pre-generate AVIF + WebP at 3 widths per asset with `sharp`; `next/image` with explicit `sizes`; hero bike preloaded; everything else lazy. Reserve aspect-ratio boxes to prevent layout shift.
- **JS budget:** GSAP core + ScrollTrigger only (no Framer Motion, no Lenis by default). Native scroll is more reliable on pinned sections and iOS. Three.js not in the initial scope.
- **Mobile (Instagram in-app browser):** no scroll-jacking; shorter pins; test for address-bar resize jitter (`ignoreMobileResize`, `100svh`); touch targets ≥ 44 px.
- **Accessibility:** semantic landmarks, skip link, visible 2 px focus rings (green on dark, ink on light), `prefers-reduced-motion` honoured everywhere, alt text for every image, ARIA for tabs/accordion/carousel, no information conveyed by animation only.
- **SEO:** per-page titles and descriptions, OG/Twitter metadata, `Product` + `LocalBusiness` + `Organization` JSON-LD (only with verified fields), sitemap, robots, descriptive URLs (`/motorcycles/a12`).
- **Truthfulness mechanics:** a central `facts` data layer tags every field `confirmed | international | tbc`; unconfirmed items render with a subtle **"TBC"** marker in prototype mode and are hidden or replaced at launch.
