import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/common/cta-band";
import { EnquireButton } from "@/components/common/enquire-button";
import { catalog } from "@/lib/catalog";
import { publicFileExists } from "@/lib/public-assets";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TextReveal } from "@/components/ui/text-reveal";

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
  };
}

/**
 * One sector — what Cohuman makes for it and why specifying for it is different.
 *
 * Every section below the considerations is driven by data the client supplies: named
 * ranges, photography, and installs cleared for publication. Each renders only when it
 * has content, so the page reads as complete at every stage of being filled in rather
 * than showing empty frames or invented product names.
 */
export default async function SectorPage({ params }: Props) {
  const { slug } = await params;
  const sector = await catalog.getSector(slug);
  if (!sector) notFound();

  const photos = sector.photos.filter((photo) => publicFileExists(photo.src));
  const allProjects = await catalog.getProjects();
  const projects = allProjects.filter((project) => sector.projectSlugs.includes(project.slug));

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,78px)] sm:px-6 lg:px-11">
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="mb-[clamp(18px,2.4vw,30px)] flex items-center gap-2 text-[12.5px] text-co-faint"
            >
              <Link href="/sectors" className="hover:text-co-ink">
                Sectors
              </Link>
              <span aria-hidden>/</span>
              <span className="font-medium text-co-ink">{sector.name}</span>
            </nav>
            <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
              {sector.kicker}
            </p>
            <h1 className="mb-4 max-w-[16ch] font-display text-[clamp(34px,5vw,62px)] font-medium leading-[1.02] tracking-tight">
              <TextReveal>{`${sector.name} furniture.`}</TextReveal>
            </h1>
            <p className="max-w-[58ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
              {sector.blurb}
            </p>
            <div className="mt-7">
              <EnquireButton subject={sector.enquirySubject}>Start an enquiry</EnquireButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Photography */}
      {photos.length ? (
        <section className="border-b border-co-border">
          <StaggerContainer
            className={
              photos.length > 1
                ? "mx-auto grid max-w-[1320px] grid-cols-1 gap-3 px-[18px] py-[clamp(34px,4vw,56px)] sm:grid-cols-2 sm:px-6 lg:px-11"
                : "mx-auto max-w-[1320px] px-[18px] py-[clamp(34px,4vw,56px)] sm:px-6 lg:px-11"
            }
          >
            {photos.map((photo) => (
              <StaggerItem key={photo.src} className="border border-co-card-border">
                <div className="relative aspect-[16/9] overflow-hidden bg-co-bg-alt">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {photo.caption ? (
                  <p className="border-t border-co-card-border px-4 py-3 text-[12.5px] font-light text-co-muted">
                    {photo.caption}
                  </p>
                ) : null}
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      ) : null}

      {/* What makes this sector different */}
      <section className="border-b border-co-border">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
          <Reveal>
            <h2 className="mb-[clamp(28px,3.5vw,46px)] max-w-[22ch] font-display text-[clamp(25px,3vw,40px)] font-medium tracking-tight">
              <TextReveal>What changes when you specify for this.</TextReveal>
            </h2>
          </Reveal>
          <StaggerContainer className="grid grid-cols-1 gap-px border border-co-border bg-co-border sm:grid-cols-3">
            {sector.considerations.map((point, index) => (
              <StaggerItem
                key={point.title}
                className="bg-co-bg p-[clamp(24px,3vw,32px)]"
              >
                <p className="mb-4 font-mono text-[12.5px] text-co-green">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mb-2.5 font-display text-xl font-medium leading-tight tracking-tight">
                  {point.title}
                </h3>
                <p className="text-[15px] font-light leading-relaxed text-co-muted">
                  {point.detail}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Named ranges — only once real product names and specs exist */}
      {sector.ranges.length ? (
        <section className="border-b border-co-border bg-co-bg-alt">
          <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
            <Reveal>
              <h2 className="mb-[clamp(24px,3vw,40px)] font-display text-[clamp(25px,3vw,40px)] font-medium tracking-tight">
                <TextReveal>What we make for it.</TextReveal>
              </h2>
            </Reveal>
            <StaggerContainer className="grid grid-cols-1 gap-px border border-co-border bg-co-border sm:grid-cols-2 lg:grid-cols-3">
              {sector.ranges.map((range) => (
                <StaggerItem key={range.name} className="bg-co-bg p-[clamp(20px,2.4vw,28px)]">
                  <h3 className="mb-2 font-display text-lg font-medium tracking-tight">
                    {range.name}
                  </h3>
                  <p className="mb-2.5 text-[14.5px] font-light leading-relaxed text-co-muted">
                    {range.note}
                  </p>
                  {range.spec ? (
                    <p className="font-mono text-[12px] text-co-faint">{range.spec}</p>
                  ) : null}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : null}

      {/* Proof — only installs cleared for publication */}
      {projects.length ? (
        <section className="border-b border-co-border">
          <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
            <Reveal>
              <h2 className="mb-[clamp(24px,3vw,40px)] font-display text-[clamp(25px,3vw,40px)] font-medium tracking-tight">
                <TextReveal>Delivered.</TextReveal>
              </h2>
            </Reveal>
            <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <StaggerItem
                  key={project.slug}
                  className="border border-co-card-border bg-co-bg"
                >
                  {project.images[0] ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-co-bg-alt">
                      <Image
                        src={project.images[0]}
                        alt={project.delivered}
                        fill
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="border-t border-co-card-border p-4">
                    <h3 className="mb-1 font-display text-[17px] font-medium tracking-tight">
                      {project.name}
                    </h3>
                    {project.city ? (
                      <p className="mb-1.5 text-[12.5px] font-light text-co-faint">
                        {project.city}
                      </p>
                    ) : null}
                    <p className="text-[13.5px] font-light leading-normal text-co-muted">
                      {project.delivered}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : null}

      <CtaBand
        heading={`Tell us about the ${sector.name.toLowerCase()} brief.`}
        body="Room sizes, a floor plan or a ward list — whatever you have. You get back a schedule and a drawing."
        subject={sector.enquirySubject}
      />
    </div>
  );
}
