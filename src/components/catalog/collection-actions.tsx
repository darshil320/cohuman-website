"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";

export function CollectionActions({ name, href }: { name: string; href: string }) {
  const { openQuote } = useQuoteDialog();
  return (
    <div className="flex flex-wrap gap-2.5">
      <Link
        href={href}
        className="border border-co-ink px-6 py-3 text-[15px] font-semibold text-co-ink hover:bg-co-ink hover:text-co-bg"
      >
        View {name}
      </Link>
      <Button variant="outline" onClick={() => openQuote(`${name} collection`)}>
        Enquire
      </Button>
    </div>
  );
}
