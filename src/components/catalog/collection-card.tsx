import Image from "next/image";
import Link from "next/link";
import { collectionPhoto } from "@/lib/photos";
import type { Collection } from "@/lib/catalog";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group block overflow-hidden border border-co-card-border bg-white text-co-ink transition-all hover:-translate-y-1 hover:border-co-ink"
    >
      <div className="relative h-[260px] overflow-hidden bg-[radial-gradient(110%_90%_at_50%_5%,#FFFFFF_0%,#F8F6F1_55%,#EFECE4_100%)]">
        <Image
          src={collectionPhoto[collection.slug]}
          alt={collection.name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
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
