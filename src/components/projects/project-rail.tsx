"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/** The frame whose left edge sits nearest the rail's scroll position; the last at the end. */
function activeFrame(track: HTMLElement): number {
  const frames = Array.from(track.children) as HTMLElement[];
  if (frames.length === 0) return 0;
  const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  if (atEnd) return frames.length - 1;
  const origin = frames[0].offsetLeft;
  let best = 0;
  frames.forEach((frame, i) => {
    const distance = Math.abs(frame.offsetLeft - origin - track.scrollLeft);
    const bestDistance = Math.abs(frames[best].offsetLeft - origin - track.scrollLeft);
    if (distance < bestDistance) best = i;
  });
  return best;
}

const ARROW =
  "flex size-[44px] shrink-0 items-center justify-center border border-co-ink text-co-ink transition-colors hover:bg-co-ink hover:text-co-bg disabled:pointer-events-none disabled:border-co-border disabled:text-co-muted-2";

/**
 * A project's photographs as one horizontal plate: every frame the same large size, the
 * next one showing at the edge, the track running out to the right edge of the screen.
 *
 * The frames are server-rendered children, so the page is complete — and the rail still
 * scrolls — with scripting off. This component only adds the instruments under it: a
 * segmented rule (one segment per photograph, the one on screen drawn in ink), a mono
 * counter, and square previous/next buttons. Nothing here is green: the page has many
 * rails, and the header's quote dots already spend the screen's green.
 */
export function ProjectRail({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(activeFrame(track)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = useCallback((target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const frames = Array.from(track.children) as HTMLElement[];
    const clamped = Math.min(Math.max(target, 0), frames.length - 1);
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: frames[clamped].offsetLeft - frames[0].offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  return (
    <div role="region" aria-roledescription="carousel" aria-label={`${label} — photographs`}>
      <div
        ref={trackRef}
        tabIndex={0}
        className="co-plate-rail focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-co-ink"
      >
        {children}
      </div>

      {count > 1 ? (
        <div className="mt-5 flex items-center gap-[clamp(16px,2.4vw,32px)]">
          <div className="flex min-w-0 flex-1 items-center" role="group" aria-label="Photographs">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Photograph ${i + 1} of ${count}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className="group flex h-[44px] min-w-0 flex-1 items-center"
              >
                <span
                  className={cn(
                    "block w-full transition-[height,background-color] duration-200",
                    i === index ? "h-[3px] bg-co-ink" : "h-px bg-co-border group-hover:bg-co-muted-2",
                  )}
                />
              </button>
            ))}
          </div>

          <p className="co-data shrink-0 tabular-nums" aria-live="polite">
            {pad(index + 1)}
            <span className="text-co-muted-2"> / {pad(count)}</span>
          </p>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Previous photograph"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              className={ARROW}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next photograph"
              onClick={() => go(index + 1)}
              disabled={index === count - 1}
              className={ARROW}
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
