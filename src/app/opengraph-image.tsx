import { ImageResponse } from "next/og";

export const alt = "REVOO Rwanda — Move beyond. Electric two-wheelers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph card for pages without a dedicated image. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f2f1ed",
          color: "#0e0f11",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 18, height: 18, background: "#00a74a" }} />
          REVOO Rwanda
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              maxWidth: 900,
            }}
          >
            Move beyond.
          </div>
          <div style={{ fontSize: 28, color: "#5a5d63", maxWidth: 720, lineHeight: 1.35 }}>
            Electric two-wheelers for Kigali. Design concept prototype.
          </div>
        </div>
        <div style={{ fontSize: 20, letterSpacing: "0.14em", textTransform: "uppercase", color: "#007a36" }}>
          Electric mobility
        </div>
      </div>
    ),
    { ...size },
  );
}
