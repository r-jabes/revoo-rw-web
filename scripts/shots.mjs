/**
 * Dev tool: section-by-section screenshots with true viewport emulation + console error capture.
 *
 *   node scripts/shots.mjs --path / --width 1440 --height 900 --prefix d [--ids hero,showroom] [--max 3]
 *
 * Needs the dev server running (default http://localhost:3100) and Microsoft Edge installed.
 * Output: %TEMP%/revoo-shots/<prefix>-<id>-<n>.png  (+ prints any console errors)
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
const PORT = args.port ?? "3100";
const PAGE = args.path ?? "/";
const W = +(args.width ?? 1440);
const H = +(args.height ?? 900);
const PREFIX = args.prefix ?? "s";
const MAX = +(args.max ?? 3);
const IDS = (args.ids ?? "hero,discovery,showroom,engineering,charging,city,support,start").split(",");
const OUT = path.join(os.tmpdir(), "revoo-shots");
fs.mkdirSync(OUT, { recursive: true });

const edge = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));
if (!edge) throw new Error("Edge not found");

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
  });
const evalJs = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
await send("Page.navigate", { url: `http://localhost:${PORT}${PAGE}` });
await sleep(4500);

const total = await evalJs("document.documentElement.scrollHeight");
console.log(`viewport ${W}x${H}, page height ${total}`);

async function shot(name) {
  const r = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(OUT, name), Buffer.from(r.result.data, "base64"));
  console.log("→", path.join(OUT, name));
}

if (args.scrollId) {
  // --scrollId engineering --offset 330 [--eval "js to run first"] -> one screenshot
  if (args.eval) {
    await evalJs(args.eval);
    await sleep(500);
  }
  await evalJs(
    `(() => { const e = document.getElementById(${JSON.stringify(args.scrollId)}); window.scrollTo(0, e.getBoundingClientRect().top + scrollY + ${+(args.offset ?? 0)}); })()`,
  );
  await sleep(700);
  await shot(`${PREFIX}.png`);
} else if (args.scrollId) {
  // --scrollId engineering --offset 330 [--eval "js to run first"] -> one screenshot
  if (args.eval) {
    await evalJs(args.eval);
    await sleep(500);
  }
  await evalJs(
    `(() => { const e = document.getElementById(${JSON.stringify(args.scrollId)}); window.scrollTo(0, e.getBoundingClientRect().top + scrollY + ${+(args.offset ?? 0)}); })()`,
  );
  await sleep(700);
  await shot(`${PREFIX}.png`);
} else if (args.scrollTo) {
  await evalJs(`window.scrollTo(0, ${+args.scrollTo})`);
  await sleep(700);
  await shot(`${PREFIX}-y${args.scrollTo}.png`);
} else {
  for (const sid of IDS) {
    const box = await evalJs(
      `(() => { const e = document.getElementById(${JSON.stringify(sid)}); if (!e) return null; const r = e.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; })()`,
    );
    if (!box) {
      console.log("skip (no element)", sid);
      continue;
    }
    const slices = Math.min(MAX, Math.max(1, Math.ceil(box.h / H)));
    for (let n = 0; n < slices; n++) {
      await evalJs(`window.scrollTo(0, ${Math.round(box.top + n * H)})`);
      await sleep(650);
      await shot(`${PREFIX}-${sid}-${n + 1}.png`);
    }
  }
}

console.log(problems.length ? "PROBLEMS:\n" + [...new Set(problems)].join("\n") : "No console errors or warnings.");
ws.close();
proc.kill();
setTimeout(() => process.exit(0), 300);
