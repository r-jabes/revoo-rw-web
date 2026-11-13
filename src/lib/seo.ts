import type { Metadata } from "next";
import { PROTOTYPE, SITE_URL } from "./flags";

export const SITE_NAME = "REVOO Rwanda";

export function buildMetadata({
  title,
  description,
  path = "/",
  noindex = false,
  ogImage,
}: {
  title?: string;
  description: string;
  path?: string;
  noindex?: boolean;
  /** Absolute or site-relative path to a share image */
  ogImage?: string;
}): Metadata {
  const full = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: Move Beyond. Electric two-wheelers`;
  const url = `${SITE_URL}${path}`;
  const image = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${SITE_URL}${ogImage}`
    : undefined;
  // Prototype pitch stays out of search indexes until launch.
  const block = noindex || PROTOTYPE;

  return {
    title: full,
    description,
    alternates: { canonical: path },
    robots: block ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: full,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_RW",
      type: "website",
      ...(image ? { images: [{ url: image, alt: full }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: full,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
