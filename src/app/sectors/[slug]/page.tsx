import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/common/cta-band";
import { EnquireButton } from "@/components/common/enquire-button";
import { SectionHeading } from "@/components/common/section-heading";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { HairlineGrid } from "@/components/ui/hairline-grid";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { catalog } from "@/lib/catalog";
import { publicFileExists } from "@/lib/public-assets";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const sectors = await catalog.getSectors();
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sector = await catalog.getSector(slug);
  if (!sector) return {};
  return {
    title: `${sector.name} furniture`,
    description: sector.blurb,
    alternates: { canonical: `/sectors/${sector.slug}` },
    openGraph: {
      title: `${sector.name} furniture`,
      description: sector.blurb,
      url: `/sectors/${sector.slug}`,
      // First sector photograph where there is one, so a shared sector link previews
      // that sector; otherwise the site-wide card, which a page-level `openGraph` would
      // otherwise drop (see share-image.ts).
      images: sector.photos[0] ? [{ url: sector.photos[0].src }] : [SHARE_IMAGE],
    },
    twitter: {
      title: `${sector.name} furniture`,
      description: sector.blurb,
      ...(sector.photos[0] ? { images: [sector.photos[0].src] } : {}),
    },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Hairline rows on the index grid: number, name, then the reading column. */
const ROW_GRID =
  "grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-3 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.3fr)] lg:grid-cols-[90px_minmax(0,360px)_minmax(0,1fr)]";

/**
 * One sector — what Cohuman makes for it and why specifying for it is different.
 *
 * Every section below the considerations is driven by data the client supplies: named
 * ranges, photography, and installs cleared for publication. Each renders only when it
 * has content, so the page reads as complete at every stage of being filled in rather
 * than showing empty frames or invented product names. Section and figure numbers are
 * counted from what actually renders, so a missing section never leaves a gap.
 */
export default async function SectorPage({ params }: Props) {
  const { slug } = await params;
  const sector = await catalog.getSector(slug);
  if (!sector) notFound();

  const photos = sector.photos.filter((photo) => publicFileExists(photo.src));
  const allProjects = await catalog.getProjects();
  const projects = allProjects.filter((project) => sector.projectSlugs.includes(project.slug));

  const breadcrumb = breadcrumbJsonLd([
    { name: "Sectors", path: "/sectors" },
    { name: sector.name },
  ]);

  const [lead, ...morePhotos] = photos;

  const sections = [
    morePhotos.length ? "Photographs" : null,
    "Considerations",
    sector.ranges.length ? "Ranges" : null,
    projects.length ? "Projects" : null,
  ].filter((name): name is string => name !== null);
  const eyebrow = (name: string) => `${pad(sections.indexOf(name) + 1)} / ${name}`;

  // Figures run down the page: the hero photograph, the rest of the shoot, then installs.
  const firstMoreFigure = lead ? 2 : 1;
  const firstProjectFigure = firstMoreFigure + morePhotos.length;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-co-ink">
        <HairlineGrid />
        <div
          className={cn(
            "co-shell relative grid grid-cols-1 gap-y-12 pb-[clamp(48px,6vw,96px)] pt-[clamp(24px,3vw,40px)]",
            lead && "lg:grid-cols-12 lg:items-end lg:gap-x-0",
          )}
        >
          <div className={cn(lead && "lg:col-span-6 lg:pr-10")}>
            <nav aria-label="Breadcrumb" className="co-eyebrow flex flex-wrap items-center gap-2">
              <Link href="/sectors" className="hover:text-co-ink">
                Sectors
              </Link>
              <span aria-hidden>/</span>
              <span className="text-co-ink">{sector.name}</span>
            </nav>
            <p className="co-eyebrow mt-[clamp(40px,6vw,88px)]">{sector.kicker}</p>
            <h1
              className={cn(
                "co-h1 mt-[clamp(16px,2vw,28px)] max-w-[16ch]",
                lead && "lg:text-[clamp(40px,4.6vw,68px)]",
              )}
            >
              <KineticHeading>{`${sector.name} furniture.`}</KineticHeading>
            </h1>
            <p className="co-lead mt-[clamp(20px,2.6vw,36px)] max-w-[58ch]">{sector.blurb}</p>
            <div className="mt-8">
              <EnquireButton subject={sector.enquirySubject}>Start an enquiry</EnquireButton>
            </div>
          </div>

          {lead ? (
            <figure className="relative lg:col-span-6">
              <RegistrationCross className="-left-2 -top-2 z-10" />
              <ClipReveal className="aspect-[4/3] border border-co-border bg-co-bg-alt">
                <Image
                  src={lead.src}
                  alt={lead.alt}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="co-highkey object-cover"
                />
              </ClipReveal>
              <FigureCaption n={1} className="mt-3">
                {lead.caption ?? sector.name}
              </FigureCaption>
            </figure>
          ) : null}
        </div>
      </section>

      {/* The rest of the shoot, once there is more than the hero frame. */}
      {morePhotos.length ? (
        <section className="co-shell co-section">
          <SectionHeading eyebrow={eyebrow("Photographs")} title="On site." />
          <StaggerContainer className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
            {morePhotos.map((photo, i) => (
              <StaggerItem key={photo.src}>
                <figure>
                  <ClipReveal className="aspect-[16/9] border border-co-border bg-co-bg-alt">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 640px) 48vw, 100vw"
                      className="co-highkey object-cover"
                    />
                  </ClipReveal>
                  <FigureCaption n={firstMoreFigure + i} className="mt-3">
                    {photo.caption ?? sector.name}
                  </FigureCaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      ) : null}

      {/* What makes this sector different */}
      <section className="co-shell co-section">
        <SectionHeading
          eyebrow={eyebrow("Considerations")}
          title="What changes when you specify for this."
          className="mb-0"
        />
        <StaggerContainer as="ol">
          {sector.considerations.map((point, index) => (
            <StaggerItem
              key={point.title}
              as="li"
              className={cn(ROW_GRID, "items-baseline border-b border-co-border py-[clamp(22px,2.6vw,34px)]")}
            >
              <span className="co-data">{pad(index + 1)}</span>
              <h3 className="co-h3 max-w-[22ch]">{point.title}</h3>
              <p className="col-start-2 max-w-[60ch] text-[15px] leading-[1.55] text-co-ink-soft md:col-start-auto">
                {point.detail}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Named ranges — only once real product names and specs exist */}
      {sector.ranges.length ? (
        <section className="border-t border-co-ink bg-co-bg-alt">
          <div className="co-shell co-section">
            <SectionHeading
              eyebrow={eyebrow("Ranges")}
              title="What we make for it."
              className="mb-0"
            />
            <Reveal>
              <dl>
                {sector.ranges.map((range) => (
                  <div
                    key={range.name}
                    className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-co-border py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:grid-cols-[minmax(0,450px)_minmax(0,1fr)_260px]"
                  >
                    <dt className="co-h3">{range.name}</dt>
                    <dd className="max-w-[60ch] text-[15px] leading-[1.55] text-co-ink-soft">
                      {range.note}
                    </dd>
                    {range.spec ? (
                      <dd className="co-data md:col-start-2 lg:col-start-auto">{range.spec}</dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Proof — only installs cleared for publication */}
      {projects.length ? (
        <section className="co-shell co-section">
          <SectionHeading
            eyebrow={eyebrow("Projects")}
            title="Delivered."
            linkHref="/projects"
            linkLabel="All projects"
          />
          <StaggerContainer className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => {
              const title = `${project.name}${project.city ? `, ${project.city}` : ""}`;
              // Only photographed installs take a figure number.
              const figure =
                firstProjectFigure + projects.slice(0, i).filter((p) => p.images[0]).length;
              return (
                <StaggerItem key={project.slug}>
                  {project.images[0] ? (
                    <figure>
                      <ClipReveal className="aspect-[4/3] border border-co-border bg-co-bg-alt">
                        <Image
                          src={project.images[0]}
                          alt={`${project.name} — completed fit-out`}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                          quality={90}
                          className="object-cover"
                        />
                      </ClipReveal>
                      <FigureCaption n={figure} className="mt-3">
                        {title}
                      </FigureCaption>
                    </figure>
                  ) : (
                    <h3 className="co-h3 border-t border-co-ink pt-4">{title}</h3>
                  )}
                  <p className="mt-2 max-w-[48ch] text-[14px] leading-[1.55] text-co-muted">
                    {project.delivered}
                  </p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      ) : null}

      <CtaBand
        tone="light"
        heading={`Tell us about the ${sector.name.toLowerCase()} brief.`}
        body="Room sizes, a floor plan or a ward list — whatever you have. You get back a schedule and a drawing."
        subject={sector.enquirySubject}
      />
    </div>
  );
}
