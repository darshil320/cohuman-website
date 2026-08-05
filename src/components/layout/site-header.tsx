"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { cn } from "@/lib/utils";
import { HEADER_HEIGHT } from "@/lib/layout";
import { fullNav, primaryNav } from "@/lib/nav";
import { motion, AnimatePresence } from "framer-motion";

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
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-[4px] rounded-full border border-slate-200/80 bg-white shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
          >
            <span className={cn("block h-[1.5px] w-4 bg-slate-800 transition-all duration-300", mobileOpen ? "absolute rotate-45" : "")} />
            <span className={cn("block h-[1.5px] w-4 bg-slate-800 transition-all duration-300", mobileOpen ? "absolute -rotate-45" : "")} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2, delay: 0 } }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full flex flex-col border-t border-slate-200/60 bg-white/95 px-[22px] pb-10 pt-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col">
              {fullNav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, delay: i * 0.05 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="group flex items-center justify-between border-b border-slate-200/50 py-4 font-display text-[24px] font-medium tracking-tight text-slate-900 transition-colors hover:text-[#6fa82b]"
                  >
                    {item.label}
                    <span className="text-slate-300 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#6fa82b] group-hover:opacity-100">
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, delay: fullNav.length * 0.05 + 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col gap-4"
            >
              <Button
                size="lg"
                onClick={() => {
                  setMobileOpen(false);
                  openQuote();
                }}
                className="w-full rounded-full bg-[#6fa82b] py-6 text-[16px] font-semibold text-slate-950 shadow-[0_0_20px_rgba(111,168,43,0.2)] transition-all hover:bg-[#80bc33] hover:shadow-[0_0_25px_rgba(111,168,43,0.4)]"
              >
                Request a Quote
              </Button>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-slate-200 bg-slate-50 py-4 text-[15px] font-semibold text-slate-800 transition-colors hover:bg-slate-100"
              >
                Contact Showroom
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
