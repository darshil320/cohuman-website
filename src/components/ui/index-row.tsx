import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SignalDots } from "@/components/ui/signal-dots";
import { cn } from "@/lib/utils";

/**
 * The index row — Signal's list pattern, read like a parts list.
 *
 * Number, name in display caps, a type line, a measured range in mono, and an arrow.
 * On hover or keyboard focus the row takes the fog panel, a cut-out thumbnail wipes in
 * left to right, and the arrow becomes the signal dots — "this one is lit". On phones
 * there is no hover, so the row collapses to number / name + type / arrow and the
 * thumbnail never shows.
 *
 * `IndexHeader` prints the column labels on the same grid; use it once above a list.
 */
const GRID =
  "grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-4 md:grid-cols-[64px_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)_48px] lg:grid-cols-[90px_minmax(0,360px)_minmax(0,1fr)_260px_60px]";

export function IndexHeader({
  columns = ["No.", "System", "Type", "Range"],
  className,
}: {
  columns?: [string, string, string, string];
  className?: string;
}) {
  return (
    <div aria-hidden className={cn(GRID, "co-eyebrow border-b border-co-border py-3.5", className)}>
      <span>{columns[0]}</span>
      <span>{columns[1]}</span>
      <span className="hidden md:block">{columns[2]}</span>
      <span className="hidden md:block">{columns[3]}</span>
      <span />
    </div>
  );
}

interface IndexRowProps {
  n: string;
  title: string;
  type?: ReactNode;
  range?: ReactNode;
  /** A link row. */
  href?: string;
  /** A button row — e.g. opening the quote dialog. Only from a client parent. */
  onClick?: () => void;
  /** Cut-out shown on hover. Decorative: the row's own text names the thing. */
  image?: { src: string };
  className?: string;
}

export function IndexRow({ n, title, type, range, href, onClick, image, className }: IndexRowProps) {
  const body = (
    <>
      <span className="co-data self-center">{n}</span>
      <span className="min-w-0">
        <span className="co-index block">
          {title}
        </span>
        {type ? <span className="mt-1.5 block text-[14px] text-co-muted md:hidden">{type}</span> : null}
      </span>
      <span className="hidden min-w-0 text-[16px] text-co-ink-soft md:block">{type}</span>
      <span className="co-data hidden min-w-0 md:block">{range}</span>
      <span className="relative flex h-6 w-6 items-center justify-center justify-self-end">
        <span
          aria-hidden
          className="text-[18px] leading-none group-hover:opacity-0 group-focus-visible:opacity-0"
        >
          →
        </span>
        <SignalDots className="absolute opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" />
      </span>

      {image ? (
        // The wipe's clip-path sits on the image, not on this wrapper: a clip-path on the
        // wrapper would make it a stacking context, isolating the multiply blend so the
        // render's white frame showed as a box on the fog row.
        <span aria-hidden className="pointer-events-none absolute inset-y-1 right-[340px] hidden w-[170px] lg:block">
          <Image
            src={image.src}
            alt=""
            fill
            sizes="170px"
            className="co-cutout object-contain transition-[clip-path] duration-300 ease-linear [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
          />
        </span>
      ) : null}
    </>
  );

  const rowClass = cn(
    GRID,
    "group relative min-h-[84px] w-full border-b border-co-border py-4 text-left transition-colors duration-150 hover:bg-co-bg-alt focus-visible:bg-co-bg-alt md:min-h-[96px]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={rowClass}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rowClass}>
      {body}
    </button>
  );
}
