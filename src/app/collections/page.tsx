import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { CollectionActions } from "@/components/catalog/collection-actions";
import { catalog } from "@/lib/catalog";
import { collectionPhoto } from "@/lib/stock-photos";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Four furniture collections designed to sit in the same building — Meridian, Origin, Loom and Parlour.",
};

export default async function CollectionsPage() {
  const [collections, allProducts] = await Promise.all([
    catalog.getCollections(),
    catalog.getProducts(),
  ]);

  return (
    <div>
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,78px)] sm:px-6 lg:px-11">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            Collections
          </p>
          <h1 className="mb-4 max-w-[22ch] font-display text-[clamp(34px,5vw,62px)] font-medium leading-[1.02] tracking-tight">
            Four families, designed to sit in the same building.
          </h1>
          <p className="max-w-[58ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
            Finishes, edge profiles and upholstery ranges carry across all four, so a cabin, an
            open floor and a lounge read as one office rather than three procurement rounds.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1320px] gap-[clamp(30px,4vw,54px)] px-[18px] py-[clamp(44px,6vw,84px)] sm:px-6 lg:px-11">
        {collections.map((c) => {
          const items = allProducts.filter((p) => p.col === c.slug);
          return (
            <div
              key={c.slug}
              className="grid grid-cols-1 items-center gap-6 border-b border-co-border pb-[clamp(30px,4vw,54px)] last:border-b-0 lg:grid-cols-2 lg:gap-12"
            >
              <a
                href={`/collections/${c.slug}`}
                className="group relative block aspect-[16/11] overflow-hidden bg-co-hero-bg"
              >
                <ImagePlaceholder
                  hint={c.slotHint}
                  alt={c.name}
                  src={collectionPhoto[c.slug]}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </a>
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-co-faint">
                  {c.kicker} · {items.length} products
                </p>
                <h2 className="mb-3.5 font-display text-[clamp(28px,3.4vw,42px)] font-medium leading-[1.05] tracking-tight">
                  {c.name}
                </h2>
                <p className="mb-5 max-w-[44ch] text-[clamp(16px,1.4vw,18.5px)] font-light leading-relaxed text-co-muted">
                  {c.blurb}
                </p>
                <p className="mb-6 text-[14.5px] font-light text-co-muted-2">
                  <span className="text-co-faint">Includes</span>{" "}
                  {items.map((p) => p.name).join(" · ")}
                </p>
                <CollectionActions name={c.name} href={`/collections/${c.slug}`} />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
