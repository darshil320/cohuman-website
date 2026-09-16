import Image from "next/image";
import { Reveal } from "@/components/ui/scroll-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { TextReveal } from "@/components/ui/text-reveal";
import { sitePhotos } from "@/lib/photos";
import { siteConfig } from "@/lib/site-config";

/**
 * Why us.
 *
 * Was a 3-up of numbered text columns, immediately after another 4-up of numbered text
 * columns. The points are unchanged; what changed is that they now stack as prose beside
 * two photographs, and the index drops to a small mono figure rather than a 32px display
 * numeral standing over empty space. That is what stops the page reading as one long
 * document.
 *
 * The founding year and the years in business stay derived — a hardcoded "37 yrs" is
 * wrong every January.
 */
const yearsInBusiness = new Date().getFullYear() - siteConfig.foundedYear;

const CAPABILITIES = [
  {
    n: "01",
    name: "Our own workshop in Surat",
    note: `Designing and making workplaces since ${siteConfig.foundedYear} — ${yearsInBusiness} years of the same benches, the same finishes, the same people.`,
  },
  {
    n: "02",
    name: "Spares that still exist in year seven",
    note: "Because we manufacture the range ourselves, a finish can be matched and a part replaced a decade after the install.",
  },
  {
    n: "03",
    name: "Installed by our own crews",
    note: "Out of hours if the floor is live, with the packaging taken away and a service contract that keeps it working.",
  },
];

export function CapabilityEditorial() {
  return (
    <section className="bg-co-bg-alt">
      <div className="co-shell co-section-lg grid grid-cols-1 items-center gap-x-[clamp(28px,4vw,80px)] gap-y-12 lg:grid-cols-[1fr_1.05fr]">
        <Reveal>
          <p className="co-eyebrow mb-4">Why us</p>
          <h2 className="co-h2 mb-[clamp(28px,3.4vw,52px)] max-w-[16ch]">
            <TextReveal>Made down the road, not shipped in a container.</TextReveal>
          </h2>

          <div>
            {CAPABILITIES.map((item) => (
              <div
                key={item.n}
                className="grid grid-cols-[auto_1fr] items-start gap-x-5 border-t border-co-border py-[clamp(18px,2vw,26px)]"
              >
                <span
                  aria-hidden
                  className="mt-1 font-mono text-[10.5px] tabular-nums text-co-placeholder"
                >
                  {item.n}
                </span>
                <div className="min-w-0">
                  <h3 className="mb-2 font-display text-[clamp(17px,1.5vw,21px)] font-medium leading-tight tracking-[-0.026em]">
                    {item.name}
                  </h3>
                  <p className="max-w-[44ch] text-[13.5px] font-light leading-relaxed text-co-muted">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/*
          Two portrait frames, the second dropped by a twelfth of the column. The offset is
          the whole point — two images squared off in a 2-up read as a grid, one stepped
          down reads as a spread. Only the left frame parallaxes: on both it registers as
          an effect, on one as a considered detail.
        */}
        <div className="grid grid-cols-2 gap-3.5 lg:gap-4">
          <ParallaxImage
            src={sitePhotos.aboutCabin}
            alt="Cabin fit-out with desk, credenza and visitor seating"
            fill
            sizes="(min-width: 1024px) 26vw, 45vw"
            className="aspect-[4/5]"
          />
          <div className="relative mt-12 aspect-[4/5] overflow-hidden bg-co-hero-bg">
            <Image
              src={sitePhotos.heroBenching}
              alt="Open-plan bench desking on a finished floor"
              fill
              sizes="(min-width: 1024px) 26vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
