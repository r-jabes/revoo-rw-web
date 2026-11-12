import { assets } from "@/data/assets";

/**
 * Official REVOO wordmark, rendered as a CSS mask of the official SVG so it
 * takes the current text colour (currentColor) and stays pixel-exact.
 */
export function Logo({ className = "", height = 22 }: { className?: string; height?: number }) {
  const url = `url(${assets.brand.wordmarkWhite})`;
  return (
    <span
      role="img"
      aria-label="REVOO"
      className={`inline-block bg-current ${className}`}
      style={{
        height,
        width: (height * 156) / 26,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    />
  );
}
