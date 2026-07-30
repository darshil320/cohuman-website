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
      {/* Vignette & side gradient overlays for crisp contrast and dark navbar glass support */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0f1710]/95 via-[#0f1710]/55 to-transparent" />
      <div className="relative z-10 h-full">{children}</div>
      {slides.length > 1 ? (
        <div className="absolute bottom-6 left-[18px] z-20 sm:bottom-8 sm:left-6 lg:bottom-8 lg:left-11">
          <div className="flex items-center gap-2.5 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setActive(i)}
                className="group p-0.5 focus:outline-none"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300",
                    i === active
                      ? "w-7 bg-[#a6d85b] shadow-[0_0_10px_rgba(166,216,91,0.8)]"
                      : "w-2 bg-white/40 group-hover:bg-white/70",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
