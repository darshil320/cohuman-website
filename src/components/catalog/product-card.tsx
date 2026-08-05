"use client";

import Link from "next/link";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { categoryPhoto } from "@/lib/photos";
import type { Product } from "@/lib/catalog";

interface ProductCardProps {
  product: Product;
  catLabel: string;
}

export function ProductCard({ product, catLabel }: ProductCardProps) {
  const { openQuote } = useQuoteDialog();
  const href = `/catalog/${product.slug}`;

  return (
    <div className="group flex flex-col overflow-hidden border border-co-card-border bg-white transition-colors hover:border-co-ink">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-co-bg-alt">
        <ImagePlaceholder
          hint={product.name}
          alt={product.name}
          src={categoryPhoto[product.cat]}
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2.5 p-[18px] pb-[18px]">
        <div>
          <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.15em] text-co-faint">
            {catLabel}
          </p>
          <Link href={href} className="text-co-ink">
            <h3 className="mb-1.5 font-display text-[19px] font-medium tracking-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm leading-snug text-co-muted-2">{product.tagline}</p>
        </div>
        <div className="mt-auto flex justify-end pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openQuote(product.name)}
            className="whitespace-nowrap"
          >
            Enquire
          </Button>
        </div>
      </div>
    </div>
  );
}
