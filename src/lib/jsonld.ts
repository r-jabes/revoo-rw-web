/**
 * JSON-LD builders. Only verified or clearly international fields —
 * never invent addresses, phones, prices or availability.
 */
import { facts } from "@/data/facts";
import { locations } from "@/data/locations";
import { models, type Model } from "@/data/models";
import { SITE_URL } from "./flags";

const SITE_NAME = "REVOO Rwanda";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: facts.brand.positioning,
    slogan: "Move beyond.",
    sameAs: facts.rwanda.instagram.value ? [facts.rwanda.instagram.value] : undefined,
    brand: {
      "@type": "Brand",
      name: facts.brand.name,
    },
  };
}

/** Remera only — existence confirmed; address/phone omitted until supplied. */
export function localBusinessJsonLd() {
  const remera = locations.find((l) => l.id === "remera");
  if (!remera || remera.existence !== "confirmed-rw") return null;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `REVOO ${remera.name}`,
    url: `${SITE_URL}/contact`,
    description: remera.note,
    parentOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    sameAs: facts.rwanda.instagram.value ? [facts.rwanda.instagram.value] : undefined,
    areaServed: {
      "@type": "City",
      name: "Kigali",
    },
  };
}

export function productJsonLd(model: Model) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `REVOO ${model.code}`,
    description: `${model.tagline}. ${model.intro}`,
    sku: model.code,
    brand: {
      "@type": "Brand",
      name: facts.brand.name,
    },
    url: `${SITE_URL}/range/${model.slug}`,
    category: "Electric two-wheeler",
    // No Offer — Rwanda pricing unconfirmed
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: facts.brand.positioning,
    inLanguage: "en-RW",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** All models as an ItemList for /range */
export function rangeItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "REVOO electric two-wheeler range",
    itemListElement: models.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/range/${m.slug}`,
      name: `REVOO ${m.code}`,
    })),
  };
}
