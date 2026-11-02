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
 * The render sits ABOVE the grid. It still multiplies its white into the canvas, but
 * inside an isolated group with a feathered canvas plate behind it — so it blends with
 * the plate, not with the lines, and the lines pass behind the product and fade out under
 * it instead of being drawn across it.
 *
 * The panel fills the screen and runs under the transparent header, so its own top
 * padding clears the header. The headline is the LCP element: `KineticHeading` animates
 * transform only, so the words paint on the first frame.
 */
export function SignalHeroPanel({ series, config }: { series: SeriesDefinition; config: SeriesConfig }) {
  return (
    <div className="relative flex min-h-[100svh] flex-col justify-center bg-co-bg">
      <HairlineGrid tone="signal" />

      <div
        className="co-shell relative grid w-full grid-cols-1 gap-y-12 pb-[clamp(96px,10vh,128px)] lg:grid-cols-12 lg:items-center lg:gap-x-0"
        style={{ paddingTop: `calc(${HEADER_HEIGHT}px + clamp(32px, 6vh, 72px))` }}
      >
        <div className="flex flex-col lg:col-span-6 lg:pr-10">
          <p className="co-eyebrow">Office systems — Surat, IN</p>

          <h1 className="co-display mt-[clamp(20px,3vw,40px)] text-[clamp(40px,5.3vw,76px)]">
            <KineticHeading>Engineered for two.</KineticHeading>
            <span className="block text-co-muted-2">
              <KineticHeading>Scaled for the floor.</KineticHeading>
            </span>
          </h1>

          <p className="co-lead mt-[clamp(24px,3vw,40px)] max-w-[34ch] text-co-ink">
            Configurable desking, cabins and meeting tables — specified to the millimetre and
            quoted to your floor plan.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Button asChild>
              <Link href="/configure">Configure a desk</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contact">Book a showroom visit</Link>
            </Button>
          </div>
        </div>

        <figure className="relative self-center text-co-ink lg:col-span-6">
          <RegistrationCross className="-left-1 -top-6 lg:left-2" />
          <RegistrationCross className="-right-1 -top-6" />

          <div className="relative pr-8 sm:pr-12">
            {/* Isolated: the render multiplies with the plate below it, never with the grid. */}
            <div className="relative isolate">
              <span aria-hidden className="co-cutout-plate absolute inset-0 bg-co-bg" />
              <Image
                src={config.image}
                alt={config.imageAlt}
                width={1400}
                height={637}
                sizes="(min-width: 1024px) 46vw, 100vw"
                loading="eager"
                fetchPriority="high"
                quality={90}
                className="co-cutout relative h-auto w-full"
              />
            </div>
            {/* Working height: the one dimension every configuration in the series shares. */}
            <DimensionLine
              axis="y"
              label={`${series.workingHeightMm} H`}
              className="absolute bottom-[12%] right-0 top-[18%] sm:right-2"
            />
          </div>

          <DimensionLine label={`${configLengthLabel(config)} per seat`} className="mt-3 w-[86%]" />

          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <FigureCaption n={1}>
              {series.wordmark} {config.name.toLowerCase()} · {config.seats} seats
            </FigureCaption>
            <p className="co-data text-co-muted-2">{siteConfig.coordinates.label}</p>
          </div>
        </figure>
      </div>
    </div>
  );
}
