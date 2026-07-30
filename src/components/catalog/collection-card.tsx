import Link from "next/link";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { collectionPhoto } from "@/lib/stock-photos";
import type { Collection } from "@/lib/catalog";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group block overflow-hidden border border-co-card-border bg-white text-co-ink transition-all hover:-translate-y-1 hover:border-co-ink"
    >
      <div className="relative h-[260px] overflow-hidden bg-co-hero-bg">
        <ImagePlaceholder
          hint={collection.slotHint}
          alt={collection.name}
          src={collectionPhoto[collection.slug]}
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5 pb-6">
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
          {collection.kicker}
        </p>
        <h3 className="mb-2 font-display text-[22px] font-medium tracking-tight">
          {collection.name}
        </h3>
        <p className="text-sm leading-relaxed text-co-muted-2">{collection.blurb}</p>
      </div>
    </Link>
  );
}
