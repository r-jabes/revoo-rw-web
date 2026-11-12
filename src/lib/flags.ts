/**
 * Prototype mode shows "TBC / International spec" markers on any fact that
 * is not confirmed for REVOO Rwanda. Set NEXT_PUBLIC_PROTOTYPE=0 at launch
 * to hide markers (unconfirmed values must then be replaced or removed).
 */
export const PROTOTYPE = process.env.NEXT_PUBLIC_PROTOTYPE !== "0";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://revoo-rwanda.example";
