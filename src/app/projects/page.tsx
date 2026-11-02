import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { CtaBand } from "@/components/common/cta-band";
import { SectionHeading } from "@/components/common/section-heading";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { catalog } from "@/lib/catalog";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/common/page-hero";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Completed Cohuman fit-outs — workstation floors, executive cabins, boardrooms and reception areas, photographed on site.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects",
    description:
      "Completed Cohuman fit-outs — workstation floors, executive cabins, boardrooms and reception areas, photographed on site.",
    url: "/projects",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Projects",
    description:
      "Completed Cohuman fit-outs — workstation floors, executive cabins, boardrooms and reception areas, photographed on site.",
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The lead frame. The first project's lead is preloaded as the page's likely LCP image,
 * so it skips the wipe — a clip-path that starts closed would hold back the very paint
 * the preload is there to hurry. Every other frame wipes in.
 */
function Frame({ wipe, className, children }: { wipe: boolean; className: string; children: ReactNode }) {
  return wipe ? (
    <ClipReveal className={className}>{children}</ClipReveal>
  ) : (
    <div className={cn("relative overflow-hidden", className)}>{children}</div>
  );
}

/**
 * Completed fit-outs as a drawing set: each project a large lead figure with its copy
 * beside it, then the rest of the shoot as a strip. Figure numbers run down the whole
 * page. Only the fields a project actually carries are printed — no city where none was
 * shared, no counts, no sectors.
 */
export default async function ProjectsPage() {
  const projects = await catalog.getProjects();

  // The first figure number of each project: one per photograph in the projects above it.
  const firstFigure = projects.map(
    (_, i) => 1 + projects.slice(0, i).reduce((sum, p) => sum + p.images.length, 0),
  );

  return (
    <div>
      <PageHero
        eyebrow="Projects"
        title="Floors we have finished."
        titleClassName="max-w-[14ch]"
        lead="Photographed on site after handover. Some of these are named, some are known by the unit they were built into — where a client has not asked to be listed, we do not list them."
      />

      <section className="co-shell co-section">
        <SectionHeading eyebrow="01 / Projects" title="On site, after handover." className="mb-0" />

        {projects.map((project, index) => {
          const [lead, ...rest] = project.images;
          const title = `${project.name}${project.city ? `, ${project.city}` : ""}`;
          const fig = firstFigure[index];

          return (
            <article
              key={project.slug}
              className="grid gap-y-[clamp(20px,2.4vw,32px)] border-b border-co-border py-[clamp(40px,5vw,80px)]"
            >
              <div className="grid grid-cols-1 items-end gap-x-[clamp(24px,3vw,48px)] gap-y-6 lg:grid-cols-12">
                {lead ? (
                  <figure className="lg:col-span-8">
                    <Frame wipe={index > 0} className="aspect-[3/2] border border-co-border bg-co-bg-alt">
                      <Image
                        src={lead}
                        alt={`${project.name} — completed fit-out`}
                        fill
                        sizes="(min-width: 1024px) 64vw, 100vw"
                        preload={index === 0}
                        className="co-highkey object-cover"
                      />
                    </Frame>
                    <FigureCaption n={fig} className="mt-3">
                      {title}
                    </FigureCaption>
                  </figure>
                ) : null}

                <Reveal className={cn(lead ? "lg:col-span-4 lg:pb-9" : "lg:col-span-12")}>
                  <p className="co-eyebrow">Project {pad(index + 1)}</p>
                  <h3 className="co-index mt-4">
                    {project.name}
                  </h3>
                  {project.city ? <p className="co-data mt-3">{project.city}</p> : null}
                  <p className="mt-5 max-w-[46ch] border-t border-co-border pt-5 text-[15px] leading-[1.55] text-co-ink-soft">
                    {project.delivered}
                  </p>
                </Reveal>
              </div>

              {rest.length > 0 ? (
                <StaggerContainer
                  as="ul"
                  className="grid list-none grid-cols-2 gap-x-3 gap-y-6 p-0 sm:grid-cols-4 sm:gap-x-6"
                >
                  {rest.map((image, i) => (
                    <StaggerItem key={image} as="li">
                      <figure>
                        <ClipReveal className="aspect-[4/3] border border-co-border bg-co-bg-alt">
                          <Image
                            src={image}
                            alt={`${project.name} — view ${i + 2}`}
                            fill
                            sizes="(min-width: 640px) 22vw, 45vw"
                            className="co-highkey object-cover"
                          />
                        </ClipReveal>
                        <FigureCaption n={fig + 1 + i} className="mt-2.5">
                          {project.name}, view {i + 2}
                        </FigureCaption>
                      </figure>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : null}
            </article>
          );
        })}
      </section>

      <CtaBand
        tone="light"
        heading="Your floor could be the next one."
        body="Send the plan and the headcount. We will come back with test-fits and a costed schedule."
        buttonLabel="Start an enquiry"
      />
    </div>
  );
}
