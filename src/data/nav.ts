export interface NavItem {
  label: string;
  href: string;
  /** Short mono caption shown in the full-screen menu */
  caption?: string;
}

/*
 * "The Range" replaces the brief's "Motorcycles" label/route: REVOO's products
 * are step-through electric scooters, and the approved terminology is
 * "electric two-wheelers". See doc/IMPLEMENTATION_PLAN.md §7a.
 */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/", caption: "01" },
  { label: "Range", href: "/range", caption: "02" },
  { label: "Technology", href: "/technology", caption: "03" },
  { label: "About REVOO", href: "/about", caption: "04" },
  { label: "Support", href: "/support", caption: "05" },
  { label: "Contact", href: "/contact", caption: "06" },
];

export const primaryCta: NavItem = { label: "Book a test ride", href: "/contact#test-ride" };

export const legalNav: NavItem[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
];
