import Image from "next/image";
import Link from "next/link";
import type { CollectionItem } from "@/lib/catalog/collection-menu";
import { cn } from "@/lib/utils";

/**
 * A product or system as a picture card: the image first on the fog panel, then the
 * name and one quiet line (a size or a type). Cut-outs multiply into the panel
 * (`co-cutout`); room shots are cropped to fill. Shared by the header's Collections
 * panel, /collections and the product pages, so every list of products looks the same.
 *
 * `variant`:
 * - `boxed` (pages): a 4:5 frame in a hairline border, the line under the name.
 * - `plain` (menus): a borderless 4:3 frame, name and line each held to one line, so a
 *   row of cards never goes ragged when one name or size is longer than the rest.
 *
 * No hooks, so it renders on the server and inside the client menus alike.
 */
export function CollectionCard({
  item,
  sizes,
  onNavigate,
  size = "md",
  variant = "boxed",
  showLine = true,
}: {
  item: CollectionItem;
  sizes: string;
  onNavigate?: () => void;
  size?: "sm" | "md";
  variant?: "boxed" | "plain";
  showLine?: boolean;
}) {
  const plain = variant === "plain";
  return (
    <Link href={item.href} onClick={onNavigate} className="group block min-w-0">
      <span
        className={cn(
          "relative block overflow-hidden bg-co-bg-alt",
          plain
            ? "aspect-[4/3]"
            : "aspect-[4/5] border border-co-border",
        )}
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes={sizes}
          quality={90}
          className={item.imageKind === "cutout" ? "co-cutout object-contain p-[8%]" : "object-cover"}
        />
        {/*
          Boxed cards, pointer devices: the second picture wipes in over the first, left to
          right, while the frame is plotted — the piece, then the piece in its room (or a
          room, then the product on white). A cut-out gets its own fog plate under it so it
          multiplies onto the panel, not onto the photo beneath. Never on touch, where it
          is display:none and so never fetched.
        */}
        {!plain && item.hoverImage ? (
          <>
            {item.hoverImage.kind === "cutout" ? <span aria-hidden className="co-swap absolute inset-0 bg-co-bg-alt" /> : null}
            <Image
              src={item.hoverImage.src}
              alt=""
              aria-hidden
              fill
              sizes={sizes}
              className={cn(
                "co-swap",
                item.hoverImage.kind === "cutout" ? "co-cutout object-contain p-[8%]" : "object-cover",
              )}
            />
          </>
        ) : null}
        {/* Boxed cards: on hover or focus the frame is plotted in ink, edge by edge. */}
        {plain ? null : (
          <span aria-hidden className="co-plot-frame pointer-events-none absolute inset-0">
            <span />
            <span />
            <span />
            <span />
          </span>
        )}
      </span>
      <span
        className={cn(
          "block font-heading font-semibold leading-[1.25] text-co-ink underline-offset-4 group-hover:underline",
          size === "sm" ? "mt-3 text-[16px]" : "mt-4 text-[clamp(18px,1.5vw,22px)]",
          plain && "truncate",
        )}
      >
        {item.title}
      </span>
      {showLine ? (
        <span className={cn("co-data mt-1 block text-co-muted-2", plain && "truncate")}>{item.line}</span>
      ) : null}
    </Link>
  );
}
