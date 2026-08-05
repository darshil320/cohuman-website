"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
}

export function AnimatedStat({ value, suffix = "", label }: AnimatedStatProps) {
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
      <p className="mb-1.5 font-display text-[clamp(34px,4vw,52px)] font-medium leading-none tracking-tight text-co-panel-fg">
        {count}
        {suffix}
      </p>
      <p className="text-[14px] leading-snug text-co-panel-muted">{label}</p>
    </div>
  );
}
