"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState, type KeyboardEvent } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Tag } from "@/components/ui/Tag";
import { ArrowRight } from "@/components/ui/Icons";
import { models, type Model } from "@/data/models";
import { PROTOTYPE } from "@/lib/flags";

function ModelImage({ model }: { model: Model }) {
  if (model.image) {
    return (
      <Picture
        asset={model.image}
        sizes="(min-width:1024px) 58vw, 92vw"
        imgClassName="mx-auto h-auto w-full max-w-4xl select-none"
      />
    );
  }
  return (
    <div className="relative mx-auto grid aspect-[1.353] w-full max-w-4xl place-items-center border border-dashed border-[color:var(--line)]">
      <span
        aria-hidden
        className="t-display text-[clamp(4rem,14vw,10rem)] text-transparent [-webkit-text-stroke:1.5px_var(--line)]"
      >
        {model.code}
      </span>
      {PROTOTYPE && (
        <span className="t-label absolute bottom-4 left-4 right-4 text-[color:var(--muted)]">
          {model.imageNote ?? "High-resolution render requested from REVOO"}
        </span>
      )}
    </div>
  );
}

/**
 * Immersive model switcher: one bike on stage, keyboard-friendly model list,
 * headline specs and a path into the product page. Crossfade is CSS only.
 */
export function RangeSwitcher({ initial = models[0].slug }: { initial?: string }) {
  const uid = useId();
  const start = models.find((m) => m.slug === initial) ?? models[0];
  const [active, setActive] = useState(start);
  const i = models.findIndex((m) => m.slug === active.slug);

  const go = useCallback((slug: string) => {
    const next = models.find((m) => m.slug === slug);
    if (next) setActive(next);
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const next = models[(i + dir + models.length) % models.length];
      setActive(next);
    },
    [i],
  );

  // Deep-link: /range#a12
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && models.some((m) => m.slug === hash)) go(hash);
  }, [go]);

  useEffect(() => {
    const url = `${window.location.pathname}#${active.slug}`;
    window.history.replaceState(null, "", url);
  }, [active.slug]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(models[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(models[models.length - 1]);
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 lg:items-end">
      {/* Stage */}
      <div className="relative lg:col-span-8">
        <div
          key={active.slug}
          className="range-in"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="sr-only">
            Showing REVOO {active.code}. {active.tagline}.
          </p>
          <ModelImage model={active} />
          <div
            aria-hidden
            className="mx-auto mt-[-2%] h-4 w-[78%] max-w-3xl rounded-[50%] bg-[radial-gradient(closest-side,rgba(14,15,17,0.28),rgba(14,15,17,0))]"
          />
        </div>
      </div>

      {/* Controls + copy */}
      <div className="lg:col-span-4 lg:pb-6">
        <div
          role="tablist"
          aria-label="REVOO models"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="border-t border-[color:var(--fg)]"
        >
          {models.map((m, idx) => {
            const selected = m.slug === active.slug;
            return (
              <button
                key={m.slug}
                role="tab"
                id={`${uid}-tab-${m.slug}`}
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => go(m.slug)}
                className={`flex w-full items-baseline gap-4 border-b border-[color:var(--line)] py-4 text-left transition-colors ${
                  selected ? "text-[color:var(--fg)]" : "text-[color:var(--muted)] hover:text-[color:var(--fg)]"
                }`}
              >
                <span className="t-label w-6 shrink-0 text-[color:var(--accent-text)]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="t-display t-h3 flex-1">{m.code}</span>
                {selected && <span aria-hidden className="h-px w-8 bg-[color:var(--accent-text)]" />}
              </button>
            );
          })}
        </div>

        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active.slug}`} className="mt-10">
          <p className="t-label text-[color:var(--muted)]">{active.series}</p>
          <p className="t-lead mt-3">{active.tagline}</p>

          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-[color:var(--line)] pt-5">
            {(
              [
                ["Top speed", active.headline.topSpeed],
                ["Range", active.headline.range],
                ["Battery", active.headline.battery],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="t-label text-[color:var(--muted)]">{label}</dt>
                <dd className="t-spec-value mt-1.5 text-[clamp(0.95rem,0.8rem+0.5vw,1.25rem)] leading-tight">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="t-label mt-4 text-[0.625rem] text-[color:var(--muted)]">
            International specification <Tag confidence={active.specConfidence} />
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`/range/${active.slug}`}>View {active.code}</ButtonLink>
            <ButtonLink href="/contact#test-ride" variant="outline">
              Book a test ride
            </ButtonLink>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              className="t-label inline-flex items-center gap-2 text-[color:var(--muted)] hover:text-[color:var(--fg)]"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="t-label inline-flex items-center gap-2 text-[color:var(--muted)] hover:text-[color:var(--fg)]"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

/** Quiet link strip used under the comparison table. */
export function RangeModelLinks() {
  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-3">
      {models.map((m) => (
        <li key={m.slug}>
          <Link href={`/range/${m.slug}`} className="t-label link-wipe inline-flex items-center gap-2">
            {m.code}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
