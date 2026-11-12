/**
 * The truth layer.
 *
 * Every factual claim shown on the site comes from here and carries a
 * confidence level. Components must never hardcode specs, prices, warranty
 * terms, phone numbers or addresses.
 *
 *  confirmed-rw  Verified Rwanda-specific information
 *  international Official REVOO information from other markets / global site
 *  tbc           Unknown or unverified. Must be confirmed by REVOO Rwanda
 *
 * See doc/REVOO_BRAND_RESEARCH.md for sources.
 */

export type Confidence = "confirmed-rw" | "international" | "tbc";

export interface Fact<T = string> {
  value: T | null;
  confidence: Confidence;
  /** Short human-readable provenance */
  source?: string;
  /** Extra note shown in tooltips / docs */
  note?: string;
}

const tbc = <T = string>(note?: string): Fact<T> => ({ value: null, confidence: "tbc", note });

export const facts = {
  brand: {
    name: "REVOO",
    positioning: "Electric mobility designed for the next generation of movement.",
    foundedGlobal: {
      value: "2023",
      confidence: "international",
      source: "revoo-ev.com/about",
    } satisfies Fact,
    countries: {
      value: "10+ countries",
      confidence: "international",
      source: "revoo-ev.com/about",
    } satisfies Fact,
    parent: {
      value: "Part of Transsion Holdings' mobility ecosystem",
      confidence: "international",
      source: "revoo-ev.com/about",
      note: "Relationship of the Rwandan entity to Transsion is unconfirmed; do not state ownership.",
    } satisfies Fact,
    eastAfricaTesting: {
      value: "12,000+ km of durability testing in East Africa",
      confidence: "international",
      source: "revoo-ev.com/about (2023 milestone)",
    } satisfies Fact,
  },

  rwanda: {
    legalEntity: tbc("Legal entity name of the Rwandan distributor/subsidiary"),
    instagram: {
      value: "https://www.instagram.com/revoo_in_rwanda/",
      confidence: "confirmed-rw",
      source: "Instagram @revoo_in_rwanda",
    } satisfies Fact,
    instagramHandle: {
      value: "@revoo_in_rwanda",
      confidence: "confirmed-rw",
      source: "Instagram",
    } satisfies Fact,
    phone: tbc("No verified Rwanda phone. A map directory lists +250 798 686 958 for REVOO Sonatubes (unverified)."),
    whatsapp: tbc("No verified WhatsApp number."),
    email: tbc("No verified Rwanda email."),
    hours: tbc("Opening hours for each branch"),
    warranty: {
      value: "2 years or 20,000 km whole-vehicle warranty (global programme)",
      confidence: "international",
      source: "revoo-ev.com/service",
      note: "Rwanda terms unconfirmed. Battery/motor terms vary by model and market.",
    } satisfies Fact,
    chargingHome: {
      value: "Charges from a standard household outlet",
      confidence: "confirmed-rw",
      source: "IGIHE, Aug 2023 (REVOO Rwanda at Gikondo Expo)",
    } satisfies Fact,
    chargingPortable: {
      value: "A portable charger was included (2023)",
      confidence: "confirmed-rw",
      source: "IGIHE, Aug 2023",
      note: "Dated 2023; reconfirm.",
    } satisfies Fact,
    priceRange2023: {
      value: "RWF 990,000 – 1.3 million (2023, three models)",
      confidence: "confirmed-rw",
      source: "IGIHE, Aug 2023",
      note: "Dated and not model-specific. Do not publish as current pricing.",
    } satisfies Fact,
    serviceSupport: {
      value: "Repair support for technical issues",
      confidence: "confirmed-rw",
      source: "IGIHE, Aug 2023",
    } satisfies Fact,
  },

  service: {
    process: {
      value: ["Book service", "Reception", "Inspection", "Approval", "Repair & care", "Handover"],
      confidence: "international",
      source: "revoo-ev.com/service",
    } satisfies Fact<string[]>,
    promises: {
      value: [
        "Certified technicians using diagnostic tools",
        "Genuine spare parts",
        "Roadside assistance",
        "Transparent pricing before repair",
      ],
      confidence: "international",
      source: "revoo-ev.com/service",
    } satisfies Fact<string[]>,
    formats: {
      value: [
        { name: "3S Hub", detail: "Sales, service and spare parts in one location" },
        { name: "Experience Store", detail: "Display, test ride and care" },
        { name: "Service Center", detail: "Fast repair and diagnostics" },
      ],
      confidence: "international",
      source: "revoo-ev.com/service",
    } satisfies Fact<{ name: string; detail: string }[]>,
  },
} as const;

/** Display copy for each confidence level. */
export const confidenceLabel: Record<Confidence, { short: string; long: string }> = {
  "confirmed-rw": { short: "Rwanda", long: "Confirmed for REVOO Rwanda" },
  international: { short: "Intl spec", long: "Official international specification. Confirm the Rwanda variant" },
  tbc: { short: "TBC", long: "To be confirmed by REVOO Rwanda" },
};
