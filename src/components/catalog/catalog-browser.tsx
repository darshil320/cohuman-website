"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { ProductCard } from "@/components/catalog/product-card";
import { PRICE_BAND_LABEL, type Category, type Collection, type PriceBand, type Product } from "@/lib/catalog";
import { resolveCatLabel, resolveColName } from "@/lib/catalog/resolve";
import { cn } from "@/lib/utils";

interface CatalogBrowserProps {
  products: Product[];
  categories: Category[];
  collections: Collection[];
}

const BANDS: { id: PriceBand | "all"; label: string }[] = [
  { id: "all", label: "Any budget" },
  { id: "budget", label: PRICE_BAND_LABEL.budget },
  { id: "value", label: PRICE_BAND_LABEL.value },
  { id: "premium", label: PRICE_BAND_LABEL.premium },
];

function chipClass(active: boolean) {
  return cn(
    "whitespace-nowrap border px-3.5 py-2 text-[13px] font-medium",
    active ? "border-co-ink bg-co-ink text-co-bg" : "border-co-border bg-white/60 text-co-muted",
  );
}

export function CatalogBrowser({ products, categories, collections }: CatalogBrowserProps) {
  const [cat, setCat] = useState<string>("all");
  const [band, setBand] = useState<string>("all");
  const [col, setCol] = useState<string>("all");
  const { openQuote } = useQuoteDialog();

  // Collections are desking systems with their own configurators, not buckets the demo
  // catalog products belong to — so the filter only appears for ones that have products.
  const filterableCollections = useMemo(
    () => collections.filter((c) => products.some((p) => p.col === c.slug)),
    [collections, products],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat !== "all" && p.cat !== cat) return false;
      if (band !== "all" && p.band !== band) return false;
      if (col !== "all" && p.col !== col) return false;
      return true;
    });
  }, [products, cat, band, col]);

  return (
    <div>
      <div className="sticky top-[74px] z-40 border-b border-co-border bg-co-bg/95 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1320px] gap-2.5 px-[18px] py-4 sm:px-6 lg:px-11">
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setCat("all")} className={chipClass(cat === "all")}>
              Everything
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={chipClass(cat === c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {BANDS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBand(b.id)}
                className={chipClass(band === b.id)}
              >
                {b.label}
              </button>
            ))}
            {filterableCollections.length > 0 ? (
              <>
                <span className="mx-1 h-5 w-px bg-co-border" />
                <button
                  type="button"
                  onClick={() => setCol("all")}
                  className={chipClass(col === "all")}
                >
                  All collections
                </button>
                {filterableCollections.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setCol(c.slug)}
                    className={chipClass(col === c.slug)}
                  >
                    {c.name}
                  </button>
                ))}
              </>
            ) : null}
            <span className="ml-auto whitespace-nowrap text-[13px] text-co-faint">
              {filtered.length} products
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1320px] px-[18px] py-[clamp(30px,4vw,50px)] pb-[clamp(64px,8vw,100px)] sm:px-6 lg:px-11">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.slug}
                product={p}
                catLabel={resolveCatLabel(categories, p.cat)}
                colName={resolveColName(collections, p.col)}
              />
            ))}
          </div>
        ) : (
          <div className="py-[clamp(50px,8vw,90px)] text-center">
            <h3 className="mb-2.5 font-display text-2xl font-medium tracking-tight">
              Nothing matches that combination.
            </h3>
            <p className="mb-[22px] text-[15.5px] text-co-muted-2">
              Widen the filters, or tell us what you are after and we will source it.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button
                variant="outline"
                onClick={() => {
                  setCat("all");
                  setBand("all");
                  setCol("all");
                }}
              >
                Clear filters
              </Button>
              <Button onClick={() => openQuote()}>Ask us</Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
