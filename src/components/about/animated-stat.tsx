"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
  /**
   * Which surface this sits on. The original colours assumed the dark panel on /about;
   * on a light strip they rendered near-white on near-white.
   */
  tone?: "panel" | "page";
}

export function AnimatedStat({ value, suffix = "", label, tone = "panel" }: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;

        const durationMs = 1200;
        const startTime = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - startTime) / durationMs, 1);
          const eased = 1 - (1 - progress) * (1 - progress);
          setCount(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <p
        className={cn(
          "mb-1.5 whitespace-nowrap font-display font-medium leading-none tracking-tight",
          // Matches the type scale of whichever strip it sits in, so a counted figure and
          // a written one are the same size in the same row.
          tone === "panel"
            ? "text-[clamp(34px,4vw,52px)] text-co-panel-fg"
            : "text-[clamp(30px,3.2vw,42px)] text-co-ink",
        )}
      >
        {count}
        {suffix}
      </p>
      <p
        className={cn(
          "leading-snug",
          tone === "panel" ? "text-[14px] text-co-panel-muted" : "text-[13.5px] text-co-muted-2",
        )}
      >
        {label}
      </p>
    </div>
  );
}
