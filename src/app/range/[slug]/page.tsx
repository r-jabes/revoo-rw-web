import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { getModel, models } from "@/data/models";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return {};
  return buildMetadata({
    title: `REVOO ${model.code}`,
    description: `${model.tagline}. ${model.intro}`,
    path: `/range/${model.slug}`,
  });
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();
  return (
    <PagePlaceholder
      eyebrow={model.series}
      title={`REVOO ${model.code}`}
      note="Product page. Built in Phase 5 (hero, overview, numbered spec accordion, battery and charging, gallery, enquiry)."
    />
  );
}
