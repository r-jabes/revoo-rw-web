"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus } from "./Icons";

export interface AccordionItem {
  id: string;
  /** Mono index like "01" */
  index?: string;
  title: ReactNode;
  content: ReactNode;
}

/**
 * Numbered accordion (Zero-style spec list). Accessible disclosure pattern:
 * each header is a button with aria-expanded/aria-controls; panels are regions.
 * Height animates with the grid-rows trick (no JS measuring).
 */
export function Accordion({
  items,
  defaultOpen = null,
  allowMultiple = false,
}: {
  items: AccordionItem[];
  defaultOpen?: string | null;
  allowMultiple?: boolean;
}) {
  const uid = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen ? [defaultOpen] : []);

  const toggle = (id: string) =>
    setOpen((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : allowMultiple ? [...cur, id] : [id],
    );

  return (
    <div className="border-t border-[color:var(--line)]">
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const btnId = `${uid}-${item.id}-btn`;
        const panelId = `${uid}-${item.id}-panel`;
        return (
          <div key={item.id} className="border-b border-[color:var(--line)]">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center gap-5 py-5 text-left md:gap-8 md:py-6"
              >
                {item.index && (
                  <span className="t-label w-8 shrink-0 text-[color:var(--muted)] md:w-12">{item.index}</span>
                )}
                <span className="t-h3 flex-1 transition-colors duration-[var(--dur-micro)] group-hover:text-[color:var(--accent-text)]">
                  {item.title}
                </span>
                <Plus
                  className={`h-5 w-5 shrink-0 transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-[grid-template-rows] duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-7 pl-[3.25rem] md:pl-20 md:pr-12">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
