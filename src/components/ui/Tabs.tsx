"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

/**
 * Accessible tabs (WAI-ARIA): roving tabindex, arrow/Home/End keys,
 * sliding green indicator under the active tab.
 */
export function Tabs({ items, label }: { items: TabItem[]; label: string }) {
  const uid = useId();
  const [active, setActive] = useState(items[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusTab = (id: string) => {
    setActive(id);
    refs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next >= 0) {
      e.preventDefault();
      focusTab(items[next].id);
    }
  };

  const activeIndex = Math.max(0, items.findIndex((i) => i.id === active));

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="relative flex gap-8 overflow-x-auto border-b border-[color:var(--line)] [scrollbar-width:none]"
      >
        {items.map((item, i) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[item.id] = el;
              }}
              role="tab"
              id={`${uid}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`t-wide relative shrink-0 py-4 text-sm transition-colors duration-[var(--dur-micro)] ${
                selected ? "text-[color:var(--fg)]" : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"
              }`}
            >
              {item.label}
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-px h-0.5 origin-left bg-[color:var(--accent-text)] transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] ${
                  selected ? "scale-x-100" : "scale-x-0"
                }`}
                data-index={activeIndex}
              />
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${uid}-panel-${item.id}`}
          aria-labelledby={`${uid}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className="pt-8"
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
