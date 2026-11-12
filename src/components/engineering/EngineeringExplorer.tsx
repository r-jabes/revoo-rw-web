"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Plus } from "@/components/ui/Icons";
import { Tag } from "@/components/ui/Tag";
import { engineering } from "@/data/home";
import { BlueprintStage } from "./BlueprintStage";

/**
 * Static-first component explorer: blueprint + numbered accordion.
 * Selecting a row or a marker highlights the part. Phase 4 adds the
 * drawn-in linework, exploded offsets and reassembly on top of this.
 */
export function EngineeringExplorer() {
  const [activeId, setActiveId] = useState(engineering[0].id);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const last = engineering.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    if (e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    btnRefs.current[engineering[next].id]?.focus();
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <figure className="lg:sticky lg:top-24 lg:col-span-7 lg:self-start">
        <BlueprintStage components={engineering} activeId={activeId} onSelect={setActiveId} />
        <figcaption className="t-label mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 text-[0.625rem] text-[color:var(--muted)]">
          <span>Fig. 01 · A12 side elevation · not to scale</span>
          <span>Linework traced from the official REVOO render</span>
        </figcaption>
      </figure>

      <ul className="lg:col-span-5 lg:col-start-8">
        {engineering.map((c, i) => {
          const open = c.id === activeId;
          return (
            <li key={c.id} className="border-t border-[color:var(--line)] last:border-b">
              <h3>
                <button
                  ref={(el) => {
                    btnRefs.current[c.id] = el;
                  }}
                  type="button"
                  id={`eng-tab-${c.id}`}
                  aria-expanded={open}
                  aria-controls={`eng-panel-${c.id}`}
                  onClick={() => setActiveId(c.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="group flex w-full items-baseline gap-5 py-5 text-left"
                >
                  <span
                    className={`t-label w-6 shrink-0 transition-colors ${
                      open ? "text-[color:var(--accent-text)]" : "text-[color:var(--muted)]"
                    }`}
                  >
                    {c.index}
                  </span>
                  <span
                    className={`t-h3 flex-1 transition-colors duration-[var(--dur-micro)] ${
                      open ? "text-[color:var(--fg)]" : "text-[color:var(--muted)] group-hover:text-[color:var(--fg)]"
                    }`}
                  >
                    {c.label}
                  </span>
                  <Plus
                    aria-hidden
                    className={`h-4 w-4 shrink-0 transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] ${
                      open ? "rotate-45 text-[color:var(--accent-text)]" : ""
                    }`}
                  />
                </button>
              </h3>
              <div
                id={`eng-panel-${c.id}`}
                role="region"
                aria-labelledby={`eng-tab-${c.id}`}
                hidden={!open}
                className="pb-7 pl-11"
              >
                <p className="t-body max-w-md">{c.body}</p>
                {c.spec && (
                  <p className="mt-5 border-t border-[color:var(--line)] pt-4">
                    <span className="t-label block text-[color:var(--muted)]">{c.spec.label}</span>
                    <span className="t-spec-value mt-1.5 block">
                      {c.spec.value} <Tag confidence={c.specConfidence} />
                    </span>
                  </p>
                )}
                {c.illustrative && (
                  <p className="t-label mt-5 text-[0.625rem] text-[color:var(--muted)]">
                    Illustrative layout · REVOO has not published where this part sits
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
