import type { LegOption, TopOption } from "@/lib/configurator";

/**
 * Plan geometry for the configurator drawing.
 *
 * Pure: the frame's size in CSS pixels and the specification go in; path data, leg
 * positions and dimension placements come out. The drawing is laid out at 1:1 with the
 * screen, so every rule lands on the pixel grid and renders as exactly one pixel.
 *
 * Proportional, not to scale. A rectangular top keeps its real depth-to-length ratio,
 * clamped so a long, shallow bench still shows a readable depth. The return on an L or
 * U top has no published length, so it is drawn at a fixed schematic proportion and is
 * never dimensioned. The only numbers drawn are the length and depth the specification
 * resolved to.
 */

export type Point = readonly [number, number];
export type LegLayout = "four" | "two" | "bench" | "bench-mid";

export interface DimensionMark {
  /** Extension lines from the measured edges out to the dimension line. */
  extension: string;
  /** The dimension line and its two end ticks. */
  line: string;
  label: { x: number; y: number; text: string; vertical: boolean };
}

export interface TablePlan {
  outline: string;
  /** Chain centre lines. Drawn on symmetric tops only. */
  centre: string | null;
  screen: { x: number; y: number; w: number; h: number } | null;
  legs: Point[];
  dimensions: DimensionMark[];
}

export interface PlanInput {
  shape: TopOption["shape"];
  length: number;
  depth: number | null;
  legs: LegLayout;
  hasScreen: boolean;
  width: number;
  height: number;
}

/** Clear of the registration crosses pinned in the frame's corners. */
const PAD = 40;
/** Room for one dimension line and its label beside the outline. */
const DIM_SPACE = 36;
/** Outline to dimension line. */
const DIM_GAP = 22;
/** Half the end-tick length. */
const TICK = 5;
/** Extension lines start this far off the outline… */
const EXT_GAP = 4;
/** …and run this far past the dimension line. */
const EXT_OVER = 6;
const CENTRE_OVER = 10;
/** Side of the square ink flat that marks a leg in plan. */
export const LEG_MARK_SIZE = 6;

const MIN_RATIO = 0.28;
const MAX_RATIO = 1.5;
/** Schematic return length on L and U tops, as a fraction of the length. Never labelled. */
const RETURN = 0.5;
/** Caps the drawn bar depth so an L still reads as an L and a U keeps its opening. */
const MAX_BAR = { "l-shape": 0.6, "u-shape": 0.36 } as const;

/** Integer pixel box of the top; `bar` is the drawn worktop depth on L and U tops. */
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  bar: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Leg packages that put a support at mid-span rather than only at the corners. */
export function legLayout(leg: LegOption | null): LegLayout {
  const name = leg?.name.toLowerCase() ?? "";
  if (name.includes("mid")) return "bench-mid";
  if (name.includes("bench")) return "bench";
  if (name.startsWith("2") || name.includes("two")) return "two";
  return "four";
}

/** Width, height and worktop depth in length-units (length = 1). */
function proportions(shape: PlanInput["shape"], length: number, depth: number | null) {
  if (shape === "round" || shape === "square") return { w: 1, h: 1, bar: 1 };
  const ratio = clamp(depth && length ? depth / length : 0.5, MIN_RATIO, MAX_RATIO);
  if (shape === "rect") return { w: 1, h: ratio, bar: ratio };
  const bar = Math.min(ratio, MAX_BAR[shape]);
  return { w: 1, h: bar + RETURN, bar };
}

/*
  Stroke coordinates sit on pixel centres (n + 0.5) so a 1px rule covers exactly one
  pixel column. The box is integer pixels; its edges are therefore x + 0.5 and
  x + w - 0.5.
*/
function edges({ x, y, w, h }: Box) {
  return { L: x + 0.5, T: y + 0.5, R: x + w - 0.5, B: y + h - 0.5 };
}

function outlinePath(shape: PlanInput["shape"], box: Box): string {
  const { L, T, R, B } = edges(box);
  const { bar } = box;
  switch (shape) {
    case "round": {
      const r = (R - L) / 2;
      const cy = (T + B) / 2;
      return `M${L} ${cy}A${r} ${r} 0 1 0 ${R} ${cy}A${r} ${r} 0 1 0 ${L} ${cy}Z`;
    }
    case "l-shape":
      return `M${L} ${T}H${R}V${T + bar}H${L + bar}V${B}H${L}Z`;
    case "u-shape":
      return `M${L} ${T}H${R}V${B}H${R - bar}V${T + bar}H${L + bar}V${B}H${L}Z`;
    default:
      return `M${L} ${T}H${R}V${B}H${L}Z`;
  }
}

function centrePath(shape: PlanInput["shape"], box: Box): string | null {
  if (shape === "l-shape" || shape === "u-shape") return null;
  const { L, T, R, B } = edges(box);
  const cx = Math.round((L + R) / 2) + 0.5;
  const cy = Math.round((T + B) / 2) + 0.5;
  return (
    `M${L - CENTRE_OVER} ${cy}H${R + CENTRE_OVER}` +
    `M${cx} ${T - CENTRE_OVER}V${B + CENTRE_OVER}`
  );
}

function screenRect(shape: PlanInput["shape"], hasScreen: boolean, box: Box) {
  if (!hasScreen || (shape !== "rect" && shape !== "square")) return null;
  const inset = 12;
  return { x: box.x + inset, y: Math.round(box.y + box.h / 2) - 1, w: box.w - inset * 2, h: 3 };
}

/** Leg centres. Round tops ring the edge; L and U tops stand on every outside corner. */
function legPoints(shape: PlanInput["shape"], layout: LegLayout, box: Box): Point[] {
  const { x, y, w, h, bar } = box;
  const inset = Math.round(clamp(Math.min(w, h, bar) * 0.12, 7, 16));
  const l = x + inset;
  const r = x + w - inset;
  const t = y + inset;
  const b = y + h - inset;
  const cx = Math.round(x + w / 2);
  const cy = Math.round(y + h / 2);

  if (shape === "round") {
    const radius = w / 2 - inset * 1.4;
    const count = layout === "two" ? 2 : 4;
    return Array.from({ length: count }, (_, i): Point => {
      const angle = Math.PI / 4 + (Math.PI * 2 * i) / count;
      return [Math.round(cx + radius * Math.cos(angle)), Math.round(cy + radius * Math.sin(angle))];
    });
  }

  if (shape === "l-shape") {
    return [[l, t], [r, t], [r, y + bar - inset], [x + bar - inset, b], [l, b]];
  }

  if (shape === "u-shape") {
    return [[l, t], [r, t], [r, b], [x + w - bar + inset, b], [x + bar - inset, b], [l, b]];
  }

  if (layout === "two") return [[l, cy], [r, cy]];
  const corners: Point[] = [[l, t], [r, t], [r, b], [l, b]];
  return layout === "bench-mid" ? [...corners, [cx, t], [cx, b]] : corners;
}

/** A horizontal dimension between two points, its line running at `at`. */
function horizontal(from: Point, to: Point, at: number, text: string): DimensionMark {
  const side = Math.sign(at - from[1]) || -1;
  const extension = [from, to]
    .map(([px, py]) => `M${px} ${py + side * EXT_GAP}V${at + side * EXT_OVER}`)
    .join("");
  const ticks = [from[0], to[0]].map((px) => `M${px} ${at - TICK}V${at + TICK}`).join("");
  return {
    extension,
    line: `M${from[0]} ${at}H${to[0]}${ticks}`,
    label: { x: (from[0] + to[0]) / 2, y: at, text, vertical: false },
  };
}

/** A vertical dimension between two points, its line running at `at`. */
function vertical(from: Point, to: Point, at: number, text: string): DimensionMark {
  const side = Math.sign(at - from[0]) || 1;
  const extension = [from, to]
    .map(([px, py]) => `M${px + side * EXT_GAP} ${py}H${at + side * EXT_OVER}`)
    .join("");
  const ticks = [from[1], to[1]].map((py) => `M${at - TICK} ${py}H${at + TICK}`).join("");
  return {
    extension,
    line: `M${at} ${from[1]}V${to[1]}${ticks}`,
    label: { x: at, y: (from[1] + to[1]) / 2, text, vertical: true },
  };
}

/**
 * Length across the top edge, always. Depth down the right-hand end of the worktop —
 * except on a U, where the right edge is the return, so the depth is taken across the
 * foot of that return instead (the return is as deep as the worktop).
 */
function dimensionsFor(input: PlanInput, box: Box): DimensionMark[] {
  const { shape, length, depth } = input;
  const { L, T, R, B } = edges(box);
  const top = T - DIM_GAP;

  const lengthMark =
    shape === "round"
      ? horizontal([L, (T + B) / 2], [R, (T + B) / 2], top, `Ø ${length}`)
      : horizontal([L, T], [R, T], top, String(length));

  if (depth === null || shape === "round") return [lengthMark];

  if (shape === "u-shape") {
    return [lengthMark, horizontal([R - box.bar, B], [R, B], B + DIM_GAP, String(depth))];
  }

  const foot = shape === "l-shape" ? T + box.bar : B;
  return [lengthMark, vertical([R, T], [R, foot], R + DIM_GAP, String(depth))];
}

export function planTable(input: PlanInput): TablePlan {
  const { shape, length, depth, width, height } = input;
  const unit = proportions(shape, length, depth);

  const hasDepth = depth !== null && shape !== "round";
  const right = hasDepth && shape !== "u-shape" ? DIM_SPACE : 0;
  const bottom = hasDepth && shape === "u-shape" ? DIM_SPACE : 0;

  const availW = Math.max(width - PAD * 2 - right, 40);
  const availH = Math.max(height - PAD * 2 - DIM_SPACE - bottom, 40);
  const scale = Math.min(availW / unit.w, availH / unit.h);

  const w = Math.round(unit.w * scale);
  const h = Math.round(unit.h * scale);
  const box: Box = {
    w,
    h,
    bar: Math.round(unit.bar * scale),
    // Centre the outline and its dimensions together, as one drawing.
    x: Math.round((width - (w + right)) / 2),
    y: Math.round((height - (DIM_SPACE + h + bottom)) / 2 + DIM_SPACE),
  };

  return {
    outline: outlinePath(shape, box),
    centre: centrePath(shape, box),
    screen: screenRect(shape, input.hasScreen, box),
    legs: legPoints(shape, input.legs, box),
    dimensions: dimensionsFor(input, box),
  };
}
