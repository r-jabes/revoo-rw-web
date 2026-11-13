/**
 * Phase 7 QA harness (Edge CDP):
 *   - screenshot matrix at 1920 / 1440 / 1024 / 768 / 390
 *   - console / page error capture
 *   - approximate CWV (LCP, CLS) via PerformanceObserver
 *
 *   node scripts/qa.mjs [--port 3001] [--out %TEMP%/revoo-qa]
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
const OUT = arg("out", path.join(os.tmpdir(), "revoo-qa"));
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { w: 1920, h: 1080, name: "1920" },
  { w: 1440, h: 900, name: "1440" },
  { w: 1024, h: 768, name: "1024" },
  { w: 768, h: 1024, name: "768" },
  { w: 390, h: 844, name: "390" },
];

const PAGES = [
  { path: "/", id: "home", waitMs: 2500 },
  { path: "/range", id: "range", waitMs: 1500 },
  { path: "/range/a12", id: "a12", waitMs: 1500 },
  { path: "/contact", id: "contact", waitMs: 1200 },
];

const edge = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));
if (!edge) throw new Error("Edge not found");

const DEBUG = 9500 + Math.floor(Math.random() * 200);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "revoo-qa-"));
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
const consoleIssues = [];

ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method === "Runtime.exceptionThrown") {
    consoleIssues.push({
      type: "exception",
      text: msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text,
    });
  } else if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
    consoleIssues.push({
      type: msg.params.type,
      text: msg.params.args.map((a) => a.value ?? a.description).join(" ").slice(0, 400),
    });
  } else if (msg.method === "Log.entryAdded" && ["error", "warning"].includes(msg.params.entry.level)) {
    consoleIssues.push({
      type: "log-" + msg.params.entry.level,
      text: `${msg.params.entry.text} ${msg.params.entry.url ?? ""}`.trim(),
    });
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
await send("Log.enable");
await send("Network.enable");

// Install CWV observers before every document so buffered entries are not missed.
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `(() => {
    window.__cwv = { lcp: null, cls: 0 };
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__cwv.lcp = e.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cwv.cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
      // Fallback entryTypes form for older Chromium builds
      try {
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) window.__cwv.lcp = e.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'], buffered: true });
      } catch (_) {}
    } catch (e) {}
  })()`,
});

const report = { generatedAt: new Date().toISOString(), origin: ORIGIN, pages: [], consoleIssues: [] };

async function measure(pagePath) {
  await send("Page.navigate", { url: ORIGIN + pagePath });
  await sleep(200);
}

async function readCwv() {
  const r = await send("Runtime.evaluate", {
    expression: `(() => {
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      const lcp = window.__cwv?.lcp ?? (lcpEntries.length ? lcpEntries[lcpEntries.length - 1].startTime : null);
      const nav = performance.getEntriesByType('navigation')[0];
      return JSON.stringify({
        lcp,
        cls: window.__cwv?.cls ?? 0,
        nav: nav ? {
          domContentLoaded: nav.domContentLoadedEventEnd,
          load: nav.loadEventEnd,
          transferSize: nav.transferSize
        } : null
      });
    })()`,
    returnByValue: true,
  });
  return JSON.parse(r.result.value);
}

for (const page of PAGES) {
  const before = consoleIssues.length;
  const entry = { path: page.path, id: page.id, shots: [], cwv: null, consoleDelta: [] };

  // Primary CWV pass at 1440 (desktop) and 390 (mobile)
  for (const vp of [
    { w: 1440, h: 900, label: "desktop" },
    { w: 390, h: 844, label: "mobile" },
  ]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.w < 768,
    });
    await measure(page.path);
    await sleep(page.waitMs);
    // Scroll a bit to accumulate CLS from below-fold
    await send("Runtime.evaluate", {
      expression: `window.scrollTo(0, Math.min(document.body.scrollHeight * 0.35, 1200))`,
    });
    await sleep(600);
    await send("Runtime.evaluate", { expression: `window.scrollTo(0, 0)` });
    await sleep(400);
    const cwv = await readCwv();
    entry.cwv = entry.cwv || {};
    entry.cwv[vp.label] = cwv;
  }

  // Screenshot matrix (above-the-fold)
  for (const vp of VIEWPORTS) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: vp.w <= 768,
    });
    await measure(page.path);
    await sleep(Math.min(page.waitMs, 1800));
    const shot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
    const file = path.join(OUT, `${page.id}-${vp.name}.png`);
    fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
    entry.shots.push(file);
  }

  entry.consoleDelta = consoleIssues.slice(before);
  report.pages.push(entry);
}

report.consoleIssues = consoleIssues;

const reportPath = path.join(OUT, "report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

// Human summary
console.log(`QA output → ${OUT}`);
console.log(`Report → ${reportPath}\n`);

let cwvFail = 0;
for (const p of report.pages) {
  console.log(`## ${p.path}`);
  for (const [label, m] of Object.entries(p.cwv || {})) {
    const lcp = m.lcp != null ? `${(m.lcp / 1000).toFixed(2)}s` : "n/a";
    const cls = m.cls != null ? m.cls.toFixed(3) : "n/a";
    const lcpOk = m.lcp == null || m.lcp <= 2500;
    const clsOk = m.cls == null || m.cls < 0.05;
    if (!lcpOk || !clsOk) cwvFail++;
    console.log(
      `  ${label}: LCP ${lcp}${lcpOk ? "" : " ⚠"} · CLS ${cls}${clsOk ? "" : " ⚠"} · shots ${p.shots.length}`,
    );
  }
  const noise = p.consoleDelta.filter(
    (c) => !/favicon\.ico|Download the React DevTools|Deprecated API for given entry type/i.test(c.text || ""),
  );
  if (noise.length) {
    console.log(`  console (${noise.length}):`);
    noise.slice(0, 5).forEach((c) => console.log(`    [${c.type}] ${c.text.slice(0, 160)}`));
  } else {
    console.log("  console: clean");
  }
}

const budgets =
  `Budgets: LCP ≤ 2.5s, CLS < 0.05 (headless Edge, unthrottled — indicative, not field data).`;
console.log(`\n${budgets}`);
console.log(cwvFail ? `${cwvFail} CWV reading(s) outside budget.` : "CWV readings within budget (indicative).");

proc.kill();
try {
  fs.rmSync(profile, { recursive: true, force: true });
} catch {}

process.exitCode = 0; // report, don't fail the phase on headless variance
