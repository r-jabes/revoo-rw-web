/**
 * Model catalogue (v1: A12, A11, C35Y, E52).
 *
 * ALL specification values are OFFICIAL INTERNATIONAL figures (mainly the
 * REVOO Pakistan site, cross-checked with Bangladesh/Nigeria/Senegal).
 * Rwanda availability and Rwanda-variant specs are UNCONFIRMED.
 */
import { assets, type AssetDef, type ModelKey } from "./assets";
import type { Confidence } from "./facts";

export interface SpecRow {
  key: string;
  label: string;
  value: string;
  /** Variants (e.g. graphene vs lithium) if figures differ */
  note?: string;
}

export interface Model {
  slug: ModelKey;
  code: string; // "A12"
  series: string;
  tagline: string;
  intro: string;
  /** One-line headline facts shown in the showroom rows */
  headline: { topSpeed: string; range: string; battery: string };
  specs: SpecRow[];
  image: AssetDef | null;
  imageNote?: string;
  /** Specification confidence (never "confirmed-rw" without REVOO confirmation) */
  specConfidence: Confidence;
  availabilityConfidence: Confidence;
  colourways: { name: string; hex: string }[];
}

export const models: Model[] = [
  {
    slug: "a12",
    code: "A12",
    series: "A Series · Urban",
    tagline: "As Strong, As Style",
    intro:
      "A step-through urban scooter with a rear hub motor, front disc brake and hydraulic suspension. Sold internationally with a graphene or a lithium (LFP) battery.",
    headline: {
      topSpeed: "35–45 km/h",
      range: "70–100 km",
      battery: "72 V 26 Ah · 73.6 V 30 Ah",
    },
    specs: [
      { key: "speed", label: "Top speed", value: "35–45 km/h" },
      { key: "range", label: "Range", value: "70–90 km graphene · 80–100 km lithium", note: "Test-condition estimate" },
      { key: "battery", label: "Battery", value: "72 V 26 Ah graphene · 73.6 V 30 Ah lithium (LFP)" },
      { key: "charge", label: "Charging time", value: "6–9 h graphene · 3–3.5 h lithium" },
      { key: "motor", label: "Motor", value: "Hub motor, 1000–1800 W" },
      { key: "brakes", label: "Brakes", value: "Front disc · rear drum" },
      { key: "suspension", label: "Suspension", value: "Hydraulic, front and rear" },
      { key: "tyres", label: "Tyres", value: "3.0-10″ vacuum (tubeless)" },
      { key: "weight", label: "Weight", value: "110 kg graphene · 80 kg lithium" },
      { key: "clearance", label: "Ground clearance", value: "150 mm" },
      { key: "display", label: "Display", value: "Advanced state-of-charge (SOC %) monitor" },
    ],
    image: assets.models.a12.side,
    specConfidence: "international",
    availabilityConfidence: "tbc",
    colourways: [{ name: "Red (official render)", hex: "#b8141f" }],
  },
  {
    slug: "a11",
    code: "A11",
    series: "A Series · Urban",
    tagline: "Rule Urban Roads",
    intro:
      "A lighter step-through scooter built for everyday city riding, with drum brakes front and rear. Sold internationally in graphene and lithium (LFP) versions.",
    headline: {
      topSpeed: "35–45 km/h",
      range: "65–90 km",
      battery: "60 V 26 Ah · 60.8 V 30 Ah",
    },
    specs: [
      { key: "speed", label: "Top speed", value: "35–45 km/h" },
      { key: "range", label: "Range", value: "65–80 km graphene · 75–90 km lithium", note: "Test-condition estimate" },
      { key: "battery", label: "Battery", value: "60 V 26 Ah graphene · 60.8 V 30 Ah lithium (LFP)" },
      { key: "charge", label: "Charging time", value: "6–9 h graphene · 3–3.5 h lithium" },
      { key: "motor", label: "Motor", value: "1000–1500 W" },
      { key: "brakes", label: "Brakes", value: "Drum, front and rear" },
      { key: "suspension", label: "Suspension", value: "Hydraulic, front and rear" },
      { key: "tyres", label: "Tyres", value: "3.0-10″ vacuum (tubeless)" },
      { key: "weight", label: "Weight", value: "90 kg graphene · 70 kg lithium" },
      { key: "clearance", label: "Ground clearance", value: "150 mm" },
    ],
    image: assets.models.a11.side,
    specConfidence: "international",
    availabilityConfidence: "tbc",
    colourways: [{ name: "White and gold (official render)", hex: "#f4f2ee" }],
  },
  {
    slug: "c35y",
    code: "C35Y",
    series: "C Series · Commuter",
    tagline: "Power Your Commute",
    intro:
      "A higher-output commuter with crash bars, a front disc brake and hydraulic suspension. Sold internationally as C35 Young in graphene and lithium (LFP) versions.",
    headline: {
      topSpeed: "35–55 km/h",
      range: "80–115 km",
      battery: "72 V 35 Ah · 73.6 V 30 Ah",
    },
    specs: [
      { key: "speed", label: "Top speed", value: "35–55 km/h" },
      { key: "range", label: "Range", value: "80–115 km graphene · 80–105 km lithium", note: "Test-condition estimate" },
      { key: "battery", label: "Battery", value: "72 V 35 Ah graphene · 73.6 V 30 Ah lithium (LFP)" },
      { key: "charge", label: "Charging time", value: "6–9 h graphene · 3–3.5 h lithium" },
      { key: "motor", label: "Motor", value: "1200–2400 W" },
      { key: "brakes", label: "Brakes", value: "Front disc · rear drum" },
      { key: "suspension", label: "Suspension", value: "Hydraulic, front and rear" },
      { key: "tyres", label: "Tyres", value: "3.0-10″ vacuum (tubeless)" },
      { key: "weight", label: "Weight", value: "132 kg graphene · 93 kg lithium" },
      { key: "clearance", label: "Ground clearance", value: "165–168 mm" },
    ],
    image: assets.models.c35y.side,
    specConfidence: "international",
    availabilityConfidence: "tbc",
    colourways: [{ name: "Red (official render)", hex: "#b8141f" }],
  },
  {
    slug: "e52",
    code: "E52",
    series: "E Series · Flagship",
    tagline: "Glide with Power",
    intro:
      "The flagship of the E Series: 12-inch wheels, disc brakes with combined braking (CBS) and the highest rated motor output of the models listed here.",
    headline: {
      topSpeed: "40–75 km/h",
      range: "70–110 km",
      battery: "96 V 35 Ah",
    },
    specs: [
      { key: "speed", label: "Top speed", value: "40–75 km/h", note: "Differs by market (Nigeria lists 80 km/h)" },
      { key: "range", label: "Range", value: "70–110 km", note: "Differs by market" },
      { key: "battery", label: "Battery", value: "96 V 35 Ah graphene" },
      { key: "charge", label: "Charging time", value: "8–10 h" },
      { key: "motor", label: "Motor", value: "3000–4800 W" },
      { key: "brakes", label: "Brakes", value: "Disc, front and rear, with CBS" },
      { key: "suspension", label: "Suspension", value: "Hydraulic, front and rear" },
      { key: "tyres", label: "Tyres", value: "Front 100/90 · rear 120/70-12″ vacuum" },
      { key: "weight", label: "Weight", value: "150 kg" },
      { key: "clearance", label: "Ground clearance", value: "145 mm" },
    ],
    image: assets.models.e52.side,
    imageNote: "Awaiting a high-resolution render from REVOO; the only public side view is 324 px wide.",
    specConfidence: "international",
    availabilityConfidence: "tbc",
    colourways: [],
  },
];

export const getModel = (slug: string) => models.find((m) => m.slug === slug);
