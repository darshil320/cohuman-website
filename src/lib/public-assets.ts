import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Whether a `/public` path is actually on disk.
 *
 * Server components only — it reads the filesystem at render (so, at build time for the
 * static pages). It exists so photography can be handed over as files rather than as a
 * code change: a section lists the pictures it wants, and each one appears the moment
 * someone drops it into `public/`. Until then nothing renders, so the site never ships a
 * broken image while it waits for a photographer.
 */
export function publicFileExists(src: string): boolean {
  if (!src.startsWith("/")) return false;
  // Reject traversal before touching the filesystem — these paths are ours today, but a
  // helper that resolves arbitrary strings against the project root should not be the
  // thing standing between a future caller and `../../.env`.
  if (src.includes("..")) return false;
  return existsSync(join(process.cwd(), "public", src.slice(1)));
}
