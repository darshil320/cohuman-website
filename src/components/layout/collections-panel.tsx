"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CollectionCard } from "@/components/collections/collection-card";
import type { CollectionGroup } from "@/lib/catalog/collection-menu";
import { HEADER_HEIGHT } from "@/lib/layout";
import { cn } from "@/lib/utils";

export const COLLECTIONS_PANEL_ID = "collections-panel";

const pad = (n: number) => String(n).padStart(2, "0");

const PANEL_LINKS = [
  { label: "All collections", href: "/collections" },
  { label: "Configure a desk", href: "/configure" },
  { label: "Tops & finishes", href: "/finishes" },
  { label: "B2B / bulk orders", href: "/b2b" },
] as const;

/**
 * The Collections panel — the header's full-page menu (Nov 2026, after amardeepdesign.com's
 * Products menu). Clicking "Collections" opens it under the bar: the groups on the left in
 * display type with their counts and, under them, a short list of related pages; the
 * active group's products on the right as large, borderless pictures, three across.
 * Pointing at (or focusing) a group swaps the pictures; the group's name links to its
 * section of /collections.
 *
 * It wipes down from the bar, like the mobile menu — no fade. Mounted only while open,
 * so the framer `initial` never reaches the server HTML.
 */
export function CollectionsPanel({
  open,
  groups,
  onClose,
}: {
  open: boolean;
  groups: CollectionGroup[];
  onClose: () => void;
}) {
  const [activeId, setActiveId] = useState(groups[0]?.id);
  const active = groups.find((g) => g.id === activeId) ?? groups[0];

  return (
    <AnimatePresence>
      {open && active ? (
        <motion.div
          id={COLLECTIONS_PANEL_ID}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
          style={{ top: HEADER_HEIGHT }}
          className="fixed inset-x-0 bottom-0 hidden overflow-y-auto border-t border-co-border bg-co-bg xl:block"
        >
          <div className="co-shell grid grid-cols-[minmax(280px,0.7fr)_minmax(0,1.7fr)] gap-x-[clamp(40px,5vw,96px)] py-[clamp(36px,4vw,64px)]">
            <nav aria-label="Collection groups" className="lg:sticky lg:top-0 lg:self-start">
              <ul className="list-none p-0">
                {groups.map((group) => {
                  const on = group.id === active.id;
                  return (
                    <li key={group.id}>
                      <Link
                        href={`/collections#${group.id}`}
                        onClick={onClose}
                        onMouseEnter={() => setActiveId(group.id)}
                        onFocus={() => setActiveId(group.id)}
                        aria-current={on ? "true" : undefined}
                        className={cn(
                          "inline-flex items-start gap-2.5 whitespace-nowrap py-1.5 font-display text-[clamp(36px,3.4vw,60px)] font-semibold leading-[1.05] tracking-[-0.02em] transition-colors duration-150",
                          on ? "text-co-ink" : "text-co-muted-2/45 hover:text-co-muted-2",
                        )}
                      >
                        {group.label}
                        <span className="co-data mt-[0.5em] text-co-muted-2">({pad(group.items.length)})</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <ul className="mt-10 grid list-none gap-2.5 border-t border-co-border p-0 pt-5">
                {PANEL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="co-data inline-flex min-h-8 items-center gap-2 text-co-muted transition-colors hover:text-co-ink"
                    >
                      {link.label}
                      <span aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <div className="flex items-baseline justify-between gap-6">
                <p className="co-eyebrow">
                  {active.label} · {pad(active.items.length)}
                </p>
                <Link
                  href={`/collections#${active.id}`}
                  onClick={onClose}
                  className="co-data text-co-ink underline-offset-4 hover:underline"
                >
                  View all →
                </Link>
              </div>
              <ul className="mt-5 grid list-none grid-cols-3 gap-x-6 gap-y-9 p-0">
                {active.items.map((item) => (
                  <li key={item.slug} className="min-w-0">
                    <CollectionCard
                      item={item}
                      variant="plain"
                      onNavigate={onClose}
                      size="sm"
                      sizes="(min-width: 1536px) 20vw, 22vw"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Collections inside the phone menu: a row that expands in place to the groups, each a
 * heading that links to its section and a swipe rail of fixed-width pictures — products
 * first, so a seating link no longer drops a visitor straight into the quote form.
 * Cards are a fixed 148px with one-line names, so the rail stays even.
 */
export function MobileCollections({
  groups,
  index,
  active,
  onNavigate,
}: {
  groups: CollectionGroup[];
  index: number;
  active: boolean;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-co-border">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="mobile-collections"
        className="relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 py-[clamp(12px,2vh,18px)] text-left"
      >
        <span aria-hidden className="co-data text-co-muted-2">
          {pad(index + 1)}
        </span>
        <span className="font-display text-[clamp(22px,6vw,32px)] font-semibold leading-[1.2] tracking-[-0.02em]">
          Collections
        </span>
        <span aria-hidden className="text-[22px] leading-none">
          {expanded ? "−" : "+"}
        </span>
        {active ? <span aria-hidden className="absolute -bottom-px left-0 block h-[2px] w-16 bg-co-ink" /> : null}
      </button>

      {expanded ? (
        <div id="mobile-collections" className="pb-5">
          {groups.map((group) => (
            <section key={group.id} aria-label={group.label} className="border-t border-co-border py-4">
              <Link
                href={`/collections#${group.id}`}
                onClick={onNavigate}
                className="flex items-baseline justify-between gap-4"
              >
                <span className="font-heading text-[19px] font-semibold text-co-ink">
                  {group.label} <span className="co-data text-co-muted-2">({pad(group.items.length)})</span>
                </span>
                <span className="co-data text-co-ink">All →</span>
              </Link>
              <ul className="-mx-[18px] mt-3 flex list-none snap-x snap-mandatory scroll-px-[18px] gap-3 overflow-x-auto px-[18px] pb-1 sm:scroll-px-6 [scrollbar-width:none] sm:-mx-6 sm:px-6">
                {group.items.map((item) => (
                  <li key={item.slug} className="w-[148px] shrink-0 snap-start">
                    <CollectionCard
                      item={item}
                      variant="plain"
                      showLine={false}
                      onNavigate={onNavigate}
                      size="sm"
                      sizes="148px"
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-co-border pt-4">
            {PANEL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={onNavigate} className="co-data text-co-ink">
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
