import type { Metadata } from "next";
import { SITE_URL } from "./flags";

const SITE_NAME = "REVOO Rwanda";

export function buildMetadata({
  title,
  description,
  path = "/",
  noindex = false,
}: {
  title?: string;
  description: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  const full = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: Move Beyond. Electric two-wheelers`;
  return {
    title: full,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: full,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      locale: "en_RW",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: full, description },
  };
}
