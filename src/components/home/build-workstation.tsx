import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

/**
 * The catalogue's selection guide ("Build your workstation. Six steps, from the leg
 * up.", 2026 catalogue p28), in its order and words. Steps 04–05 have no photograph in
 * the catalogue yet, so the photographs illustrate the leg, the partition and the
 * finished bench only.
 */
const STEPS = [
  { n: "01", title: "Select your system", body: "Pick the leg system the desk stands on." },
  {
    n: "02",
    title: "Select your top",
    body: "Choose the desktop core, the edge profile and the finish.",
    href: "/finishes",
  },
  {
    n: "03",
    title: "Select your partition",
    body: "Choose a screen partition, or keep the desk open.",
    href: "/finishes",
  },
  { n: "04", title: "Select your VOLT & BOLT system", body: "Add power and data units at the desk." },
  { n: "05", title: "Select your accessories", body: "Add the accessories your team needs." },
  { n: "06", title: "Your workstation is ready", body: "We build it to your selection." },
] as const;

const PHOTOS = [
  { src: "/build/leg.jpg", alt: "The splayed tubular leg of a Stretch S table", caption: "The leg system" },
  {
    src: "/build/partition.jpg",
    alt: "A four-seat bench with fabric screen partitions between the desks",
    caption: "Screen partition",
  },
  {
    src: "/build/finished.jpg",
    alt: "Stretch V desks with screens on an open office floor",
    caption: "A finished bench",
  },
] as const;

export function BuildWorkstation({ eyebrow }: { eyebrow: string }) {
  return (
    <section className="co-shell co-section">
      <SectionHeading
        layout="stacked"
        eyebrow={eyebrow}
        title="Build your workstation."
        blurb="Six steps, from the leg up. Choose each part, and our team will guide you through the options."
        linkHref="/configure"
        linkLabel="Configure a desk"
      />

      <div className="grid grid-cols-1 gap-x-[clamp(28px,4vw,72px)] gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <ol className="list-none border-t border-co-ink p-0">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 border-b border-co-border py-5"
            >
              <span className="co-data pt-1 text-co-muted-2">{step.n}</span>
              <span>
                <span className="co-h3 block">{step.title}</span>
                <span className="mt-1.5 block text-[14px] leading-relaxed text-co-muted">{step.body}</span>
                {"href" in step ? (
                  <Link href={step.href} className="co-data mt-2 inline-block text-co-ink underline-offset-4 hover:underline">
                    Tops &amp; finishes →
                  </Link>
                ) : null}
              </span>
            </li>
          ))}
        </ol>

        <StaggerContainer className="grid grid-cols-2 gap-4 md:gap-6">
          {PHOTOS.map((photo, i) => (
            <StaggerItem key={photo.src} className={i === 0 ? "row-span-2" : undefined}>
              <figure className="flex h-full flex-col">
                <ClipReveal
                  className={
                    i === 0
                      ? "min-h-[320px] flex-1 border border-co-border bg-co-bg-alt"
                      : "aspect-[4/3] border border-co-border bg-co-bg-alt"
                  }
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 26vw, 50vw"
                    quality={90}
                    className="object-cover"
                  />
                </ClipReveal>
                <figcaption className="co-data mt-3 text-co-muted-2">{photo.caption}</figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
