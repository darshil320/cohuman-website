"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";

export function ProductQuoteActions({ productName }: { productName: string }) {
  const { openQuote } = useQuoteDialog();
  return (
    <div className="mb-7 flex flex-wrap gap-2.5">
      <Button onClick={() => openQuote(productName)}>Request a Quote</Button>
      <Link
        href="/contact"
        className="border border-co-border-strong px-[26px] py-[15px] text-[15.5px] font-semibold text-co-ink hover:border-co-ink hover:bg-co-bg-alt"
      >
        See a sample
      </Link>
    </div>
  );
}
