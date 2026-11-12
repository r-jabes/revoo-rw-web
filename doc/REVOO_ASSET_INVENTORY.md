# REVOO — Asset Inventory

**Audit date:** 12 November 2026
**Local raw cache:** `_research/img/` (downloaded for inspection only; not shipped; to be gitignored)
**Official CMS media host:** `https://cmsapi.revoo-ev.com/uploads/<filename>`

## Classification key

| Code | Meaning |
|---|---|
| **A: Official REVOO** | Published by REVOO on its official sites. Usable in this *proposal prototype* as the client's own material; **written usage permission from REVOO is required before a public launch**. |
| **B: Alternative motorcycle** | Another manufacturer's product. **None used, none planned.** (Not needed: official renders are strong enough.) |
| **C: Generic technical visualization** | Non-REVOO engineering imagery or models, used only to illustrate and always labelled "illustrative". |
| **D: Temporary placeholder** | Stand-in to be replaced before launch. |
| **R: Replace** | Must eventually be replaced or supplemented with Rwanda-specific material. |

**Integrity rule:** no other manufacturer's motorcycle appears anywhere in the prototype, so the "never present another maker's bike as REVOO" rule is satisfied by construction. Two caveats are listed in §6.

---

## 1. Brand assets

| Asset | Source file | Class | Notes |
|---|---|---|---|
| Wordmark, white | `revoo_logo_c3901d01d3.svg` | A | 156×26 viewBox, vector. For dark backgrounds |
| Wordmark, dark | `revoo_logo_dark_38faad5b1a.svg` | A | For light backgrounds |
| Background vector ("VECTO") | `VECTO_096fb3d836_1a0977cf8b.svg` | A | Decorative; not planned for use |
| Road line SVG | `road_fc4e864055_d6598c6b1c.svg` | A | Decorative; 0 KB / empty; ignore |
| Brand font TransSans | `cmsapi.revoo-ev.com/TransSansVF.ttf` | A (licence **unknown**) | **Not redistributed.** Replaced by a licensed alternative (see design research) |
| Rwanda storefront (profile photo) | Instagram @revoo_in_rwanda avatar | A-Rwanda (proprietary to REVOO Rwanda) | Not downloaded; request original |

## 2. Product renders: transparent, high quality (hero-grade)

| Asset | File | Pixels | Class | Colour / view | Use |
|---|---|---|---|---|---|
| **A12-L side** | `pk_a12_l_cac89f182b.png` | 3500×2292 α | **A** | Red, pure side profile, backrest, rear hub motor visible | **Hero entrance, skeleton base**, product page |
| **A11-L side** | `pk_a11_l_f19c7ebea2.png` | 3500×2292 α | **A** | White/gold, side profile | Showroom, product page |
| **C35Y side** | `C35_Y_f0f9972def_d74a1789af.png` | 2000×2000 α | **A** | Red/black with crash bars, side profile | Showroom, product page |

Hero-quality: yes (all three scale to full-viewport at 2× DPR without softening). These are the backbone of the prototype.

## 3. Product renders: usable only after processing

| Asset | File | Pixels | Class | Problem |
|---|---|---|---|---|
| Grey/gold 3/4 front, backrest, no windscreen (captioned "E52 – Glide with Power") | `banner04_mob_7940b18364.png` | 1080×1917 | A | Baked grey backdrop + ghost bike + text; bike ≈ 600 px wide. Needs **cut-out**. **Model identity unverified**, see warning below |
| Same bike (desktop) | `banner04_cf44d7a5ce.png`, `banner02_0ebac58697.png` | 1600×660 | A | Bike ≈ 380 px tall |
| Grey/black 3/4 front **with windscreen** (captioned "E52 – Empower your every journey") | `banner01_793f25d359.png` | 1600×660 | A | Matches the `pk_e52` side thumbnail (windscreen), so most likely the true E52 |
| Teal 3/4 front with crash bars (desktop caption "E52"; mobile caption "C35") | `banner03_54c68d2fbb.png`, `banner02_mob_1796ff45bf.png` | 1600×660 / 1083×1917 | A | **Captions conflict**; identity unverified |
| Red 3/4 front, white stripes (mobile caption "E52 – As strong, as style") | `banner01_mob_4af58cf443.png` | 1080×1917 | A | Matches the **A12-L** side render and the A12 tagline, so almost certainly an **A12**, mis-captioned |
| Orange/black 3/4 front (caption "C35 GT") | `banner03_mob_38c853e13c.png` | 1092×1917 | A | Baked backdrop |

> **Banner caption warning:** official banner captions are inconsistent (two different bikes both captioned E52; one bike captioned E52 on desktop and C35 on mobile; an A12 captioned E52). **Model identity of any banner-derived image must be confirmed by REVOO before it is labelled on the site.** Until then, the prototype labels only the three side renders whose identity is certain (A12-L, A11-L, C35Y, each matching its tagline/spec page), and uses banner cut-outs only where the model label is verified or the image is unlabelled.
| A09 side | `pk_a09_c2102fd9a8.png` | 875×875 α | A | Lavender; OK for small/medium use only |
| Rider on teal scooter (profile) | `movebike_680899b991.png` | 300×300 α | A | Too small; reference only |

**Processing plan (Phase 2):** background removal on the banner 3/4 views; upscaling decisions made per asset; reject any that look soft at display size and request originals from REVOO.

## 4. Product thumbnails: reference only

`pk_e52_44b1af2341.jpg` (324 px, **the only E52 side view**), `pk_c35y_…jpg`, `pk_a11_…jpg`, `pk_a12_…jpg`, `pk_y06_…jpg` (210 px), `pk_y04_…jpg` (210 px), `pk_b12_…jpg` (210 px).
**Class A, unusable at display size.** Used only to *identify* models. Models **E52, Y04, Y06, B12 have no hero-grade imagery**; they need originals from REVOO.

## 5. Lifestyle and campaign imagery

All official; **none shot in Rwanda**. Subjects are predominantly South Asian riders and locations (some with local text and event branding).

| Asset | File | Class | Observations |
|---|---|---|---|
| Rider seated by black A-series | `IMG_3781_color_composition_optimized_13543e2d3b.png` | A / **R** | Real photo, Dhaka-style street; usable only as a placeholder |
| Rider with green E52-type scooter | `vlcsnap_2026_08_29_…92273bf4bf.png` | A / **R** | Real photo, video frame, lake; teal/green bike |
| Rider with teal scooter (woman) | `IMG_20260820_150802_972_…901878a81f.png` | A / **R** | Real photo; cultural dress context specific to South Asia |
| Rider by grey scooter w/ top box | `Screenshot_2026_08_30_111417_…`, `…111606_…` | A / **R** | Real, video frames |
| Studio / street portraits | `SIF_06242`, `SIF_06337`, `SIF_06500`, `CP_3_A4563`, `IMG_4990_2` | A / **R** | Real, high quality portrait photography (1024×1536 – 1066×1600) |
| Rider at event with C35 GT | `Fatmeeshh_4de906b1a3.jpeg` | A / **R** | Event photo with REVOO banners |
| Rider with mountain backdrop | `Hamza_Bokhari_610ecf11b3.jpeg`, `Photo_with_Subtitle_Removed_0353c37177.png` | A / **R** | Composited/AI-styled backdrop; do not use |
| Single rider scenario (C35) | `C35_Single_Riding_Scenario_Updated_copy_9bfe903a4c.jpg` | A / **R** | 1080×1920; real or edited; vertical, good for Instagram-format placeholder |
| "Carry What Matters", "Freedom to Move", "Move the Day Forward", "Confidence Every Day" | `img_Carry_What_Matter…`, `img_Freedom_to_Move…`, `img_Move_the_Day…`, `img_Confidence_Every_Day…` (685×514) | A, **appears AI-generated** | Low resolution; **do not use**: they show products that don't match the catalogue (e.g. a pastel e-bike with basket) |
| Series tiles | `img_A_Series…`, `img_B_Series…`, `img_C_Series…` (rider in Pakistani dress), `img_E_Series…`, `img_Y_Series…` | A, low-res, AI-composite | Reference only |
| Rider with delivery box (AI-looking) | `Chat_GPT_Image_2026_6_28_…623e4e9412.png` | **A, AI-generated** (file name) | Do not use |
| About-page imagery | `img_about_*.png`, `millestore_…png`, `banner_find_REVOO…png`, `20260813_105214_…png` | A, mostly stock/AI renders | `img_about_globally` is a stock globe render. **Do not use** |

Lifestyle verdict: **no usable Kigali imagery exists in public sources.** The prototype uses **non-human, non-location-specific moods** (product on studio backdrop, abstract street textures) and a small number of clearly flagged placeholder photos, each registered in the asset config with `status: "placeholder"`, `replaceBefore: "launch"`.

## 6. Missing assets (do not exist in public official sources)

- Front-on, rear, rear-3/4 and top views; any interior/detail shots (dash, headlight, seat storage, hub motor, battery, charger).
- Any **video** (none found on global or country sites), any **3D model**, any **exploded view / engineering skeleton**, any **360° spin**.
- Rwanda-shot media (shops, riders, Kigali streets, Remera branch). Exists on Instagram only.
- E52, Y04, Y06, B12, A10, C32Y high-resolution renders.
- Official high-res transparent PNG/WebP of the E52 side profile (the flagship!).

## 7. Skeleton / engineering visuals

| Option | Class | Status |
|---|---|---|
| **Primary:** engineering blueprint **derived from the official A12-L side render** (edge extraction + hand-authored component overlays: wheels, rear hub motor, battery bay, controller, frame line, brakes) | C layered on A | To be built in Phase 4. Keeps REVOO's own silhouette, so no mismatch |
| **Optional:** generic CC0 GLB scooter for a true 3D exploded view (candidates: tevy "Motor Scooter" CC0, 1.8 m, separable fork/wheels/lid; Innerscene "Urban motor scooter" CC0, 1.9 m) | **C: generic** | **Not used unless approved.** Silhouette differs from REVOO; would be labelled "generic illustration". Licence CC0; sources: https://tevy.dev/models/motor-scooter · https://www.innerscene.com/tools/library/3d-parts/urban-motor-scooter-9dd945f9 |
| Component locations that REVOO has not documented (battery position, controller position, frame material) | n/a | Drawn schematically and labelled *"Illustrative layout"* |

## 8. Replacement status summary

| Slot | Status at prototype | Replace by |
|---|---|---|
| Hero bike (A12-L side) | Official, final-grade | Keep, or REVOO-supplied E52 flagship render |
| Product renders | Official (3 hero-grade, others low-res) | Full studio set from REVOO or generated set per image guide |
| 3/4 views | Official, cut-out, medium-res | Generated/photographed 3/4 views |
| Skeleton | Derived blueprint | Real engineering renders / CAD from REVOO |
| Lifestyle | **Placeholders (non-Kigali)** | Kigali photo shoot / Rwanda Instagram originals |
| Rwanda showroom imagery | **None** | Remera / Sonatubes photos |
| Video | **None** | Client footage |

See `REVOO_IMAGE_REPLACEMENT_GUIDE.md` for exact specifications.
