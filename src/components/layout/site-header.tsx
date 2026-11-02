"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { useHeroChrome } from "@/lib/hero-chrome";
import { cn } from "@/lib/utils";
import { HEADER_HEIGHT } from "@/lib/layout";
import { fullNav, primaryNav } from "@/lib/nav";
import {
  NavDrawer,
  type DrawerLink,
  type DrawerRange,
  type DrawerSeries,
} from "@/components/layout/nav-drawer";

/** How long the drawer survives the pointer leaving, so a diagonal sweep to it is forgiving. */
const DRAWER_CLOSE_MS = 180;

const DRAWER_LINKS: DrawerLink[] = [
  { label: "All collections", href: "/collections", note: "Every system, side by side." },
  { label: "Configure a desk", href: "/configure", note: "Pick the size and finish, get the part numbers." },
  { label: "Workspace solutions", href: "/solutions", note: "Furnish by room type." },
  { label: "B2B / bulk orders", href: "/b2b", note: "Floor-plate quantities on one schedule." },
];

/**
 * Site header — the moodboard's nav bar.
 *
 * Logo, mono nav, and the one primary action: "Get a quote" with the signal dots. A solid
 * canvas bar on a hairline. The active route is marked by a 2px rule under its label plus
 * `aria-current`; the green stays on the quote button's dots, so the header never puts two
 * green things on one screen.
 *
 * Over the homepage's full-bleed hero the bar goes transparent (`useHeroChrome`), with
 * light type and the reversed logo on a dark film. It turns solid again once the hero has
 * scrolled away, or whenever the drawer or the mobile menu is open.
 *
 * NEVER give this element `backdrop-filter`, `filter`, `transform` or `will-change`. Any
 * of them makes the header the containing block for its `position: fixed` children, and
 * the mobile menu — sized `top: 72px; bottom: 0` against the viewport — collapses to the
 * header's own box and vanishes. That was the "menu won't open after scrolling" bug: the
 * old header added `backdrop-blur` once the page scrolled.
 */
export function SiteHeader({ series, ranges }: { series: DrawerSeries[]; ranges: DrawerRange[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const hero = useHeroChrome();
  const transparent = hero.overHero && !mobileOpen && !drawerOpen;
  // Light type, for a transparent bar over dark footage.
  const onDark = transparent && hero.tone === "dark";
  const ink = onDark ? "bg-co-panel-fg" : "bg-co-ink";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b transition-colors duration-200",
        transparent ? "border-transparent bg-transparent" : "border-co-border bg-co-bg",
      )}
    >
      <div
        style={{ height: HEADER_HEIGHT }}
        className="co-shell flex items-center justify-between gap-4 sm:gap-8"
      >
        <Link href="/" className="group flex shrink-0 items-center" aria-label="Cohuman — home">
          <Logo
            eager
            tone={onDark ? "light" : "dark"}
            className="w-[140px] sm:w-[150px]"
          />
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-[clamp(16px,1.9vw,32px)] xl:flex">
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
                    "co-data group relative block py-2 transition-colors duration-150",
                    // Over footage, type runs full strength — a muted grey vanishes on a
                    // busy frame. The muted rest state is for the solid bar only.
                    onDark
                      ? "text-co-panel-fg"
                      : transparent || active || (isCollections && drawerOpen)
                        ? "text-co-ink"
                        : "text-co-muted hover:text-co-ink",
                  )}
                >
                  {item.label}
                  {/*
                    Ink, not green: the header already carries this screen's one green
                    thing — the dots on "Get a quote" — and it is on every screen.
                  */}
                  {active ? (
                    <span aria-hidden className={cn("absolute -bottom-px left-0 block h-[2px] w-full", ink)} />
                  ) : (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute bottom-0 left-0 block h-px w-full origin-left transition-transform duration-[400ms] ease-linear group-hover:scale-x-100",
                        ink,
                        isCollections && drawerOpen ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-5 sm:gap-6">
          <Link
            href="/contact"
            aria-current={isActive("/contact") ? "page" : undefined}
            className={cn(
              "co-data hidden transition-colors xl:inline-block",
              onDark ? "text-co-panel-fg" : transparent ? "text-co-ink" : "text-co-muted hover:text-co-ink",
            )}
          >
            Contact
          </Link>
          <Button
            type="button"
            size="sm"
            dots
            variant={onDark ? "onDark" : "primary"}
            onClick={() => openQuote()}
            className="gap-2.5 px-3 sm:gap-3.5 sm:px-4"
          >
            {/* Shortened on phones so the action never drops out of the bar. */}
            <span className="sm:hidden">Quote</span>
            <span className="hidden sm:inline">Get a quote</span>
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={cn(
              "relative flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[6px] border xl:hidden",
              onDark ? "border-co-panel-fg" : "border-co-ink",
            )}
          >
            <span
              className={cn(
                "block h-px w-[18px] transition-transform duration-200",
                ink,
                mobileOpen && "absolute rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-[18px] transition-transform duration-200",
                ink,
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
          ranges={ranges}
          links={DRAWER_LINKS}
          onClose={() => setDrawerOpen(false)}
        />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          /*
            The overlay wipes down from the bar rather than fading — the same plotter
            motion as the page. Interactive chrome, mounted on demand, so a framer
            `initial` here never reaches the server HTML.
          */
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
            style={{ top: HEADER_HEIGHT }}
            className="fixed inset-x-0 bottom-0 flex flex-col overflow-y-auto bg-co-bg xl:hidden"
          >
            <nav aria-label="Menu" className="co-shell flex w-full flex-col pt-[clamp(16px,4vh,36px)]">
              {fullNav.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 border-b border-co-border py-[clamp(12px,2vh,18px)]"
                  >
                    <span aria-hidden className="co-data text-co-muted-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(22px,6vw,32px)] font-semibold leading-[0.95] tracking-[-0.02em]">
                      {item.label}
                    </span>
                    <span aria-hidden className="text-[18px] leading-none">
                      →
                    </span>
                    {active ? (
                      <span aria-hidden className="absolute -bottom-px left-0 block h-[2px] w-16 bg-co-ink" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="co-shell mt-auto flex w-full flex-col gap-4 py-[clamp(24px,5vh,44px)]">
              <Button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openQuote();
                }}
                className="w-full"
              >
                Get a quote
              </Button>
              <Button asChild variant="link" arrow className="self-start justify-self-start">
                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                  Contact &amp; showroom
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
