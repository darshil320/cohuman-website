import Image from "next/image";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /** What should be photographed here — shown until `src` is supplied. */
  hint: string;
  alt: string;
  src?: string;
  className?: string;
  sizes?: string;
  /**
   * Preload this image — a `<link rel="preload">` in the head, for the one image on a
   * page that is its LCP element. Replaces the `priority` prop, which Next 16
   * deprecated in favour of `preload` to make the behaviour legible at the call site.
   * Never set it on more than one image per page, and never together with `loading` or
   * `fetchPriority`, which Next documents as the props not to combine with it.
   */
  preload?: boolean;
  /**
   * "warm" (default) — an interior photograph: cover-cropped and run high-key
   * in its own colour, as every room shot now renders.
   * "white" — an isolated studio cut-out on white: contained and composited into the
   * ground (`co-cutout`). Never put this variant inside a `ClipReveal` or any wrapper with
   * a clip-path, filter, opacity or transform — that isolates the multiply blend and the
   * render's white frame shows as a box.
   */
  variant?: "warm" | "white";
}

/**
 * PLACEHOLDER MEDIA SLOT — every instance renders a labelled placeholder frame until
 * a real `src` is passed in. Search the codebase for `ImagePlaceholder` usages
 * without a `src` prop before launch; each one needs real product/project
 * photography from the client.
 *
 * The empty state is a flat drawing-sheet frame: fog (or canvas for a cut-out slot), a
 * hairline border, a registration cross in the corner and a mono note of what belongs
 * there. It fills its positioned parent, exactly like the `fill` image it stands in for.
 */
export function ImagePlaceholder({
  hint,
  alt,
  src,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  preload = false,
  variant = "warm",
}: ImagePlaceholderProps) {
  const cutout = variant === "white";

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={cn(cutout ? "co-cutout object-contain" : "object-cover", className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "absolute inset-0 border border-co-border text-co-ink",
        cutout ? "bg-co-bg" : "bg-co-bg-alt",
        className,
      )}
    >
      <RegistrationCross className="left-3 top-3" />
      <span
        className={cn(
          "co-eyebrow absolute max-w-[40ch]",
          cutout ? "inset-x-4 top-1/2 -translate-y-1/2 text-center mx-auto" : "bottom-3 left-3 right-3",
        )}
      >
        Placeholder — {hint}
      </span>
    </div>
  );
}
