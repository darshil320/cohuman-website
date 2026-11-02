import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface FinishChipProps {
  name: string;
  /** Part code, printed under the name, e.g. "TOP-NOK". */
  code?: string;
  /**
   * CSS fill for the swatch. These are material samples — a wood grain may be a
   * gradient — which is the one place a gradient is a description rather than decoration.
   */
  fill?: string;
  /** Edge-band colour, drawn as a strip along the bottom of the swatch. */
  edge?: string;
  selected?: boolean;
  /**
   * Light the signal dot when selected. Off where something else on the screen is
   * already the one green thing (the configurator's progress rail); the ink outline and
   * `aria-pressed` still carry the state.
   */
  dot?: boolean;
  /** Present → the chip is a button. Absent → a static board entry. */
  onSelect?: () => void;
  className?: string;
}

/**
 * A square finish chip: swatch, name, code.
 *
 * Selected is an ink outline offset from the swatch plus the signal dot in its corner —
 * the outline carries the state, the dot only confirms it. With no `onSelect` it renders
 * as a plain figure for finish boards that are reference, not a picker.
 */
export function FinishChip({
  name,
  code,
  fill,
  edge,
  selected = false,
  dot = true,
  onSelect,
  className,
}: FinishChipProps) {
  const swatchStyle: CSSProperties | undefined = fill ? { background: fill } : undefined;

  const body = (
    <>
      <span
        className={cn(
          "relative block aspect-square w-full border border-co-border",
          !fill && "bg-co-bg-alt",
          selected && "outline outline-1 outline-offset-[3px] outline-co-ink",
        )}
        style={swatchStyle}
      >
        {edge ? (
          <span aria-hidden className="absolute inset-x-0 bottom-0 block h-[6px]" style={{ background: edge }} />
        ) : null}
        {selected && dot ? (
          <span aria-hidden className="absolute right-1.5 top-1.5 block h-[7px] w-[7px] rounded-full bg-co-green" />
        ) : null}
      </span>
      <span className="co-data mt-2.5 block text-left text-[10px] leading-snug">
        {name}
        {code ? <span className="block text-co-muted-2">{code}</span> : null}
      </span>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" aria-pressed={selected} onClick={onSelect} className={cn("block w-[76px]", className)}>
        {body}
      </button>
    );
  }

  return <div className={cn("block w-[76px]", className)}>{body}</div>;
}
