import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesPdp } from "@/components/series/series-pdp";
import { ALL_SERIES, findSeries, type SeriesDefinition } from "@/lib/series";
import { siteConfig } from "@/lib/site-config";

/**
 * Every collection is a desking series with its own configurator, so this route renders
 * the shared series PDP rather than a list of SKUs — the customer picks a configuration
 * and a size before enquiring, and the quote depends on both.
 *
 * Adding a series: add its definition to src/lib/series and a matching entry to
 * src/data/collections.json (which drives /collections, the sitemap and llms.txt).
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ALL_SERIES.map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = findSeries(slug);
  if (!series) return {};

  const description = `${series.promise} ${series.intro}`;
  return {
    title: `${series.name} — ${series.eyebrow}`,
    description,
    alternates: { canonical: `/collections/${series.slug}` },
    openGraph: {
      title: `${series.name} — ${series.eyebrow} · ${siteConfig.name}`,
      description,
      url: `/collections/${series.slug}`,
      images: [series.anatomyImage],
    },
  };
}

/**
 * Product schema with the configurations as variants. `offers` is deliberately absent:
 * pricing is quote-only, and publishing a fake price would be worse than publishing none.
 */
function productJsonLd(series: SeriesDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: `${siteConfig.name} ${series.name}`,
    description: `${series.promise} ${series.intro}`,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: "Office desking system",
    height: {
      "@type": "QuantitativeValue",
      value: series.workingHeightMm,
      unitCode: "MMT",
    },
    variesBy: ["configuration", "length", "depth"],
    hasVariant: series.configs.map((config) => ({
      "@type": "Product",
      name: `${series.name} — ${config.name}`,
      sku: config.code,
      image: config.image,
      width: {
        "@type": "QuantitativeValue",
        minValue: Math.min(...config.lens),
        maxValue: Math.max(...config.lens),
        unitCode: "MMT",
      },
    })),
  };
}

export default async function SeriesCollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const series = findSeries(slug);
  if (!series) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(series)) }}
      />
      <SeriesPdp series={series} />
    </>
  );
}
