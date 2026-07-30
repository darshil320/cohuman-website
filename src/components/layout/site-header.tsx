"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { fullNav, primaryNav } from "@/lib/nav";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openQuote } = useQuoteDialog();

  return (
    <header className="sticky top-0 z-[60] border-b border-co-border bg-co-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-[1320px] items-center gap-8 px-[18px] sm:px-6 lg:px-11">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="block h-2.5 w-2.5 -rotate-[15deg] rounded-[50%_8%_50%_50%] bg-co-green" />
          <span className="font-display text-[23px] font-semibold tracking-tight text-co-ink">
            Co<span className="font-medium text-co-muted">Human</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-[14.5px] font-medium text-co-muted hover:bg-co-bg-alt hover:text-co-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          <Link
            href="/contact"
            className="hidden text-[14.5px] font-medium text-co-muted hover:text-co-ink lg:inline-block"
          >
            Contact
          </Link>
          <Button size="sm" onClick={() => openQuote()} className="whitespace-nowrap">
            Request a Quote
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 border border-co-border lg:hidden"
          >
            <span className="block h-[1.5px] w-4 bg-co-ink" />
            <span className="block h-[1.5px] w-4 bg-co-ink" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="animate-co-fade grid gap-0.5 border-t border-co-border bg-co-bg px-[18px] pb-[22px] pt-2.5 lg:hidden">
          {fullNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-co-bg-alt py-3.5 font-display text-[19px] font-medium text-co-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
