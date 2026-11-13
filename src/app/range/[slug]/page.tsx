import { notFound } from "next/navigation";
import { ModelPageView } from "@/components/range/ModelPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getModel, models } from "@/data/models";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { srcSets } from "@/data/assets";

export function generateStaticParams() {
  return models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) return {};
  const ogImage = model.image ? srcSets(model.image).fallback : undefined;
  return buildMetadata({
    title: `REVOO ${model.code}`,
    description: `${model.tagline}. ${model.intro}`,
    path: `/range/${model.slug}`,
    ogImage,
  });
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(slug);
  if (!model) notFound();
  return (
    <>
      <JsonLd
        data={[
          productJsonLd(model),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Range", path: "/range" },
            { name: `REVOO ${model.code}`, path: `/range/${model.slug}` },
          ]),
        ]}
      />
      <ModelPageView model={model} />
    </>
  );
}
