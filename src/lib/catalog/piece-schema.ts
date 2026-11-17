import { z } from "zod";

/**
 * The shape of `src/data/pieces.json`, validated when the local repository loads it.
 *
 * A piece is one product with its own page at `/products/<slug>` — the designer
 * collaboration ("Designer collab", designed by Parth Makwana) and the seating, as the 2026 catalogue presents them:
 * a name, a type, one sentence, a short about, the catalogue's sizes where it prints
 * them, and its photographs. Desking systems are not pieces; they live in
 * `collections.json` and `src/lib/series`.
 */

/**
 * The collection groups a piece can sit in. Workstations are mostly the desking systems
 * in `collections.json`; a piece joins them when the catalogue draws a system as fixed
 * products rather than a configurable range (Type A).
 */
export const PIECE_GROUPS = ["designer-collab", "workstations", "seating", "phone-booths", "accessories"] as const;

const imageSrc = z
  .string()
  .regex(/^\/[a-z0-9-]+(\/[a-z0-9-]+)*\/[\w.-]+\.(jpe?g|png|webp|avif)$/i, "image must be a file under public/");

const pieceImageSchema = z.object({
  src: imageSrc,
  alt: z.string().trim().min(1, "image needs alt text"),
});

/** Millimetres. A list where the catalogue offers more than one value, e.g. sofa widths. */
const mm = z.array(z.number().int().positive()).min(1);

const sizeSchema = z.object({
  w: mm,
  d: mm,
  h: mm,
  /** What the size is of, e.g. "two seater". */
  note: z.string().trim().min(1).optional(),
});

export const pieceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
  name: z.string().trim().min(1),
  /** "Executive desk", "Sofa", "Office chair". */
  type: z.string().trim().min(1),
  group: z.enum(PIECE_GROUPS),
  /** Who designed it, credited on the product page ("Designed by …"). Designer collab only. */
  designer: z.string().trim().min(1).optional(),
  /** The catalogue's one-line description. */
  tagline: z.string().trim().min(1),
  /** The catalogue's ABOUT paragraph. */
  about: z.string().trim().min(1),
  /** Width × depth × height, as the catalogue prints it. Absent where it prints none. */
  size: sizeSchema.optional(),
  /** Several products under one name, each with its own size (Type A's workstation and main table). */
  parts: z.array(z.object({ label: z.string().trim().min(1), size: sizeSchema })).min(1).optional(),
  /** What comes built in, as the catalogue lists it. */
  builtIn: z.string().trim().min(1).optional(),
  availableAs: z.array(z.string().trim().min(1)).min(1).optional(),
  finish: z.string().trim().min(1).optional(),
  /** Seat count where the source states one, e.g. "1 to 8, by model". */
  seats: z.string().trim().min(1).optional(),
  /**
   * More folded rows for the details section, from the product's own literature — e.g.
   * the booth's acoustics, construction and installation. Each line is one sentence.
   */
  details: z.array(z.object({ title: z.string().trim().min(1), lines: z.array(z.string().trim().min(1)).min(1) })).optional(),
  /** Colour options, as the client confirmed them (Ergohuman: black, grey). */
  colours: z.array(z.string().trim().min(1)).min(1).optional(),
  upholstery: z.string().trim().min(1).optional(),
  /**
   * The piece in a room: first image on the page. Optional — Type A is drawings only,
   * and a drawing is never passed off as a photograph.
   */
  scene: pieceImageSchema.optional(),
  /**
   * More photographs shown whole, after the room shot — studio shots on a grey or
   * coloured backdrop, which must not be multiplied like a cut-out on white (phone booth).
   */
  photos: z.array(pieceImageSchema.extend({ label: z.string().trim().min(1) })).optional(),
  /** Cut-outs on white, in the catalogue's order; the first is the piece's card image. */
  /** May be empty when the piece is photographed only (power units shot on a desk). */
  views: z.array(pieceImageSchema.extend({ label: z.string().trim().min(1) })),
  /** Named versions with their own render (Ergohuman's headrest, leg rest); shown in the viewer. */
  versions: z.array(pieceImageSchema.extend({ label: z.string().trim().min(1) })).optional(),
});

export const piecesSchema = z
  .array(pieceSchema.refine((p) => p.scene || p.views.length > 0, "a piece needs a room shot or a view"))
  .refine((list) => new Set(list.map((p) => p.slug)).size === list.length, "piece slugs must be unique");

export type Piece = z.infer<typeof pieceSchema>;
export type PieceGroup = (typeof PIECE_GROUPS)[number];
export type PieceSize = NonNullable<Piece["size"]>;

/** "2400 × 1100 × 800 mm"; several values on one axis read "900 / 1400 / 2000". */
export function pieceSizeLabel(size: PieceSize): string {
  const axis = (values: number[]) => values.join(" / ");
  return `${axis(size.w)} × ${axis(size.d)} × ${axis(size.h)} mm`;
}

/** Every picture of a piece, room shot first where there is one. */
export function pieceImages(piece: Piece): { src: string; alt: string }[] {
  return [...(piece.scene ? [piece.scene] : []), ...(piece.photos ?? []), ...piece.views, ...(piece.versions ?? [])];
}

/** The picture that stands for a piece in a list: its room shot, else its first view. */
export function pieceLeadImage(piece: Piece): { src: string; alt: string; kind: "scene" | "cutout" } {
  return piece.scene ? { ...piece.scene, kind: "scene" } : { ...piece.views[0], kind: "cutout" };
}
