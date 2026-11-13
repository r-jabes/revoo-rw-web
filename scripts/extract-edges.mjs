/**
 * Blueprint linework generator.
 *
 *   npm run edges
 *
 * Derives line art from an OFFICIAL cleaned render (public/images/models/<id>-<w>.webp)
 * so the blueprint matches REVOO's real silhouette pixel-for-pixel. Nothing is redrawn
 * or invented: it is edge detection (Sobel on luminance + silhouette alpha).
 *
 * Output: public/images/derived/<id>-lines.webp  (lines in `tint` colour, alpha = line strength)
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "derived");

const JOBS = [
  {
    id: "revoo-a12-side-red",
    from: "public/images/models/revoo-a12-side-red-2400.webp",
    width: 2000,
    // tuned by eye on the A12 render; raise `lo` for fewer fine details
    lo: 14,
    hi: 70,
    silhouette: 1.0,
    clahe: 6,
    // line colour baked in (brand paper #f2f1ed): the blueprint is drawn as SVG <image>
    // groups so wheels/body can be exploded; SVG cannot tint a raster with CSS.
    tint: [242, 241, 237],
  },
];

async function process_(job) {
  const src = path.join(ROOT, job.from);
  const base = sharp(src).resize({ width: job.width, kernel: "lanczos3" }).ensureAlpha();
  const { data: rgba, info } = await base.clone().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  // Local-contrast equalise (CLAHE) on the greyscale bike over black, so dark bodywork
  // detail (tyres, rims, panel seams) produces usable edges.
  const grey = await base
    .clone()
    .flatten({ background: "#000000" })
    .greyscale()
    .clahe({ width: 96, height: 96, maxSlope: job.clahe ?? 6 })
    .raw()
    .toBuffer();

  // luminance (premultiplied by alpha, so transparent areas are flat) + alpha plane
  const lum = new Float32Array(w * h);
  const alp = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const a = rgba[i * 4 + 3] / 255;
    lum[i] = grey[i] * a;
    alp[i] = a * 255;
  }

  // light 3x3 box blur on luminance to suppress raster noise
  const blur = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let s = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += lum[(y + dy) * w + x + dx];
      blur[y * w + x] = s / 9;
    }
  }

  const sobel = (p, x, y) => {
    const i = y * w + x;
    const gx =
      -p[i - w - 1] + p[i - w + 1] - 2 * p[i - 1] + 2 * p[i + 1] - p[i + w - 1] + p[i + w + 1];
    const gy =
      -p[i - w - 1] - 2 * p[i - w] - p[i - w + 1] + p[i + w - 1] + 2 * p[i + w] + p[i + w + 1];
    return Math.hypot(gx, gy) / 4;
  };

  const tint = job.tint ?? [255, 255, 255];
  const out = Buffer.alloc(w * h * 4);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const m = Math.max(sobel(blur, x, y), sobel(alp, x, y) * job.silhouette);
      const t = Math.min(1, Math.max(0, (m - job.lo) / (job.hi - job.lo)));
      out[i * 4] = tint[0];
      out[i * 4 + 1] = tint[1];
      out[i * 4 + 2] = tint[2];
      out[i * 4 + 3] = Math.round(t * t * (3 - 2 * t) * 255); // smoothstep
    }
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  const file = path.join(OUT_DIR, `${job.id}-lines.webp`);
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 86, alphaQuality: 90, effort: 5 })
    .toFile(file);
  const { size } = await fs.stat(file);
  console.log(`✓ derived/${job.id}-lines.webp  ${w}x${h}  ${(size / 1024).toFixed(0)} KB`);
}

for (const job of JOBS) await process_(job);
