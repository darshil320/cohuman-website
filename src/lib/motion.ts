/**
 * Interaction motion tokens for JavaScript (framer transitions, async timing).
 *
 * The CSS side lives in `src/app/globals.css` (`--ease-enter`, `--duration-drawer-in`, …);
 * these mirror it for code that cannot read a custom property. Change both together.
 * Values follow the charles-ux-animation skill.
 */

/** Appearing, responding to input. */
export const EASE_ENTER = [0.32, 0.72, 0, 1] as const;
/** Leaving. */
export const EASE_EXIT = [0.55, 0, 1, 0.45] as const;
/** Moving or resizing on screen. */
export const EASE_MOVE = [0.77, 0, 0.175, 1] as const;

/** Durations in seconds, framer's unit. */
export const DURATION_S = {
  drawerIn: 0.28,
  drawerOut: 0.2,
} as const;

/** A submit shows its pending state only once it has taken this long… */
export const PENDING_DELAY_MS = 300;
/** …and, once shown, holds it at least this long, so it never flickers. */
export const PENDING_MIN_MS = 500;

/** Read at event time only — never during render (server and client must agree). */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll an element into view, smoothly unless the visitor asked for reduced motion. */
export function scrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
