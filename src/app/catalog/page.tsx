import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { CtaBand } from "@/components/common/cta-band";
import { SpecRows } from "@/components/ui/spec-rows";
import { catalog, PRICE_BAND_LABEL } from "@/lib/catalog";
import { itemListJsonLd } from "@/lib/seo/structured-data";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { PageHero } from "@/components/common/page-hero";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "The full Cohuman range — executive desks, ergonomic seating, workstations, conference tables, storage and reception furniture. Filter by category and budget band.",
  alternates: { canonical: "/catalog" },
  openGraph: {
    title: "Catalog",
    description:
      "The full Cohuman range — executive desks, ergonomic seating, workstations, conference tables, storage and reception furniture. Filter by category and budget band.",
    url: "/catalog",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Catalog",
    description:
      "The full Cohuman range — executive desks, ergonomic seating, workstations, conference tables, storage and reception furniture. Filter by category and budget band.",
  },
};

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    catalog.getProducts(),
    catalog.getCategories(),
  ]);

  // Sixteen product links are otherwise an unstructured wall to a crawler; the list
  // states what this page enumerates so a result can carry the set, not one child.
  const itemList = itemListJsonLd(
    "Cohuman office furniture catalog",
    "/catalog",
    products.map((product) => ({
      name: product.name,
      path: `/catalog/${product.slug}`,
      description: product.tagline,
    })),
  );

  // How the range is priced, as the hero's spec block states it: the band labels come
  // from the same map the filters and cards use, so the three can never disagree.
  const heroRows = [
    { k: "Categories", v: String(categories.length).padStart(2, "0") },
    { k: "Budget bands", v: Object.values(PRICE_BAND_LABEL).join(" · ") },
    { k: "Pricing", v: "Price on request" },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <PageHero
        eyebrow="Catalog — Office furniture"
        title="Everything we make, in one place."
        titleClassName="max-w-[14ch]"
        lead="Prices are quoted, not listed — cost depends on finish, quantity and installation. Pick what fits and we will price it properly."
        aside={<SpecRows rows={heroRows} />}
      />

      <CatalogBrowser products={products} categories={categories} />

      <CtaBand
        heading="Can’t see it here?"
        body="Tell us the piece, the quantity and the room it is going in. We will source it and price it properly — no cart, no list price."
        secondary={{ label: "Book a showroom visit", href: "/contact" }}
      />
    </div>
  );
}
