"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ALL_OPTIONS,
  resolveSpecification,
  summaryRows,
  summarySubject,
  summaryText,
  estimate,
  type Specification,
} from "@/lib/configurator";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { Button } from "@/components/ui/button";
import { ProgressRail } from "@/components/ui/progress-rail";
import { HEADER_HEIGHT } from "@/lib/layout";
import { EmptyNote, StepNav, pad } from "./configurator-controls";
import { StepBody, type StepKey } from "./configurator-steps";
import { SpecificationBlock } from "./configurator-summary";
import { TableFigure } from "./table-figure";

/**
 * Quote configurator.
 *
 * Five steps — series, configuration, top, legs, extras — over one specification object,
 * with a plan drawing that re-plots on every change. The specification is resolved
 * through the same helpers the PDP uses, so the size string and part numbers the
 * customer sees here are the ones the product page would quote.
 *
 * Pricing is deliberately absent: `estimate()` is the single seam that turns this into a
 * costed quote when the rate card lands. Until then the last step shows the full
 * specification and hands it to the existing enquiry flow.
 *
 * Signal layout: the drawing on the left, the step strip, progress rail and the current
 * step on the right. The progress rail is the one green thing; every selection is ink.
 *
 * Keyboard flow: the strip keeps focus where it is (the next step follows it in reading
 * order). The pager hands focus to the new step, because the button pressed may no
 * longer exist — "Next" is gone on the last step, "Back" is disabled on the first — and
 * because the step it opened starts far above the pager on a long list.
 */

const STEPS: readonly { key: StepKey; label: string }[] = [
  { key: "series", label: "Series" },
  { key: "config", label: "Configuration" },
  { key: "top", label: "Top & finish" },
  { key: "legs", label: "Legs" },
  { key: "extras", label: "Extras" },
];

/** Breathing room between the sticky header and a step scrolled up to meet it. */
const SCROLL_GAP_PX = 24;

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

/** "Step 2 of 5 — next: Top & finish", or ready to send on the last step. */
function railCaption(step: number): string {
  const next = STEPS[step + 1];
  const position = `Step ${step + 1} of ${STEPS.length}`;
  return next ? `${position} — next: ${next.label}` : `${position} — ready to send`;
}

/**
 * Moves focus to the step that just opened and, if its top has gone above the sticky
 * header, scrolls it back into view. Runs only when `pending` is set — the pager sets it,
 * the strip does not — and never on first render.
 */
function useStepHandoff(step: number) {
  const regionRef = useRef<HTMLElement>(null);
  const pendingRef = useRef(false);

  useEffect(() => {
    const node = regionRef.current;
    if (!pendingRef.current || !node) return;
    pendingRef.current = false;
    node.focus({ preventScroll: true });

    const top = node.getBoundingClientRect().top;
    if (top >= HEADER_HEIGHT) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: top + window.scrollY - HEADER_HEIGHT - SCROLL_GAP_PX,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [step]);

  /** Call before a pager move: the step it opens takes focus once it has rendered. */
  const armHandoff = useCallback(() => {
    pendingRef.current = true;
  }, []);

  return { regionRef, armHandoff };
}

export function Configurator() {
  const [spec, setSpec] = useState<Specification>(defaultSpec);
  const [step, setStep] = useState(0);
  const { openQuote } = useQuoteDialog();
  const { regionRef, armHandoff } = useStepHandoff(step);

  const resolved = useMemo(() => resolveSpecification(spec), [spec]);
  const price = useMemo(() => (resolved ? estimate(resolved) : null), [resolved]);

  if (!resolved) {
    return (
      <EmptyNote>
        The configurator could not load a series to specify. Send us the floor plan and a
        headcount below and we will specify it with you.
      </EmptyNote>
    );
  }
  const { options, top, leg, topFinish, frameFinish, accessories } = resolved;
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
    // The subject is the one-line interest (the API caps it at 200 characters); the full
    // specification travels in the Requirements field, where the visitor can add to it.
    openQuote(summarySubject(resolved), summaryText(resolved));
  }

  /** Pager moves hand focus to the new step; strip moves leave it on the strip. */
  function page(delta: 1 | -1) {
    const target = Math.min(STEPS.length - 1, Math.max(0, step + delta));
    if (target === step) return;
    armHandoff();
    setStep(target);
  }

  const current = STEPS[step];
  const next = STEPS[step + 1];

  return (
    <div className="grid grid-cols-1 gap-x-[clamp(28px,4vw,80px)] gap-y-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
      {/* Fig. 01 — the plan, held in view while the steps scroll. */}
      <div className="lg:sticky lg:top-[104px] lg:self-start">
        <TableFigure
          top={top}
          leg={leg}
          topFinish={topFinish}
          frameFinish={frameFinish}
          hasScreen={hasScreen}
          length={resolved.length}
          depth={resolved.depth}
          wordmark={options.series.wordmark}
          size={resolved.size}
        />
      </div>

      <div className="min-w-0">
        <StepNav steps={STEPS} current={step} onPick={setStep} />
        <ProgressRail step={step + 1} total={STEPS.length} label={railCaption(step)} className="mt-5" />

        {/*
          Keyed by step, so each step mounts fresh: its top rule is a new `data-reveal`
          node and draws in at plotter speed. Nothing fades. The region is the pager's
          focus target — programmatic only (tabIndex -1), so it carries no focus ring.
        */}
        <section
          key={current.key}
          ref={regionRef}
          tabIndex={-1}
          aria-label={`Step ${step + 1} of ${STEPS.length}: ${current.label}`}
          className="mt-10 scroll-mt-[96px] outline-none!"
        >
          <span aria-hidden data-reveal className="co-rule block h-px bg-co-ink" />
          <p className="co-eyebrow mt-5">
            Step {pad(step + 1)} / {current.label}
          </p>
          <div className="mt-3">
            <StepBody
              step={current.key}
              spec={spec}
              resolved={resolved}
              setSpec={setSpec}
              onPickSeries={pickSeries}
            />
          </div>

          {next ? null : (
            <SpecificationBlock rows={summaryRows(resolved)} price={price} onSend={sendSpecification} />
          )}
        </section>

        {/* Pager — Next names the step it opens, so the bottom of a long list still says where it goes. */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-co-border pt-5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-11"
            onClick={() => page(-1)}
            disabled={step === 0}
          >
            <span aria-hidden>←</span> Back
          </Button>
          {next ? (
            <Button type="button" size="sm" className="h-11" onClick={() => page(1)}>
              Next: {next.label} <span aria-hidden>→</span>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
