"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wordmark } from "@/components/common/wordmark";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { cn } from "@/lib/utils";
import { HEADER_HEIGHT } from "@/lib/layout";
import { fullNav, primaryNav } from "@/lib/nav";

/** Scroll distance after which the header tightens onto a hairline. */
const CONDENSE_AT = 20;

/**
 * Site header.
 *
 * Type and hairlines only — the pills, shadows and raw `slate-*` values this used to
 * carry were the one piece of chrome that contradicted every page under it. The active
 * route is marked by a rule under the label rather than a filled chip, which is the same
 * device the configurator and the collections index use for selection.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openQuote } = useQuoteDialog();
  const pathname = usePathname();

  // Close the overlay when the route changes, during render rather than in an effect:
  // an effect would paint the menu once over the new page before closing it.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > CONDENSE_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The overlay is fixed and full-height, so the page behind it must not scroll under it.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b transition-colors duration-300",
        scrolled ? "border-co-border bg-co-bg/92 backdrop-blur-xl" : "border-transparent bg-co-bg",
      )}
    >
      <div
        style={{ height: HEADER_HEIGHT }}
        className="co-shell flex items-center justify-between gap-4 sm:gap-8"
      >
        <Link href="/" className="group flex shrink-0 items-center" aria-label="Cohuman — home">
          <Wordmark className="text-[17px] text-co-ink transition-opacity duration-300 group-hover:opacity-60 sm:text-[19px]" />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-1 text-[13.5px] font-medium transition-colors duration-200",
                  active ? "text-co-ink" : "text-co-muted hover:text-co-ink",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-co-ink transition-transform duration-300 ease-[var(--ease-co)]",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5 sm:gap-6">
          <Link
            href="/contact"
            className="hidden text-[13.5px] font-medium text-co-muted transition-colors hover:text-co-ink lg:inline-block"
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={() => openQuote()}
            className="hidden border-b-2 border-co-ink pb-1 text-[13.5px] font-semibold text-co-ink transition-colors hover:border-co-placeholder hover:text-co-muted min-[380px]:inline-flex"
          >
            Request a Quote
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="relative flex h-6 w-6 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={cn(
                "block h-px w-5 bg-co-ink transition-transform duration-300 ease-[var(--ease-co)]",
                mobileOpen && "absolute rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-co-ink transition-transform duration-300 ease-[var(--ease-co)]",
                mobileOpen && "absolute -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ top: HEADER_HEIGHT }}
            className="fixed inset-x-0 bottom-0 flex flex-col overflow-y-auto bg-co-bg lg:hidden"
          >
            <nav className="co-shell flex flex-col pt-6">
              {fullNav.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.035,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group flex items-baseline gap-4 border-b border-co-border py-4"
                  >
                    <span
                      aria-hidden
                      className="font-mono text-[10.5px] tabular-nums text-co-placeholder"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "co-h3 transition-colors",
                        isActive(item.href) ? "text-co-ink" : "text-co-ink group-hover:text-co-muted",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: fullNav.length * 0.035 + 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="co-shell mt-auto flex flex-col gap-5 py-10"
            >
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openQuote();
                }}
                className="w-full bg-co-ink py-4 text-[15px] font-semibold text-co-bg transition-colors hover:bg-co-green-light"
              >
                Request a Quote
              </button>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full border-b-2 border-co-ink pb-2 text-center text-[15px] font-semibold text-co-ink"
              >
                Contact showroom
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
