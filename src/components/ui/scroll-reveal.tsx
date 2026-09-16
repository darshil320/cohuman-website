"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function Reveal({ children, className, delay = 0, yOffset = 30 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  /**
   * The element to render. Defaults to a `div`; pass `"dl"`, `"ul"` and so on where the
   * content has a real semantic shape, so the animation wrapper does not force the
   * markup to be a stack of anonymous divs.
   */
  as?: "div" | "dl" | "ul" | "ol";
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  as = "div",
}: StaggerContainerProps) {
  const Tag = motion[as];

  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  yOffset?: number;
  /** Matches `StaggerContainer`'s `as` — a `dl` needs its children to be valid inside it. */
  as?: "div" | "li";
}

export function StaggerItem({ children, className, yOffset = 20, as = "div" }: StaggerItemProps) {
  const Tag = motion[as];

  return (
    <Tag
      variants={{
        hidden: { opacity: 0, y: yOffset },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}
