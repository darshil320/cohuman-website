"use client";

import { useCountUp } from "@/lib/use-count-up";

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
}

/**
 * The counted figures on the dark panel of /about, wrapper and colours included.
 *
 * For a figure that has to line up beside plain ones in a shared row, use `CountUp`
 * (src/components/common/count-up.tsx) instead — it renders the text only, so it inherits
 * the surrounding layout rather than bringing its own. Both share `useCountUp`
 * (src/lib/use-count-up.ts), so both put the real figure in the server-rendered HTML.
 */
export function AnimatedStat({ value, suffix = "", label }: AnimatedStatProps) {
  const { ref, count } = useCountUp<HTMLDivElement>(value);

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
