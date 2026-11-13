import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { models } from "@/data/models";

/** Spec keys compared across every model. Values come from models.ts only. */
const ROWS: { key: string; label: string }[] = [
  { key: "speed", label: "Top speed" },
  { key: "range", label: "Range" },
  { key: "battery", label: "Battery" },
  { key: "charge", label: "Charging time" },
  { key: "motor", label: "Motor" },
  { key: "brakes", label: "Brakes" },
  { key: "weight", label: "Weight" },
  { key: "clearance", label: "Ground clearance" },
];

function cell(slug: string, key: string) {
  const m = models.find((x) => x.slug === slug)!;
  const row = m.specs.find((s) => s.key === key);
  return row?.value ?? "—";
}

/**
 * Side-by-side comparison. Sticky first column on small screens so the measure
 * label stays readable while the models scroll horizontally.
 */
export function RangeCompare() {
  return (
    <div className="overflow-x-auto [scrollbar-width:thin]">
      <table className="w-full min-w-[44rem] border-collapse text-left">
        <caption className="t-label mb-6 text-left text-[color:var(--muted)]">
          International specifications side by side <Tag confidence="international" />
        </caption>
        <thead>
          <tr className="border-t border-[color:var(--fg)]">
            <th scope="col" className="sticky left-0 z-10 bg-[color:var(--bg)] py-5 pr-6 t-label text-[color:var(--muted)]">
              Measure
            </th>
            {models.map((m) => (
              <th key={m.slug} scope="col" className="px-4 py-5 align-bottom">
                <Link href={`/range/${m.slug}`} className="group block">
                  <span className="t-label text-[color:var(--accent-text)]">{m.series.split("·")[0].trim()}</span>
                  <span className="t-display t-h3 mt-2 block transition-colors group-hover:text-[color:var(--accent-text)]">
                    {m.code}
                  </span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className="border-t border-[color:var(--line)]">
              <th
                scope="row"
                className="sticky left-0 z-10 bg-[color:var(--bg)] py-5 pr-6 t-label align-top text-[color:var(--muted)]"
              >
                {row.label}
              </th>
              {models.map((m) => (
                <td key={m.slug} className="px-4 py-5 align-top text-[0.9375rem] leading-snug">
                  {cell(m.slug, row.key)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-[color:var(--line)]">
            <td colSpan={models.length + 1} className="pt-5 text-[0.8125rem] leading-relaxed text-[color:var(--muted)]">
              Figures differ by market and battery chemistry. Rwanda versions of every model are to be confirmed{" "}
              <Tag confidence="tbc" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
