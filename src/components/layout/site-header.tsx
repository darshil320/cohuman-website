"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wordmark } from "@/components/common/wordmark";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { cn } from "@/lib/utils";
import { HEADER_HEIGHT } from "@/lib/layout";
import { fullNav, primaryNav } from "@/lib/nav";
import { NavDrawer, type DrawerLink, type DrawerSeries } from "@/components/layout/nav-drawer";

/** How long the drawer survives the pointer leaving, so a diagonal sweep to it is forgiving. */
const DRAWER_CLOSE_MS = 180;

const DRAWER_LINKS: DrawerLink[] = [
  { label: "All collections", href: "/collections", note: "Both series, side by side." },
  { label: "Configure a desk", href: "/configure", note: "Pick the size and finish, get the part numbers." },
  { label: "Workspace solutions", href: "/solutions", note: "Furnish by room type." },
  { label: "B2B / bulk orders", href: "/b2b", note: "Floor-plate quantities on one schedule." },
];

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
export function SiteHeader({ series }: { series: DrawerSeries[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const { openQuote } = useQuoteDialog();
  const pathname = usePathname();

  // Close the overlay when the route changes, during render rather than in an effect:
  // an effect would paint the menu once over the new page before closing it.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMobileOpen(false);
    setDrawerOpen(false);
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

  /*
    A short close delay, so moving the pointer diagonally from the trigger into the panel
    does not snap it shut on the way. Opening is immediate — a hover delay on open reads
    as lag.
  */
  const openDrawer = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setDrawerOpen(false), DRAWER_CLOSE_MS);
  };

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  // Escape closes it, which is the expected key for a hover-revealed panel.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

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

        {/*
          Nav labels are mono and tracked out, matching the part-code language the pages
          use. The rule under a label grows from the left on hover as well as on the
          active route, so the header moves the same way the section links do.
        */}
        <nav className="ml-auto hidden items-center gap-[clamp(18px,2vw,30px)] lg:flex">
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            const isCollections = item.href === "/collections";
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={isCollections ? openDrawer : closeDrawer}
                onMouseLeave={isCollections ? closeDrawer : undefined}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-expanded={isCollections ? drawerOpen : undefined}
                  onFocus={isCollections ? openDrawer : undefined}
                  className={cn(
                    "group relative block py-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-200",
                    active || (isCollections && drawerOpen)
                      ? "text-co-ink"
                      : "text-co-muted hover:text-co-ink",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-co-ink transition-transform duration-300 ease-[var(--ease-co)] group-hover:scale-x-100",
                      active || (isCollections && drawerOpen) ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-5 sm:gap-6">
          <Link
            href="/contact"
            className="hidden font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-co-muted transition-colors hover:text-co-ink lg:inline-block"
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={() => openQuote()}
            className="hidden border-b-2 border-co-ink pb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-co-ink transition-colors hover:border-co-placeholder hover:text-co-muted min-[380px]:inline-flex"
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

      <div onMouseEnter={openDrawer} onMouseLeave={closeDrawer}>
        <NavDrawer
          open={drawerOpen}
          series={series}
          links={DRAWER_LINKS}
          onClose={() => setDrawerOpen(false)}
        />
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
            {/*
              Flush left against the page gutter, with the index in its own fixed column
              so every label starts on the same vertical. The rules run the full width of
              the shell rather than stopping under the text — the overlay reads as a
              contents page, which is what the numbering implies.
            */}
            <nav className="co-shell flex flex-col pt-[clamp(20px,5vh,44px)]">
              {fullNav.map((item, index) => {
                const active = isActive(item.href);
                return (
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
                      aria-current={active ? "page" : undefined}
                      className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-4 border-b border-co-border py-[clamp(12px,2vh,18px)]"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "font-mono text-[10.5px] tabular-nums transition-colors",
                          active ? "text-co-ink" : "text-co-placeholder",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-[clamp(21px,5.6vw,30px)] font-medium leading-tight tracking-[-0.03em] transition-colors",
                          active ? "text-co-ink" : "text-co-ink group-hover:text-co-muted",
                        )}
                      >
                        {item.label}
                      </span>
                      {/* Marks the route you are on without a second colour or a chip. */}
                      <span
                        aria-hidden
                        className={cn(
                          "block h-px w-6 self-center bg-co-ink transition-transform duration-300 ease-[var(--ease-co)]",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: fullNav.length * 0.035 + 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="co-shell mt-auto flex flex-col gap-5 py-[clamp(24px,5vh,44px)]"
            >
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openQuote();
                }}
                className="w-full bg-co-ink py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-co-bg transition-colors hover:bg-co-green-light"
              >
                Request a Quote
              </button>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="self-start border-b-2 border-co-ink pb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-co-ink"
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
