"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/catalog/product-card";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { SegmentedControl, type SegmentOption } from "@/components/ui/segmented-control";
import { resolveCatLabel } from "@/lib/catalog/resolve";
import { PRICE_BAND_LABEL, type Category, type PriceBand, type Product } from "@/lib/catalog/types";

interface CatalogBrowserProps {
  products: Product[];
  categories: Category[];
}

const ALL = "all";

const BANDS: SegmentOption<PriceBand | typeof ALL>[] = [
  { value: ALL, label: "Any budget" },
  { value: "budget", label: PRICE_BAND_LABEL.budget },
  { value: "value", label: PRICE_BAND_LABEL.value },
  { value: "premium", label: PRICE_BAND_LABEL.premium },
];

/** Two-digit count, so the result tally never changes width as it filters. */
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The catalog: two square segmented controls (category, price band) over a grid of
 * product cards. Filtering is local state, exactly as before — there is no URL for a
 * filtered view.
 *
 * Selection is carried by the ink fill and `aria-pressed`, never by colour, so the
 * page spends none of its one green thing on a filter. The bar sticks under the header
 * on wide screens only; on a phone the two wrapped controls would hold a third of the
 * viewport.
 */
export function CatalogBrowser({ products, categories }: CatalogBrowserProps) {
  const [cat, setCat] = useState<string>(ALL);
  const [band, setBand] = useState<PriceBand | typeof ALL>(ALL);
  const { openQuote } = useQuoteDialog();

  const categoryOptions = useMemo<SegmentOption<string>[]>(
    () => [{ value: ALL, label: "Everything" }, ...categories.map((c) => ({ value: c.id, label: c.label }))],
    [categories],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat !== ALL && p.cat !== cat) return false;
      if (band !== ALL && p.band !== band) return false;
      return true;
    });
  }, [products, cat, band]);

  return (
    <div>
      <div className="z-40 border-b border-co-border bg-co-bg lg:sticky lg:top-[72px]">
        <div className="co-shell grid grid-cols-1 gap-y-4 py-4 lg:grid-cols-[112px_minmax(0,1fr)] lg:items-center lg:gap-x-6 lg:gap-y-3">
          <p className="co-eyebrow">Category</p>
          <SegmentedControl label="Category" options={categoryOptions} value={cat} onChange={setCat} />

          <p className="co-eyebrow">Budget band</p>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <SegmentedControl label="Budget band" options={BANDS} value={band} onChange={setBand} />
            <p className="co-data" aria-live="polite">
              {pad(filtered.length)} / {pad(products.length)}{" "}
              <span className="text-co-muted-2">products</span>
            </p>
          </div>
        </div>
      </div>

      <section className="co-shell pb-[clamp(64px,8vw,120px)] pt-[clamp(32px,4vw,56px)]">
        {filtered.length > 0 ? (
          <StaggerContainer
            staggerDelay={0.06}
            className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((p) => (
              <StaggerItem key={p.slug} className="h-full">
                <ProductCard product={p} catLabel={resolveCatLabel(categories, p.cat)} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <div className="border-y border-co-border py-[clamp(48px,7vw,96px)]">
            <p className="co-data">00 results — nothing matches that combination</p>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.55] text-co-ink-soft">
              Widen the filters, or tell us what you are after and we will source it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setCat(ALL);
                  setBand(ALL);
                }}
              >
                Clear filters
              </Button>
              <Button type="button" onClick={() => openQuote()}>
                Ask us
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
