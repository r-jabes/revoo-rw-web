/**
 * Content for the home page sections that are more than a sentence of copy.
 * Anything factual is derived from the truth layer (facts.ts / models.ts).
 */
import { getModel } from "./models";
import type { Confidence } from "./facts";

const a12 = getModel("a12")!;
const spec = (key: string) => a12.specs.find((s) => s.key === key)!.value;

// ── Engineering explorer (A12) ───────────────────────────────

/** A point on the A12 render, as fractions of its width/height. */
export interface Pt {
  x: number;
  y: number;
}

export interface EngComponent {
  id: string;
  index: string;
  label: string;
  /** One plain-English sentence. Describes the part, never invents a spec. */
  body: string;
  /** Official A12 value, if one is published */
  spec: { label: string; value: string } | null;
  specConfidence: Confidence;
  /** Marker positions on the render */
  points: Pt[];
  /** Highlight drawn when active */
  shape:
    | { kind: "wheel"; wheel: "front" | "rear"; scale: number }
    | { kind: "wheels"; scale: number }
    | { kind: "box"; x: number; y: number; w: number; h: number }
    | { kind: "dot"; r: number };
  /** Position is NOT published by REVOO, so the diagram marks it as illustrative */
  illustrative?: boolean;
  /** Which side the label/leader goes to */
  labelSide: "top" | "bottom";
}

export const engineering: EngComponent[] = [
  {
    id: "motor",
    index: "01",
    label: "Hub motor",
    body: "The motor sits inside the rear wheel, so power goes straight to the tyre. There is no chain or belt to adjust or replace.",
    spec: { label: "A12 motor", value: spec("motor") },
    specConfidence: "international",
    points: [{ x: 0.832, y: 0.852 }],
    shape: { kind: "wheel", wheel: "rear", scale: 0.46 },
    labelSide: "bottom",
  },
  {
    id: "controller",
    index: "02",
    label: "Vector controller",
    body: "The controller manages how much power flows from the battery to the motor as you open the throttle.",
    spec: null,
    specConfidence: "tbc",
    points: [{ x: 0.7, y: 0.6 }],
    shape: { kind: "box", x: 0.645, y: 0.535, w: 0.11, h: 0.12 },
    illustrative: true,
    labelSide: "top",
  },
  {
    id: "battery",
    index: "03",
    label: "Battery",
    body: "Sold internationally with a graphene or a lithium (LFP) battery. The lithium version charges faster and weighs less.",
    spec: { label: "A12 battery", value: spec("battery") },
    specConfidence: "international",
    points: [{ x: 0.44, y: 0.735 }],
    shape: { kind: "box", x: 0.3, y: 0.7, w: 0.28, h: 0.065 },
    illustrative: true,
    labelSide: "bottom",
  },
  {
    id: "brakes",
    index: "04",
    label: "Brakes",
    body: "A disc brake on the front wheel, where most of the braking force is needed, and a drum brake at the rear.",
    spec: { label: "A12 brakes", value: spec("brakes") },
    specConfidence: "international",
    points: [{ x: 0.122, y: 0.838 }],
    shape: { kind: "wheel", wheel: "front", scale: 0.5 },
    labelSide: "bottom",
  },
  {
    id: "suspension",
    index: "05",
    label: "Suspension",
    body: "Hydraulic shock absorbers at the front and the rear take the sting out of uneven roads.",
    spec: { label: "A12 suspension", value: spec("suspension") },
    specConfidence: "international",
    points: [
      { x: 0.8, y: 0.74 },
      { x: 0.147, y: 0.715 },
    ],
    shape: { kind: "dot", r: 26 },
    labelSide: "top",
  },
  {
    id: "tyres",
    index: "06",
    label: "Tyres",
    body: "Vacuum (tubeless) tyres have no inner tube.",
    spec: { label: "A12 tyres", value: spec("tyres") },
    specConfidence: "international",
    points: [
      // lower outer edge of each tyre (clear of the hub and fork markers)
      { x: 0.042, y: 0.946 },
      { x: 0.904, y: 0.949 },
    ],
    shape: { kind: "wheels", scale: 1 },
    labelSide: "bottom",
  },
  {
    id: "display",
    index: "07",
    label: "Instrument display",
    body: "A state-of-charge readout on the instrument display shows the battery percentage that is left.",
    spec: { label: "A12 display", value: spec("display") },
    specConfidence: "international",
    points: [{ x: 0.352, y: 0.205 }],
    shape: { kind: "dot", r: 30 },
    labelSide: "top",
  },
];

// ── Battery comparison (A12, international specification) ────

export interface BatteryRow {
  label: string;
  graphene: string;
  lithium: string;
}

export const a12Batteries: { confidence: Confidence; rows: BatteryRow[] } = {
  confidence: "international",
  rows: [
    { label: "Battery", graphene: "72 V 26 Ah", lithium: "73.6 V 30 Ah (LFP)" },
    { label: "Range", graphene: "70–90 km", lithium: "80–100 km" },
    { label: "Charging time", graphene: "6–9 h", lithium: "3–3.5 h" },
    { label: "Weight", graphene: "110 kg", lithium: "80 kg" },
  ],
};

// ── City section: C35Y facts ────────────────────────────────

const c35y = getModel("c35y")!;
const c = (key: string) => c35y.specs.find((s) => s.key === key)!.value;

export const cityFacts = [
  { label: "Frame", value: "Step-through", note: "Easy to get on and off in everyday clothes" },
  { label: "Suspension", value: c("suspension"), note: "C35Y" },
  { label: "Ground clearance", value: c("clearance"), note: "C35Y" },
];
