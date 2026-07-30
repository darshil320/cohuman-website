"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { cn } from "@/lib/utils";
import { fullNav, primaryNav } from "@/lib/nav";

export const HEADER_HEIGHT = 74;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openQuote } = useQuoteDialog();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || mobileOpen;
  const glassText = solid ? "" : "[text-shadow:0_1px_3px_rgb(0_0_0_/_0.5)]";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-all duration-300 ease-in-out",
        solid
          ? "border-b border-white/10 bg-[#141d13]/85 backdrop-blur-xl shadow-lg shadow-black/20"
          : "border-b border-white/10 bg-[#141d13]/35 backdrop-blur-xl shadow-sm",
      )}
    >
      <div
        style={{ height: HEADER_HEIGHT }}
        className="mx-auto flex max-w-[1320px] items-center gap-8 px-[18px] sm:px-6 lg:px-11"
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="block h-2.5 w-2.5 -rotate-[15deg] rounded-[50%_8%_50%_50%] bg-co-green shadow-[0_0_10px_rgba(111,168,43,0.6)] transition-transform group-hover:scale-110" />
          <span className="font-display text-[23px] font-semibold tracking-tight text-white">
            Co
            <span className="font-medium text-white/70 transition-colors group-hover:text-white/90">
              Human
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1.5 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-[14.5px] font-medium text-white/85 transition-all duration-200 hover:bg-white/15 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link
            href="/contact"
            className="hidden rounded-full px-3.5 py-1.5 text-[14.5px] font-medium text-white/85 transition-all duration-200 hover:bg-white/15 hover:text-white lg:inline-block"
          >
            Contact
          </Link>
          <Button
            size="sm"
            onClick={() => openQuote()}
            className="rounded-md bg-co-green px-4 py-2 text-[14px] font-semibold text-co-panel-fg shadow-[0_0_15px_rgba(111,168,43,0.3)] transition-all hover:bg-co-green-light hover:shadow-[0_0_20px_rgba(166,216,91,0.5)]"
          >
            Request a Quote
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-md border border-white/20 bg-white/5 lg:hidden"
          >
            <span className="block h-[1.5px] w-4 bg-white" />
            <span className="block h-[1.5px] w-4 bg-white" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="animate-co-fade grid gap-0.5 border-t border-white/10 bg-[#141d13] px-[18px] pb-[22px] pt-2.5 lg:hidden">
          {fullNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-white/10 py-3.5 font-display text-[19px] font-medium text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
