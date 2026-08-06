"use client";

import { motion } from "framer-motion";
import { Children, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** A word to mask and lift, or an explicit line break between them. */
type Piece = { kind: "word"; text: string } | { kind: "break" };

/**
 * Flattens children into words.
 *
 * `children` is a `ReactNode`, not a `string`: a headline that carries its own line
 * breaks (`Workstations for<br />Modern Offices`) arrives as an array, and calling
 * `.split` on it threw. A `<br />` becomes a break piece; any other element is walked for
 * the text inside it, so a nested `<em>` contributes its words rather than disappearing.
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
 * An Apple-style typographic reveal.
 *
 * Splits text into words and staggers their translation up from behind an invisible
 * mask, so a line reads as crafted rather than sliding in as a block.
 */
export function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
  const pieces = toPieces(children);
  let wordIndex = 0;

  return (
    <span className={cn("inline-flex flex-wrap gap-x-[0.25em]", className)}>
      {pieces.map((piece, index) => {
        if (piece.kind === "break") {
          // `<br />` does nothing between flex items; a full-basis, zero-height item is
          // what forces the row to wrap.
          return <span key={index} aria-hidden className="w-full basis-full" />;
        }

        const order = wordIndex++;
        return (
          <span key={index} className="-my-1 inline-flex overflow-hidden py-1">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: delay + order * 0.03, // Slight stagger per word
              }}
              className="inline-block"
            >
              {piece.text}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
