"use client";

import Link from "next/link";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";

/**
 * Entry actions on the collections index.
 *
 * Underlined type rather than a bordered pair: the page carries no other boxes, and two
 * outlined buttons per entry were the last thing making an entry read as a card. The
 * primary action keeps the heavier rule so the hierarchy survives losing the fill.
 */
export function CollectionActions({ name, href }: { name: string; href: string }) {
  const { openQuote } = useQuoteDialog();

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
      <Link
        href={href}
        className="group inline-flex items-center gap-2.5 border-b-2 border-co-ink pb-1.5 text-[14.5px] font-semibold text-co-ink transition-colors hover:border-co-muted hover:text-co-muted"
      >
        View {name}
        <svg
          aria-hidden
          width="13"
          height="9"
          viewBox="0 0 13 9"
          fill="none"
          className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        >
          <path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Link>

      <button
        type="button"
        onClick={() => openQuote(`${name} collection`)}
        className="border-b-2 border-transparent pb-1.5 text-[14.5px] font-semibold text-co-placeholder transition-colors hover:border-co-border-strong hover:text-co-ink"
      >
        Enquire
      </button>
    </div>
  );
}
