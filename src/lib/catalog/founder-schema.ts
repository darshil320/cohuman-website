import { z } from "zod";

/**
 * The shape of `src/data/founders.json`, validated when the local repository loads it.
 *
 * The file is hand-edited content, so it is checked rather than trusted: a typo in a
 * photo path or an empty bio fails the build with a message instead of shipping a broken
 * card. Photos must live in `public/founders/` and carry alt text; LinkedIn links must be
 * real https linkedin.com URLs.
 */
export const founderSchema = z.object({
  /** Stable key, kebab-case. */
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
  name: z.string().trim().min(1),
  /** e.g. "Co-founder · Manufacturing". */
  role: z.string().trim().min(1),
  /**
   * Two to four sentences. Personal career history is allowed; brand heritage is not —
   * no Cohuman founding year, no old trading name, no counted track record.
   */
  bio: z.string().trim().min(1),
  /** Focus areas, printed in mono. */
  focus: z.array(z.string().trim().min(1)).min(1),
  photo: z
    .object({
      src: z.string().regex(/^\/founders\/[\w.-]+\.(jpe?g|png|webp|avif)$/i, "photo must be in public/founders/"),
      alt: z.string().trim().min(1, "photo needs alt text"),
    })
    .optional(),
  linkedin: z
    .string()
    .url()
    .regex(/^https:\/\/(www\.)?linkedin\.com\//, "LinkedIn link must be an https linkedin.com URL")
    .optional(),
  quote: z.string().trim().min(1).optional(),
});

export const foundersSchema = z
  .array(founderSchema)
  .refine((list) => new Set(list.map((f) => f.slug)).size === list.length, "founder slugs must be unique");
