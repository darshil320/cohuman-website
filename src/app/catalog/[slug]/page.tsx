import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductQuoteActions } from "@/components/catalog/product-quote-actions";
import { PRICE_BAND_LABEL } from "@/lib/catalog";
import { catalog } from "@/lib/catalog";
import { resolveCatLabel } from "@/lib/catalog/resolve";
import { siteConfig } from "@/lib/site-config";
import { categoryPhoto } from "@/lib/photos";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await catalog.getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await catalog.getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    catalog.getProduct(slug),
    catalog.getCategories(),
  ]);

  if (!product) notFound();

  const [related] = await Promise.all([catalog.getRelatedProducts(product, 3)]);

  const catLabel = resolveCatLabel(categories, product.cat);
  const bandLabel = PRICE_BAND_LABEL[product.band];

  const specRows = [
    { k: "Category", v: catLabel },
    { k: "Materials", v: product.materials },
    { k: "Dimensions", v: product.sizes },
    { k: "Lead time", v: `${product.lead} from order confirmation` },
    { k: "Warranty", v: product.warranty },
  ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: catLabel,
    material: product.materials,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/catalog/${product.slug}`,
      description: `Price on request — ${bandLabel} band`,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="mx-auto flex max-w-[1320px] flex-wrap gap-2 px-[18px] pt-[22px] text-[13px] text-co-faint sm:px-6 lg:px-11">
        <Link href="/catalog" className="text-co-faint hover:text-co-ink">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-co-muted">{catLabel}</span>
        <span>/</span>
        <span className="font-medium text-co-ink">{product.name}</span>
      </div>

      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-[clamp(28px,4vw,60px)] px-[18px] py-[clamp(22px,3vw,34px)] pb-[clamp(56px,7vw,90px)] sm:px-6 lg:grid-cols-2 lg:px-11">
        <div className="grid gap-3">
          <div className="relative aspect-[4/3] overflow-hidden border border-co-card-border bg-co-bg-alt">
            <ImagePlaceholder
              hint={`${product.name} — main product shot`}
              alt={product.name}
              src={categoryPhoto[product.cat]}
              priority
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="relative aspect-square overflow-hidden border border-co-card-border bg-co-bg-alt">
              <ImagePlaceholder
                hint="Detail"
                alt={`${product.name} detail`}
                src={categoryPhoto[product.cat]}
              />
            </div>
            <div className="relative aspect-square overflow-hidden border border-co-card-border bg-co-bg-alt">
              <ImagePlaceholder
                hint="Angle"
                alt={`${product.name} angle view`}
                src={categoryPhoto[product.cat]}
              />
            </div>
            <div className="relative aspect-square overflow-hidden border border-co-card-border bg-co-bg-alt">
              <ImagePlaceholder
                hint="In situ"
                alt={`${product.name} in a finished room`}
                src={categoryPhoto[product.cat]}
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-co-green">
            {catLabel}
          </p>
          <h1 className="mb-3.5 font-display text-[clamp(32px,4vw,50px)] font-medium leading-[1.03] tracking-tight">
            {product.name}
          </h1>
          <p className="mb-[26px] max-w-[44ch] text-[clamp(17px,1.5vw,20px)] font-light leading-relaxed text-co-ink-soft">
            {product.tagline}
          </p>

          <ProductQuoteActions productName={product.name} />

          <p className="mb-[30px] text-[13.5px] font-light text-co-faint">
            Price on request — {bandLabel} band. Quantity, finish and installation change the
            number, so we quote rather than list.
          </p>

          <div className="border-t border-co-border">
            {specRows.map((r) => (
              <div
                key={r.k}
                className="grid grid-cols-[minmax(110px,0.4fr)_1fr] gap-[18px] border-b border-co-border py-3.5"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-co-faint">
                  {r.k}
                </span>
                <span className="text-[15px] font-light leading-relaxed text-co-ink-soft">
                  {r.v}
                </span>
              </div>
            ))}
          </div>

          <h2 className="mb-3.5 mt-8 font-display text-xl font-medium tracking-tight">
            What you get
          </h2>
          <div className="grid gap-2.5">
            {product.features.map((ft) => (
              <div key={ft} className="flex items-baseline gap-3">
                <span className="mt-[-2px] h-1.5 w-1.5 shrink-0 bg-co-green" />
                <span className="text-[15px] font-light leading-relaxed text-co-ink-soft">
                  {ft}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-co-border bg-co-bg-alt">
          <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,84px)] sm:px-6 lg:px-11">
            <h2 className="mb-[clamp(24px,3vw,36px)] font-display text-[clamp(24px,2.8vw,36px)] font-medium tracking-tight">
              Usually specified alongside
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  catLabel={resolveCatLabel(categories, p.cat)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
