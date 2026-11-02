"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { FigureCaption } from "@/components/ui/figure-caption";
import { RegistrationCross } from "@/components/ui/registration-cross";
import type { FinishOption, LegOption, TopOption } from "@/lib/configurator";
import { LEG_MARK_SIZE, legLayout, planTable } from "./table-plan";

/**
 * Live specification drawing — Fig. 01 of the configurator.
 *
 * A plan of the table being specified, drawn the way a drawing set draws it: a fog plate
 * with a one-pixel ink outline, chain centre lines, the leg package as ink flats, a
 * screen along the spine when one is on the specification, and dimension lines carrying
 * the length and depth the specification resolved to. It is drawn from the
 * specification, so it can never show a combination the customer has not chosen.
 *
 * Finishes are not painted onto the plate — a drawing is ink on paper — so they are
 * keyed in the caption with the data's own swatch fills.
 *
 * Motion is the plotter: when the geometry changes the outline and dimensions re-draw,
 * 400ms linear, via stroke-dashoffset. Nothing fades. The resting state is the finished
 * drawing, so with scripting off or reduced motion the plan is simply there.
 */

interface TableFigureProps {
  top: TopOption;
  leg: LegOption | null;
  topFinish: FinishOption | null;
  frameFinish: FinishOption | null;
  /** Drawn along the spine when a screen accessory is selected. */
  hasScreen: boolean;
  length: number;
  depth: number | null;
  /** Series wordmark for the caption, e.g. "STRETCH S". */
  wordmark: string;
  /** The size as the summary quotes it (`sizeLabel`) — printed, never rebuilt here. */
  size: string;
}

/** Plotter speed: every Signal motion that moves a measurement takes 400ms, linear. */
const PLOT_MS = 400;

/** Laid out at this size until the frame has been measured (server render, first paint). */
const FALLBACK = { width: 640, height: 480 };

/**
 * The frame's content size in CSS pixels. The SVG's viewBox is set to it so one user
 * unit is one pixel — which is what makes every stroke exactly 1px and lets the
 * stroke-dash plot work (`non-scaling-stroke` would break `pathLength` dashing).
 */
function useFrameSize(ref: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState(FALLBACK);

  useEffect(() => {
    const frame = ref.current;
    if (!frame || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      if (!width || !height) return;
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

/**
 * Re-plots the group's strokes when `signature` changes — never on mount, so the server
 * HTML's finished drawing is not wiped and redrawn on hydration. Every stroked path in
 * the group carries `pathLength={1}`, so one dash of length 1 covers any path and the
 * offset 1 → 0 draws it end to end. Reduced motion skips straight to the result.
 */
function usePlot(ref: RefObject<SVGGElement | null>, signature: string) {
  const plotted = useRef(signature);

  useEffect(() => {
    const group = ref.current;
    if (!group || plotted.current === signature) return;
    plotted.current = signature;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const plot = group.animate(
      [
        { strokeDasharray: "1 1", strokeDashoffset: "1" },
        { strokeDasharray: "1 1", strokeDashoffset: "0" },
      ],
      { duration: PLOT_MS, easing: "linear" },
    );
    return () => plot.cancel();
  }, [ref, signature]);
}

export function TableFigure({
  top,
  leg,
  topFinish,
  frameFinish,
  hasScreen,
  length,
  depth,
  wordmark,
  size,
}: TableFigureProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<SVGGElement>(null);
  const { width, height } = useFrameSize(frameRef);
  const layout = legLayout(leg);

  const plan = useMemo(
    () => planTable({ shape: top.shape, length, depth, legs: layout, hasScreen, width, height }),
    [top.shape, length, depth, layout, hasScreen, width, height],
  );

  usePlot(plotRef, `${top.slug}|${length}|${depth}|${layout}|${hasScreen}`);

  const half = LEG_MARK_SIZE / 2;

  return (
    <figure>
      <div
        ref={frameRef}
        className="relative aspect-[4/3] w-full border border-co-border bg-co-bg text-co-ink"
      >
        <RegistrationCross className="left-2.5 top-2.5" />
        <RegistrationCross className="right-2.5 top-2.5" />
        <RegistrationCross className="bottom-2.5 left-2.5" />
        <RegistrationCross className="bottom-2.5 right-2.5" />

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`Plan of the ${top.name} — ${size}`}
        >
          <g ref={plotRef} fill="none" stroke="currentColor" strokeWidth={1}>
            <path d={plan.outline} pathLength={1} className="fill-co-bg-alt" />

            {/* Its own dash pattern, so the plot passes it by. */}
            {plan.centre ? (
              <path d={plan.centre} className="stroke-co-muted-2" strokeDasharray="12 3 2 3" />
            ) : null}

            {plan.screen ? (
              <rect
                x={plan.screen.x}
                y={plan.screen.y}
                width={plan.screen.w}
                height={plan.screen.h}
                stroke="none"
                className="fill-co-ink"
              />
            ) : null}

            {plan.legs.map(([cx, cy], index) => (
              <rect
                key={`${layout}-${index}`}
                x={cx - half}
                y={cy - half}
                width={LEG_MARK_SIZE}
                height={LEG_MARK_SIZE}
                stroke="none"
                className="fill-co-ink"
              />
            ))}

            {plan.dimensions.map((mark) => (
              <g key={mark.label.text + mark.label.vertical}>
                <path d={mark.extension} pathLength={1} className="stroke-co-muted-2" />
                <path d={mark.line} pathLength={1} />
              </g>
            ))}
          </g>

          {/*
            Labels sit on their dimension line; a canvas-coloured halo knocks the line out
            behind the figures, as the moodboard's dimension labels do.
          */}
          {plan.dimensions.map(({ label }) => (
            <text
              key={label.text + label.vertical}
              x={label.x}
              y={label.y}
              transform={label.vertical ? `rotate(-90 ${label.x} ${label.y})` : undefined}
              textAnchor="middle"
              dominantBaseline="central"
              strokeWidth={8}
              strokeLinejoin="round"
              paintOrder="stroke"
              className="co-data fill-current stroke-co-bg text-[10px]"
            >
              {label.text}
            </text>
          ))}
        </svg>
      </div>

      <figcaption className="mt-3 border-t border-co-border pt-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <FigureCaption as="span" n={1} className="min-w-0">
            {wordmark} · {top.name}, plan
          </FigureCaption>
          <span className="co-data text-co-ink">{size}</span>
        </div>
        <FinishKey topFinish={topFinish} frameFinish={frameFinish} />
      </figcaption>
    </figure>
  );
}

/** The finish key: a small square of each chosen finish's swatch fill, name beside it. */
function FinishKey({
  topFinish,
  frameFinish,
}: {
  topFinish: FinishOption | null;
  frameFinish: FinishOption | null;
}) {
  const entries = [
    { role: "Top", finish: topFinish },
    { role: "Frame", finish: frameFinish },
  ].filter((entry): entry is { role: string; finish: FinishOption } => entry.finish !== null);

  return (
    <ul className="mt-2 flex list-none flex-wrap items-center gap-x-6 gap-y-2 p-0">
      {entries.map(({ role, finish }) => (
        <li key={role} className="co-data flex items-center gap-2 text-co-muted-2">
          <span
            aria-hidden
            className="block h-3 w-3 shrink-0 border border-co-border"
            style={{ background: finish.fill }}
          />
          {role}
          <span className="text-co-ink">{finish.name}</span>
        </li>
      ))}
      <li className="co-data text-co-muted-2 sm:ml-auto">Schematic · not to scale</li>
    </ul>
  );
}
