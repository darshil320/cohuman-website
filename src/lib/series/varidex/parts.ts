import type { SeriesPart } from "../types";

/**
 * Every distinct component called out on the VARIDEX specification pages, with the
 * material and finish exactly as printed. The PDF repeats the same part across product
 * pages under different numbers; this is the union, renumbered in assembly order.
 *
 * `focus` was measured off `/varidex/bench-2.jpg`. Only the foot, the end leg, the mid
 * leg and the top are identifiable in it; the beams, connectors and cable channels sit
 * inside the assembly, so they carry no focus and the stage says so instead of pointing
 * a number at a plausible-looking pixel.
 */
export const VARIDEX_PARTS: SeriesPart[] = [
  {
    n: "1",
    name: "Adjustable foot",
    group: "Chassis",
    why: "Levels out 30mm of floor variance — enough for most screed and carpet-tile transitions.",
    rows: [
      { k: "Material", v: "ABS plastic" },
      { k: "Adjustment", v: "30mm travel" },
    ],
    focus: { x: 12.4, y: 82.2, zoom: 3.4 },
  },
  {
    n: "2",
    name: "Side leg",
    group: "Chassis",
    why: "The end support every configuration stands on, at 720mm working height.",
    rows: [
      { k: "Material", v: "2.0mm metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
    focus: { x: 12.4, y: 64, zoom: 2.5 },
  },
  {
    n: "3",
    name: "Middle leg",
    group: "Chassis",
    why: "Carries the span on meeting tables and benches so the top stays flat across the run.",
    rows: [
      { k: "Material", v: "40×25×T2mm rectangular metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
    focus: { x: 60.3, y: 55, zoom: 2.5 },
  },
  {
    n: "4",
    name: "Single in line mid leg",
    group: "Chassis",
    why: "Lets two desks run in line off one shared support instead of four legs each.",
    rows: [
      { k: "Material", v: "T=2mm metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "5",
    name: "Outer beam",
    group: "Chassis",
    why: "The rail the top sits on, and where screens and CPU holders bracket in.",
    rows: [
      { k: "Material", v: "40×25×T1.5mm rectangular metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "6",
    name: "Adjusting beam",
    group: "Chassis",
    why: "Sets the depth of the frame, so one chassis takes a 600mm or an 800mm top.",
    rows: [
      { k: "Material", v: "36×21×T1.5mm rectangular metal pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "7",
    name: "Adjustable beam",
    group: "Chassis",
    why: "Takes up the length between leg pairs, which is what lets a top be quoted as a range.",
    rows: [
      { k: "Material", v: "36×21mm rectangular pipe" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "8",
    name: "Straight connector",
    group: "Chassis",
    why: "Joins two frames in line, so a bench run extends without a second set of end legs.",
    rows: [
      { k: "Material", v: "T=3mm metal sheet" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "9",
    name: "Table top",
    group: "Surface",
    why: "25mm core with a 2mm PVC edge — the edge is what survives ten years of chair arms.",
    rows: [
      { k: "Core", v: "Particle board, T=25mm, E0 grade" },
      { k: "Finishing", v: "Melamine paper" },
      { k: "Edge banding", v: "T=2mm PVC" },
    ],
    focus: { x: 64, y: 31, zoom: 1.9 },
  },
  {
    n: "10",
    name: "Return supportive wood box",
    group: "Surface",
    why: "Supports the return end of a manager desk and doubles as closed storage.",
    rows: [
      { k: "Panel", v: "Particle board, T=16mm, E0 grade" },
      { k: "Finishing", v: "Melamine" },
      { k: "Edge banding", v: "T=2mm PVC" },
    ],
  },
  {
    n: "11",
    name: "Cable riser for face to face",
    group: "Cable management",
    why: "Drops power from the desktop channel to the floor box inside the leg line.",
    rows: [
      { k: "Material", v: "T=1mm metal sheet" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "12",
    name: "Inner channel for face to face",
    group: "Cable management",
    why: "Holds the power rail down the spine of a bench, between the two rows of tops.",
    rows: [
      { k: "Material", v: "1mm metal sheet" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
  {
    n: "13",
    name: "Outer channel for face to face",
    group: "Cable management",
    why: "Carries data separately from power, so the two are not sharing one tray.",
    rows: [
      { k: "Material", v: "1mm metal sheet" },
      { k: "Finishing", v: "Powder coating, 80–120μ" },
    ],
  },
];

/** Part shown first — the table top reads best as an entry point into the list. */
export const VARIDEX_DEFAULT_PART_INDEX = 8;
