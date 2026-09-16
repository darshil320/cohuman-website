import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveals, as server components.
 *
 * These were `framer-motion` with `initial={{ opacity: 0 }}`, which serializes into the
 * server HTML as an inline `style="opacity:0"`. That is fine right up until JavaScript
 * does not arrive — a blocked script, a 404'd chunk, a crawler that does not execute —
 * and then the visitor reads a blank page. Before this change roughly thirty elements per
 * page were in that state.
 *
 * The replacement is the `co-reveal` CSS already sitting in `globals.css`: the hidden
 * state is a rule that matches only while `html.co-js` is present, and that class is set
 * by a blocking inline script in the head. No script, no class, no hiding — everything
 * paints. `data-reveal` is what the app-level `RevealObserver` looks for to flip
 * `data-shown` and start the (paused) animation.
 *
 * The public API is unchanged, so every existing call site keeps working, and the whole
 * site drops a client boundary per revealed block.
 */

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds, matching the old framer prop. */
  delay?: number;
  /** Travel distance in px. */
  yOffset?: number;
}

export function Reveal({ children, className, delay = 0, yOffset = 30 }: RevealProps) {
  return (
    <div
      data-reveal
      className={cn("co-reveal", className)}
      style={
        {
          "--co-reveal-y": `${yOffset}px`,
          animationDelay: delay ? `${delay}s` : undefined,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  /**
   * The element to render. Defaults to a `div`; pass `"ol"`, `"ul"` and so on where the
   * content has a real semantic shape, so the reveal wrapper does not force the markup to
   * be a stack of anonymous divs.
   */
  as?: "div" | "dl" | "ul" | "ol";
}

/**
 * Staggering is done by the children, which read their own index — there is no shared
 * variant state to coordinate any more, so this is a plain element that exists to carry
 * the grid classes and to tell its items how far apart to fire.
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  as: Tag = "div",
}: StaggerContainerProps) {
  return (
    <Tag className={className} style={{ "--co-stagger": `${staggerDelay}s` } as CSSProperties}>
      {children}
    </Tag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  yOffset?: number;
  /** Matches `StaggerContainer`'s `as` — an `ol` needs `li` children to be valid. */
  as?: "div" | "li";
}

/**
 * One revealed item.
 *
 * Its delay comes from `--co-i`, which CSS multiplies by the container's `--co-stagger`.
 * `--co-i` is set by `nth-child` in `globals.css` rather than counted in JavaScript, so
 * a list of any length staggers without the parent having to enumerate its children.
 */
export function StaggerItem({ children, className, yOffset = 20, as: Tag = "div" }: StaggerItemProps) {
  return (
    <Tag
      data-reveal
      className={cn("co-reveal co-stagger-item", className)}
      style={{ "--co-reveal-y": `${yOffset}px` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
