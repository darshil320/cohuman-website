"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ALL_OPTIONS,
  resolveSpecification,
  summaryRows,
  summarySubject,
  summaryText,
  estimate,
  type Specification,
} from "@/lib/configurator";
import { lengthFieldLabel } from "@/lib/series";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { cn } from "@/lib/utils";
import { TableFigure } from "./table-figure";

/**
 * Quote configurator.
 *
 * Five steps — series, configuration, top, legs, extras — over one specification object,
 * with a schematic that redraws on every change. The specification is resolved through
 * the same helpers the PDP uses, so the size string and part numbers the customer sees
 * here are the ones the product page would quote.
 *
 * Pricing is deliberately absent: `estimate()` is the single seam that turns this into a
 * costed quote when the rate card lands. Until then the last step shows the full
 * specification and hands it to the existing enquiry flow.
 */

const STEPS = [
  { key: "series", label: "Series" },
  { key: "config", label: "Configuration" },
  { key: "top", label: "Top & finish" },
  { key: "legs", label: "Legs" },
  { key: "extras", label: "Extras" },
] as const;

const FADE = { duration: 0.42, ease: [0.16, 1, 0.3, 1] } as const;

/** "1 seat", "4 seats", and nothing at all where the spec does not state a count. */
function seatLabel(seats: string): string | null {
  if (!seats || seats === "—" || seats === "–" || seats === "-") return null;
  return seats === "1" ? "1 seat" : `${seats} seats`;
}

function defaultSpec(): Specification {
  const first = ALL_OPTIONS[0];
  const top = first.tops.find((t) => t.slug === first.series.defaultConfigSlug) ?? first.tops[0];
  return {
    seriesSlug: first.series.slug,
    topSlug: top.slug,
    lenIndex: 0,
    depIndex: 0,
    legCode: first.legs[0]?.code ?? "",
    topFinishCode: first.finishes.find((f) => f.applies === "top")?.code ?? null,
    frameFinishCode: first.finishes.find((f) => f.applies === "frame")?.code ?? null,
    accessoryCodes: [],
  };
}

export function Configurator() {
  const [spec, setSpec] = useState<Specification>(defaultSpec);
  const [step, setStep] = useState(0);
  const { openQuote } = useQuoteDialog();

  const resolved = useMemo(() => resolveSpecification(spec), [spec]);
  const price = useMemo(() => (resolved ? estimate(resolved) : null), [resolved]);

  if (!resolved) return null;
  const { options, top, leg, topFinish, frameFinish, accessories } = resolved;

  const topFinishes = options.finishes.filter((f) => f.applies === "top");
  const frameFinishes = options.finishes.filter((f) => f.applies === "frame");
  const hasScreen = accessories.some((a) => /screen|felt/i.test(`${a.name} ${a.note}`));

  /** Switching series invalidates every downstream choice, so they are re-seeded. */
  function pickSeries(slug: string) {
    const next = ALL_OPTIONS.find((entry) => entry.series.slug === slug);
    if (!next) return;
    const nextTop =
      next.tops.find((t) => t.slug === next.series.defaultConfigSlug) ?? next.tops[0];
    setSpec({
      seriesSlug: slug,
      topSlug: nextTop.slug,
      lenIndex: 0,
      depIndex: 0,
      legCode: next.legs[0]?.code ?? "",
      topFinishCode: next.finishes.find((f) => f.applies === "top")?.code ?? null,
      frameFinishCode: next.finishes.find((f) => f.applies === "frame")?.code ?? null,
      accessoryCodes: [],
    });
  }

  function sendSpecification() {
    if (!resolved) return;
    openQuote(`${summarySubject(resolved)}\n\n${summaryText(resolved)}`);
  }

  const atLast = step === STEPS.length - 1;

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid grid-cols-1 gap-x-[clamp(28px,4vw,80px)] gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.85fr)]">
        {/* Stage */}
        <div className="lg:sticky lg:top-[100px] lg:self-start">
          <div className="relative aspect-[4/3] w-full bg-co-bg-alt p-[clamp(12px,2vw,28px)]">
            <TableFigure
              top={top}
              leg={leg}
              topFinish={topFinish}
              frameFinish={frameFinish}
              hasScreen={hasScreen}
              length={resolved.length}
              depth={resolved.depth}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-co-border pt-4">
            <p className="co-eyebrow">{options.series.wordmark}</p>
            <p className="font-mono text-[11px] tabular-nums text-co-placeholder">
              {resolved.size}
            </p>
            <p className="ml-auto text-[11px] font-semibold uppercase tracking-[0.16em] text-co-placeholder">
              Schematic · not to scale
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="min-w-0">
          <ol className="mb-9 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
            {STEPS.map((entry, index) => (
              <li key={entry.key}>
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  aria-current={index === step ? "step" : undefined}
                  className={cn(
                    "flex items-baseline gap-2 border-b-2 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
                    index === step
                      ? "border-co-ink text-co-ink"
                      : "border-transparent text-co-placeholder hover:text-co-muted",
                  )}
                >
                  <span className="font-mono tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {entry.label}
                </button>
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait">
            <motion.div
              key={STEPS[step].key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={FADE}
            >
              {step === 0 ? (
                <Choices
                  heading="Which system?"
                  note="Both run at 720mm working height."
                  items={ALL_OPTIONS.map((entry) => ({
                    id: entry.series.slug,
                    name: entry.series.name,
                    note: entry.series.promise,
                    on: entry.series.slug === spec.seriesSlug,
                    onPick: () => pickSeries(entry.series.slug),
                  }))}
                />
              ) : null}

              {step === 1 ? (
                <>
                  <Choices
                    heading="Which configuration?"
                    note={`${options.tops.length} configurations in this series.`}
                    items={options.tops.map((entry) => ({
                      id: entry.slug,
                      name: entry.name,
                      note: seatLabel(entry.seats) ?? entry.shape,
                      on: entry.slug === spec.topSlug,
                      onPick: () =>
                        setSpec((s) => ({ ...s, topSlug: entry.slug, lenIndex: 0, depIndex: 0 })),
                    }))}
                  />

                  <Field label={lengthFieldLabel(options.series.configs.find((c) => c.slug === top.slug)!)}>
                    {top.lens.map((value, index) => (
                      <Pick
                        key={value}
                        on={index === spec.lenIndex}
                        onPick={() => setSpec((s) => ({ ...s, lenIndex: index }))}
                      >
                        {value}
                      </Pick>
                    ))}
                  </Field>

                  {!top.dia && !top.sq && top.deps.length > 0 ? (
                    <Field label="Depth — mm">
                      {top.deps.map((value, index) => (
                        <Pick
                          key={value}
                          on={index === spec.depIndex}
                          onPick={() => setSpec((s) => ({ ...s, depIndex: index }))}
                        >
                          {value}
                        </Pick>
                      ))}
                    </Field>
                  ) : null}
                </>
              ) : null}

              {step === 2 ? (
                topFinishes.length || frameFinishes.length ? (
                  <>
                    {topFinishes.length ? (
                      <Swatches
                        heading="Top finish"
                        items={topFinishes}
                        activeCode={spec.topFinishCode}
                        onPick={(code) => setSpec((s) => ({ ...s, topFinishCode: code }))}
                      />
                    ) : null}
                    {frameFinishes.length ? (
                      <Swatches
                        heading="Frame finish"
                        items={frameFinishes}
                        activeCode={spec.frameFinishCode}
                        onPick={(code) => setSpec((s) => ({ ...s, frameFinishCode: code }))}
                      />
                    ) : null}
                  </>
                ) : (
                  <Empty>
                    This series&apos; specification names materials rather than finish colours, so
                    there is nothing to choose here — we confirm the finish on the quote.
                  </Empty>
                )
              ) : null}

              {step === 3 ? (
                <Choices
                  heading="Which leg package?"
                  note="Beams follow the top you picked, so they are not a separate choice."
                  items={options.legs.map((entry) => ({
                    id: entry.code,
                    name: entry.name,
                    note: entry.note,
                    code: entry.code,
                    on: entry.code === spec.legCode,
                    onPick: () => setSpec((s) => ({ ...s, legCode: entry.code })),
                  }))}
                />
              ) : null}

              {step === 4 ? (
                <>
                  {options.accessories.length ? (
                    <Choices
                      heading="Anything to add?"
                      note="Select as many as apply."
                      multi
                      items={options.accessories.map((entry) => ({
                        id: entry.code,
                        name: entry.name,
                        note: entry.note,
                        code: entry.code,
                        on: spec.accessoryCodes.includes(entry.code),
                        onPick: () =>
                          setSpec((s) => ({
                            ...s,
                            accessoryCodes: s.accessoryCodes.includes(entry.code)
                              ? s.accessoryCodes.filter((code) => code !== entry.code)
                              : [...s.accessoryCodes, entry.code],
                          })),
                      }))}
                    />
                  ) : (
                    <Empty>
                      This series publishes no accessory schedule — tell us what you need on the
                      enquiry and we will quote it against the run.
                    </Empty>
                  )}

                  <div className="mt-10 border-t border-co-ink pt-6">
                    <p className="co-eyebrow mb-5">Your specification</p>
                    <dl className="mb-7 grid">
                      {summaryRows(resolved).map((row) => (
                        <div
                          key={`${row.label}-${row.value}`}
                          className="grid grid-cols-[minmax(92px,0.4fr)_1fr] gap-4 border-b border-co-border py-2.5"
                        >
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-co-placeholder">
                            {row.label}
                          </dt>
                          <dd className="flex flex-wrap items-baseline gap-x-3 text-[14px] text-co-ink-soft">
                            {row.value}
                            {row.code ? (
                              <span className="font-mono text-[11.5px] text-co-placeholder">
                                {row.code}
                              </span>
                            ) : null}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {price && !price.priced ? (
                      <p className="mb-7 max-w-[46ch] text-[13px] font-light leading-relaxed text-co-muted">
                        <span className="font-semibold text-co-ink">Price on request.</span>{" "}
                        {price.reason}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={sendSpecification}
                      className="group inline-flex items-center gap-3 border-b-2 border-co-ink pb-2 text-[clamp(15px,1.4vw,19px)] font-semibold text-co-ink transition-colors hover:border-co-placeholder hover:text-co-muted"
                    >
                      Send this specification
                      <svg
                        aria-hidden
                        width="15"
                        height="10"
                        viewBox="0 0 13 9"
                        fill="none"
                        className="transition-transform duration-300 ease-[var(--ease-co)] group-hover:translate-x-1.5"
                      >
                        <path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Pager */}
          <div className="mt-10 flex items-center gap-6 border-t border-co-border pt-5">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-co-placeholder transition-colors hover:text-co-ink disabled:pointer-events-none disabled:opacity-35"
            >
              Back
            </button>
            <span className="font-mono text-[11px] tabular-nums text-co-placeholder">
              {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </span>
            {!atLast ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="group ml-auto inline-flex items-center gap-2.5 border-b-2 border-co-ink pb-1.5 text-[13.5px] font-semibold text-co-ink transition-colors hover:border-co-placeholder hover:text-co-muted"
              >
                Next
                <svg
                  aria-hidden
                  width="13"
                  height="9"
                  viewBox="0 0 13 9"
                  fill="none"
                  className="transition-transform duration-300 ease-[var(--ease-co)] group-hover:translate-x-1"
                >
                  <path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

/* ---------------------------------------------------------------- small pieces */

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-[48ch] border-t border-co-border pt-5 text-[14px] font-light leading-relaxed text-co-muted">
      {children}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-co-placeholder">
        {label}
      </p>
      <div className="flex flex-wrap gap-x-5 gap-y-2">{children}</div>
    </div>
  );
}

function Pick({
  on,
  onPick,
  children,
}: {
  on: boolean;
  onPick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onPick}
      className={cn(
        "border-b-2 pb-1.5 pt-1 text-[14.5px] font-medium tabular-nums transition-colors",
        on
          ? "border-co-ink text-co-ink"
          : "border-transparent text-co-placeholder hover:border-co-border-strong hover:text-co-ink",
      )}
    >
      {children}
    </button>
  );
}

interface ChoiceItem {
  id: string;
  name: string;
  note: string;
  code?: string;
  on: boolean;
  onPick: () => void;
}

function Choices({
  heading,
  note,
  items,
  multi,
}: {
  heading: string;
  note?: string;
  items: ChoiceItem[];
  multi?: boolean;
}) {
  return (
    <div>
      <h2 className="co-h3 mb-1.5">{heading}</h2>
      {note ? <p className="mb-6 text-[13px] font-light text-co-muted">{note}</p> : null}

      <ul className="grid list-none gap-0 p-0">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={item.on}
              onClick={item.onPick}
              className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-x-4 border-t border-co-border py-3.5 text-left last:border-b"
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 font-mono text-[10.5px] tabular-nums transition-colors",
                  item.on ? "text-co-ink" : "text-co-placeholder",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-[15px] font-medium transition-colors",
                    item.on ? "text-co-ink" : "text-co-ink-soft group-hover:text-co-ink",
                  )}
                >
                  {item.name}
                </span>
                <span className="mt-1 block max-w-[46ch] text-[12.5px] font-light leading-relaxed text-co-muted">
                  {item.note}
                </span>
                {item.code ? (
                  <span className="mt-1.5 block font-mono text-[11px] text-co-placeholder">
                    {item.code}
                  </span>
                ) : null}
              </span>
              <span
                aria-hidden
                className={cn(
                  "mt-1 block h-3 w-3 shrink-0 border transition-colors",
                  multi ? "" : "rounded-full",
                  item.on
                    ? "border-co-ink bg-co-ink"
                    : "border-co-border-strong bg-transparent group-hover:border-co-ink",
                )}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Swatches({
  heading,
  items,
  activeCode,
  onPick,
}: {
  heading: string;
  items: { code: string; name: string; spec: string; fill: string; edge?: string }[];
  activeCode: string | null;
  onPick: (code: string) => void;
}) {
  return (
    <div className="mb-10">
      <h2 className="co-h3 mb-6">{heading}</h2>
      <ul className="grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0 sm:grid-cols-[repeat(auto-fill,minmax(130px,1fr))]">
        {items.map((item) => {
          const on = item.code === activeCode;
          return (
            <li key={item.code}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onPick(item.code)}
                className="group block w-full text-left"
              >
                <span
                  className="relative block aspect-[5/4] w-full overflow-hidden"
                  style={{ background: item.fill }}
                >
                  {item.edge ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[24%]"
                      style={{ background: item.edge }}
                    />
                  ) : null}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-2.5 block h-px w-full transition-colors",
                    on ? "bg-co-ink" : "bg-co-border group-hover:bg-co-ink",
                  )}
                />
                <span
                  className={cn(
                    "mt-2 block text-[13.5px] font-medium transition-colors",
                    on ? "text-co-ink" : "text-co-ink-soft",
                  )}
                >
                  {item.name}
                </span>
                <span className="mt-0.5 block text-[11.5px] font-light leading-snug text-co-muted">
                  {item.spec}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
