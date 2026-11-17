import Image from "next/image";
import { CtaBand } from "@/components/common/cta-band";
import Link from "next/link";
import { ProductSpecLayout } from "@/components/product/product-spec-layout";
import { STANDARD_HEIGHT_MM, TOP_FINISH_LINE, WORKSPACE_WARRANTY, standardRows } from "@/components/product/spec-fields";
import { SYSTEMS } from "@/lib/configurator/systems";
import type { ProductImage } from "@/components/product/product-viewer";
import { Button } from "@/components/ui/button";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import type { PhotographedCollection } from "@/lib/catalog";

/**
 * A photographed range: the collection page for a series the manufacturer has
 * photographed but not yet specified (STRETCH F, APEX, ELEMENT).
 *
 * There is no specification behind it, so the page quotes none: no sizes, no
 * dimension lines, no part codes. It opens like every product page (`ProductSpecLayout`,
 * the Stretch S / V layout): every photograph in the viewer with thumbnails under it, the
 * ink panel beside it — then the leg finishes, and the enquiry, where sizes are quoted to
 * the visitor's plan. When the supplier sends a specification, the collection
 * gets a `SeriesDefinition` and this page gives way to the configurator.
 *
 * Interiors render in their own colour and wipe open (`ClipReveal`). Renders on
 * white multiply into the canvas (`co-cutout`) and wipe on the image itself, never on a
 * wrapper, so the blend is not isolated. The leg-finish shot is shown as supplied: it
 * exists to show colour, so it is not desaturated.
 */
export function CollectionGallery({ collection }: { collection: PhotographedCollection }) {
  const finishes = collection.legFinishes;
  const frameShades = SYSTEMS.find((system) => system.href === `/collections/${collection.slug}`)?.frameShades ?? [];
  // Every photograph is in the viewer, in the order supplied: the hero, the scenes, the
  // cut-outs. The caption names what is shown, never a size.
  const images: ProductImage[] = collection.photos.map((photo) => ({
    src: photo.src,
    alt: photo.alt,
    label: photo.caption,
    kind: photo.kind,
  }));

  return (
    <div>
      <ProductSpecLayout
        eyebrow={`${collection.wordmark} — ${collection.kicker}`}
        title={collection.wordmark}
        lead={collection.lead}
        images={images}
        // The Stretch S fields; the supplier has sent photographs, not a specification, so
        // the sizes read "Not available" until it arrives (see spec-fields.tsx).
        // What catalogue v31 states for the system (frame shades p. 70, tops p. 68,
        // warranty p. 68); sizes stay "Not available" until the specification arrives.
        rows={standardRows(
          {
            Type: collection.kicker,
            Configurations: collection.pieces.join(", "),
            Height: `${STANDARD_HEIGHT_MM}\u00A0mm, standard`,
            Finish: TOP_FINISH_LINE,
            "Frame finish": frameShades.length ? frameShades.map((shade) => shade.name).join(", ") : undefined,
          },
          {
            extra: [
              { k: "Warranty", v: WORKSPACE_WARRANTY },
              { k: "Collection", v: "Workstations" },
            ],
          },
        )}
        subject={`${collection.name} collection`}
        secondary={
          <Button asChild variant="secondaryOnDark">
            <Link href="/collections">All collections</Link>
          </Button>
        }
      />

      {finishes ? (
        <section className="border-b border-co-border bg-co-bg-alt">
          <div className="co-shell co-section grid grid-cols-1 items-center gap-x-[clamp(28px,5vw,96px)] gap-y-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <figure>
              <ClipReveal className="aspect-[3/4] border border-co-border bg-co-bg">
                <Image
                  src={finishes.src}
                  alt={finishes.alt}
                  fill
                  sizes="(min-width: 768px) 38vw, 100vw"
                  className="object-cover"
                />
              </ClipReveal>
              <FigureCaption n={1} className="mt-3">
                {finishes.caption}
              </FigureCaption>
            </figure>
            <div>
              <p className="co-eyebrow">02 / Finishes</p>
              <h2 className="co-h2 mt-5 max-w-[14ch]">Leg finishes.</h2>
              <p className="co-lead mt-6 max-w-[40ch]">
                The legs as the manufacturer photographed them. Finish names, top materials and
                the full finish card come with the quote.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        // A no-break space keeps "STRETCH F" on one line.
        heading={`Quote ${collection.wordmark.replaceAll(" ", "\u00A0")} to your plan.`}
        body="Send the floor plan and the headcount. We will specify the pieces, the sizes and the finishes, and send a costed proposal back."
        subject={`${collection.name} collection`}
        secondary={{ label: "All collections", href: "/collections" }}
      />
    </div>
  );
}
