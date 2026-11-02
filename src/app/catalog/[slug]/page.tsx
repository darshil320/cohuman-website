import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductQuoteActions } from "@/components/catalog/product-quote-actions";
import { CtaBand } from "@/components/common/cta-band";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { SectionHeading } from "@/components/common/section-heading";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { IndexHeader, IndexRow } from "@/components/ui/index-row";
import { MeasureRule } from "@/components/ui/measure-rule";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { Reveal } from "@/components/ui/scroll-reveal";
import { SpecRows, type SpecRow } from "@/components/ui/spec-rows";
import { catalog, PRICE_BAND_LABEL } from "@/lib/catalog";
import { resolveCatLabel } from "@/lib/catalog/resolve";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/site-config";
import { categoryPhoto } from "@/lib/photos";
import { SHARE_IMAGE } from "@/lib/seo/share-image";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Two-digit ordinal for list numbering. */
const pad = (n: number) => String(n).padStart(2, "0");

export async function generateStaticParams() {
  const products = await catalog.getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await catalog.getProduct(slug);
  if (!product) return {};

  // A share card needs an absolute image and a canonical of its own, or WhatsApp and
  // LinkedIn fall back to the site-wide card for all 16 products.
  const image = product.images?.[0]?.src ?? categoryPhoto[product.cat];

  return {
    title: product.name,
    description: product.tagline,
    alternates: { canonical: `/catalog/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${siteConfig.name}`,
      description: product.tagline,
      url: `/catalog/${product.slug}`,
      images: image ? [{ url: image, alt: product.name }] : [SHARE_IMAGE],
    },
  };
}

/**
 * Catalog product page, on the officemate structure the series PDP uses:
 *
 *   A  name hero      breadcrumb, category eyebrow, the name in extended caps, tagline;
 *                     an ink tab in the bottom-right corner is the top of the spec block
 *   B  spec block     the photograph on the canvas, the ink block beside it holding the
 *                     spec rows, the feature list and the quote actions
 *   C  related        index rows, read like a parts list
 *   D  enquiry        the closing `CtaBand`
 *
 * No product has been photographed, so the frame holds one photograph of the category in
 * a finished install. It is an interior, not a render of this product, so it carries a
 * figure caption saying so and no dimension line.
 */
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    catalog.getProduct(slug),
    catalog.getCategories(),
  ]);

  if (!product) notFound();

  const related = await catalog.getRelatedProducts(product, 3);

  const catLabel = resolveCatLabel(categories, product.cat);
  const bandLabel = PRICE_BAND_LABEL[product.band];

  // `images` is absent on every demo product, so `lead` falls back to the category
  // photograph and `thumbnails` is empty rather than three duplicates of it.
  const [lead, ...thumbnails] = product.images ?? [];

  const specRows: SpecRow[] = [
    { k: "Category", v: catLabel },
    { k: "Materials", v: product.materials },
    { k: "Dimensions", v: product.sizes },
    { k: "Lead time", v: `${product.lead} from order confirmation` },
    { k: "Warranty", v: product.warranty },
    { k: "Band", v: `${bandLabel} — Price on request` },
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

  /*
    Machine copy of the breadcrumb trail rendered just below. The category crumb carries
    no `item`: the catalog's category filter is client-side state rather than a query
    parameter, so there is no URL that resolves to "just the task chairs" — and a
    breadcrumb pointing at a page that ignores the filter is worse than an unlinked
    crumb, which schema.org allows.
  */
  const breadcrumb = breadcrumbJsonLd([
    { name: "Catalog", path: "/catalog" },
    { name: catLabel },
    { name: product.name },
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* A — name hero */}
      <section className="relative overflow-hidden">
        <div className="co-shell relative pb-[clamp(72px,9vw,136px)] pt-[clamp(24px,3vw,40px)]">
          <nav aria-label="Breadcrumb" className="co-eyebrow flex flex-wrap items-center gap-2">
            <Link href="/catalog" className="transition-colors duration-150 hover:text-co-ink">
              Catalog
            </Link>
            <span aria-hidden>/</span>
            <span>{catLabel}</span>
            <span aria-hidden>/</span>
            <span aria-current="page" className="text-co-ink">
              {product.name}
            </span>
          </nav>

          <div className="mt-[clamp(40px,6vw,96px)] lg:pl-[clamp(0px,18vw,280px)]">
            <p className="co-eyebrow">
              {catLabel} — {bandLabel} band — Price on request
            </p>
            {/*
              Plain, not kinetic: a hyphenated name ("Height-Adjustable") must be free to
              break at the hyphen on a phone, and the per-word masks would clip it instead.
            */}
            <h1 className="co-display mt-4 max-w-[18ch] text-[clamp(34px,5.6vw,88px)]">
              {product.name}
            </h1>
            <MeasureRule className="mt-[clamp(20px,2.4vw,32px)] max-w-[820px]" />
            <p className="co-lead mt-6 max-w-[46ch]">{product.tagline}</p>
          </div>

          {/* Anchored to the shell's outer edge — the same edge the spec block ends on. */}
          <div
            aria-hidden
            className="absolute -bottom-px right-0 hidden h-[clamp(56px,7vw,110px)] w-[clamp(120px,21vw,300px)] bg-co-panel lg:block"
          />
        </div>
      </section>

      {/* B — photograph + ink spec block */}
      <section className="border-b border-co-ink">
        <div className="co-shell grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)]">
          <div className="min-w-0 py-[clamp(32px,4vw,64px)] lg:pr-[clamp(24px,3.5vw,56px)]">
            <div className="lg:sticky lg:top-[104px]">
              {/*
                The lead frame does not wipe: it is this page's LCP image and preloads, and
                a clip-path held until the reveal observer hydrates would hide it until then.
              */}
              <figure className="relative text-co-ink">
                <RegistrationCross className="-left-2 -top-2 z-10" />
                <div className="relative aspect-[4/3] overflow-hidden border border-co-border bg-co-bg-alt">
                  <ImagePlaceholder
                    hint={`${product.name} — main product shot`}
                    alt={lead ? lead.alt : `${catLabel} by ${siteConfig.name}`}
                    src={lead ? lead.src : categoryPhoto[product.cat]}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    preload
                  />
                </div>
                <FigureCaption n={1} className="mt-3">
                  {lead ? lead.alt : `${catLabel}, photographed in a completed install`}
                </FigureCaption>
              </figure>

              {/*
                Thumbnails only exist where real extra frames do. This used to render three
                fixed tiles all pointing at the same category photograph as the main shot, so
                every one of the 16 PDPs showed one image four times under the labels
                "Detail", "Angle" and "In situ" — visibly broken, and the same four files
                across the whole catalog. Until a product is shot, one honest photograph of
                the category beats four copies of it.
              */}
              {thumbnails.length > 0 ? (
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {thumbnails.map((image, i) => (
                    <figure key={image.src}>
                      <ClipReveal className="aspect-square border border-co-border bg-co-bg-alt">
                        <ImagePlaceholder
                          hint={image.alt}
                          alt={image.alt}
                          src={image.src}
                          sizes="(min-width: 1024px) 18vw, 30vw"
                        />
                      </ClipReveal>
                      <FigureCaption n={i + 2} className="mt-2 line-clamp-2">
                        {image.alt}
                      </FigureCaption>
                    </figure>
                  ))}
                </div>
              ) : !lead ? (
                <p className="mt-2 max-w-[56ch] text-[13px] leading-[1.55] text-co-muted">
                  Not this exact piece — finish samples and detail shots come with the quote.
                </p>
              ) : null}
            </div>
          </div>

          <div className="-mx-[18px] bg-co-panel px-[18px] py-[clamp(40px,5vw,70px)] text-co-panel-fg sm:-mx-6 sm:px-6 lg:mx-0 lg:-mr-12 lg:pl-10 lg:pr-12">
            <p className="co-eyebrow mb-5 text-co-panel-faint">01 / Specification</p>
            <SpecRows rows={specRows} tone="dark" />

            <p className="co-eyebrow mb-3 mt-9 text-co-panel-faint">What you get</p>
            <ul className="co-data grid list-none border-t border-co-panel-border p-0">
              {product.features.map((feature, i) => (
                <li
                  key={feature}
                  className="grid grid-cols-[36px_minmax(0,1fr)] items-baseline gap-x-3 border-b border-co-panel-border py-2.5"
                >
                  <span className="text-co-panel-faint">{pad(i + 1)}</span>
                  <span className="normal-case text-co-panel-fg">{feature}</span>
                </li>
              ))}
            </ul>

            <ProductQuoteActions productName={product.name} tone="dark" className="mt-9" />
            <p className="mt-5 max-w-[40ch] text-[12.5px] leading-relaxed text-co-panel-faint">
              Price on request — {bandLabel} band. Quantity, finish and installation change
              the number, so we quote rather than list.
            </p>
          </div>
        </div>
      </section>

      {/* C — related, as index rows */}
      {related.length > 0 ? (
        <section className="co-shell co-section">
          <SectionHeading
            eyebrow="02 / Related"
            title="Usually specified alongside."
            linkHref="/catalog"
            linkLabel="Full catalog"
            className="mb-0"
          />
          <Reveal>
            <IndexHeader columns={["No.", "Product", "Category", "Size"]} />
            {related.map((p, i) => (
              <IndexRow
                key={p.slug}
                n={pad(i + 1)}
                title={p.name}
                type={resolveCatLabel(categories, p.cat)}
                range={p.sizes}
                href={`/catalog/${p.slug}`}
              />
            ))}
          </Reveal>
        </section>
      ) : null}

      {/* D — enquiry */}
      <CtaBand
        heading="Price it for your floor."
        body={`Send the quantity, the finish and the room the ${product.name} is going in. We will come back with a costed proposal — price on request, never a list.`}
        buttonLabel="Request a quote"
        subject={product.name}
        secondary={{ label: "Book a showroom visit", href: "/contact" }}
      />
    </div>
  );
}
