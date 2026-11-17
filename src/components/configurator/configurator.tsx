"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  defaultSpecification,
  resolveSpecification,
  summaryRows,
  summarySubject,
  summaryText,
  estimate,
  type FinishOption,
  type ResolvedSpecification,
  type Specification,
  type TopOption,
} from "@/lib/configurator";
import type { Swatch } from "@/lib/finishes";
import { ProductViewer, type ProductImage } from "@/components/product/product-viewer";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { Button } from "@/components/ui/button";
import { ProgressRail } from "@/components/ui/progress-rail";
import { HEADER_HEIGHT } from "@/lib/layout";
import { StepNav, pad } from "./configurator-controls";
import { StepBody, type StepKey } from "./configurator-steps";
import { SpecificationBlock } from "./configurator-summary";
import { TableFigure } from "./table-figure";

/**
 * Quote configurator.
 *
 * Six steps over one specification object (Nov 2026 rework, catalogue v31): system (the
 * leg), top and finish, partition, VOLT & BOLT, accessories, then the configuration and
 * its fixed size. A plan drawing re-plots on every change, and under it the pictures of
 * what is selected. Sizes are resolved through the same helpers the PDP uses.
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
  { key: "system", label: "System" },
  { key: "top", label: "Top & finish" },
  { key: "partition", label: "Partition" },
  { key: "power", label: "VOLT & BOLT" },
  { key: "accessories", label: "Accessories" },
  { key: "config", label: "Configuration" },
];

/** Breathing room between the sticky header and a step scrolled up to meet it. */
const SCROLL_GAP_PX = 24;

/** A swatch as the plan drawing's finish key wants it. */
function asFinish(swatch: Swatch | null, applies: FinishOption["applies"]): FinishOption | null {
  if (!swatch) return null;
  return { code: swatch.code ?? swatch.name, name: swatch.name, spec: "", fill: swatch.fill ?? "#8f8874", applies };
}

/** The plan needs a table to draw; a system with none on record draws a plain desk. */
const PLAIN_DESK: TopOption = { slug: "desk", name: "Desk", shape: "rect", seats: "", image: "", imageAlt: "", lens: [], deps: [] };

/** Pictures of what is selected, in build order: table, leg, top, partition, power. */
function selectionImages(resolved: ResolvedSpecification): ProductImage[] {
  const { system, top } = resolved;
  const table = top?.image
    ? [{ src: top.image, alt: top.imageAlt, label: top.name, kind: "cutout" as const }]
    : system.photo
      ? [{ ...system.photo, label: system.name, kind: "scene" as const }]
      : [];
  const parts = [
    system.legImage ? { src: system.legImage, alt: `The ${system.name} leg`, label: `${system.name} leg` } : null,
    { src: resolved.core.src, alt: resolved.core.name, label: resolved.core.name },
    { src: resolved.edge.src, alt: `${resolved.edge.name} edge`, label: `${resolved.edge.name} edge` },
    resolved.partition ? { src: resolved.partition.src, alt: resolved.partition.name, label: resolved.partition.name } : null,
    resolved.power ? { src: resolved.power.src, alt: resolved.power.name, label: resolved.power.name } : null,
  ].filter((part): part is { src: string; alt: string; label: string } => part !== null);
  return [...table, ...parts.map((part) => ({ ...part, kind: "scene" as const }))];
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
  const [spec, setSpec] = useState<Specification>(() => defaultSpecification());
  const [step, setStep] = useState(0);
  const { openQuote } = useQuoteDialog();
  const { regionRef, armHandoff } = useStepHandoff(step);

  const resolved = useMemo(() => resolveSpecification(spec), [spec]);
  const price = useMemo(() => estimate(resolved), [resolved]);
  const images = useMemo(() => selectionImages(resolved), [resolved]);
  const top = resolved.top ?? PLAIN_DESK;
  const legName = top.sharing || /bench/i.test(top.name) ? "Bench legs" : "Four legs";

  function sendSpecification() {
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
      <div className="grid gap-10 lg:self-start">
        <TableFigure
          top={top}
          leg={{ code: "", name: legName, note: "", ref: "" }}
          topFinish={asFinish(resolved.topShade, "top")}
          frameFinish={asFinish(resolved.frameShade, "frame")}
          hasScreen={resolved.partition !== null}
          length={resolved.length ?? 1400}
          depth={resolved.depth ?? (resolved.length ? null : 700)}
          wordmark={resolved.system.name}
          size={resolved.size}
        />
        {/* What is selected, as pictures: the table, its leg, the top, partition and power. */}
        <ProductViewer key={images.map((image) => image.src).join("|")} images={images} name="Your selection" />
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
            <StepBody step={current.key} spec={spec} resolved={resolved} setSpec={setSpec} />
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
