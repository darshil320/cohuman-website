import Image from "next/image";
import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { SpecRows } from "@/components/ui/spec-rows";
import type { CollectionPhoto, PhotographedCollection } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * A photographed range: the collection page for a series the manufacturer has
 * photographed but not yet specified (STRETCH F, APEX, ELEMENT).
 *
 * There is no specification behind it, so the page quotes none: no sizes, no
 * dimension lines, no part codes. It shows what the photographs show — the range in
 * situ, the pieces on white, the leg finishes — and ends on the enquiry, where sizes are
 * quoted to the visitor's plan. When the supplier sends a specification, the collection
 * gets a `SeriesDefinition` and this page gives way to the configurator.
 *
 * Interiors render in their own colour and wipe open (`ClipReveal`). Renders on
 * white multiply into the canvas (`co-cutout`) and wipe on the image itself, never on a
 * wrapper, so the blend is not isolated. The leg-finish shot is shown as supplied: it
 * exists to show colour, so it is not desaturated.
 */
export function CollectionGallery({ collection }: { collection: PhotographedCollection }) {
  const [hero, ...rest] = collection.photos;
  const scenes = rest.filter((photo) => photo.kind === "scene");
  const cutouts = rest.filter((photo) => photo.kind === "cutout");
  // Figures number down the page: the hero is 01, then the scenes, then the cut-outs.
  const firstScene = 2;
  const firstCutout = firstScene + scenes.length;
  const finishesFigure = firstCutout + cutouts.length;
  const finishes = collection.legFinishes;

  return (
    <div>
      <PageHero
        eyebrow={`Collections / ${collection.kicker}`}
        title={collection.wordmark}
        lead={collection.lead}
        aside={
          <SpecRows
            rows={[
              { k: "Type", v: collection.kicker },
              { k: "Range", v: collection.pieces.join(", ") },
              { k: "Sizes", v: "Quoted to your plan" },
              { k: "Pricing", v: "Price on request" },
            ]}
          />
        }
      />

      <section className="co-shell pt-[clamp(40px,5vw,72px)]">
        <figure className="relative">
          <RegistrationCross className="-left-2 -top-2 z-10" />
          <RegistrationCross className="-right-2 -top-2 z-10" />
          <ClipReveal className="aspect-[4/3] border border-co-border bg-co-bg-alt md:aspect-[16/9]">
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              preload
              sizes="(min-width: 1440px) 1344px, 100vw"
              className="object-cover"
            />
          </ClipReveal>
          <FigureCaption n={1} className="mt-3">
            {hero.caption}
          </FigureCaption>
        </figure>
      </section>

      {scenes.length || cutouts.length ? (
        <section className="co-shell co-section">
          <SectionHeading
            eyebrow="01 / Range"
            title="The range."
            blurb="What the photographs show. Every piece is made to the size the floor plan needs, so sizes come with the quote rather than from a list."
          />

          {scenes.length ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
              {scenes.map((photo, i) => (
                <SceneFigure
                  key={photo.src}
                  photo={photo}
                  n={firstScene + i}
                  // An odd last scene takes the full row rather than leaving half of it empty.
                  wide={scenes.length % 2 === 1 && i === scenes.length - 1}
                />
              ))}
            </div>
          ) : null}

          {cutouts.length ? (
            <div className={cn("grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4", scenes.length && "mt-16")}>
              {cutouts.map((photo, i) => (
                <CutoutFigure key={photo.src} photo={photo} n={firstCutout + i} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {finishes ? (
        <section className="border-t border-co-ink bg-co-bg-alt">
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
              <FigureCaption n={finishesFigure} className="mt-3">
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

function SceneFigure({ photo, n, wide }: { photo: CollectionPhoto; n: number; wide: boolean }) {
  return (
    <figure className={cn(wide && "md:col-span-2")}>
      <ClipReveal className={cn("aspect-[16/10] border border-co-border bg-co-bg-alt", wide && "md:aspect-[21/9]")}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={wide ? "(min-width: 1440px) 1344px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className="object-cover"
        />
      </ClipReveal>
      <FigureCaption n={n} className="mt-3">
        {photo.caption}
      </FigureCaption>
    </figure>
  );
}

/** A render on white, multiplied into the canvas. The wipe is on the image itself. */
function CutoutFigure({ photo, n }: { photo: CollectionPhoto; n: number }) {
  return (
    <figure className="flex flex-col">
      <div className="relative aspect-[4/3] border-t border-co-ink">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 24vw, 50vw"
          data-reveal
          className="co-cutout co-reveal object-contain p-[8%]"
        />
      </div>
      <FigureCaption n={n} className="mt-3">
        {photo.caption}
      </FigureCaption>
    </figure>
  );
}
