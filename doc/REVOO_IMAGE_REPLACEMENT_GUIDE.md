# REVOO — Image Replacement Guide

**Purpose:** list exactly what imagery should eventually replace the prototype's official-but-limited assets, with sizes and rules, so replacement never requires redesign.

## How replacement will work (architecture promise)

- Every image is declared **once** in `src/data/assets.ts` as a typed entry:
  `{ id, src, alt, width, height, focal, status: 'official' | 'derived' | 'placeholder' | 'generic', replaceBefore: 'launch' | 'never', source }`.
- Components reference **only asset ids** (e.g. `assets.hero.side`), never URLs.
- To replace an image: drop the new file in the same `public/images/<group>/` path (or update one line in `assets.ts`), then run `npm run images` (sharp pipeline regenerates AVIF/WebP at all widths and updates blur placeholders). **No component edits.**
- All compositions are built around **named anchor points** (wheel centres, ground contact line, headlight, seat) stored per asset in `assets.ts`. A replacement bike only needs those anchors re-set (about 10 numbers) for the hero entrance, shadow, wheel-blur disc and blueprint overlay to snap to the new image.

## Universal specifications

| Rule | Value |
|---|---|
| Cut-outs | **Transparent PNG, 16-bit not required; clean alpha, no white fringe**, 3500 px long edge (or larger) |
| Colour | sRGB; neutral studio light; consistent light direction (top-left key) across **all** models |
| Ground | Provide cut-out **without** baked reflection/shadow; the site renders its own shadow. If a baked shadow is unavoidable, deliver a second file without it |
| Consistency | Same camera height (≈ seat height), same lens (≈ 85 mm equivalent), same crop margin (bike fills 80% of width, 8% margin each side) for every model, so product switching stays aligned |
| Delivered formats | PNG master + layered PSD/TIFF if available |
| Naming | `revoo-<model>-<view>-<colour>.png` e.g. `revoo-a12-side-red.png` |

## Priority list

### P0: required for a credible launch

| # | Image | Dimensions · ratio | Background | Used for | Prototype stand-in |
|---|---|---|---|---|---|
| 1 | **Hero bike, pure side profile** (flagship or best-seller; confirm model with REVOO) | 4000×2600 · ~3:2 | Transparent | Hero entrance, skeleton base | A12-L side (official) |
| 2 | Same bike, **front ¾ (left)** | 3600×3000 · 6:5 | Transparent | Showroom stage, product hero | Banner cut-out (low-res) |
| 3 | Same bike, **rear ¾** | 3600×3000 | Transparent | Product gallery | None |
| 4 | **Side profile + front ¾ for every model sold in Rwanda**, in every Rwanda colour | as #1/#2 | Transparent | Showroom, product pages, colour selector | Only A12, A11, C35Y (sides) |
| 5 | **Rwanda shop photography**: Remera branch + Sonatubes exterior and interior | 3000×2000 min, 3:2 and 4:5 | Natural | Contact, About, Support | None |
| 6 | **Kigali lifestyle set** (5–8 images): commuting, parking, charging at home, evening city; real riders with consent; helmets worn | 3000×2000 landscape + 2400×3000 portrait | Natural | City section, About, social crops | Non-Kigali placeholders |
| 7 | **Team portrait** (Remera team) | 3000×2000 | Natural | About, Support | None |

### P1: strengthens the signature experience

| # | Image | Dimensions | Background | Used for |
|---|---|---|---|---|
| 8 | **Technical skeleton**: official engineering/CAD render of the hero bike, side view, **body-off** showing battery, controller, hub motor, wiring, frame | 4000×2600 | Transparent or flat dark `#0E0F11` | Engineering chapter (replaces derived blueprint) |
| 9 | **Exploded view**: 6–8 separate transparent layers (body panels, seat, battery, controller, frame, motor/rear wheel, front fork+wheel, lights) all in the same camera | 4000×2600 each layer, **identical canvas** | Transparent | Reassembly animation (true parts instead of offsets) |
| 10 | **Detail macros** (6–10): headlight, display/SOC monitor, seat storage open, hub motor, brake disc, charging port, charger, battery removed | 2400×1600 | Studio or natural | Product galleries, technology tabs |
| 11 | **Wheel isolates**: front and rear wheel (tyre + rim) photographed or rendered on a plain background, separately | 1600×1600 | Transparent | Real wheel-spin in hero (replaces disc-overlay trick) |
| 12 | **360° turntable**: 36–72 frames per hero bike | 1800×1200 per frame, WebP | Transparent | Optional 360° viewer (Zero-style) |
| 13 | Hero **video loop** (6–10 s): bike entering a clean studio or Kigali road, 4K, no baked text | 3840×2160, H.264/AV1 + WebM, ≤ 6 MB 1080p version | n/a | Optional hero alternative / social |

### P2: finishing

| # | Image | Notes |
|---|---|---|
| 14 | Open Graph card (1200×630) per page | Generated from approved imagery |
| 15 | Favicon / app icon master (SVG) | From official wordmark/brand mark; request approved logo mark |
| 16 | Accessories & rider-gear shots (helmet, rear box, backrest) | Only if sold |
| 17 | Charger and battery product shots | Needed for the Support/charging page |

## Prompt notes for custom-generated REVOO imagery (when approved)

Not generated now. When you start, use official renders as **image references** and give the generator these constraints:
- Preserve exact REVOO proportions, wordmark placement, stripe graphics and wheel/hub design; **never invent a new model**.
- Keep the same camera and light per the universal rules so that models stay interchangeable.
- Ask for transparent PNG and separate wheel layers; check edges at 300% zoom.
- Verify every generated image against the official side render for silhouette drift (headlight shape, backrest, mudguard, battery box) before approval.
- Label generated images in `assets.ts` as `status: 'derived'` and keep the source references on record.

## Replacement checklist (for each swap)

1. New file meets size/ratio/background rules above.
2. Alt text updated in `assets.ts`.
3. Anchors (wheel centres, ground line, headlight) re-set.
4. `npm run images` run; spot-check hero at 1440×900, 390×844 and 2560×1440.
5. `status` changed to `official` or `derived`; `replaceBefore` cleared.
6. Hero entrance, skeleton overlay and shadows visually re-checked.
