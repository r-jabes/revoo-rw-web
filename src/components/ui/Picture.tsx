import { srcSets, type AssetDef } from "@/data/assets";

interface PictureProps {
  asset: AssetDef;
  /** CSS `sizes` attribute, e.g. "(min-width:1024px) 60vw, 100vw" */
  sizes: string;
  /** LCP image: eager + high fetch priority */
  priority?: boolean;
  alt?: string;
  className?: string;
  imgClassName?: string;
}

/**
 * Responsive AVIF/WebP picture driven by the asset registry.
 * Width/height come from the manifest, so layout never shifts.
 */
export function Picture({ asset, sizes, priority, alt, className, imgClassName }: PictureProps) {
  const s = srcSets(asset);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={s.avif} sizes={sizes} />
      <source type="image/webp" srcSet={s.webp} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={s.fallback}
        srcSet={s.webp}
        sizes={sizes}
        width={s.width}
        height={s.height}
        alt={alt ?? asset.alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
        className={imgClassName ?? "h-auto w-full"}
      />
    </picture>
  );
}
