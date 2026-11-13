type Ld = Record<string, unknown>;

/** Server component: emits a JSON-LD script tag. */
export function JsonLd({ data }: { data: Ld | (Ld | null | undefined)[] | null }) {
  if (!data) return null;
  const payload = Array.isArray(data) ? data.filter((x): x is Ld => !!x) : data;
  if (Array.isArray(payload) && payload.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
