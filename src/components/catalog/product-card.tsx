"use client";

import Link from "next/link";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { categoryPhoto } from "@/lib/photos";
import type { Product } from "@/lib/catalog";

interface ProductCardProps {
  product: Product;
  catLabel: string;
}

/**
 * Product entry.
 *
 * Frameless: the photograph sits on the page ground, a hairline under it carries the
 * hover, and the enquire action is an underlined link rather than an outlined button —
 * a bordered box per product turned a grid of six into a wall of chrome.
 */
export function ProductCard({ product, catLabel }: ProductCardProps) {
  const { openQuote } = useQuoteDialog();
  const href = `/catalog/${product.slug}`;

  return (
    <div className="group flex flex-col">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-co-bg-alt">
        <ImagePlaceholder
          hint={product.name}
          alt={product.name}
          src={categoryPhoto[product.cat]}
          className="transition-transform duration-[900ms] ease-[var(--ease-co)] group-hover:scale-[1.05]"
        />
      </Link>

      <span
        aria-hidden
        className="mt-[clamp(12px,1.4vw,18px)] block h-px w-full bg-co-border transition-colors duration-500 group-hover:bg-co-ink"
      />

      <div className="flex flex-1 flex-col pt-4">
        <p className="co-eyebrow mb-2.5">{catLabel}</p>
        <Link href={href} className="text-co-ink">
          <h3 className="mb-2 font-display text-[clamp(17px,1.5vw,20px)] font-medium leading-tight tracking-[-0.026em]">
            {product.name}
          </h3>
        </Link>
        <p className="mb-5 text-[13.5px] font-light leading-relaxed text-co-muted">
          {product.tagline}
        </p>

        <button
          type="button"
          onClick={() => openQuote(product.name)}
          className="mt-auto self-start border-b-2 border-transparent pb-1 text-[13px] font-semibold text-co-placeholder transition-colors hover:border-co-ink hover:text-co-ink"
        >
          Enquire
        </button>
      </div>
    </div>
  );
}
