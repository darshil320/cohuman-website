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

/** A photographed range: no specification, so a name and a type, not a measured plate. */
export interface DrawerRange {
  slug: string;
  wordmark: string;
  kicker: string;
}

export interface DrawerLink {
  label: string;
  href: string;
  note: string;
}

/**
 * The Collections drawer.
 *
 * Hovering "Collections" in the header drops a full-width panel carrying the specified
 * desking series as measured figures — the cut-out, its real configuration count and
 * millimetre span — with the photographed ranges listed by name beneath them (they have
 * no specification to draw), plus the routes that sit under them. It wipes down from the bar; nothing fades.
 *
 * Presentation only — every link in here also exists in the normal nav and on
 * /collections, so nothing is reachable exclusively by hover.
 */
export function NavDrawer({
  open,
  series,
  ranges,
  links,
  onClose,
}: {
  open: boolean;
  series: DrawerSeries[];
  ranges: DrawerRange[];
  links: DrawerLink[];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.28, ease: [0.65, 0, 0.35, 1] }}
          style={{ top: HEADER_HEIGHT }}
          className="absolute inset-x-0 hidden border-b border-co-ink bg-co-bg xl:block"
        >
          <div className="co-shell grid grid-cols-[1.55fr_0.9fr] gap-x-[clamp(32px,4vw,72px)] py-[clamp(28px,3vw,44px)]">
            <div>
            <div className="grid grid-cols-2 gap-x-[clamp(20px,2.4vw,40px)]">
              {series.map((s, i) => (
                <Link key={s.slug} href={`/collections/${s.slug}`} onClick={onClose} className="group block">
                  <figure className="relative block aspect-[16/10] border border-co-border bg-co-bg transition-colors duration-150 group-hover:bg-co-bg-alt">
                    <Image src={s.image} alt="" fill sizes="30vw" className="co-cutout object-contain p-6" />
                    <figcaption className="co-data absolute left-3 top-3 text-co-muted-2">
                      Fig. {String(i + 1).padStart(2, "0")}
                    </figcaption>
                  </figure>
                  <span className="mt-4 flex items-baseline justify-between gap-3 border-t border-co-ink pt-3">
                    <span className="font-display text-[clamp(20px,1.8vw,26px)] font-semibold leading-[1.2] tracking-[-0.02em] text-co-ink">
                      {s.wordmark}
                    </span>
                    <span className="co-data text-co-muted-2">{s.configs} configs</span>
                  </span>
                  <span className="co-data mt-1.5 block text-co-ink">{s.span}</span>
                  <span className="mt-2 block max-w-[38ch] text-[14px] leading-relaxed text-co-muted">
                    {s.blurb}
                  </span>
                </Link>
              ))}
            </div>

            {ranges.length ? (
              <div className="mt-6 border-t border-co-ink pt-4">
                <p className="co-eyebrow">Photographed ranges / sized to plan</p>
                <ul className="mt-3 grid grid-cols-3 gap-x-[clamp(20px,2.4vw,40px)]">
                  {ranges.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/collections/${r.slug}`}
                        onClick={onClose}
                        className="group block border-b border-co-border py-2 transition-colors duration-150 hover:bg-co-bg-alt"
                      >
                        <span className="block font-display text-[18px] font-semibold leading-[1.2] tracking-[-0.01em] text-co-ink">
                          {r.wordmark}
                        </span>
                        <span className="mt-1.5 block text-[13px] leading-snug text-co-muted">{r.kicker}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            </div>

            <div className="border-l border-co-border pl-[clamp(20px,2.4vw,40px)]">
              <p className="co-eyebrow">Go deeper</p>
              <div className="mt-4 grid">
                {links.map((l, i) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={onClose}
                    className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-2 border-t border-co-border py-3.5 transition-colors last:border-b hover:bg-co-bg-alt"
                  >
                    <span className="co-data text-co-muted-2">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="co-data block text-co-ink">{l.label}</span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-co-muted">{l.note}</span>
                    </span>
                    <span aria-hidden className="pr-1 transition-transform duration-150 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
