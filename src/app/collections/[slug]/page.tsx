import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { ProductCard } from "@/components/catalog/product-card";
import { CollectionQuoteButton } from "@/components/catalog/collection-quote-button";
import { catalog } from "@/lib/catalog";
import { resolveCatLabel } from "@/lib/catalog/resolve";
import { collectionPhoto } from "@/lib/stock-photos";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const collections = await catalog.getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await catalog.getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.blurb,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const [collection, collections, categories, products] = await Promise.all([
    catalog.getCollection(slug),
    catalog.getCollections(),
    catalog.getCategories(),
    catalog.getProductsByCollection(slug),
  ]);

  if (!collection) notFound();

  return (
    <div>
      <section className="relative h-[clamp(340px,52vh,520px)] overflow-hidden bg-co-hero-bg">
        <ImagePlaceholder
          hint={collection.slotHint}
          alt={collection.name}
          src={collectionPhoto[collection.slug]}
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(20,24,20,0.74)] via-[rgba(20,24,20,0.2)] to-[rgba(20,24,20,0.04)]" />
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1320px] px-[18px] pb-[clamp(30px,4vw,48px)] sm:px-6 lg:px-11">
            <p className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green-pale">
              Collection · {collection.kicker}
            </p>
            <h1 className="mb-3 font-display text-[clamp(36px,5.4vw,70px)] font-medium leading-none tracking-tight text-[#FBFAF7]">
              {collection.name}
            </h1>
            <p className="max-w-[48ch] text-[clamp(16px,1.5vw,20px)] font-light leading-relaxed text-[#E4E7DC]">
              {collection.blurb}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-co-border">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-5 px-[18px] py-[clamp(26px,3vw,38px)] sm:px-6 lg:px-11">
          <div className="flex flex-wrap gap-2">
            {collections.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className={cn(
                  "px-4 py-2.5 text-[13.5px] font-medium",
                  c.slug === collection.slug
                    ? "bg-co-ink text-co-bg"
                    : "border border-co-border bg-white/60 text-co-muted",
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>
          <CollectionQuoteButton name={collection.name} />
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-[18px] py-[clamp(40px,5vw,68px)] sm:px-6 lg:px-11">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              catLabel={resolveCatLabel(categories, p.cat)}
              colName={collection.name}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
