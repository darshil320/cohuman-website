"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger index — each step delays the reveal by 60ms. */
  step?: number;
  as?: "div" | "li";
}

/**
 * Scroll-in reveal used across the PDP sections.
 *
 * Reduced motion is handled by the `MotionConfig reducedMotion="user"` wrapper in
 * pros-pdp.tsx rather than by branching here: branching on a media query produces
 * different markup on the server and the client, which trips hydration.
 */
export function Reveal({ children, className, step = 0, as = "div" }: RevealProps) {
  const Tag = as === "li" ? motion.li : motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: step * 0.06 }}
    >
      {children}
    </Tag>
  );
}
