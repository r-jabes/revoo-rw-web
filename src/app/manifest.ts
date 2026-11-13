import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "REVOO Rwanda",
    short_name: "REVOO",
    description: "Electric two-wheelers for the next generation of movement in Rwanda.",
    start_url: "/",
    display: "browser",
    background_color: "#f2f1ed",
    theme_color: "#f2f1ed",
    lang: "en-RW",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
