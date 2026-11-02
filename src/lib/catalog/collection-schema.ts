import { z } from "zod";

/**
 * The shape of `src/data/collections.json`, validated when the local repository loads it.
 *
 * A collection is one of two things:
 *
 * - **A configurator series** (STRETCH S, STRETCH V): only the listing fields here; the
 *   specification — configurations, sizes, part codes — lives in `src/lib/series`.
 * - **A photographed range** (STRETCH F, APEX, ELEMENT): the manufacturer supplied
 *   photographs but no specification, so the collection carries its own wordmark, lead,
 *   the pieces it includes and the photographs, and quotes no sizes at all. Its page is
 *   a gallery and an enquiry, not a configurator. When a specification arrives, write a
 *   `SeriesDefinition` for it and the configurator takes over.
 */
export const collectionPhotoSchema = z.object({
  src: z
    .string()
    .regex(/^\/[a-z0-9-]+\/[\w.-]+\.(jpe?g|png|webp|avif)$/i, "photo must be a file under public/"),
  alt: z.string().trim().min(1, "photo needs alt text"),
  /** Figure caption: names what is shown, never a size. */
  caption: z.string().trim().min(1),
  /** `scene`: an interior, set high-key. `cutout`: a render on white, multiplied. */
  kind: z.enum(["scene", "cutout"]),
});

export const collectionSchema = z
  .object({
    /** The URL contract: `/collections/<slug>`. Never renamed with the wordmark. */
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
    name: z.string().trim().min(1),
    kicker: z.string().trim().min(1),
    blurb: z.string().trim().min(1),
    slotHint: z.string().trim().min(1),
    wordmark: z.string().trim().min(1).optional(),
    /** The gallery page's opening paragraph. */
    lead: z.string().trim().min(1).optional(),
    /** What the range includes, e.g. "Executive desk". */
    pieces: z.array(z.string().trim().min(1)).min(1).optional(),
    /** First photo is the collection's hero, so it must be a scene. */
    photos: z.array(collectionPhotoSchema).min(1).optional(),
    /** The supplier's leg-finish shot, shown as its own figure. */
    legFinishes: collectionPhotoSchema.optional(),
  })
  .superRefine((c, ctx) => {
    if (!c.photos) return;
    if (c.photos[0].kind !== "scene") {
      ctx.addIssue({ code: "custom", path: ["photos", 0, "kind"], message: "the hero photo must be a scene" });
    }
    for (const key of ["wordmark", "lead", "pieces"] as const) {
      if (!c[key]) {
        ctx.addIssue({ code: "custom", path: [key], message: `a photographed collection needs a ${key}` });
      }
    }
  });

export const collectionsSchema = z
  .array(collectionSchema)
  .refine((list) => new Set(list.map((c) => c.slug)).size === list.length, "collection slugs must be unique");

export type CollectionPhoto = z.infer<typeof collectionPhotoSchema>;
