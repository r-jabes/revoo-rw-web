/**
 * REVOO image pipeline.
 *
 *   npm run images
 *
 * Reads originals from  assets-src/<group>/<id>.src.(png|jpg|jpeg)
 * Writes responsive AVIF + WebP to  public/images/<group>/<id>-<width>.(avif|webp)
 * Writes metadata (size, blur placeholder) to  src/data/image-manifest.json
 *
 * Cut-out renders ("cutout": true) are cleaned:
 *   - baked reflection / ground shadow is removed (the site renders its own shadow)
 *   - the canvas is trimmed to the bike with a small safe margin
 *
 * Replacing an image = drop a new .src file with the same id and re-run this script.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "assets-src");
const OUT = path.join(ROOT, "public", "images");
const MANIFEST = path.join(ROOT, "src", "data", "image-manifest.json");

/** @type {{id:string; group:string; cutout?:boolean; widths:number[]; pad?:number}[]} */
const JOBS = [
  { id: "revoo-a12-side-red", group: "models", cutout: true, widths: [900, 1600, 2400, 3200], pad: 24 },
  { id: "revoo-a11-side-white", group: "models", cutout: true, widths: [900, 1600, 2400, 3200], pad: 24 },
  { id: "revoo-c35y-side-red", group: "models", cutout: true, widths: [900, 1600, 1800], pad: 24 },
];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function findSource(group, id) {
  for (const ext of ["png", "jpg", "jpeg"]) {
    const p = path.join(SRC, group, `${id}.src.${ext}`);
    if (await exists(p)) return p;
  }
  throw new Error(`Missing source for ${group}/${id}`);
}

/** Remove soft baked shadows: keep alpha only near solid (alpha>=250) pixels. */
async function cleanCutout(file) {
  const base = sharp(file).ensureAlpha();
  const { width: w, height: h } = await base.metadata();
  const rgba = await base.raw().toBuffer();

  // Solid mask -> dilate so anti-aliased edges survive.
  const solid = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) solid[i] = rgba[i * 4 + 3] >= 250 ? 255 : 0;
  const dilated = await sharp(solid, { raw: { width: w, height: h, channels: 1 } })
    .dilate(7)
    .extractChannel(0) // sharp promotes to 3 channels after dilate; keep one
    .raw()
    .toBuffer();
  if (dilated.length !== w * h) throw new Error(`Unexpected mask size ${dilated.length} vs ${w * h}`);

  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (dilated[i] === 0) {
        rgba[i * 4 + 3] = 0;
      } else if (rgba[i * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { rgba, w, h, bbox: { minX, minY, maxX, maxY } };
}

async function run() {
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  const manifest = {};

  for (const job of JOBS) {
    const srcFile = await findSource(job.group, job.id);
    const outDir = path.join(OUT, job.group);
    await fs.mkdir(outDir, { recursive: true });

    let pipeline;
    let meta = {};

    if (job.cutout) {
      const { rgba, w, h, bbox } = await cleanCutout(srcFile);
      const pad = job.pad ?? 16;
      const left = Math.max(0, bbox.minX - pad);
      const top = Math.max(0, bbox.minY - pad);
      const right = Math.min(w - 1, bbox.maxX + pad);
      const bottom = Math.min(h - 1, bbox.maxY + pad);
      const cw = right - left + 1;
      const ch = bottom - top + 1;
      pipeline = sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).extract({
        left,
        top,
        width: cw,
        height: ch,
      });
      meta = { width: cw, height: ch, trimmedFrom: { w, h, left, top } };
    } else {
      const m = await sharp(srcFile).metadata();
      pipeline = sharp(srcFile);
      meta = { width: m.width, height: m.height };
    }

    // Materialise the trimmed master once, so every size is derived from the same pixels.
    const master = await pipeline.png().toBuffer();

    const written = [];
    for (const target of job.widths) {
      const width = Math.min(target, meta.width);
      if (written.includes(width)) continue;
      const resized = sharp(master).resize({ width, withoutEnlargement: true, kernel: "lanczos3" });
      await resized.clone().avif({ quality: 60, effort: 5 }).toFile(path.join(outDir, `${job.id}-${width}.avif`));
      await resized.clone().webp({ quality: 82, effort: 5 }).toFile(path.join(outDir, `${job.id}-${width}.webp`));
      written.push(width);
    }

    // Tiny blur placeholder (WebP data URL, keeps alpha).
    const blur = await sharp(master).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();

    manifest[job.id] = {
      group: job.group,
      width: meta.width,
      height: meta.height,
      ratio: +(meta.width / meta.height).toFixed(4),
      widths: written,
      blur: `data:image/webp;base64,${blur.toString("base64")}`,
      ...(meta.trimmedFrom ? { trimmedFrom: meta.trimmedFrom } : {}),
    };
    console.log(`✓ ${job.group}/${job.id}  ${meta.width}x${meta.height}  [${written.join(", ")}]`);
  }

  // Brand SVGs are copied as-is.
  const brandOut = path.join(OUT, "brand");
  await fs.mkdir(brandOut, { recursive: true });
  for (const f of await fs.readdir(path.join(SRC, "brand"))) {
    await fs.copyFile(path.join(SRC, "brand", f), path.join(brandOut, f));
  }

  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Manifest written: ${path.relative(ROOT, MANIFEST)}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
