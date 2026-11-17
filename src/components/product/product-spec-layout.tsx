import type { ReactNode } from "react";
import { EnquireButton } from "@/components/common/enquire-button";
import { SpecSheetButton } from "@/components/common/spec-sheet-button";
import { SpecRows, type SpecRow } from "@/components/ui/spec-rows";
import { ProductViewer, type ProductImage } from "./product-viewer";

interface ProductSpecLayoutProps {
  /** Mono line over the name, e.g. "Designer collab — Executive desk". */
  eyebrow: string;
  title: string;
  /** Mono credit under the name, e.g. "Designed by Parth Makwana". */
  credit?: string;
  lead?: string;
  images: readonly ProductImage[];
  rows: readonly SpecRow[];
  /** Quote subject and spec-sheet file name. */
  subject: string;
  /** Extra content in the ink panel under the rows (a note, a parts table). */
  panelExtra?: ReactNode;
  /** Secondary action beside "Get a quote", e.g. a link to the group. */
  secondary?: ReactNode;
}

/**
 * Every product page opens the same way as the Stretch S / V pages (client, Nov 2026):
 * the name and the viewer on the left — thumbnails
 * directly under the picture — and the ink specification panel on the right, rising
 * level with the name. On phones it stacks: name, viewer, thumbnails, panel.
 *
 * Grid, gutters and the panel's bleed through the right gutter are the series spec
 * block's (`series-spec-block.tsx`), so the pages line up when you move between them.
 */
export function ProductSpecLayout({
  eyebrow,
  title,
  credit,
  lead,
  images,
  rows,
  subject,
  panelExtra,
  secondary,
}: ProductSpecLayoutProps) {
  return (
    <>
      {/* No breadcrumb (client, Nov 2026); `#configuration` marks the top of the product. */}
      <div id="configuration" aria-hidden className="scroll-mt-[72px]" />

      <section id="specification" className="scroll-mt-[72px] border-b border-co-ink">
        <div className="co-shell grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
          <div className="min-w-0 pb-[clamp(32px,4vw,64px)] pt-[clamp(40px,5vw,72px)] lg:pr-[clamp(24px,3.5vw,56px)]">
            <p className="co-eyebrow">{eyebrow}</p>
            <h1 className="co-display mt-4 max-w-[20ch] text-[clamp(30px,4.2vw,64px)]">{title}</h1>
            {credit ? <p className="co-data mt-4 text-co-ink">{credit}</p> : null}
            {lead ? <p className="co-lead mt-6 max-w-[46ch]">{lead}</p> : null}
            <div className="mt-[clamp(32px,4vw,56px)]">
              <ProductViewer images={images} name={title} />
            </div>
          </div>

          <div className="relative -mx-[18px] bg-co-panel px-[18px] py-[clamp(40px,5vw,70px)] text-co-panel-fg sm:-mx-6 sm:px-6 lg:mx-0 lg:-mr-12 lg:mt-[clamp(40px,5vw,72px)] lg:pl-10 lg:pr-12">
            <p className="co-eyebrow mb-5 text-co-panel-faint">01 / Specification</p>
            <SpecRows rows={rows} tone="dark" />
            {panelExtra}

            <div data-print="hide" className="mt-10 flex flex-wrap gap-3">
              <EnquireButton subject={subject} variant="onDark">
                Get a quote
              </EnquireButton>
              {secondary}
              <SpecSheetButton title={subject} variant="secondaryOnDark" />
            </div>
            <p className="mt-5 max-w-[40ch] text-[13px] leading-relaxed text-co-panel-faint">
              Price on request. Quantity, finish and installation move the number, so we quote
              rather than list.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
