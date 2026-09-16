"use client";

import { motion } from "framer-motion";
import type { FinishOption, LegOption, TopOption } from "@/lib/configurator";

/**
 * Live specification drawing.
 *
 * A vector plan of the table being specified: the outline follows the configuration's
 * shape, the fills follow the chosen top and frame finishes, the leg marks follow the
 * selected leg package, and screens appear when a screen accessory is picked. It is a
 * schematic rather than a render — it is drawn from the specification, so it can never
 * show a combination the customer has not actually chosen, which a library of static
 * photographs could not promise.
 *
 * Every figure is proportional, not to scale: the aspect ratio tracks the selected
 * length and depth so a 4000mm boardroom top reads longer than an 800mm desk, but the
 * drawing is not a dimensioned plan and nothing should be measured off it.
 */

const SPRING = { type: "spring", bounce: 0, duration: 0.7 } as const;

interface TableFigureProps {
  top: TopOption;
  leg: LegOption | null;
  topFinish: FinishOption | null;
  frameFinish: FinishOption | null;
  /** Drawn along the spine when a screen accessory is selected. */
  hasScreen: boolean;
  length: number;
  depth: number | null;
}

/** Leg packages that put a support at the mid-span rather than only at the corners. */
function legMarks(leg: LegOption | null): "four" | "two" | "bench" | "bench-mid" {
  const name = leg?.name.toLowerCase() ?? "";
  if (name.includes("mid")) return "bench-mid";
  if (name.includes("bench")) return "bench";
  if (name.startsWith("2") || name.includes("two")) return "two";
  return "four";
}

export function TableFigure({
  top,
  leg,
  topFinish,
  frameFinish,
  hasScreen,
  length,
  depth,
}: TableFigureProps) {
  const surface = topFinish?.fill ?? "#E6DECC";
  const edge = topFinish?.edge ?? "#D3C9B3";
  const frame = frameFinish?.fill ?? "#9BA0A6";
  const marks = legMarks(leg);

  /*
    The viewBox is fixed and the top is centred inside it, so the stroke width stays
    visually constant instead of scaling with the table.

    The box is fitted to the frame rather than pinned to a fixed width: a 4000 × 1200
    boardroom top is proportionally very wide, and sizing off the width alone pushed the
    drawing past the bottom of the frame. Whichever dimension hits its limit first sets
    the scale, and the other follows the real proportion.
  */
  const VIEW_W = 360;
  const VIEW_H = 270;
  const MAX_W = 290;
  const MAX_H = 196;

  const ratio =
    top.shape === "round" ? 1 : depth && length ? Math.min(Math.max(depth / length, 0.28), 1) : 0.5;

  const boxW = Math.min(MAX_W, MAX_H / ratio);
  const boxH = boxW * ratio;
  const x = (VIEW_W - boxW) / 2;
  const y = (VIEW_H - boxH) / 2;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      // Uniform scale, centred. Stretching the viewBox to the stage moved the top and the
      // leg marks by different factors and the legs landed off the board.
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="img"
      aria-label={`Plan view — ${top.name}, ${topFinish?.name ?? "default"} top`}
    >
      <defs>
        {/* Gradients are supplied as CSS strings on the swatch, which SVG cannot read,
            so the swatch's flat edge colour backs the surface and the CSS gradient is
            layered over it with a foreignObject-free approach: a plain rect plus the
            edge band. Good enough for a schematic, and it never misreports a finish. */}
        <linearGradient id="co-surface" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={edge} stopOpacity="0.35" />
          <stop offset="100%" stopColor={edge} stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Frame: drawn under the top so the legs read as supporting it. */}
      <motion.g animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={SPRING}>
        {marks !== "bench-mid" ? (
          <motion.line
            // Both the attribute and the animated value are set: motion tweens from the
            // attribute, and without it the first frame has no geometry at all.
            x1={x + 16}
            x2={x + boxW - 16}
            y1={y + boxH + 14}
            y2={y + boxH + 14}
            stroke={frame}
            strokeWidth="3"
            strokeLinecap="round"
            initial={false}
            animate={{ x1: x + 16, x2: x + boxW - 16, y1: y + boxH + 14, y2: y + boxH + 14 }}
            transition={SPRING}
          />
        ) : null}
      </motion.g>

      {/* Top */}
      {top.shape === "round" ? (
        <circle
          cx={VIEW_W / 2}
          cy={VIEW_H / 2}
          r={boxH / 2}
          fill={surface.startsWith("linear") ? edge : surface}
          stroke={edge}
          strokeWidth="2"
        />
      ) : top.shape === "l-shape" ? (
        <motion.path
          initial={false}
          animate={{
            d: `M${x} ${y} H${x + boxW} V${y + boxH * 0.52} H${x + boxW * 0.52} V${y + boxH} H${x} Z`,
          }}
          transition={SPRING}
          suppressHydrationWarning
          fill={surface.startsWith("linear") ? edge : surface}
          stroke={edge}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : top.shape === "u-shape" ? (
        <motion.path
          initial={false}
          animate={{
            d: `M${x} ${y} H${x + boxW} V${y + boxH} H${x + boxW * 0.72} V${y + boxH * 0.4} H${x + boxW * 0.28} V${y + boxH} H${x} Z`,
          }}
          transition={SPRING}
          fill={surface.startsWith("linear") ? edge : surface}
          stroke={edge}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : (
        <rect
          x={x}
          y={y}
          width={boxW}
          height={boxH}
          fill={surface.startsWith("linear") ? edge : surface}
          stroke={edge}
          strokeWidth="2"
        />
      )}

      {/* Surface shading, so a flat fill still reads as a board rather than a swatch. */}
      {top.shape === "rect" || top.shape === "square" ? (
        <rect x={x} y={y} width={boxW} height={boxH} fill="url(#co-surface)" opacity="0.28" />
      ) : null}

      {/* Screen along the spine — only when a screen accessory is on the specification. */}
      {hasScreen && (top.shape === "rect" || top.shape === "square") ? (
        <motion.rect
          x={x + 10}
          y={y + boxH / 2 - 3}
          width={boxW - 20}
          height={6}
          rx="3"
          fill={frame}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          exit={{ opacity: 0 }}
          transition={SPRING}
        />
      ) : null}

      {/* Leg marks */}
      {(() => {
        const inset = Math.min(24, boxH / 2 - 6, boxW / 2 - 6);
        const corners = [
          [x + inset, y + inset],
          [x + boxW - inset, y + inset],
          [x + inset, y + boxH - inset],
          [x + boxW - inset, y + boxH - inset],
        ];
        const pairs = [
          [x + inset, y + boxH / 2],
          [x + boxW - inset, y + boxH / 2],
        ];
        const mids = [
          [x + boxW / 2, y + inset],
          [x + boxW / 2, y + boxH - inset],
        ];

        /*
          A round top has no corners: placing the marks on the bounding box floated them
          off the board. They go on the circle itself, inset from the edge by the same
          amount a rectangular top insets from its sides.
        */
        if (top.shape === "round") {
          const r = boxH / 2 - inset * 0.7;
          const count = marks === "two" ? 2 : 4;
          const ring = Array.from({ length: count }, (_, i) => {
            const angle = (Math.PI * 2 * i) / count + Math.PI / 4;
            return [VIEW_W / 2 + r * Math.cos(angle), VIEW_H / 2 + r * Math.sin(angle)];
          });
          return ring.map(([cx, cy], index) => (
            <motion.circle
              key={`round-${marks}-${index}`}
              cx={cx}
              cy={cy}
              r="5"
              fill={frame}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING, delay: index * 0.03 }}
            />
          ));
        }

        /*
          L and U tops are not rectangles: the bounding-box corners land in the cut-away,
          where there is no board to stand a leg on. Both shapes are drawn from the same
          proportions as the outline above, so the marks follow those instead.
        */
        if (top.shape === "l-shape") {
          const legPoints = [
            [x + inset, y + inset],
            [x + boxW - inset, y + inset],
            [x + inset, y + boxH - inset],
            [x + boxW * 0.52 - inset, y + boxH - inset],
          ];
          return legPoints.map(([cx, cy], index) => (
            <motion.circle
              key={`l-${index}`}
              cx={cx}
              cy={cy}
              r="5"
              fill={frame}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING, delay: index * 0.03 }}
            />
          ));
        }

        if (top.shape === "u-shape") {
          const legPoints = [
            [x + inset, y + inset],
            [x + boxW - inset, y + inset],
            [x + inset, y + boxH - inset],
            [x + boxW - inset, y + boxH - inset],
          ];
          return legPoints.map(([cx, cy], index) => (
            <motion.circle
              key={`u-${index}`}
              cx={cx}
              cy={cy}
              r="5"
              fill={frame}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING, delay: index * 0.03 }}
            />
          ));
        }

        const points =
          marks === "two" ? pairs : marks === "bench-mid" ? [...corners, ...mids] : corners;

        return points.map(([cx, cy], index) => (
          <motion.circle
            key={`${marks}-${index}`}
            cx={cx}
            cy={cy}
            r="5"
            fill={frame}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING, delay: index * 0.03 }}
          />
        ));
      })()}
    </svg>
  );
}
