"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface HeroSlide {
  src: string;
  alt: string;
  linkLabel?: string;
  linkHref?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  intervalMs?: number;
  children?: React.ReactNode;
  className?: string;
}

export function HeroCarousel({
  slides,
  intervalMs = 4000,
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
          !dragging && "transition-transform duration-700 ease-out",
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
              quality={100}
              unoptimized
              className="object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Subtle gradient to ensure white text is readable without being overwhelming */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      
      <div className="relative z-10 h-full">{children}</div>
      
      {/* Bottom Nav: Dots (Left) and Link (Right) */}
      <div className="absolute bottom-12 left-0 right-0 z-20 mx-auto max-w-[1320px] px-[18px] sm:px-6 lg:px-11 flex justify-between items-end pointer-events-none">
        
        {slides.length > 1 ? (
          <div className="flex items-center gap-3 pointer-events-auto pb-2">
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
                    "block h-2 w-2 rounded-full transition-colors duration-300",
                    i === active
                      ? "bg-red-600"
                      : "bg-white/70 group-hover:bg-white",
                  )}
                />
              </button>
            ))}
          </div>
        ) : <div />}

        {slides[active]?.linkLabel && slides[active]?.linkHref && (
          <Link 
            href={slides[active].linkHref!} 
            className="pointer-events-auto flex items-center gap-3 text-white font-medium hover:text-white/80 transition-colors group"
          >
            {slides[active].linkLabel}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 group-hover:bg-black/80 transition-colors">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
