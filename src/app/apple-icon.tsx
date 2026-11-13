import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: REVOO green with condensed wordmark mark. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#00a74a",
          color: "#0e0f11",
          fontSize: 110,
          fontWeight: 800,
          fontFamily: "Arial Black, Arial, sans-serif",
          letterSpacing: "-0.06em",
        }}
      >
        R
      </div>
    ),
    { ...size },
  );
}
