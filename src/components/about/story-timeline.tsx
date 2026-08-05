"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineItem {
  year: string;
  what: string;
}

interface StoryTimelineProps {
  items: TimelineItem[];
}

export function StoryTimeline({ items }: StoryTimelineProps) {
  const [visible, setVisible] = useState<boolean[]>(() => items.map(() => false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = refs.current.map((node, i) => {
      if (!node) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setVisible((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v))));
        },
        { threshold: 0.3 },
      );
      observer.observe(node);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="grid grid-cols-1 gap-px border border-co-border bg-co-border sm:grid-cols-2 lg:grid-cols-5">
      {items.map((t, i) => (
        <div
          key={t.year}
          ref={(node) => {
            refs.current[i] = node;
          }}
          style={{ transitionDelay: `${i * 90}ms` }}
          className={cn(
            "bg-co-bg p-[clamp(24px,3vw,32px)] px-[clamp(20px,2.2vw,26px)] transition-all duration-700 ease-out",
            visible[i] ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <p className="mb-3.5 font-display text-[26px] font-medium leading-none tracking-tight text-co-green">
            {t.year}
          </p>
          <p className="text-[15px] font-light leading-relaxed text-co-ink-soft">{t.what}</p>
        </div>
      ))}
    </div>
  );
}
