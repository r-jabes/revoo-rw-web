/**
 * Verify every registered image exists on disk and that hero AVIFs stay in budget.
 *
 *   node scripts/image-check.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "src/data/image-manifest.json"), "utf8"));

const HERO_AVIF_BUDGET = 220 * 1024; // 220 KB at ~1600w (plan §6)
const problems = [];
const ok = [];

for (const [id, entry] of Object.entries(manifest)) {
  const base = path.join(publicDir, "images", entry.group, id);
  for (const w of entry.widths) {
    for (const ext of ["avif", "webp"]) {
      const file = `${base}-${w}.${ext}`;
      if (!fs.existsSync(file)) {
        problems.push(`MISSING ${path.relative(root, file)}`);
        continue;
      }
      const size = fs.statSync(file).size;
      ok.push(`${path.relative(root, file)} ${(size / 1024).toFixed(1)}KB`);
      if (ext === "avif" && w >= 1600 && w <= 1700 && size > HERO_AVIF_BUDGET) {
        problems.push(`OVER BUDGET ${path.relative(root, file)} ${(size / 1024).toFixed(1)}KB > 220KB`);
      }
    }
  }
}

// Derived + brand assets referenced outside the manifest
const extras = [
  "images/brand/revoo-wordmark-white.svg",
  "images/brand/revoo-wordmark-dark.svg",
  "images/derived/revoo-a12-side-red-lines.webp",
];
for (const rel of extras) {
  const file = path.join(publicDir, rel);
  if (!fs.existsSync(file)) problems.push(`MISSING ${rel}`);
  else ok.push(`${rel} ${(fs.statSync(file).size / 1024).toFixed(1)}KB`);
}

console.log(`Checked ${ok.length} image file(s).`);
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  problems.forEach((p) => console.log("  " + p));
  process.exitCode = 1;
} else {
  console.log("All registered images present. AVIF budgets OK.");
  // Print largest AVIFs for the report
  const avifs = ok
    .filter((l) => l.includes(".avif"))
    .map((l) => {
      const m = l.match(/^(.*) ([\d.]+)KB$/);
      return m ? { file: m[1], kb: +m[2] } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.kb - a.kb)
    .slice(0, 6);
  console.log("\nLargest AVIFs:");
  avifs.forEach((a) => console.log(`  ${a.kb.toFixed(1)}KB  ${a.file}`));
}
