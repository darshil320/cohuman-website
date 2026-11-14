"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { useHeroChrome } from "@/lib/hero-chrome";
import { useOverlayFocus } from "@/lib/use-overlay-focus";
import { cn } from "@/lib/utils";
import { HEADER_HEIGHT } from "@/lib/layout";
import { fullNav, primaryNav } from "@/lib/nav";
import {
  COLLECTIONS_PANEL_ID,
  CollectionsPanel,
  MobileCollections,
} from "@/components/layout/collections-panel";
import type { CollectionGroup } from "@/lib/catalog/collection-menu";

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
 * scrolled away, or whenever the Collections panel or the mobile menu is open.
 *
 * "Collections" is a button, not a hover: clicking it opens the full-page Collections
 * panel under the bar (`collections-panel.tsx`) and clicking again closes it.
 *
 * NEVER give this element `backdrop-filter`, `filter`, `transform` or `will-change`. Any
 * of them makes the header the containing block for its `position: fixed` children, and
 * the mobile menu — sized `top: 72px; bottom: 0` against the viewport — collapses to the
 * header's own box and vanishes. That was the "menu won't open after scrolling" bug: the
 * old header added `backdrop-blur` once the page scrolled.
 *
 * Both overlays are CSS (`co-drop` in globals.css), not framer: they wipe down from the
 * bar on a transition, so closing one mid-open turns it around, and the header ships no
 * animation library. Each mounts on its first open and then stays mounted, `inert` and
 * hidden while closed. `useOverlayFocus` moves focus in, keeps Tab inside, closes on
 * Escape and hands focus back to the trigger.
 */
export function SiteHeader({ groups }: { groups: CollectionGroup[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Mounted on first open, kept after, so the close can animate and the panel's images
  // are not fetched on pages where nobody opens it.
  const [menuMounted, setMenuMounted] = useState(false);
  if (mobileOpen && !menuMounted) setMenuMounted(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerToggleRef = useRef<HTMLButtonElement>(null);
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

  // Both overlays are fixed and full-height, so the page behind must not scroll under them.
  const overlayOpen = mobileOpen || drawerOpen;
  useEffect(() => {
    if (!overlayOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlayOpen]);

  useOverlayFocus(mobileOpen, menuRef, menuToggleRef, () => setMobileOpen(false));
  useOverlayFocus(drawerOpen, drawerRef, drawerToggleRef, () => setDrawerOpen(false));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const hero = useHeroChrome();
  const transparent = hero.overHero && !mobileOpen && !drawerOpen;
  // Light type, for a transparent bar over dark footage.
  const onDark = transparent && hero.tone === "dark";
  const ink = onDark ? "bg-co-panel-fg" : "bg-co-ink";

  return (
    <header
      data-print="hide"
      className={cn(
        "fixed inset-x-0 top-0 z-[60] border-b transition-colors duration-200",
        transparent ? "border-transparent bg-transparent" : "border-co-border bg-co-bg",
      )}
    >
      <div
        style={{ height: HEADER_HEIGHT }}
        className="co-shell flex items-center justify-between gap-4 sm:gap-8"
      >
        <Link href="/" className="co-hit group flex shrink-0 items-center" aria-label="Cohuman — home">
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
              <div key={item.href} className="relative">
                <NavItem
                  href={item.href}
                  isToggle={isCollections}
                  buttonRef={drawerToggleRef}
                  expanded={drawerOpen}
                  onToggle={() => setDrawerOpen((v) => !v)}
                  onNavigate={() => setDrawerOpen(false)}
                  aria-current={active ? "page" : undefined}
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
                </NavItem>
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
            aria-keyshortcuts="q"
            className="co-hit gap-2.5 px-3 sm:gap-3.5 sm:px-4"
          >
            {/* Shortened on phones so the action never drops out of the bar. */}
            <span className="sm:hidden">Quote</span>
            <span className="hidden sm:inline">Get a quote</span>
            {/* The keyboard shortcut, shown where there is a keyboard: a square key cap. */}
            <kbd
              aria-hidden
              title="Press Q"
              className="hidden h-[18px] min-w-[18px] items-center justify-center border border-current px-1 font-mono text-[10px] leading-none opacity-70 xl:inline-flex"
            >
              Q
            </kbd>
          </Button>

          {/*
            40px visual, 44px target (`co-hit`). The two bars cross into an X with
            transform only — each slides 3.5px (half the 7px between their centres) and
            turns — so neither jumps position mid-turn.
          */}
          <button
            ref={menuToggleRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className={cn(
              "co-hit flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[6px] border xl:hidden",
              onDark ? "border-co-panel-fg" : "border-co-ink",
            )}
          >
            <span
              className={cn(
                "block h-px w-[18px] transition-transform duration-(--duration-drawer-in) ease-(--ease-move)",
                ink,
                mobileOpen && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-[18px] transition-transform duration-(--duration-drawer-in) ease-(--ease-move)",
                ink,
                mobileOpen && "-translate-y-[3.5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </div>

      {/* Read-head: how far down the sheet you are (scroll-driven CSS, see globals.css). */}
      <span
        aria-hidden
        data-motion-keep
        className={cn("co-readhead pointer-events-none absolute inset-x-0 -bottom-px h-px", ink)}
      />

      <CollectionsPanel
        open={drawerOpen}
        groups={groups}
        panelRef={drawerRef}
        onClose={() => setDrawerOpen(false)}
      />

      {menuMounted ? (
        /*
          The overlay wipes down from the bar rather than fading — the same plotter
          motion as the page. Mounted on first open, never in the server HTML.
        */
        <div
          ref={menuRef}
          id="mobile-menu"
          data-open={mobileOpen ? "" : undefined}
          inert={!mobileOpen}
          style={{ top: HEADER_HEIGHT }}
          className="co-drop fixed inset-x-0 bottom-0 flex flex-col overflow-y-auto bg-co-bg xl:hidden"
        >
          <nav aria-label="Menu" className="co-shell flex w-full flex-col pt-[clamp(16px,4vh,36px)]">
            {fullNav.map((item, index) => {
              const active = isActive(item.href);
              if (item.href === "/collections") {
                return (
                  <MobileCollections
                    key={item.href}
                    groups={groups}
                    index={index}
                    active={active}
                    onNavigate={() => setMobileOpen(false)}
                  />
                );
              }
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
                  <span className="font-display text-[clamp(22px,6vw,32px)] font-semibold leading-[1.2] tracking-[-0.02em]">
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
              still
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
        </div>
      ) : null}
    </header>
  );
}

/**
 * A primary-nav entry: a link, or — for Collections — a button that toggles the panel.
 * The button keeps the link's look and its active rule.
 */
function NavItem({
  href,
  isToggle,
  buttonRef,
  expanded,
  onToggle,
  onNavigate,
  className,
  children,
  "aria-current": ariaCurrent,
}: {
  href: string;
  isToggle: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  className: string;
  children: ReactNode;
  "aria-current"?: "page";
}) {
  if (isToggle) {
    return (
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={COLLECTIONS_PANEL_ID}
        aria-current={ariaCurrent}
        className={className}
      >
        {children}
      </button>
    );
  }
  return (
    <Link href={href} onClick={onNavigate} aria-current={ariaCurrent} className={className}>
      {children}
    </Link>
  );
}
