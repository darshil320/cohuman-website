import Image from "next/image";
import Link from "next/link";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { SpecLabel } from "@/components/ui/spec-label";
import type { Space } from "@/lib/catalog";
import { spacePhoto } from "@/lib/photos";

/**
 * Furnish by space.
 *
 * Was a 4-up of numbered text columns — the third section in a row using that same
 * device — while `spacePhoto` already mapped every slug to a real photograph of that
 * room type that nothing on the homepage rendered. The photograph carries the section
 * now and the numeral drops to a caption on the image, which is what stops this reading
 * as another list.
 *
 * These are photographs of finished installs, not the studio renders in `public/pros`
 * and `public/varidex` — those are shot on white and would show as a white box on this
 * near-black ground.
 */
export function SpaceTiles({ spaces }: { spaces: Space[] }) {
  return (
    <section className="bg-co-panel text-co-panel-fg">
      <div className="co-shell co-section">
        <Reveal>
          <SpecLabel tone="dark" rule className="mb-6">
            03 / By space
          </SpecLabel>
          <h2 className="co-h2 mb-[clamp(38px,5vw,76px)] max-w-[22ch] text-co-panel-fg">
            <KineticHeading>Tell us the room. We&apos;ll tell you what goes in it.</KineticHeading>
          </h2>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 gap-x-[clamp(16px,2vw,32px)] gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {spaces.map((sp) => (
            <StaggerItem key={sp.slug}>
              <Link href="/solutions" className="group block text-co-panel-fg">
                {/*
                  A 4:5 crop of a 3:2 photograph. Portrait tiles give the row a rhythm a
                  landscape grid does not, and the centre of these interiors is where the
                  furniture is.
                */}
                <div className="relative aspect-[4/5] overflow-hidden bg-co-panel-border">
                  <Image
                    src={spacePhoto[sp.slug]}
                    alt={sp.slotHint}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-co)] group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden
                    className="absolute left-3 top-3 font-mono text-[10.5px] tabular-nums text-white/70"
                  >
                    {sp.num}
                  </span>
                </div>

                <span
                  aria-hidden
                  className="mt-[clamp(12px,1.4vw,18px)] block h-px w-full bg-co-panel-border transition-colors duration-500 group-hover:bg-co-panel-fg"
                />

                <h3 className="co-h3 mb-2.5 mt-4">{sp.name}</h3>
                <p className="max-w-[30ch] text-[13.5px] font-light leading-relaxed text-co-panel-muted">
                  {sp.blurb}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
