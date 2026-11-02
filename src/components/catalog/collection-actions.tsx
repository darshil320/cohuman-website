"use client";

import Link from "next/link";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Entry actions on the collections index.
 *
 * "Configure" is the primary — the series page is a configurator, so that is where the
 * visitor is going. "Enquire" is the quieter text link beside it, opening the quote
 * dialog with the collection as its subject. Neither carries the signal dots: the
 * header's quote button already does, and one green thing per screen is the rule.
 */
export function CollectionActions({
  name,
  href,
  label = "Configure",
  className,
}: {
  name: string;
  href: string;
  /** "Configure" for a series page; a photographed range has nothing to configure. */
  label?: string;
  className?: string;
}) {
  const { openQuote } = useQuoteDialog();

  return (
    <div className={cn("flex flex-wrap items-center gap-x-7 gap-y-4", className)}>
      <Button asChild>
        <Link href={href}>
          {label}
          <span className="sr-only"> {name}</span>
        </Link>
      </Button>

      <Button type="button" variant="link" onClick={() => openQuote(`${name} collection`)}>
        Enquire<span className="sr-only"> about {name}</span>
      </Button>
    </div>
  );
}
