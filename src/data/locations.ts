import type { Confidence } from "./facts";

export interface Location {
  id: string;
  name: string;
  /** Does this branch exist? */
  existence: Confidence;
  address: string | null;
  addressConfidence: Confidence;
  phone: string | null;
  hours: string | null;
  note?: string;
}

/**
 * Showrooms. Only the existence of the Remera branch is confirmed (REVOO
 * Rwanda Instagram highlight). The Sonatubes listing comes from a third-party
 * map directory and is NOT verified. No addresses, phones or hours are shown
 * as fact until REVOO confirms them.
 */
export const locations: Location[] = [
  {
    id: "remera",
    name: "Remera branch",
    existence: "confirmed-rw",
    address: null,
    addressConfidence: "tbc",
    phone: null,
    hours: null,
    note: "Branch confirmed by REVOO Rwanda's Instagram. Address, phone and hours to be supplied.",
  },
  {
    id: "sonatubes",
    name: "Sonatubes (KN 3 Rd)",
    existence: "tbc",
    address: null,
    addressConfidence: "tbc",
    phone: null,
    hours: null,
    note: "Listed in a third-party map directory as REVOO Sonatubes, KN 3 Rd, Ubumwe. Not verified.",
  },
];
