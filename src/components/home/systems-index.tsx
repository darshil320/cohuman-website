"use client";

import { IndexHeader, IndexRow } from "@/components/ui/index-row";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";

/**
 * One row of the systems index. Either a page to go to (`href`) or, for a system with
 * no page yet, a quote to open with the system as its subject (`quoteSubject`).
 */
export interface SystemRow {
  n: string;
  title: string;
  type: string;
  range: string;
  href?: string;
  quoteSubject?: string;
  image?: string;
}

/**
 * The systems index — the homepage scanned like a parts list.
 *
 * Rows are built by the page from the series data (the ranges are `spanLabel` over the
 * real configurations) and passed in, so this client boundary exists only because two
 * rows open the quote dialog: seating and storage have no product pages yet, and a
 * quote is the honest destination rather than the illustrative demo catalog.
 */
export function SystemsIndex({ rows }: { rows: SystemRow[] }) {
  const { openQuote } = useQuoteDialog();

  return (
    <div className="border-t border-co-ink">
      <IndexHeader />
      {rows.map((row) => (
        <IndexRow
          key={row.n}
          n={row.n}
          title={row.title}
          type={row.type}
          range={row.range}
          href={row.href}
          onClick={row.quoteSubject ? () => openQuote(row.quoteSubject) : undefined}
          image={row.image ? { src: row.image } : undefined}
        />
      ))}
    </div>
  );
}
