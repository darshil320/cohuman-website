/**
 * Tops and finishes — the 2026 catalogue's shared reference (pp. 68–69), verbatim. One
 * page for every system instead of a finish board per product. Swatch photographs are
 * the catalogue's own, in `public/finishes/`; shades as printed may vary from the
 * actual finish.
 */

export interface Swatch {
  name: string;
  /** The board maker's shade code, where the catalogue prints one. */
  code?: string;
  src: string;
}

export const BOARD_SHADES: readonly Swatch[] = [
  { code: "22091", name: "Artic White", src: "/finishes/board-22091-artic-white.jpg" },
  { code: "20059", name: "Neo Gothic Grey", src: "/finishes/board-20059-neo-gothic-grey.jpg" },
  { code: "21076", name: "Black", src: "/finishes/board-21076-black.jpg" },
  { code: "20017", name: "Neo Irish Cream", src: "/finishes/board-20017-neo-irish-cream.jpg" },
  { code: "11005", name: "Neo Highland Pine", src: "/finishes/board-11005-neo-highland-pine.jpg" },
  { code: "10002", name: "Mangfall Beech", src: "/finishes/board-10002-mangfall-beech.jpg" },
  { code: "10613", name: "Kastha Sonoma Oak", src: "/finishes/board-10613-kastha-sonoma-oak.jpg" },
];

/** Powder-coat shades for the frame, by system, as the catalogue groups them. */
export const FRAME_SHADES: readonly { systems: string; note: string; shades: readonly Swatch[] }[] = [
  {
    systems: "Stretch S",
    note: "White or charcoal grey",
    shades: [
      { name: "White", src: "/finishes/metal-stretch-s-white.jpg" },
      { name: "Charcoal Grey", src: "/finishes/metal-stretch-s-charcoal-grey.jpg" },
    ],
  },
  {
    systems: "Stretch V",
    note: "Charcoal grey only",
    shades: [{ name: "Charcoal Grey", src: "/finishes/metal-stretch-v-charcoal-grey.jpg" }],
  },
  {
    systems: "Stretch F",
    note: "Orange only",
    shades: [{ name: "Orange", src: "/finishes/metal-stretch-f-orange.jpg" }],
  },
  {
    systems: "Apex and Element",
    note: "Standard shade card",
    shades: [
      { code: "CH-01", name: "Frosty White", src: "/finishes/metal-ch-01-frosty-white.jpg" },
      { code: "CH-02", name: "Black", src: "/finishes/metal-ch-02-black.jpg" },
      { code: "CH-03", name: "Graphite Grey", src: "/finishes/metal-ch-03-graphite-grey.jpg" },
      { code: "CH-04", name: "Beige", src: "/finishes/metal-ch-04-beige.jpg" },
    ],
  },
  {
    systems: "Stretch E and Stretch R",
    note: "Ready available",
    shades: [
      { name: "Dark Grey", src: "/finishes/metal-stretch-er-dark-grey.jpg" },
      { name: "Beige", src: "/finishes/metal-stretch-er-beige.jpg" },
    ],
  },
];

export const TOP_CORES = ["Pre-laminated wooden chip board", "Plywood", "MDF / HDHMR"] as const;

export const EDGE_DETAILS = ["Straight edges", "Chamfered edges"] as const;

export const SCREEN_POSITIONS = [
  { name: "Centre screens", note: "Between desks facing each other on a bench." },
  {
    name: "Centre and side screens",
    note: "Between facing desks and between neighbours, as on the 4-seater with side screen.",
  },
  { name: "Back screens", note: "Along the back of a single-row bench." },
] as const;

/** Values are from the Stretch S and Stretch V specifications; the warranty is not yet confirmed, so it is not listed. */
export const TECHNICAL_SPEC = [
  { k: "Desktop", v: "25 mm particle board core with melamine paper finish. E1 grade in Stretch S, E0 grade in Stretch V." },
  { k: "Edge banding", v: "2 mm PVC" },
  { k: "Frame and legs", v: "Metal pipe and sheet, powder coated, 80–120 microns. Side legs 1.5 mm (Stretch S) or 2.0 mm (Stretch V)." },
  { k: "Adjustable foot", v: "ABS plastic, 30 mm of height adjustment" },
  { k: "Cable management", v: "Aluminium cable channels, metal wire boxes and cable risers, depending on the table" },
] as const;

/** Every swatch file, for the existence test. */
export function allSwatches(): Swatch[] {
  return [...BOARD_SHADES, ...FRAME_SHADES.flatMap((group) => group.shades)];
}
