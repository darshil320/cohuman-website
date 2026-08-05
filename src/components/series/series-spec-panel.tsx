"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  INFERRED_CODE_FOOTNOTE,
  depthFieldLabel,
  depthOptions,
  isInferredCode,
  lengthFieldLabel,
} from "@/lib/series";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";

const sizeButton = (on: boolean) =>
  cn(
    "border px-3 py-2 text-[13.5px] font-medium tabular-nums transition-colors",
    on
      ? "border-co-ink bg-co-ink text-co-bg"
      : "border-co-border-strong bg-transparent text-co-muted hover:border-co-ink",
  );

export function SeriesSpecPanel() {
  const { series, config, selection, lenIndex, depIndex, setLength, setDepth } =
    useSeriesConfigurator();
  const depths = depthOptions(selection);
  const hasInferred = config.bom.some((line) => isInferredCode(series, line.code));

  return (
    <div className="min-w-0">
      <div className="mb-3.5 flex items-center gap-2.5">
        <span aria-hidden className="block h-px w-[22px] bg-co-green" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.19em] text-co-green">
          {series.eyebrow}
        </p>
      </div>
      <h1 className="mb-1.5 font-display text-[clamp(34px,4.4vw,60px)] font-medium leading-[0.94] tracking-[-0.04em]">
        {series.wordmark}
        <span className="text-co-green">.</span>
      </h1>
      <p className="mb-5 max-w-[26ch] font-display text-[clamp(17px,1.6vw,21px)] font-normal leading-tight tracking-[-0.02em] text-co-muted">
        {series.promise}
      </p>
      <p className="mb-6 max-w-[40ch] text-[15.5px] font-light leading-relaxed text-co-muted">
        {series.intro}
      </p>

      <dl className="mb-6 grid grid-cols-2 gap-x-4 border-y border-co-border py-3.5">
        <dt className="text-[11px] font-semibold uppercase tracking-[0.11em] text-co-placeholder">
          Configuration
        </dt>
        <dt className="text-[11px] font-semibold uppercase tracking-[0.11em] text-co-placeholder">
          {series.codeLabel ?? "Element code"}
        </dt>
        <dd className="mt-1 font-display text-lg font-medium leading-snug tracking-[-0.02em]">
          {config.name}
        </dd>
        <dd className="mt-1.5 font-mono text-[13px] text-co-muted">{config.code}</dd>
      </dl>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
        {lengthFieldLabel(config)}
      </p>
      <div className="mb-[18px] flex flex-wrap gap-1.5">
        {config.lens.map((value, index) => (
          <button
            key={value}
            type="button"
            aria-pressed={index === lenIndex}
            onClick={() => setLength(index)}
            className={sizeButton(index === lenIndex)}
          >
            {value}
          </button>
        ))}
      </div>

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
        {depthFieldLabel(config)}
      </p>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {depths.values.map((value, index) => (
          <button
            key={value}
            type="button"
            disabled={depths.locked}
            aria-pressed={depths.locked || index === depIndex}
            onClick={() => setDepth(index)}
            className={cn(
              sizeButton(depths.locked || index === depIndex),
              depths.locked && "cursor-default",
            )}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="mb-5 border border-co-card-border bg-co-bg-alt px-4 py-4">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-co-faint">
          Bill of components
        </p>
        <AnimatePresence mode="wait">
          <motion.ul
            key={config.slug}
            className="grid list-none gap-1.5 p-0"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {config.bom.map((line) => (
              <li key={line.code} className="flex items-baseline gap-2.5">
                <span className="text-[13.5px] font-medium text-co-ink">{line.name}</span>
                <span
                  aria-hidden
                  className="flex-1 -translate-y-[3px] border-b border-dotted border-co-border-strong"
                />
                <span className="font-mono text-[12.5px] text-co-muted">
                  {line.code}
                  {isInferredCode(series, line.code) ? (
                    <span className="text-co-green" title={INFERRED_CODE_FOOTNOTE}>
                      °
                    </span>
                  ) : null}
                </span>
                <span className="min-w-[34px] text-right text-[12.5px] font-semibold text-co-green">
                  {line.qty}
                </span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
        {config.bomNote ? (
          <p className="mt-3 text-[12.5px] font-light leading-snug text-co-muted">
            {config.bomNote}
          </p>
        ) : null}
        {hasInferred ? (
          <p className="mt-3 text-[11.5px] font-light leading-snug text-co-placeholder">
            {INFERRED_CODE_FOOTNOTE}
          </p>
        ) : null}
      </div>

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <a
          href="#enquire"
          className="bg-co-ink px-6 py-3.5 text-[15px] font-semibold text-co-bg transition-colors hover:bg-co-green hover:text-co-cta-green-ink"
        >
          Enquire — this configuration
        </a>
        <a
          href="#anatomy"
          className="border border-co-border-strong px-5 py-3.5 text-[15px] font-semibold text-co-ink transition-colors hover:border-co-ink hover:bg-co-bg-alt"
        >
          See the anatomy
        </a>
      </div>
      <p className="text-[12.5px] font-light leading-snug text-co-placeholder">
        Price on request. Quantity, finish and installation move the number, so we quote
        rather than list.
      </p>
    </div>
  );
}
