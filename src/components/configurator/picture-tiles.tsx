import Image from "next/image";
import { FinishChip } from "@/components/ui/finish-chip";
import type { Swatch } from "@/lib/finishes";
import { cn } from "@/lib/utils";
import { Field } from "./configurator-controls";

export interface PictureTile {
  id: string;
  name: string;
  note?: string;
  /** Mono line under the name: a tag such as "Sharing", or a size. */
  meta?: string;
  /** Catalogue drawing or photograph; absent = a labelled empty frame. */
  src?: string;
  /** Photographs fill the frame; drawings on white sit whole. */
  fit?: "contain" | "cover";
  /** An option that is the absence of a thing ("None"): an empty frame, not "photo to come". */
  empty?: boolean;
  on: boolean;
  onPick: () => void;
}

/**
 * Option tiles with a picture: the catalogue's drawing or photograph above the name.
 * Selected = ink frame, an ink bar under the tile and `aria-pressed` — no green (the
 * progress rail is this screen's one green thing). `multi` for steps where several can
 * be on at once. A tile without a picture keeps its frame, labelled, so a missing
 * photograph reads as a gap rather than a broken layout.
 */
export function PictureTiles({
  items,
  label,
  multi = false,
  columns = 3,
}: {
  items: readonly PictureTile[];
  label: string;
  multi?: boolean;
  columns?: 2 | 3 | 4;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "grid grid-cols-2 gap-2",
        columns === 3 && "sm:grid-cols-3",
        columns === 4 && "sm:grid-cols-4",
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={item.on}
          onClick={item.onPick}
          className={cn(
            "co-hit group relative flex min-w-0 flex-col border bg-co-bg p-2 text-left transition-colors duration-(--duration-press) focus-visible:z-10",
            item.on ? "border-co-ink" : "border-co-border hover:border-co-ink hover:bg-co-bg-alt",
          )}
        >
          <span className="relative block aspect-[4/3] w-full overflow-hidden bg-white">
            {item.src ? (
              <Image
                src={item.src}
                alt=""
                fill
                // Small catalogue files (≤ 200 KB): served as they are, like the finish
                // swatches — the optimiser queued a screenful of them behind each other.
                unoptimized
                sizes="(min-width: 1024px) 180px, 45vw"
                className={item.fit === "cover" ? "object-cover" : "object-contain p-[6%]"}
              />
            ) : item.empty ? (
              <span aria-hidden className="co-data absolute inset-0 flex items-center justify-center bg-co-bg text-co-muted-2">—</span>
            ) : (
              <span className="co-eyebrow absolute inset-0 flex items-end bg-co-bg-alt p-2">Photo to come</span>
            )}
            {multi ? (
              <span
                aria-hidden
                className={cn(
                  "absolute right-2 top-2 block h-3 w-3 border",
                  item.on ? "border-co-ink bg-co-ink" : "border-co-ink bg-co-bg",
                )}
              />
            ) : null}
          </span>
          <span className={cn("co-data mt-2 block", item.on ? "text-co-ink" : "text-co-ink group-hover:text-co-ink")}>
            {item.name}
          </span>
          {item.meta ? <span className="co-data mt-1 block text-co-muted-2">{item.meta}</span> : null}
          {item.note ? <span className="mt-1 block text-[13px] leading-[1.45] text-co-muted">{item.note}</span> : null}
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 -bottom-px h-[2px] origin-left bg-co-ink transition-transform duration-300 ease-(--ease-enter)",
              item.on ? "scale-x-100" : "scale-x-0",
            )}
          />
        </button>
      ))}
    </div>
  );
}

/** A row of the catalogue's swatch photographs as finish chips, one selected. */
export function SwatchRow({
  label,
  swatches,
  active,
  keyOf,
  onPick,
  extra,
}: {
  label: string;
  swatches: readonly Swatch[];
  active: string | null;
  keyOf: (swatch: Swatch) => string;
  onPick: (key: string) => void;
  /** An extra choice drawn as a chip, e.g. "Veneer". */
  extra?: { key: string; name: string; note: string };
}) {
  const current = swatches.find((swatch) => keyOf(swatch) === active);
  return (
    <Field label={label} hint={current ? `${current.name}${current.code ? ` — ${current.code}` : ""}` : extra && active === extra.key ? extra.note : undefined}>
      <div role="group" aria-label={label} className="flex flex-wrap items-start gap-3.5">
        {swatches.map((swatch) => (
          <FinishChip
            key={keyOf(swatch)}
            name={swatch.name}
            code={swatch.code}
            fill={`url("${swatch.src}") center / cover`}
            selected={keyOf(swatch) === active}
            onSelect={() => onPick(keyOf(swatch))}
            dot={false}
            className="w-[88px]"
          />
        ))}
        {extra ? (
          <FinishChip
            name={extra.name}
            code="As selected"
            selected={active === extra.key}
            onSelect={() => onPick(extra.key)}
            dot={false}
            className="w-[88px]"
          />
        ) : null}
      </div>
    </Field>
  );
}
