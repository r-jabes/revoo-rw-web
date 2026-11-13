/**
 * Broken-link crawl for the REVOO prototype.
 *
 *   node scripts/crawl.mjs [--port 3001] [--origin http://localhost:3001]
 *
 * Starts from every known App Router path, follows same-origin <a href> links
 * (including hash-stripped paths), and reports non-2xx / unreachable targets.
 * External links are listed but not failed unless they 404 on a HEAD/GET.
 */
const ORIGIN = (process.argv.includes("--origin")
  ? process.argv[process.argv.indexOf("--origin") + 1]
  : null) ?? `http://localhost:${process.argv.includes("--port") ? process.argv[process.argv.indexOf("--port") + 1] : "3001"}`;

const SEEDS = [
  "/",
  "/range",
  "/range/a12",
  "/range/a11",
  "/range/c35y",
  "/range/e52",
  "/technology",
  "/about",
  "/support",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/styleguide",
  "/sitemap.xml",
  "/robots.txt",
  "/this-page-should-404",
];

function norm(href, base) {
  try {
    const u = new URL(href, base);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return { origin: u.origin, path: u.pathname, hash: u.hash, url: u.origin + u.pathname };
  } catch {
    return null;
  }
}

const visited = new Set();
const broken = [];
const external = [];
const ok = [];
const queue = [];

for (const s of SEEDS) {
  const n = norm(s, ORIGIN);
  if (n) queue.push(n.url);
}

async function fetchStatus(url) {
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: "GET", redirect: "follow" });
    }
    return res.status;
  } catch (e) {
    return `ERR ${e.cause?.code ?? e.message}`;
  }
}

while (queue.length) {
  const url = queue.shift();
  if (visited.has(url)) continue;
  visited.add(url);

  const status = await fetchStatus(url);
  const path = url.replace(ORIGIN, "") || "/";
  const expect404 = path === "/this-page-should-404";
  const fine = expect404 ? status === 404 : typeof status === "number" && status >= 200 && status < 400;

  if (fine) {
    ok.push(`${status} ${path}`);
  } else {
    broken.push(`${status} ${path}`);
  }

  if (!url.startsWith(ORIGIN) || expect404 || typeof status !== "number" || status >= 400) continue;

  const html = await (await fetch(url)).text();
  const re = /href\s*=\s*["']([^"'#]+(?:#[^"']*)?)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    const n = norm(m[1], url);
    if (!n) continue;
    if (n.origin !== new URL(ORIGIN).origin) {
      external.push(n.url);
      continue;
    }
    if (!visited.has(n.url) && !queue.includes(n.url)) queue.push(n.url);
  }
}

// Real external URLs only (skip metadataBase / Open Graph placeholders like *.example)
const extUnique = [...new Set(external)].filter((u) => !/\.example(\/|$)/i.test(u));
const skipped = [...new Set(external)].filter((u) => /\.example(\/|$)/i.test(u));
for (const url of extUnique) {
  const status = await fetchStatus(url);
  if (typeof status === "number" && status >= 400) broken.push(`${status} EXT ${url}`);
  else if (typeof status === "string") broken.push(`${status} EXT ${url}`);
  else ok.push(`${status} EXT ${url}`);
}
if (skipped.length) console.log(`Skipped ${skipped.length} placeholder external URL(s) (*.example).`);

console.log(`Crawled ${visited.size} same-origin URLs from ${ORIGIN}`);
console.log(`OK (${ok.length}):`);
ok.forEach((l) => console.log("  " + l));
if (broken.length) {
  console.log(`\nBROKEN (${broken.length}):`);
  broken.forEach((l) => console.log("  " + l));
  process.exitCode = 1;
} else {
  console.log("\nNo broken links.");
}
