"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  intervalMs?: number;
  children?: React.ReactNode;
  className?: string;
}

export function HeroCarousel({
  slides,
  intervalMs = 3200,
  children,
  className,
}: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pausedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setActive((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (slides.length <= 1) return;
    draggingRef.current = true;
    startXRef.current = event.clientX;
    pausedRef.current = true;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    setDragOffset(event.clientX - startXRef.current);
  }

  function endDrag() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    pausedRef.current = false;

    const width = containerRef.current?.offsetWidth ?? 1;
    const threshold = width * 0.12;
    if (dragOffset <= -threshold) {
      setActive((i) => (i + 1) % slides.length);
    } else if (dragOffset >= threshold) {
      setActive((i) => (i - 1 + slides.length) % slides.length);
    }
    setDragOffset(0);
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative touch-pan-y overflow-hidden select-none", className)}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className={cn(
          "absolute inset-0 flex cursor-grab active:cursor-grabbing",
          !dragging && "transition-transform duration-500 ease-out",
        )}
        style={{ transform: `translateX(calc(${-active * 100}% + ${dragOffset}px))` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.src} className="relative h-full w-full shrink-0">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              draggable={false}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-co-panel/85 via-co-panel/45 to-co-panel/10" />
      <div className="relative z-10 h-full">{children}</div>
      {slides.length > 1 ? (
        <div className="absolute bottom-6 left-[18px] z-20 flex items-center gap-2 sm:bottom-8 sm:left-6 lg:bottom-10 lg:left-11">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setActive(i)}
              className="group p-1 focus:outline-none"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all duration-300",
                  i === active
                    ? "w-8 bg-co-green-light shadow-[0_0_10px_rgba(166,216,91,0.6)]"
                    : "w-2.5 bg-white/40 group-hover:bg-white/70",
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
