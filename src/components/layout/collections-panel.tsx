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
  { label: "B2B / bulk orders", href: "/b2b" },
] as const;

/**
 * The Collections panel — the header's full-page menu (Nov 2026, after amardeepdesign.com's
 * Products menu). Clicking "Collections" opens it under the bar: every group on the left
 * in display type with its count, and the active group's products as pictures on the
 * right. Pointing at (or focusing) a group swaps the pictures; the group's name itself
 * links to its section of /collections.
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
          <div className="co-shell grid min-h-full grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] gap-x-[clamp(32px,5vw,96px)] py-[clamp(32px,4vw,64px)]">
            <div className="flex flex-col">
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
                          "inline-flex items-start gap-3 whitespace-nowrap py-1 font-display text-[clamp(40px,3.8vw,72px)] font-semibold leading-[1.08] tracking-[-0.02em] transition-colors duration-150",
                          on ? "text-co-ink" : "text-co-border hover:text-co-muted-2",
                        )}
                      >
                        {group.label}
                        <span className="co-data mt-[0.6em] text-co-muted-2">({pad(group.items.length)})</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <ul className="mt-auto grid list-none gap-0 border-t border-co-ink p-0 pt-2">
                {PANEL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="co-data flex min-h-11 items-center justify-between border-b border-co-border text-co-muted transition-colors hover:text-co-ink"
                    >
                      {link.label}
                      <span aria-hidden>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-6 border-b border-co-ink pb-3">
                <p className="max-w-[56ch] text-[15px] leading-[1.55] text-co-ink-soft">{active.blurb}</p>
                <Link
                  href={`/collections#${active.id}`}
                  onClick={onClose}
                  className="co-data shrink-0 text-co-ink underline-offset-4 hover:underline"
                >
                  View all {active.label} →
                </Link>
              </div>
              <ul className="mt-6 grid list-none grid-cols-3 gap-x-5 gap-y-8 p-0 2xl:grid-cols-4">
                {active.items.map((item) => (
                  <li key={item.slug}>
                    <CollectionCard item={item} onNavigate={onClose} size="sm" sizes="(min-width: 1536px) 14vw, 18vw" />
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
 * Collections inside the phone menu: a row that expands in place to every group, each a
 * swipe rail of product pictures — products first, so a seating link no longer drops a
 * visitor straight into the quote form.
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
        <div id="mobile-collections" className="grid gap-7 pb-6">
          {groups.map((group) => (
            <section key={group.id} aria-label={group.label}>
              <div className="flex items-baseline justify-between">
                <p className="co-eyebrow">
                  {group.label} ({pad(group.items.length)})
                </p>
                <Link href={`/collections#${group.id}`} onClick={onNavigate} className="co-data text-co-ink">
                  All →
                </Link>
              </div>
              <ul className="-mx-[18px] mt-3 flex list-none gap-3 overflow-x-auto px-[18px] sm:-mx-6 sm:px-6 lg:-mx-12 lg:px-12 pb-1 [scrollbar-width:none]">
                {group.items.map((item) => (
                  <li key={item.slug} className="w-[38vw] max-w-[180px] shrink-0">
                    <CollectionCard item={item} onNavigate={onNavigate} size="sm" sizes="40vw" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <Link href="/collections" onClick={onNavigate} className="co-data text-co-ink">
            All collections →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
