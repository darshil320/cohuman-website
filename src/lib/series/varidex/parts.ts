import type { SeriesPart } from "../types";

/**
 * Every distinct component called out on the VARIDEX specification pages, with the
 * material and finish exactly as printed. The PDF repeats the same part across product
 * pages under different numbers; this is the union, renumbered in assembly order.
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
    pin: { x: 12, y: 72 },
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
    pin: { x: 14, y: 58 },
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
    pin: { x: 37, y: 58 },
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
    pin: { x: 50, y: 58 },
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
    pin: { x: 51, y: 52 },
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
    pin: { x: 51, y: 52 },
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
