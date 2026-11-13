export const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);

export const qsa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/**
 * Devices where the expensive extras (wheel-disc overlay, iris clip-path) are skipped.
 * Heuristic only: Safari exposes neither signal, so it counts as capable.
 */
export function isLowPower() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
}

/** Dev-only handle so screenshots/tests can scrub timelines deterministically. */
export function expose(name: string, value: unknown) {
  if (process.env.NODE_ENV === "production") return;
  const w = window as unknown as { __revoo?: Record<string, unknown> };
  w.__revoo = { ...w.__revoo, [name]: value };
}

/** Add a class to <html> (motion contract flags, see styles/motion.css). */
export const flag = (name: string) => document.documentElement.classList.add(name);
export const hasFlag = (name: string) => document.documentElement.classList.contains(name);
