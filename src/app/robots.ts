import type { MetadataRoute } from "next";
import { PROTOTYPE, SITE_URL } from "@/lib/flags";

export default function robots(): MetadataRoute.Robots {
  // Prototype pitch: discourage indexing until launch. Flip PROTOTYPE off to allow.
  if (PROTOTYPE) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
      host: SITE_URL,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/styleguide", "/legal/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
