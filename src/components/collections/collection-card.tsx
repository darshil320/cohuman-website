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
 * No hooks, so it renders on the server and inside the client panel alike.
 */
export function CollectionCard({
  item,
  sizes,
  onNavigate,
  size = "md",
}: {
  item: CollectionItem;
  sizes: string;
  onNavigate?: () => void;
  size?: "sm" | "md";
}) {
  return (
    <Link href={item.href} onClick={onNavigate} className="group block">
      <span className="relative block aspect-[4/5] overflow-hidden border border-co-border bg-co-bg-alt transition-colors duration-150 group-hover:border-co-ink">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes={sizes}
          quality={90}
          className={item.imageKind === "cutout" ? "co-cutout object-contain p-[8%]" : "object-cover"}
        />
      </span>
      <span
        className={cn(
          "block font-heading font-semibold leading-[1.25] text-co-ink",
          size === "sm" ? "mt-3 text-[16px]" : "mt-4 text-[clamp(18px,1.5vw,22px)]",
        )}
      >
        {item.title}
      </span>
      <span className="co-data mt-1 block text-co-muted-2">{item.line}</span>
    </Link>
  );
}
