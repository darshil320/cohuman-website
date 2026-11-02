import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Cohuman wordmark, placed from the supplied master artwork.
 *
 * The brand guidelines are explicit that the name is never retyped or redrawn: the two
 * green dots above the M and the green bar inside the O are part of the mark, and only
 * the master files carry them correctly. These are the client's vector masters, copied
 * into `public/brand/` unchanged — SVG, so the mark is sharp at any size and density.
 * Next serves a `.svg` source unoptimised, which is what a vector wants.
 *
 * - `dark`  — `logo-primary.svg`: ink letters, green dots and bar. Light surfaces.
 * - `light` — `logo-reverse.svg`: white letters, green dots and bar. Ink and dark footage.
 * - `mono-dark` / `mono-light` — single colour, for one-colour contexts only.
 *
 * Minimum size is 140px wide on screen; the `className` width must not go below that.
 * Clear space is half the cap height on every side.
 *
 * `logo-black.png` stays in `public/brand/` for the JSON-LD `logo` only — search engines
 * are surest of a raster there. Nothing on screen uses it.
 */
const LOGO_FILES = {
  dark: "/brand/logo-primary.svg",
  light: "/brand/logo-reverse.svg",
  "mono-dark": "/brand/logo-ink.svg",
  "mono-light": "/brand/logo-white.svg",
} as const;

/** The masters' viewBox is 1431.80 × 197.82; rounded, it fixes the aspect ratio. */
const LOGO_WIDTH = 1432;
const LOGO_HEIGHT = 198;

export type LogoTone = keyof typeof LOGO_FILES;

export function Logo({
  tone = "dark",
  className,
  sizes = "160px",
  eager = false,
}: {
  tone?: LogoTone;
  /** Sets the rendered width; height follows the artwork's ratio. */
  className?: string;
  /** Kept for call-site compatibility; a vector needs no responsive sizes. */
  sizes?: string;
  /** Load immediately — for the header mark, which is on screen at first paint. */
  eager?: boolean;
}) {
  return (
    <Image
      src={LOGO_FILES[tone]}
      alt="Cohuman"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={cn("block h-auto w-[150px] min-w-[140px] select-none", className)}
      draggable={false}
    />
  );
}
