import Link from "next/link";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { TextReveal } from "@/components/ui/text-reveal";
import { sitePhotos } from "@/lib/photos";

/** Shared between the section box and the content box so the two cannot drift apart. */
const BAND_HEIGHT = "clamp(420px,58vh,680px)";

/**
 * Full-bleed photograph, one line over it.
 *
 * The one moment on the page where the image is the whole section rather than a card —
 * which is what `ParallaxImage`'s over-scan was built for, and why the component had
 * sat unused. It breaks the run of white sections between the configurator and the
 * project grid, and adds a route into /projects rather than consuming one.
 *
 * The scrim is the same device the hero already uses to hold white type legible over a
 * photograph. It stays monochrome — there is no colour anywhere in this brand.
 */
export function HomeImageBand() {
  return (
    <section
      className="relative isolate overflow-hidden bg-co-panel"
      style={{ minHeight: BAND_HEIGHT }}
    >
      <ParallaxImage
        src={sitePhotos.heroBoardroom}
        alt="Boardroom and meeting suite in a completed Cohuman fit-out"
        fill
        sizes="100vw"
        className="absolute inset-0"
      />
      <div aria-hidden className="absolute inset-0 bg-black/45" />

      <div
        className="co-shell relative flex flex-col justify-end py-[clamp(40px,5vw,72px)]"
        style={{ minHeight: BAND_HEIGHT }}
      >
        <h2 className="co-h1 mb-7 max-w-[16ch] text-white">
          <TextReveal>Every floor here was drawn, made and installed by us.</TextReveal>
        </h2>
        <Link
          href="/projects"
          className="group inline-flex w-fit items-center gap-3 border-b-2 border-white pb-2 text-[clamp(15px,1.4vw,19px)] font-semibold text-white transition-colors hover:border-white/60 hover:text-white/80"
        >
          See the work
          <svg
            aria-hidden
            width="15"
            height="10"
            viewBox="0 0 13 9"
            fill="none"
            className="transition-transform duration-300 ease-[var(--ease-co)] group-hover:translate-x-1.5"
          >
            <path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
