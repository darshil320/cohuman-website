import { Children, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A word to mask and lift, or an explicit line break between them. */
type Piece = { kind: "word"; text: string } | { kind: "break" };

/**
 * Flattens children into words.
 *
 * `children` is a `ReactNode`, not a `string`: a headline carrying its own line breaks
 * arrives as an array, and calling `.split` on it throws. A `<br />` becomes a break
 * piece; any other element is walked for the text inside it, so a nested `<em>`
 * contributes its words rather than disappearing.
 */
function toPieces(children: ReactNode): Piece[] {
  const pieces: Piece[] = [];

  const walk = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (child === null || child === undefined || typeof child === "boolean") return;

      if (typeof child === "string" || typeof child === "number") {
        for (const word of String(child).split(/\s+/)) {
          if (word) pieces.push({ kind: "word", text: word });
        }
        return;
      }

      if (isValidElement(child)) {
        if (child.type === "br") {
          pieces.push({ kind: "break" });
          return;
        }
        walk((child.props as { children?: ReactNode }).children);
      }
    });
  };

  walk(children);
  return pieces;
}

/**
 * The kinetic headline — a server component.
 *
 * Visually identical to `TextReveal`, with one decisive difference: no JavaScript. The
 * stagger is an `animation-delay` computed from each word's index, so the whole effect is
 * CSS. That matters for three reasons:
 *
 *  - `TextReveal` is a client component whose framer `initial` serializes as
 *    `style="transform:translateY(110%)"`. Putting it on an `<h1>` places framer on the
 *    critical render path of the page's LCP element.
 *  - This animates `transform` only, never opacity, so every word is painted and
 *    measurable from the first frame — the headline can BE the LCP element.
 *  - If JS fails or a chunk 404s, the words are still there. `TextReveal` headlines are
 *    not.
 *
 * The whitespace text node between words is deliberate: the gap is drawn by `gap-x`,
 * which is CSS only, so without it `textContent` reads "Furnituremeasured" — which is
 * what a screen reader announces, what a copy lands in the clipboard, and what find-in-
 * page searches. A whitespace-only node between flex items renders nothing.
 */
export function KineticHeading({ children, className }: { children: ReactNode; className?: string }) {
  const pieces = toPieces(children);
  let wordIndex = 0;

  return (
    <span className={cn("co-kinetic inline-flex flex-wrap gap-x-[0.25em]", className)}>
      {pieces.map((piece, index) => {
        if (piece.kind === "break") {
          // `<br />` does nothing between flex items; a full-basis item is what wraps the row.
          return <span key={index} aria-hidden className="w-full basis-full" />;
        }

        const order = wordIndex++;
        return (
          <span key={index} className="contents">
            {order > 0 ? " " : null}
            <span className="-my-1 inline-flex overflow-hidden py-1">
              <span
                className="co-kinetic-word inline-block"
                style={{ "--co-i": order } as React.CSSProperties}
              >
                {piece.text}
              </span>
            </span>
          </span>
        );
      })}
    </span>
  );
}
