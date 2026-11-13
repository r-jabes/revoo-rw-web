/**
 * Dev tool: verify the Phase 4 motion deterministically (headless Edge over CDP).
 *
 *   node scripts/motion-check.mjs --mode hero   [--frames 0.1,0.3,0.6,1] [--width 1440 --height 900] [--port 3001]
 *   node scripts/motion-check.mjs --mode intro
 *   node scripts/motion-check.mjs --mode scroll --ids hero,discovery,showroom,engineering,city
 *   node scripts/motion-check.mjs --mode eng    [--frames 0.05,0.2,0.4,0.55,0.7,0.8,0.9,1]
 *   node scripts/motion-check.mjs --mode rm      (prefers-reduced-motion: reduce)
 *   node scripts/motion-check.mjs --mode nojs    (scripts disabled: server HTML only)
 *   node scripts/motion-check.mjs --mode perf   [--cpu 4]  (rAF frame times while scrolling)
 *
 * Output: %TEMP%/revoo-shots/m-<mode>-*.png and console problems.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);
const PORT = args.port ?? "3001";
const MODE = args.mode ?? "hero";
const W = +(args.width ?? 1440);
const H = +(args.height ?? 900);
const OUT = path.join(os.tmpdir(), "revoo-shots");
fs.mkdirSync(OUT, { recursive: true });

const edge = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));
const DEBUG = 9333 + Math.floor(Math.random() * 300);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "revoo-edge-"));
const proc = spawn(
  edge,
  ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profile}`, "about:blank"],
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
const problems = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method === "Runtime.exceptionThrown") {
    problems.push("EXCEPTION " + (msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text));
  } else if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
    problems.push(msg.params.type.toUpperCase() + " " + msg.params.args.map((a) => a.value ?? a.description).join(" ").slice(0, 300));
  } else if (msg.method === "Log.entryAdded" && ["error", "warning"].includes(msg.params.entry.level)) {
    problems.push("LOG " + msg.params.entry.level + " " + msg.params.entry.text + " " + (msg.params.entry.url ?? ""));
  }
};
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const i = ++id;
    pending.set(i, resolve);
    ws.send(JSON.stringify({ id: i, method, params }));
    setTimeout(() => {
      if (pending.has(i)) {
        pending.delete(i);
        console.log("TIMEOUT", method);
        resolve({ error: "timeout" });
      }
    }, 20000);
  });
const evalJs = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) return "ERR " + (r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text);
  return r.result?.result?.value;
};
async function shot(name) {
  const r = await send("Page.captureScreenshot", { format: "png" });
  if (!r.result) return console.log("screenshot failed", name);
  const file = path.join(OUT, `m-${MODE}-${name}.png`);
  fs.writeFileSync(file, Buffer.from(r.result.data, "base64"));
  console.log("→", file);
}
async function waitFor(expr, ms = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (await evalJs(expr)) return true;
    await sleep(25);
  }
  return false;
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
if (MODE === "rm" || args.rm) await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
if (MODE === "blocked") {
  // JS boot ran (inline) but the app bundle never arrives: the watchdog must reveal everything
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["*/_next/static/chunks/*.js"] });
}
if (MODE === "nojs") await send("Emulation.setScriptExecutionDisabled", { value: true });
if (MODE === "entrance") {
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{sessionStorage.setItem('revoo:intro','1')}catch(e){}; (function(){var t=[],l=performance.now(),s=l;function k(n){t.push(n-l);l=n;if(n-s<4500)requestAnimationFrame(k);else{var a=t.slice(2).sort(function(x,y){return x-y});window.__ent={frames:a.length,avg:+(a.reduce(function(x,y){return x+y},0)/a.length).toFixed(1),p95:+a[Math.floor(a.length*.95)].toFixed(1),worst:+a[a.length-1].toFixed(1),over33:a.filter(function(x){return x>33.4}).length}}}requestAnimationFrame(k)})()" });
}
if (MODE === "nav" || MODE === "resize" || MODE === "eval") await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{sessionStorage.setItem('revoo:intro','1')}catch(e){}" });
if (MODE === "hero" || MODE === "eng" || MODE === "scroll" || MODE === "perf") {
  // skip the brand intro so tests start at the page
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "try{sessionStorage.setItem('revoo:intro','1')}catch(e){}" });
}
if (args.cores) await send("Emulation.setHardwareConcurrencyOverride", { hardwareConcurrency: +args.cores });
if ((MODE === "perf" || MODE === "entrance") && args.cpu && args.cpu !== "0") await send("Emulation.setCPUThrottlingRate", { rate: +(args.cpu ?? 4) });

await send("Page.navigate", { url: `http://localhost:${PORT}/` });

if (MODE === "intro") {
  for (const t of [120, 260, 260, 260, 400]) {
    await sleep(t);
    await shot(`t${Date.now() % 100000}`);
  }
  await sleep(3000);
  await shot("after");
} else if (MODE === "hero") {
  const ok = await waitFor("!!(window.__revoo && window.__revoo.hero)");
  console.log("hero timeline", ok);
  await evalJs("(() => { const t = window.__revoo.hero; t.pause(); t.eventCallback('onComplete', null); })()");
  const frames = (args.frames ?? "0.05,0.15,0.3,0.45,0.6,0.75,0.85,1").split(",").map(Number);
  for (const p of frames) {
    await evalJs(`(window.__revoo.hero.progress(${p}), 1)`);
    await sleep(250);
    await shot(`p${String(Math.round(p * 100)).padStart(3, "0")}`);
  }
} else if (MODE === "eng") {
  await sleep(3500);
  const frames = (args.frames ?? "0,0.12,0.3,0.45,0.55,0.62,0.72,0.8,0.9,1").split(",").map(Number);
  // park the section in view, then drive the timeline directly (deterministic, no scroll lag)
  await evalJs(`(() => { const s = document.querySelector('[data-eng-stage]'); const r = s.getBoundingClientRect(); window.scrollTo(0, r.top + scrollY - 120); })()`);
  await sleep(800);
  await evalJs("(() => { const t = window.__revoo.eng; t.scrollTrigger.disable(false); t.pause(); })()");
  for (const p of frames) {
    await evalJs(`(window.__revoo.eng.progress(${p}), 1)`);
    await sleep(250);
    await shot(`p${String(Math.round(p * 100)).padStart(3, "0")}`);
  }
} else if (MODE === "entrance") {
  // rAF deltas for the first 4.5 s after navigation (the hero entrance)
  await waitFor("!!window.__ent", 25000);
  console.log("entrance frames:", await evalJs("JSON.stringify(window.__ent)"));
} else if (MODE === "nav") {
  // client-side navigation away and back: triggers must not duplicate, nothing may throw
  await sleep(5500);
  const n0 = await evalJs("window.__revoo.ScrollTrigger.getAll().length");
  await evalJs("document.querySelector('a[href=\"/range\"]').click()");
  await sleep(2500);
  const mid = await evalJs("location.pathname + ' | ' + window.__revoo.ScrollTrigger.getAll().length");
  await evalJs("history.back()");
  await sleep(6500);
  const n1 = await evalJs("window.__revoo.ScrollTrigger.getAll().length");
  console.log("triggers first visit:", n0, "| on /range:", mid, "| after back:", n1);
  await evalJs("window.scrollTo(0, document.getElementById('engineering').getBoundingClientRect().top + scrollY + 300)");
  await sleep(1200);
  await shot("back-engineering");
} else if (MODE === "resize") {
  await sleep(6000);
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await sleep(2500);
  await shot("hero-after-shrink");
  const st = await evalJs("window.__revoo.ScrollTrigger.getAll().length");
  const vis = await evalJs("JSON.stringify([...document.querySelectorAll('[data-hero]')].map((e) => getComputedStyle(e).visibility + '/' + getComputedStyle(e).opacity).filter((v, i, a) => a.indexOf(v) === i))");
  console.log("triggers after resize:", st, "hero visibility/opacity set:", vis);
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(2500);
  await shot("hero-after-grow");
  console.log("triggers after grow:", await evalJs("window.__revoo.ScrollTrigger.getAll().length"));
} else if (MODE === "eval") {
  await sleep(7000);
  console.log(await evalJs(args.js));
} else if (MODE === "probe") {
  await sleep(3500);
  await evalJs(`(() => { const s = document.querySelector('[data-eng-stage]'); const r = s.getBoundingClientRect(); window.scrollTo(0, r.top + scrollY - 120); })()`);
  await sleep(800);
  await evalJs("(() => { const t = window.__revoo.eng; t.scrollTrigger.disable(false); t.pause(); t.progress(0.72); return 1; })()");
  await sleep(300);
  console.log(await evalJs(`JSON.stringify((() => { const q = (n) => document.querySelector('[data-eng="' + n + '"]'); const o = {}; for (const n of ["front","rear","body","battery","controller"]) { const e = q(n); o[n] = { tf: e.getAttribute("transform"), vis: getComputedStyle(e).visibility, op: getComputedStyle(e).opacity, mask: e.getAttribute("mask") }; } o.markers = [...document.querySelectorAll('[data-eng="marker"]')].map((e) => e.textContent + ":" + getComputedStyle(e).opacity + "/" + getComputedStyle(e).visibility + "/" + e.style.cssText.slice(0, 60)); o.t = window.__revoo.eng.time(); return o; })())`));
} else if (MODE === "scroll") {
  await sleep(3500);
  const ids = (args.ids ?? "hero,discovery,showroom,engineering,city").split(",");
  for (const sid of ids) {
    const box = await evalJs(`(() => { const e = document.getElementById(${JSON.stringify(sid)}); const r = e.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; })()`);
    const steps = sid === "engineering" ? [-250, 100, 350, 600] : [-300, 0, 300];
    for (const off of steps) {
      await evalJs(`window.scrollTo(0, ${Math.round(box.top + off)})`);
      await sleep(1300);
      await shot(`${sid}-${off}`);
    }
  }
} else if (MODE === "perf") {
  await sleep(3500);
  await send("Performance.enable");
  const m0 = Object.fromEntries(((await send("Performance.getMetrics")).result?.metrics ?? []).map((m) => [m.name, m.value]));
  const total = await evalJs("document.documentElement.scrollHeight - innerHeight");
  const result = await evalJs(`(async () => {
    const times = [];
    let last = performance.now();
    let running = true;
    const ys = [];
    const tick = (t) => { times.push(t - last); ys.push(window.scrollY); last = t; if (running) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    const total = ${total};
    const dur = 9000, t0 = performance.now();
    await new Promise((res) => {
      const step = () => {
        const p = Math.min(1, (performance.now() - t0) / dur);
        window.scrollTo(0, total * p);
        p < 1 ? requestAnimationFrame(step) : res();
      };
      step();
    });
    running = false;
    const secs = [...document.querySelectorAll("section[id]")].map((s) => ({ id: s.id, top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight }));
    const per = {};
    times.forEach((dt, i) => { if (i < 2) return; const y = ys[i] + innerHeight * 0.5; const s = secs.find((s) => y >= s.top && y < s.top + s.h); const k = s ? s.id : "other"; (per[k] ||= []).push(dt); });
    window.__per = Object.fromEntries(Object.entries(per).map(([k, a]) => [k, { n: a.length, avg: +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(1), over33: a.filter((x) => x > 33.4).length }]));
    const t = times.slice(2).sort((a, b) => a - b);
    const pct = (q) => t[Math.min(t.length - 1, Math.floor(t.length * q))];
    return { frames: t.length, avg: +(t.reduce((a, b) => a + b, 0) / t.length).toFixed(1), p50: +pct(0.5).toFixed(1), p95: +pct(0.95).toFixed(1), p99: +pct(0.99).toFixed(1), worst: +t[t.length - 1].toFixed(1), over33: t.filter((x) => x > 33.4).length };
  })()`);
  console.log("scroll frame times (ms):", JSON.stringify(result));
  const m1 = Object.fromEntries(((await send("Performance.getMetrics")).result?.metrics ?? []).map((m) => [m.name, m.value]));
  const d = (k) => +(((m1[k] ?? 0) - (m0[k] ?? 0)) * 1000).toFixed(0);
  console.log("main-thread ms during 9 s scroll:", JSON.stringify({ script: d("ScriptDuration"), layout: d("LayoutDuration"), style: d("RecalcStyleDuration"), task: d("TaskDuration") }));
  console.log("by section:", JSON.stringify(await evalJs("window.__per")));
} else {
  // rm / nojs / blocked: final-state checks
  await sleep(MODE === "blocked" ? 6500 : 3500);
  await shot("hero");
  const state = await evalJs(`(() => {
    const hidden = [...document.querySelectorAll('[data-pre]')].filter((e) => getComputedStyle(e).visibility === 'hidden' || +getComputedStyle(e).opacity < 1).length;
    const intro = getComputedStyle(document.querySelector('[data-intro]')).display;
    return { htmlClass: document.documentElement.className.replace(/__[^ ]+/g, '').trim(), hiddenPreElements: hidden, introDisplay: intro };
  })()`);
  console.log("state:", JSON.stringify(state));
  for (const sid of ["engineering", "city"]) {
    await evalJs(`window.scrollTo(0, document.getElementById(${JSON.stringify(sid)}).getBoundingClientRect().top + scrollY + 250)`);
    await sleep(900);
    await shot(sid);
  }
}

console.log(problems.length ? "PROBLEMS:\n" + [...new Set(problems)].join("\n") : "No console errors or warnings.");
ws.close();
proc.kill();
setTimeout(() => process.exit(0), 300);
