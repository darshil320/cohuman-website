import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionGallery } from "@/components/collections/collection-gallery";
import { SeriesPdp } from "@/components/series/series-pdp";
import { catalog, isPhotographed, type PhotographedCollection } from "@/lib/catalog";
import { ALL_SERIES, findSeries, type SeriesDefinition } from "@/lib/series";
import { siteConfig } from "@/lib/site-config";

/**
 * A collection is one of two things, and this route renders whichever it is:
 *
 * - a specified desking series (`src/lib/series`): the shared series PDP, a configurator
 *   rather than a list of SKUs — the customer picks a configuration and a size before
 *   enquiring, and the quote depends on both;
 * - a photographed range (photos in `src/data/collections.json`, no specification yet):
 *   `CollectionGallery`, which shows the range and quotes no sizes.
 *
 * Adding a series: add its definition to src/lib/series and a matching entry to
 * src/data/collections.json (which drives /collections, the sitemap and llms.txt).
 * Adding a photographed range: the collections.json entry alone, with its photos.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function findPhotographed(slug: string): Promise<PhotographedCollection | null> {
  const collection = await catalog.getCollection(slug);
  return collection && isPhotographed(collection) ? collection : null;
}

export async function generateStaticParams() {
  const collections = await catalog.getCollections();
  const photographed = collections.filter((c) => !findSeries(c.slug) && isPhotographed(c));
  return [...ALL_SERIES, ...photographed].map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = findSeries(slug);
  if (!series) {
    const collection = await findPhotographed(slug);
    if (!collection) return {};
    return {
      title: `${collection.name} — ${collection.kicker}`,
      description: collection.blurb,
      alternates: { canonical: `/collections/${collection.slug}` },
      openGraph: {
        title: `${collection.name} — ${collection.kicker} · ${siteConfig.name}`,
        description: collection.blurb,
        url: `/collections/${collection.slug}`,
        images: [collection.photos[0].src],
      },
    };
  }

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

/** A photographed range: the pieces as products, with no sizes and no offer. */
function rangeJsonLd(collection: PhotographedCollection) {
  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: `${siteConfig.name} ${collection.name}`,
    description: collection.blurb,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: "Office desking system",
    image: collection.photos.map((photo) => photo.src),
    hasVariant: collection.pieces.map((piece) => ({
      "@type": "Product",
      name: `${collection.name} — ${piece}`,
    })),
  };
}

export default async function SeriesCollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const series = findSeries(slug);
  if (!series) {
    const collection = await findPhotographed(slug);
    if (!collection) notFound();
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rangeJsonLd(collection)) }}
        />
        <CollectionGallery collection={collection} />
      </>
    );
  }

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
