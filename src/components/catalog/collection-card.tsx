import Image from "next/image";
import Link from "next/link";
import { collectionPhoto } from "@/lib/photos";
import type { Collection } from "@/lib/catalog";

/**
 * Collection entry.
 *
 * The renders are studio shots on white, so they composite into the page ground with
 * `mix-blend-multiply` and need no panel behind them — the hairline under the image
 * carries the hover instead of a frame around it.
 */
export function CollectionCard({
  collection,
  index,
}: {
  collection: Collection;
  index?: number;
}) {
  return (
    <Link href={`/collections/${collection.slug}`} className="group block text-co-ink">
      <span className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={collectionPhoto[collection.slug]}
          alt={collection.name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-contain mix-blend-multiply transition-transform duration-[900ms] ease-[var(--ease-co)] group-hover:scale-[1.04]"
        />
      </span>

      <span className="mt-[clamp(14px,1.6vw,20px)] block h-px w-full bg-co-border transition-colors duration-500 group-hover:bg-co-ink" />

      <span className="mt-4 flex items-baseline gap-3">
        <p className="co-eyebrow">{collection.kicker}</p>
        {typeof index === "number" ? (
          <span aria-hidden className="ml-auto font-mono text-[10.5px] tabular-nums text-co-placeholder">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </span>

      <h3 className="co-h3 mb-2.5 mt-2">{collection.name}</h3>
      <p className="max-w-[44ch] text-[14px] font-light leading-relaxed text-co-muted">
        {collection.blurb}
      </p>
    </Link>
  );
}
