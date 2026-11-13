import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { MOTION_BOOT } from "@/lib/motion-boot";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/flags";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

// Display: variable weight + width axis (condensed headlines, expanded labels).
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata({
    description:
      "REVOO electric two-wheelers in Rwanda. Electric mobility designed for the next generation of movement. Design concept prototype.",
  }),
};

export const viewport: Viewport = {
  themeColor: "#f2f1ed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the boot script adds classes (js / rm / intro-seen) to <html>.
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Plain inline script (not next/script, whose beforeInteractive needs the client runtime): it must run before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body data-theme="light">
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
