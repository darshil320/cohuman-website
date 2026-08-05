"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface ParallaxImageProps extends Omit<ImageProps, "className"> {
  className?: string;
  imageClassName?: string;
}

/**
 * An Apple-style parallax image component.
 * Wraps next/image and applies a subtle vertical translation based on scroll position,
 * creating a premium sense of physical depth.
 */
export function ParallaxImage({ className, imageClassName, ...props }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track the scroll progress of this specific component relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map the scroll progress to a subtle y translation (parallax)
  // When entering at the bottom of the screen, it starts at -8%
  // When exiting at the top of the screen, it reaches 8%
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        style={{ y }}
        // Expand the container slightly past the edges so the image doesn't get clipped during parallax
        className="absolute -inset-y-[10%] inset-x-0"
      >
        <Image {...props} className={cn("object-cover", imageClassName)} />
      </motion.div>
    </div>
  );
}
