import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DimensionLine } from "@/components/ui/dimension-line";
import { FigureCaption } from "@/components/ui/figure-caption";
import { HairlineGrid } from "@/components/ui/hairline-grid";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { HEADER_HEIGHT } from "@/lib/layout";
import { configLengthLabel, type SeriesConfig, type SeriesDefinition } from "@/lib/series";
import { siteConfig } from "@/lib/site-config";

/**
 * The hero's first panel — one measured object.
 *
 * The moodboard's "Index" concept: one studio cut-out on the 12-column grid (drawn in the
 * logo green on this one panel) with its real dimensions on it, like the first sheet of a
 * drawing set. Both dimensions are read off the series data passed in, so the drawing
 * cannot claim a size the product is not offered in.
 *
 * The render sits ABOVE the grid, and the grid shows through it. The render multiplies
 * its studio white away inside an isolated group over a canvas plate, and the whole group
 * is cut to the product's silhouette (`RENDER_MATTES`): on the product it is solid and
 * hides the lines; everywhere else — the sweep, the floor between the legs — the green
 * lines run on behind it. A render without a matte falls back to a feathered rectangle,
 * which hides the lines across the whole image box.
 *
 * The panel fills the screen and runs under the transparent header, so its own top
 * padding clears the header. The headline is the LCP element: `KineticHeading` animates
 * transform only, so the words paint on the first frame.
 */
/**
 * Silhouette mattes for hero renders: an alpha PNG the same size as the render, opaque on
 * the product (desk, screens, chairs, with a 3px grown and softened edge) and clear on the
 * studio sweep. Made from the render itself by flood-filling the near-white background in
 * from the frame edge (so the light desktop, ringed by its own darker edge, stays solid).
 * Regenerate if a render changes; a render with no entry hides the grid behind its box.
 */
const RENDER_MATTES: Record<string, string> = {
  "/varidex/bench-4.jpg": "/varidex/bench-4-matte.png",
};

/**
 * Desks along the hero bench's length. The hero shows a four-seat face-to-face bench:
 * two seats a side, so two desk lengths end to end.
 */
const DESKS_ALONG = 2;

export function SignalHeroPanel({
  series,
  config,
  lead = true,
}: {
  series: SeriesDefinition;
  config: SeriesConfig;
  /**
   * The opening panel owns the page's H1 and loads its render eagerly. Behind a lead
   * film it is a second panel: an H2, and a render that can wait.
   */
  lead?: boolean;
}) {
  const Heading = lead ? "h1" : "h2";
  const matte = RENDER_MATTES[config.image];
  return (
    <div className="relative flex min-h-[100svh] flex-col justify-center bg-co-bg">
      <HairlineGrid tone="signal" />

      <div
        // Phones: the panel shares the hero's grid cell with the films, so its height sets
        // the hero's. Tighter spacing and one action keep it inside one screen, with the
        // ink control block on the first screen rather than below it.
        className="co-shell relative grid w-full grid-cols-1 gap-y-8 pb-[72px] pt-[calc(var(--co-header)+16px)] md:gap-y-12 md:pb-[clamp(96px,10vh,128px)] md:pt-[calc(var(--co-header)+clamp(32px,6vh,72px))] lg:grid-cols-12 lg:items-center lg:gap-x-0"
        style={{ "--co-header": `${HEADER_HEIGHT}px` } as CSSProperties}
      >
        <div className="flex flex-col lg:col-span-6 lg:pr-10">
          <p className="co-eyebrow">Office systems / Surat, IN</p>

          {/*
            The 40px floor gives way to 10.4vw under ~385px, so "ENGINEERED" (8.4em wide in
            the expanded caps) still fits a 320–360px phone instead of being cut by its mask.
          */}
          <Heading className="co-display mt-[clamp(20px,3vw,40px)] text-[clamp(min(40px,10.4vw),5vw,72px)]">
            <KineticHeading>Engineered for two.</KineticHeading>
            <span className="block text-co-muted-2">
              <KineticHeading>Scaled for the floor.</KineticHeading>
            </span>
          </Heading>

          <p className="co-lead mt-[clamp(24px,3vw,40px)] max-w-[34ch] text-co-ink">
            Configurable desking, cabins and meeting tables, specified to the millimetre and
            quoted to your floor plan.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:gap-4 md:mt-8">
            <Button asChild>
              <Link href="/configure">Configure a desk</Link>
            </Button>
            {/* Phones carry one action here; the showroom has its own section further down. */}
            <Button asChild variant="secondary" className="hidden sm:inline-flex">
              <Link href="/contact">Book a showroom visit</Link>
            </Button>
          </div>
        </div>

        <figure className="relative self-center text-co-ink lg:col-span-6">
          <RegistrationCross className="-left-1 -top-6 lg:left-2" />
          <RegistrationCross className="-right-1 -top-6" />

          <div className="relative pr-8 sm:pr-12">
            <div className="relative">
              {/*
                Isolated: the render multiplies with the plate below it, never with the grid.
                The matte cuts the whole group, plate and render together: an isolated
                multiply over nothing is the render's own white, so masking the plate alone
                leaves the white box standing over the lines.
              */}
              <div
                className="relative isolate"
                style={
                  matte
                    ? {
                        maskImage: `url(${matte})`,
                        WebkitMaskImage: `url(${matte})`,
                        maskSize: "100% 100%",
                        WebkitMaskSize: "100% 100%",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                      }
                    : undefined
                }
              >
                <span
                  aria-hidden
                  className={
                    matte ? "absolute inset-0 bg-co-bg" : "co-cutout-plate absolute inset-0 bg-co-bg"
                  }
                />
                <Image
                  src={config.image}
                  alt={config.imageAlt}
                  width={1400}
                  height={637}
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  loading={lead ? "eager" : "lazy"}
                  fetchPriority={lead ? "high" : "auto"}
                  quality={90}
                  className="co-cutout relative h-auto w-full"
                />
              </div>
              {/*
                Working height, drawn on the near-left leg from the floor (82% down the
                render) to the worktop (37%) — the span "720 H" actually measures. The
                positions are read off this render; move them if the hero image changes.
              */}
              <DimensionLine
                axis="y"
                label={`${series.workingHeightMm} H`}
                className="absolute bottom-[18%] left-[20.5%] top-[37%]"
              />
            </div>
          </div>

          {/*
            The bench's full length: this face-to-face bench is two desks long, so the rule
            spans the top from end to end (12%–89% of the render) and reads "2 × <desk>".
          */}
          <DimensionLine
            label={`${DESKS_ALONG} × ${configLengthLabel(config)}`}
            className="ml-[11.5%] mt-3 w-[70.5%]"
          />

          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <FigureCaption n={1}>
              {series.wordmark} {config.name.toLowerCase()} · {config.seats} seats
            </FigureCaption>
            <p className="co-data hidden text-co-muted-2 sm:block">{siteConfig.coordinates.label}</p>
          </div>
        </figure>
      </div>
    </div>
  );
}
