"use client";

import Link from "next/link";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { Button } from "@/components/ui/button";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { PRICE_BAND_LABEL, type Product } from "@/lib/catalog/types";
import { categoryPhoto } from "@/lib/photos";

interface ProductCardProps {
  product: Product;
  catLabel: string;
}

/**
 * Product entry, in Signal.
 *
 * A square hairline frame on fog holding a high-key photograph that wipes in left to
 * right, then an ink rule carrying the category (steel) and price band (ink) in mono, the
 * name in display caps, the size line from the data, and the enquire link. Price is only
 * ever the band plus "Price on request".
 *
 * No product has been photographed yet, so the frame shows the category's install
 * photograph. That is why the image link is hidden from assistive tech with an empty
 * alt: the title link names the product, and the photograph is not of it.
 */
export function ProductCard({ product, catLabel }: ProductCardProps) {
  const { openQuote } = useQuoteDialog();
  const href = `/catalog/${product.slug}`;
  const photo = product.images?.[0]?.src ?? categoryPhoto[product.cat];

  return (
    <article className="group flex h-full flex-col">
      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <ClipReveal className="aspect-[4/3] border border-co-border bg-co-bg-alt transition-colors duration-150 group-hover:border-co-ink">
          <ImagePlaceholder
            hint={product.name}
            alt=""
            src={photo}
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          />
        </ClipReveal>
      </Link>

      <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-co-ink pt-3">
        <p className="co-eyebrow min-w-0">{catLabel}</p>
        <p className="co-data shrink-0">{PRICE_BAND_LABEL[product.band]}</p>
      </div>

      <h3 className="co-h3 mt-4">
        <Link href={href} className="transition-colors duration-150 hover:text-co-muted">
          {product.name}
        </Link>
      </h3>
      <p className="mt-2.5 max-w-[40ch] text-[14px] leading-[1.55] text-co-muted">{product.tagline}</p>
      <p className="co-data mt-3 text-co-muted-2">{product.sizes}</p>

      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <Button type="button" variant="link" onClick={() => openQuote(product.name)}>
          Enquire<span className="sr-only"> about {product.name}</span>
        </Button>
        <span className="co-eyebrow">Price on request</span>
      </div>
    </article>
  );
}
