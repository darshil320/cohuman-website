import type { ReactNode } from "react";
import { pieceSizeLabel, type Piece } from "@/lib/catalog";

/** One folded row: native `<details>`, so it works without script and keeps its semantics. */
function Row({ title, open, children }: { title: string; open?: boolean; children: ReactNode }) {
  return (
    <details open={open} className="group border-b border-co-ink/40 first:border-t first:border-t-co-ink">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 font-heading text-[17px] font-semibold text-co-ink [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-[22px] font-normal leading-none">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="pb-6 text-[15px] leading-[1.6] text-co-ink-soft">{children}</div>
    </details>
  );
}

/**
 * The product's detail, folded: the catalogue's about first and open, then dimensions,
 * versions and finishes — each only if the catalogue states it.
 */
export function PieceDetails({ piece }: { piece: Piece }) {
  return (
    <div>
      <Row title="About" open>
        <p className="max-w-[56ch]">{piece.about}</p>
      </Row>

      {piece.size ? (
        <Row title="Dimensions">
          <dl className="co-data grid grid-cols-[120px_1fr] gap-y-2">
            <dt className="text-co-muted-2">Width</dt>
            <dd>{piece.size.w.join(" / ")} mm</dd>
            <dt className="text-co-muted-2">Depth</dt>
            <dd>{piece.size.d.join(" / ")} mm</dd>
            <dt className="text-co-muted-2">Height</dt>
            <dd>{piece.size.h.join(" / ")} mm</dd>
          </dl>
          <p className="co-data mt-3 text-co-muted-2">
            {pieceSizeLabel(piece.size)}
            {piece.size.note ? `, ${piece.size.note}` : ""}
          </p>
        </Row>
      ) : null}

      {piece.parts ? (
        <Row title="Dimensions">
          <dl className="co-data grid grid-cols-[minmax(0,140px)_1fr] gap-y-2">
            {piece.parts.map((part) => (
              <div key={part.label} className="contents">
                <dt className="text-co-muted-2">{part.label}</dt>
                <dd>{pieceSizeLabel(part.size)} (W × D × H)</dd>
              </div>
            ))}
          </dl>
        </Row>
      ) : null}

      {piece.builtIn ? (
        <Row title="Built in">
          <p>{piece.builtIn}.</p>
        </Row>
      ) : null}

      {piece.availableAs ? (
        <Row title="Available as">
          <p>{piece.availableAs.join(", ")}.</p>
        </Row>
      ) : null}

      {piece.upholstery ? (
        <Row title="Upholstery">
          <p>{piece.upholstery}.</p>
        </Row>
      ) : null}

      {piece.finish ? (
        <Row title="Finish">
          <p>{piece.finish}.</p>
        </Row>
      ) : null}
    </div>
  );
}
