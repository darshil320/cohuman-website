"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

/**
 * Numbered part list beside the reference render.
 *
 * The source design pinned each number onto a front elevation of the bench. That
 * elevation is not among the renders the manufacturer's PDF ships, and pinning numbers
 * onto a three-quarter studio shot puts them next to parts you cannot actually see — so
 * the numbers live in the chip row instead, where every one of them is honest.
 */
export function SeriesAnatomy() {
  const { series, partIndex, setPart } = useSeriesConfigurator();
  const part = series.parts[partIndex];
  const section = series.anatomySection;

  return (
    <section id="anatomy" className="scroll-mt-[82px] border-b border-co-border">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(46px,5.4vw,82px)] sm:px-6 lg:px-11">
        <Reveal>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.19em] text-co-green">
            {section.eyebrow}
          </p>
          <h2 className="mb-[clamp(26px,3.2vw,40px)] max-w-[24ch] font-display text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.03] tracking-[-0.033em]">
            {section.heading}
          </h2>
        </Reveal>

        <div className="grid items-start gap-[clamp(22px,3vw,46px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <div className="relative aspect-[16/10] overflow-hidden border border-co-card-border bg-[radial-gradient(120%_100%_at_50%_0%,#FFFFFF_0%,#F8F6F1_50%,#EDEAE2_100%)]">
            <Image
              src={series.anatomyImage}
              alt={series.anatomyCaption}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-contain p-[4%] mix-blend-multiply"
            />
            <p className="absolute left-4 top-4 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-co-placeholder">
              {series.anatomyCaption}
            </p>
          </div>

          <div>
            <div className="mb-5 grid grid-cols-[repeat(auto-fill,minmax(34px,1fr))] gap-1">
              {series.parts.map((item, index) => {
                const on = index === partIndex;
                return (
                  <button
                    key={item.n}
                    type="button"
                    title={item.name}
                    aria-pressed={on}
                    onClick={() => setPart(index)}
                    className={cn(
                      "aspect-square border p-0 text-[13px] font-semibold transition-colors",
                      on
                        ? "border-co-ink bg-co-ink text-co-bg"
                        : "border-co-border bg-co-bg text-co-faint hover:border-co-ink",
                    )}
                  >
                    {item.n}
                  </button>
                );
              })}
            </div>

            <div className="border border-co-border bg-white shadow-[0_1px_0_#EDEAE3,0_14px_34px_-22px_rgba(31,35,40,0.3)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={part.n}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="flex items-start gap-3.5 border-b border-co-card-border px-5 pb-4 pt-5">
                    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center bg-co-green text-[13.5px] font-bold text-co-cta-green-ink">
                      {part.n}
                    </span>
                    <div>
                      <h3 className="mb-1 font-display text-[21px] font-medium leading-tight tracking-[-0.024em]">
                        {part.name}
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-co-placeholder">
                        {part.group}
                      </p>
                    </div>
                  </div>
                  <dl className="grid">
                    {part.rows.map((row) => (
                      <div
                        key={row.k}
                        className="grid grid-cols-[minmax(88px,0.42fr)_1fr] gap-4 border-b border-co-card-border/60 px-5 py-3"
                      >
                        <dt className="pt-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-co-placeholder">
                          {row.k}
                        </dt>
                        <dd className="text-[14.5px] leading-normal text-co-ink-soft">{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="px-5 pb-4 pt-3.5 text-[13.5px] font-light leading-snug text-co-muted">
                    {part.why}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="mt-3.5 text-[12.5px] font-light leading-snug text-co-placeholder">
              Pick a number to read that part&apos;s gauge and finish. Materials are quoted from
              the manufacturer&apos;s specification sheet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
