"use client";

import Link from "next/link";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The product page's two actions: the quote (dialog, prefilled with the product) and a
 * sample visit. `dark` is for the ink spec block, where the product page carries them.
 */
export function ProductQuoteActions({
  productName,
  tone = "light",
  className,
}: {
  productName: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const { openQuote } = useQuoteDialog();
  const dark = tone === "dark";

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Button type="button" variant={dark ? "onDark" : "primary"} onClick={() => openQuote(productName)}>
        Request a quote
      </Button>
      <Button asChild variant={dark ? "secondaryOnDark" : "secondary"}>
        <Link href="/contact">See a sample</Link>
      </Button>
    </div>
  );
}
