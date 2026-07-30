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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-colors duration-300",
        solid
          ? "border-b border-co-border bg-co-bg/90 backdrop-blur-md"
          : "border-b border-white/15 bg-black/20 backdrop-blur-xl",
      )}
    >
      <div
        style={{ height: HEADER_HEIGHT }}
        className="mx-auto flex max-w-[1320px] items-center gap-8 px-[18px] sm:px-6 lg:px-11"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span
            className={cn(
              "block h-2.5 w-2.5 -rotate-[15deg] rounded-[50%_8%_50%_50%]",
              solid ? "bg-co-green" : "bg-co-green-light",
            )}
          />
          <span
            className={cn(
              "font-display text-[23px] font-semibold tracking-tight",
              solid ? "text-co-ink" : "text-white",
            )}
          >
            Co
            <span className={solid ? "font-medium text-co-muted" : "font-medium text-white/70"}>
              Human
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-[14.5px] font-medium",
                solid
                  ? "text-co-muted hover:bg-co-bg-alt hover:text-co-ink"
                  : "text-white/90 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          <Link
            href="/contact"
            className={cn(
              "hidden text-[14.5px] font-medium lg:inline-block",
              solid ? "text-co-muted hover:text-co-ink" : "text-white/90 hover:text-white",
            )}
          >
            Contact
          </Link>
          <Button
            size="sm"
            onClick={() => openQuote()}
            className={cn(
              "whitespace-nowrap",
              solid ? undefined : "bg-white text-co-ink hover:bg-white/90",
            )}
          >
            Request a Quote
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            className={cn(
              "flex h-10 w-10 flex-col items-center justify-center gap-1 border lg:hidden",
              solid ? "border-co-border" : "border-white/40",
            )}
          >
            <span className={cn("block h-[1.5px] w-4", solid ? "bg-co-ink" : "bg-white")} />
            <span className={cn("block h-[1.5px] w-4", solid ? "bg-co-ink" : "bg-white")} />
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
