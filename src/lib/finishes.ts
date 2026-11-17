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
  /** Average colour of the swatch photograph — paints the configurator's plan drawing. */
  fill?: string;
}

export const BOARD_SHADES: readonly Swatch[] = [
  // Catalogue v31 (p. 70) names and codes. Swatch files keep the v18 board-maker names.
  { code: "CH-01", name: "Frosty White", src: "/finishes/board-22091-artic-white.jpg", fill: "#c7d4cb" },
  { code: "CH-02", name: "Gothic Grey", src: "/finishes/board-20059-neo-gothic-grey.jpg", fill: "#656259" },
  { code: "CH-03", name: "Black", src: "/finishes/board-21076-black.jpg", fill: "#1f1f1f" },
  { code: "CH-04", name: "Irish Cream", src: "/finishes/board-20017-neo-irish-cream.jpg", fill: "#929791" },
  { code: "CH-05", name: "Highland Pine", src: "/finishes/board-11005-neo-highland-pine.jpg", fill: "#c7cfc5" },
  { code: "CH-06", name: "Mangfall Beech", src: "/finishes/board-10002-mangfall-beech.jpg", fill: "#ac9e84" },
  { code: "CH-07", name: "Sonoma Oak", src: "/finishes/board-10613-kastha-sonoma-oak.jpg", fill: "#a09076" },
];

/** Fabric shades for softboard, designer and acoustic screens (catalogue v31, p. 70). */
export const FABRIC_SHADES: readonly Swatch[] = [
  { code: "CH-01", name: "Red", src: "/finishes/fabric-ch-01-red.jpg", fill: "#ba2239" },
  { code: "CH-02", name: "Grey", src: "/finishes/fabric-ch-02-grey.jpg", fill: "#7a7b7b" },
  { code: "CH-03", name: "Blue", src: "/finishes/fabric-ch-03-blue.jpg", fill: "#4d75ba" },
  { code: "CH-04", name: "Green", src: "/finishes/fabric-ch-04-green.jpg", fill: "#257a6a" },
  { code: "CH-05", name: "Orange", src: "/finishes/fabric-ch-05-orange.jpg", fill: "#d8782e" },
  { code: "CH-06", name: "Lemon", src: "/finishes/fabric-ch-06-lemon.jpg", fill: "#cfa538" },
];

/** Powder-coat shades for the frame, by system, as the catalogue groups them. */
export const FRAME_SHADES: readonly { systems: string; note: string; shades: readonly Swatch[] }[] = [
  {
    systems: "Stretch S",
    note: "White or charcoal grey",
    shades: [
      { name: "White", src: "/finishes/metal-stretch-s-white.jpg", fill: "#e5eaed" },
      { name: "Charcoal Grey", src: "/finishes/metal-stretch-s-charcoal-grey.jpg", fill: "#25313c" },
    ],
  },
  {
    systems: "Stretch V",
    note: "Charcoal grey only",
    shades: [{ name: "Charcoal Grey", src: "/finishes/metal-stretch-v-charcoal-grey.jpg", fill: "#25313c" }],
  },
  {
    systems: "Stretch F",
    note: "Orange only",
    shades: [{ name: "Orange", src: "/finishes/metal-stretch-f-orange.jpg", fill: "#c98c7e" }],
  },
  {
    systems: "Apex and Element",
    note: "Standard shade card",
    shades: [
      { code: "CH-01", name: "Frosty White", src: "/finishes/metal-ch-01-frosty-white.jpg", fill: "#fafaf0" },
      { code: "CH-02", name: "Black", src: "/finishes/metal-ch-02-black.jpg", fill: "#231f20" },
      { code: "CH-03", name: "Graphite Grey", src: "/finishes/metal-ch-03-graphite-grey.jpg", fill: "#474745" },
      { code: "CH-04", name: "Beige", src: "/finishes/metal-ch-04-beige.jpg", fill: "#b5a490" },
    ],
  },
  {
    systems: "Stretch E and Stretch R",
    note: "Ready available",
    shades: [
      { name: "Dark Grey", src: "/finishes/metal-stretch-er-dark-grey.jpg", fill: "#2e3641" },
      { name: "Beige", src: "/finishes/metal-stretch-er-beige.jpg", fill: "#f4f1e2" },
    ],
  },
];

/** A named option with the catalogue's drawing or photograph (v31, p. 68). */
export interface PictureOption {
  slug: string;
  name: string;
  src: string;
  note?: string;
}

export const TOP_CORES = ["Pre-laminated wooden chip board", "Plywood", "HDHMR"] as const;

export const EDGE_DETAILS = ["Straight edges", "Chamfered edges", "Round edges"] as const;

export const CORE_OPTIONS: readonly PictureOption[] = [
  { slug: "chipboard", name: "Pre-laminated wooden chip board", src: "/configurator/core-chipboard.jpg", note: "25 mm, E1 grade — the standard top" },
  { slug: "plywood", name: "Plywood", src: "/configurator/core-plywood.jpg" },
  { slug: "hdhmr", name: "HDHMR", src: "/configurator/core-hdhmr.jpg" },
];

export const EDGE_OPTIONS: readonly PictureOption[] = [
  { slug: "straight", name: "Straight", src: "/configurator/edge-straight.jpg" },
  { slug: "chamfered", name: "Chamfered", src: "/configurator/edge-chamfered.jpg" },
  { slug: "round", name: "Round", src: "/configurator/edge-round.jpg" },
];

export const CORNER_OPTIONS: readonly PictureOption[] = [
  { slug: "straight", name: "Straight", src: "/configurator/corner-straight.jpg" },
  { slug: "round", name: "Round", src: "/configurator/corner-round.jpg" },
];

/** Screen partitions (v31, p. 69). `fabric`: takes a fabric shade. */
export const PARTITION_OPTIONS: readonly (PictureOption & { fabric: boolean })[] = [
  { slug: "glass", name: "8 mm BPG glass", note: "Magnetic or non-magnetic", src: "/configurator/partition-glass.jpg", fabric: false },
  { slug: "softboard-writing", name: "32 mm softboard + writing board", src: "/configurator/partition-softboard-writing.jpg", fabric: true },
  { slug: "softboard", name: "25 mm softboard", src: "/configurator/partition-softboard.jpg", fabric: true },
  { slug: "designer", name: "Designer screen", src: "/configurator/partition-designer.jpg", fabric: true },
  { slug: "acoustic", name: "Acoustic screen", src: "/configurator/partition-glass.jpg", fabric: true },
];

/** Cable management options in the top (v31, p. 69). */
export const CABLE_OPTIONS: readonly PictureOption[] = [
  { slug: "grommet", name: "Grommet", src: "/configurator/cable-grommet.jpg" },
  { slug: "flip-up-box", name: "Flip-up box", src: "/configurator/cable-flip-up-box.jpg" },
  { slug: "cutout", name: "Wire management cutout", src: "/configurator/cable-cutout.jpg" },
];

/** Pedestals and desk accessories (v31, p. 71). */
export const STORAGE_OPTIONS: readonly PictureOption[] = [
  { slug: "pedestal-1d1s", name: "Pedestal, 1D + 1S", note: "400 × 400 × 650 mm", src: "/configurator/pedestal-1d1s.jpg" },
  { slug: "pedestal-3-drawer", name: "Three-drawer unit", note: "400 × 400 × 650 mm", src: "/configurator/pedestal-3-drawer.jpg" },
  { slug: "pedestal-metal", name: "Metal pedestal", src: "/configurator/pedestal-metal.jpg" },
  { slug: "metal-drawer", name: "Metal drawer", src: "/configurator/acc-metal-drawer.jpg" },
  { slug: "pen-tray", name: "Pen tray", src: "/configurator/acc-pen-tray.jpg" },
  { slug: "stationery-tray", name: "Stationery tray", src: "/configurator/acc-stationery-tray.jpg" },
  { slug: "divider", name: "Divider", src: "/configurator/acc-divider.jpg" },
];

/** Catalogue v31, p. 68. */
export const WARRANTY = "10 years for workspace systems. 5 years for other products.";

export const SCREEN_POSITIONS = [
  { name: "Centre screens", note: "Between desks facing each other on a bench." },
  {
    name: "Centre and side screens",
    note: "Between facing desks and between neighbours, as on the 4-seater with side screen.",
  },
  { name: "Back screens", note: "Along the back of a single-row bench." },
] as const;

/** Values are from the Stretch S and Stretch V specifications and catalogue v31 (p. 68). */
export const TECHNICAL_SPEC = [
  { k: "Desktop", v: "25 mm particle board core with melamine paper finish. E1 grade in Stretch S, E0 grade in Stretch V." },
  { k: "Edge banding", v: "2 mm PVC" },
  { k: "Frame and legs", v: "Metal pipe and sheet, powder coated, 80–120 microns. Side legs 1.5 mm (Stretch S) or 2.0 mm (Stretch V)." },
  { k: "Leveler", v: "ABS plastic, 30 mm of height adjustment" },
  { k: "Cable management", v: "Aluminium cable channels, metal wire boxes and cable risers, depending on the table" },
  { k: "Warranty", v: "10 years for workspace systems. 5 years for other products." },
] as const;

/** Every swatch file, for the existence test. */
export function allSwatches(): Swatch[] {
  return [
    ...BOARD_SHADES,
    ...FABRIC_SHADES,
    ...FRAME_SHADES.flatMap((group) => group.shades),
    ...[...CORE_OPTIONS, ...EDGE_OPTIONS, ...CORNER_OPTIONS, ...PARTITION_OPTIONS, ...CABLE_OPTIONS, ...STORAGE_OPTIONS].map(
      (option) => ({ name: option.name, src: option.src }),
    ),
  ];
}
