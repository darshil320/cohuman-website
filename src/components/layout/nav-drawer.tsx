"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HEADER_HEIGHT } from "@/lib/layout";

export interface DrawerSeries {
  slug: string;
  wordmark: string;
  name: string;
  kicker: string;
  blurb: string;
  image: string;
  /** Configuration count and the millimetre span, read off the series data. */
  configs: number;
  span: string;
}

export interface DrawerLink {
  label: string;
  href: string;
  note: string;
}

/**
 * The Collections drawer.
 *
 * Hovering "Collections" in the header drops a full-width panel carrying both desking
 * series as photographed plates with their real configuration counts and millimetre
 * spans, plus the routes that sit under them. A dropdown of text links would have been
 * the conventional answer; a drawer that shows the product and quotes its specification
 * is the same drawing-sheet language the pages under it use.
 *
 * Presentation only — every link in here also exists in the normal nav and on
 * /collections, so nothing is reachable exclusively by hover.
 */
export function NavDrawer({
  open,
  series,
  links,
  onClose,
}: {
  open: boolean;
  series: DrawerSeries[];
  links: DrawerLink[];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          style={{ top: HEADER_HEIGHT }}
          className="absolute inset-x-0 hidden border-b border-co-border bg-co-bg/97 backdrop-blur-xl lg:block"
        >
          <div className="co-shell grid grid-cols-[1.55fr_0.9fr] gap-x-[clamp(32px,4vw,72px)] py-[clamp(28px,3.2vw,48px)]">
            <div className="grid grid-cols-2 gap-x-[clamp(20px,2.4vw,40px)]">
              {series.map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={`/collections/${s.slug}`} onClick={onClose} className="group block">
                    <span className="relative block aspect-[4/3] overflow-hidden bg-co-bg-alt">
                      <Image
                        src={s.image}
                        alt={s.name}
                        fill
                        sizes="30vw"
                        className="object-contain mix-blend-multiply transition-transform duration-[900ms] ease-[var(--ease-co)] group-hover:scale-[1.05]"
                      />
                      <span
                        aria-hidden
                        className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-co-placeholder"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>

                    <span className="mt-3.5 block h-px w-full bg-co-border transition-colors duration-500 group-hover:bg-co-ink" />

                    <span className="mt-3.5 flex items-baseline justify-between gap-3">
                      <span className="font-display text-[clamp(17px,1.5vw,21px)] font-medium tracking-[-0.028em] text-co-ink">
                        {s.wordmark}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-co-placeholder">
                        {s.configs} configs
                      </span>
                    </span>
                    <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-co-placeholder">
                      {s.span}
                    </span>
                    <span className="mt-2.5 block max-w-[34ch] text-[13px] font-light leading-relaxed text-co-muted">
                      {s.blurb}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.17, ease: [0.16, 1, 0.3, 1] }}
              className="border-l border-co-border pl-[clamp(20px,2.4vw,40px)]"
            >
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-co-muted">
                Go deeper
              </p>
              <div className="mt-5 grid">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={onClose}
                    className="group grid border-t border-co-border py-3.5 last:border-b"
                  >
                    <span className="font-display text-[15.5px] font-medium tracking-[-0.02em] text-co-ink transition-colors group-hover:text-co-muted">
                      {l.label}
                    </span>
                    <span className="mt-1 text-[12.5px] font-light leading-relaxed text-co-muted">
                      {l.note}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
