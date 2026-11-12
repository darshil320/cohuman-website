import { z } from "zod";

/**
 * The shape of `src/data/pieces.json`, validated when the local repository loads it.
 *
 * A piece is one product with its own page at `/products/<slug>` — the designer
 * collaboration (PM x Cohuman) and the seating, as the 2026 catalogue presents them:
 * a name, a type, one sentence, a short about, the catalogue's sizes where it prints
 * them, and its photographs. Desking systems are not pieces; they live in
 * `collections.json` and `src/lib/series`.
 */

/** The collection groups, in the catalogue's order. Workstations are the systems. */
export const PIECE_GROUPS = ["pm-x-cohuman", "seating"] as const;

const imageSrc = z
  .string()
  .regex(/^\/[a-z0-9-]+(\/[a-z0-9-]+)*\/[\w.-]+\.(jpe?g|png|webp|avif)$/i, "image must be a file under public/");

const pieceImageSchema = z.object({
  src: imageSrc,
  alt: z.string().trim().min(1, "image needs alt text"),
});

/** Millimetres. A list where the catalogue offers more than one value, e.g. sofa widths. */
const mm = z.array(z.number().int().positive()).min(1);

export const pieceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
  name: z.string().trim().min(1),
  /** "Executive desk", "Sofa", "Office chair". */
  type: z.string().trim().min(1),
  group: z.enum(PIECE_GROUPS),
  /** The catalogue's one-line description. */
  tagline: z.string().trim().min(1),
  /** The catalogue's ABOUT paragraph. */
  about: z.string().trim().min(1),
  /** Width × depth × height, as the catalogue prints it. Absent where it prints none. */
  size: z
    .object({
      w: mm,
      d: mm,
      h: mm,
      /** What the size is of, e.g. "two seater". */
      note: z.string().trim().min(1).optional(),
    })
    .optional(),
  availableAs: z.array(z.string().trim().min(1)).min(1).optional(),
  finish: z.string().trim().min(1).optional(),
  upholstery: z.string().trim().min(1).optional(),
  /** The piece in a room. First image on the page and in the menus' scene slots. */
  scene: pieceImageSchema,
  /** Cut-outs on white, in the catalogue's order; the first is the piece's card image. */
  views: z.array(pieceImageSchema.extend({ label: z.string().trim().min(1) })).min(1),
  /** Named versions with their own render (Ergohuman's headrest, leg rest, Plus). */
  versions: z.array(pieceImageSchema.extend({ label: z.string().trim().min(1) })).optional(),
});

export const piecesSchema = z
  .array(pieceSchema)
  .refine((list) => new Set(list.map((p) => p.slug)).size === list.length, "piece slugs must be unique");

export type Piece = z.infer<typeof pieceSchema>;
export type PieceGroup = (typeof PIECE_GROUPS)[number];
export type PieceSize = NonNullable<Piece["size"]>;

/** "2400 × 1100 × 800 mm"; several values on one axis read "900 / 1400 / 2000". */
export function pieceSizeLabel(size: PieceSize): string {
  const axis = (values: number[]) => values.join(" / ");
  return `${axis(size.w)} × ${axis(size.d)} × ${axis(size.h)} mm`;
}
