import { confidenceLabel, type Confidence, type Fact } from "@/data/facts";
import { PROTOTYPE } from "@/lib/flags";

/**
 * Prototype marker for facts that are not confirmed for REVOO Rwanda.
 * Renders nothing for confirmed facts, or when PROTOTYPE mode is off.
 */
export function Tag({ confidence, className = "" }: { confidence: Confidence; className?: string }) {
  if (!PROTOTYPE || confidence === "confirmed-rw") return null;
  const { short, long } = confidenceLabel[confidence];
  const isTbc = confidence === "tbc";
  return (
    <span
      title={long}
      className={`t-label inline-flex items-center gap-1.5 border px-1.5 py-0.5 align-middle text-[0.625rem] leading-none ${
        isTbc
          ? "border-[color:var(--color-steel)] text-[color:var(--muted)]"
          : "border-[color:var(--accent-text)] text-[color:var(--accent-text)]"
      } ${className}`}
    >
      <span aria-hidden className={`h-1 w-1 ${isTbc ? "bg-[color:var(--color-steel)]" : "bg-[color:var(--accent-text)]"}`} />
      <span>
        <span className="sr-only">{long}: </span>
        {short}
      </span>
    </span>
  );
}

/** Render a fact value with its marker, or a clear placeholder when unknown. */
export function FactValue<T extends string>({
  fact,
  placeholder = "To be confirmed",
}: {
  fact: Fact<T>;
  placeholder?: string;
}) {
  return (
    <span>
      {fact.value ?? <span className="text-[color:var(--muted)]">{placeholder}</span>}{" "}
      <Tag confidence={fact.confidence} />
    </span>
  );
}
