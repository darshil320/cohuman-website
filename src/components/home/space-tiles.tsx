import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import type { Space } from "@/lib/catalog";
import { spacePhoto } from "@/lib/photos";

/**
 * Furnish by space.
 *
 * Photographs of finished installs, run the way the moodboard treats interiors: high-key
 * and cool, partly desaturated (`co-highkey`), so the furniture rather than the room
 * styling is the subject. Each frame wipes open left to right and carries a figure
 * number. `Space.includes` is deliberately not shown: it lists the illustrative demo
 * products, not real Cohuman ones.
 */
export function SpaceTiles({
  spaces,
  eyebrow = "02 / Spaces",
  firstFigure = 2,
}: {
  spaces: Space[];
  eyebrow?: string;
  /** Figure numbering continues from the sections above it. */
  firstFigure?: number;
}) {
  return (
    <section className="co-shell co-section">
      <SectionHeading
        eyebrow={eyebrow}
        title="Tell us the room."
        blurb="Cabin, workstation, meeting or lounge — we schedule the furniture by the room it goes in, not by the catalogue page it came from."
        linkHref="/solutions"
        linkLabel="Workspace solutions"
      />

      <StaggerContainer className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {spaces.map((sp, i) => (
          <StaggerItem key={sp.slug}>
            <Link href="/solutions" className="group block">
              <figure>
                <ClipReveal className="aspect-[4/5] border border-co-border bg-co-bg-alt">
                  <Image
                    src={spacePhoto[sp.slug]}
                    alt={sp.slotHint}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw"
                    className="co-highkey object-cover"
                  />
                </ClipReveal>
                <FigureCaption n={firstFigure + i} className="mt-3">
                  {sp.name}
                </FigureCaption>
              </figure>
              <h3 className="co-h3 mt-5 border-t border-co-ink pt-4">{sp.name}</h3>
              <p className="mt-2.5 max-w-[34ch] text-[14px] leading-relaxed text-co-muted">{sp.blurb}</p>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
