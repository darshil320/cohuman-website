import type { SeriesPart } from "../types";

/**
 * The ten numbered components called out in the PROS specification sheet, with the
 * gauge and finish quoted for each.
 */
export const PROS_PARTS: SeriesPart[] = [
  {
    n: "1",
    name: "Middle leg",
    group: "Chassis",
    why: "Takes the span load on benches so the beam stays flat under four workstations.",
    rows: [
      { k: "Material", v: "2.0mm metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "2",
    name: "Side leg",
    group: "Chassis",
    why: "The signature A-frame. Splayed to clear knees and keep the footprint off the walkway.",
    rows: [
      { k: "Material", v: "1.5mm metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "3",
    name: "Adjustable foot",
    group: "Chassis",
    why: "Levels out 30mm of floor variance — enough for most screed and carpet-tile transitions.",
    rows: [
      { k: "Material", v: "ABS plastic" },
      { k: "Adjustment", v: "30mm travel" },
    ],
  },
  {
    n: "4",
    name: "Horizontal bar",
    group: "Chassis",
    why: "Ties the leg pairs together and stops the frame racking when the desk is pushed.",
    rows: [
      { k: "Material", v: "T=1.5mm metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "5",
    name: "Vertical cable channel",
    group: "Cable management",
    why: "Drops power from the desktop tray to the floor box inside the leg line — nothing visible.",
    rows: [
      { k: "Material", v: "T=1.5mm aluminium profile" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "6",
    name: "Middle leg top bar",
    group: "Chassis",
    why: "Spreads the top fixing across the middle leg so the joint never telegraphs through the melamine.",
    rows: [
      { k: "Material", v: "T=3.0mm metal sheet & T=2.0mm metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "7",
    name: "Table top",
    group: "Surface",
    why: "25mm core with a 2mm PVC edge — the edge is what survives ten years of chair arms.",
    rows: [
      { k: "Core", v: "Particle board, T=25mm, E1 grade" },
      { k: "Finishing", v: "Melamine paper" },
      { k: "Edge banding", v: "T=2mm PVC" },
    ],
  },
  {
    n: "8",
    name: "Cable channel",
    group: "Cable management",
    why: "Runs the full length under the top. Holds a power rail and data without a retrofit tray.",
    rows: [
      { k: "Material", v: "T=1.2mm aluminium profile" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "9",
    name: "Side bar",
    group: "Chassis",
    why: "The rail the top sits on. Also where screens and CPU holders bracket in.",
    rows: [
      { k: "Material", v: "60×25×T1.5mm metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "10",
    name: "Wires box",
    group: "Cable management",
    why: "A hinged box under the top for adaptors, so bricks never sit on the floor.",
    rows: [
      { k: "Material", v: "0.7mm metal sheet" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
];

/** Part shown first — the table top reads best as an entry point into the list. */
export const PROS_DEFAULT_PART_INDEX = 6;
