import { notFound } from "next/navigation";
import { ModelPageView } from "@/components/range/ModelPage";
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
  return <ModelPageView model={model} />;
}
