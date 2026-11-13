/**
 * Support FAQ. Every answer is drawn from the truth layer or is an honest
 * "to be confirmed" statement — nothing is invented for the pitch.
 */
import { facts } from "./facts";
import type { Confidence } from "./facts";

export interface FaqItem {
  id: string;
  question: string;
  /** Plain-language answer. May contain multiple paragraphs. */
  answer: string[];
  confidence: Confidence;
}

export const faq: FaqItem[] = [
  {
    id: "charge-where",
    question: "Where can I charge a REVOO?",
    answer: [
      `${facts.rwanda.chargingHome.value}. A portable charger was included with REVOO scooters shown in Rwanda in 2023 — reconfirm what ships with each model today.`,
      "REVOO does not operate a battery-swap network. Public charging points in Rwanda are to be confirmed.",
    ],
    confidence: "confirmed-rw",
  },
  {
    id: "charge-time",
    question: "How long does charging take?",
    answer: [
      "International specifications list roughly 6–9 hours for graphene batteries and 3–3.5 hours for lithium (LFP), depending on the model. Confirm the Rwanda battery option before buying.",
    ],
    confidence: "international",
  },
  {
    id: "warranty",
    question: "What warranty do I get in Rwanda?",
    answer: [
      `REVOO's global programme quotes a whole-vehicle warranty of ${facts.rwanda.warranty.value}. Battery and motor terms vary by model and market.`,
      "Rwanda-specific warranty terms and the administrator (REVOO or Carlcare) are still to be confirmed.",
    ],
    confidence: "tbc",
  },
  {
    id: "service",
    question: "How does servicing work?",
    answer: [
      `The global service programme follows six steps: ${facts.service.process.value.join(", ")}.`,
      `${facts.rwanda.serviceSupport.value} was mentioned for Rwanda in 2023. Branch-level service details are confirmed showroom by showroom.`,
    ],
    confidence: "international",
  },
  {
    id: "models",
    question: "Which models are sold in Rwanda?",
    answer: [
      "The current Rwanda model list is to be confirmed by REVOO Rwanda. This prototype shows the international A12, A11, C35Y and E52 for the pitch.",
      "In 2023, REVOO exhibited three models in Kigali. That list may have changed.",
    ],
    confidence: "tbc",
  },
  {
    id: "test-ride",
    question: "Can I book a test ride?",
    answer: [
      "Yes. Use the enquiry form on the Contact page and mark that you want a test ride. A REVOO Rwanda advisor will confirm availability at the Remera branch.",
    ],
    confidence: "confirmed-rw",
  },
];
