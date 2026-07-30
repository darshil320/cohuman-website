import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "The full Cohuman range — executive desks, ergonomic seating, workstations, conference tables, storage and reception furniture. Filter by category, budget and collection.",
};

export default async function CatalogPage() {
  const [products, categories, collections] = await Promise.all([
    catalog.getProducts(),
    catalog.getCategories(),
    catalog.getCollections(),
  ]);

  return (
    <div>
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,78px)] pb-[clamp(32px,4vw,48px)] sm:px-6 lg:px-11">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            Catalog
          </p>
          <h1 className="mb-4 max-w-[20ch] font-display text-[clamp(34px,5vw,62px)] font-medium leading-[1.02] tracking-tight">
            Everything we make, in one place.
          </h1>
          <p className="max-w-[56ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
            Prices are quoted, not listed — cost depends on finish, quantity and installation.
            Pick what fits and we will price it properly.
          </p>
        </div>
      </section>

      <CatalogBrowser products={products} categories={categories} collections={collections} />
    </div>
  );
}
