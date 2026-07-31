"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { cn } from "@/lib/utils";
import { HEADER_HEIGHT } from "@/lib/layout";
import { fullNav, primaryNav } from "@/lib/nav";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openQuote } = useQuoteDialog();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b transition-all duration-300 ease-in-out",
        scrolled
          ? "border-slate-200/90 bg-white/95 backdrop-blur-md shadow-sm"
          : "border-slate-200/60 bg-white backdrop-blur-md shadow-xs",
      )}
    >
      <div
        style={{ height: HEADER_HEIGHT }}
        className="mx-auto flex max-w-[1320px] items-center gap-8 px-[18px] sm:px-6 lg:px-11"
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="block h-2.5 w-2.5 -rotate-[15deg] rounded-[50%_8%_50%_50%] bg-[#6fa82b] transition-transform group-hover:scale-110" />
          <span className="font-display text-[23px] font-semibold tracking-tight text-slate-900">
            Co
            <span className="font-medium text-slate-600 transition-colors group-hover:text-slate-900">
              Human
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-[14.5px] font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link
            href="/contact"
            className="hidden rounded-full px-3.5 py-1.5 text-[14.5px] font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 lg:inline-block"
          >
            Contact
          </Link>
          <Button
            size="sm"
            onClick={() => openQuote()}
            className="rounded-md bg-[#6fa82b] px-4 py-2 text-[14px] font-semibold text-slate-950 shadow-sm transition-all hover:bg-[#80bc33] hover:shadow-md"
          >
            Request a Quote
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-50 lg:hidden"
          >
            <span className="block h-[1.5px] w-4 bg-slate-800" />
            <span className="block h-[1.5px] w-4 bg-slate-800" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="animate-co-fade grid gap-0.5 border-t border-slate-200 bg-white px-[18px] pb-[22px] pt-2.5 lg:hidden">
          {fullNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-slate-100 py-3.5 font-display text-[19px] font-medium text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
