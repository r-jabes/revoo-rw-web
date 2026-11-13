/**
 * Lightweight accessibility smoke check via Edge CDP + axe-core (CDN).
 *
 *   node scripts/a11y-check.mjs [--port 3001] [--paths /, /range, /contact]
 *
 * Reports serious/critical axe violations. Exit 1 if any are found.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
};

const PORT = arg("port", "3001");
const ORIGIN = `http://localhost:${PORT}`;
const PATHS = (arg("paths", "/,/range,/range/a12,/technology,/about,/support,/contact") || "")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

const edge = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));
if (!edge) throw new Error("Edge not found");

const DEBUG = 9400 + Math.floor(Math.random() * 200);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "revoo-a11y-"));
const proc = spawn(
  edge,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${DEBUG}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWs() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${DEBUG}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Edge debugger not reachable");
}

const ws = new WebSocket(await getWs());
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, (msg) => (msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send("Runtime.enable");
await send("Page.enable");

async function runAxe(pagePath) {
  const url = ORIGIN + pagePath;
  await send("Page.navigate", { url });
  await send("Page.loadEventFired").catch(() => {});
  await sleep(1200);

  // Inject axe from CDN
  await send("Runtime.evaluate", {
    expression: `(() => new Promise((resolve, reject) => {
      if (window.axe) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
      s.onload = () => resolve(true);
      s.onerror = () => reject(new Error('axe load failed'));
      document.head.appendChild(s);
    }))()`,
    awaitPromise: true,
  });

  const result = await send("Runtime.evaluate", {
    expression: `axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
      resultTypes: ['violations']
    }).then(r => JSON.stringify({
      violations: r.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
        targets: v.nodes.slice(0, 3).map(n => n.target)
      }))
    }))`,
    awaitPromise: true,
    returnByValue: true,
  });

  const parsed = JSON.parse(result.result.value);
  return { path: pagePath, ...parsed };
}

const all = [];
for (const p of PATHS) {
  try {
    all.push(await runAxe(p));
  } catch (e) {
    all.push({ path: p, error: String(e.message || e) });
  }
}

proc.kill();
try {
  fs.rmSync(profile, { recursive: true, force: true });
} catch {}

let fail = 0;
for (const r of all) {
  console.log(`\n## ${r.path}`);
  if (r.error) {
    console.log("  ERROR", r.error);
    fail++;
    continue;
  }
  const serious = (r.violations || []).filter((v) => v.impact === "critical" || v.impact === "serious");
  const other = (r.violations || []).filter((v) => v.impact !== "critical" && v.impact !== "serious");
  if (!r.violations?.length) console.log("  clean");
  for (const v of serious) {
    fail++;
    console.log(`  FAIL [${v.impact}] ${v.id}: ${v.help} (${v.nodes} nodes)`);
    v.targets?.forEach((t) => console.log("       ", JSON.stringify(t)));
  }
  for (const v of other) {
    console.log(`  note [${v.impact ?? "n/a"}] ${v.id}: ${v.help} (${v.nodes})`);
  }
}

console.log(`\n${fail ? fail + " serious/critical violation(s)" : "No serious/critical violations."}`);
process.exitCode = fail ? 1 : 0;
