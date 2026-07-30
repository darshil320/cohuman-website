"use client";

import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";

export function CollectionQuoteButton({ name }: { name: string }) {
  const { openQuote } = useQuoteDialog();
  return (
    <Button onClick={() => openQuote(`${name} collection`)} className="whitespace-nowrap">
      Quote the {name} range
    </Button>
  );
}
