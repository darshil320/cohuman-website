import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /** What should be photographed here — shown until `src` is supplied. */
  hint: string;
  alt: string;
  src?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /**
   * "warm" (default) — the room/lifestyle gradient used for hero and project shots.
   * "white" — flat, near-white studio background for isolated product shots
   * (no room context), e.g. a single chair or desk shot clean for a premium hero panel.
   */
  variant?: "warm" | "white";
}

/**
 * PLACEHOLDER MEDIA SLOT — every instance renders a labelled placeholder card until
 * a real `src` is passed in. Search the codebase for `ImagePlaceholder` usages
 * without a `src` prop before launch; each one needs real product/project
 * photography from the client.
 */
export function ImagePlaceholder({
  hint,
  alt,
  src,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  variant = "warm",
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(variant === "white" ? "object-contain" : "object-cover", className)}
      />
    );
  }

  if (variant === "white") {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-[radial-gradient(80%_70%_at_50%_40%,#FFFFFF_0%,#FAFAF8_70%,#F3F1EC_100%)] p-6",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <span className="border border-co-border/70 bg-white px-2.5 py-1.5 text-center text-[11px] font-medium leading-snug text-co-faint">
          PLACEHOLDER — {hint}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-end p-4",
        "bg-[radial-gradient(125%_95%_at_50%_6%,#FFFFFF_0%,#F6F4EE_44%,#E8E4DA_100%)]",
        className,
      )}
      role="img"
      aria-label={alt}
    >
      <span className="border border-co-border-strong/60 bg-white/70 px-2 py-1 text-[11px] font-medium text-co-faint">
        PLACEHOLDER — {hint}
      </span>
    </div>
  );
}
