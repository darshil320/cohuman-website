import { cn } from "@/lib/utils";

/**
 * Cohuman wordmark.
 *
 * Typographic only — set in the display family rather than shipped as a raster mark.
 * The previous identity was a PNG lockup whose green leaf glyph sat to the left of a
 * rounded, soft-terminal wordmark; it read as a 2010s SME logo against a site that is
 * otherwise hairlines and grotesque type. Peers in this category (Steelcase, Okamura,
 * Kokuyo, Haworth) all resolve to a plain name in a well-cut face, and that is what
 * this is.
 *
 * Because it is text, it inherits `currentColor`, scales with the layout instead of
 * with a fixed intrinsic size, costs no image request, and stays crisp at any density —
 * three problems the two PNGs (light and dark variants of the same lockup) existed to
 * work around.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-bold uppercase leading-none tracking-[-0.02em]",
        className,
      )}
    >
      Cohuman
    </span>
  );
}
