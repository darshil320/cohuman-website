import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { ProjectRail } from "@/components/projects/project-rail";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { Reveal } from "@/components/ui/scroll-reveal";
import { catalog } from "@/lib/catalog";
import type { Project } from "@/lib/catalog/types";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { cn } from "@/lib/utils";

const DESCRIPTION =
  "Completed Cohuman fit-outs — workstation floors, executive cabins, boardrooms and reception areas, photographed on site.";

export const metadata: Metadata = {
  title: "Projects",
  description: DESCRIPTION,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects",
    description: DESCRIPTION,
    url: "/projects",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Projects",
    description: DESCRIPTION,
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One photograph's frame. The page's first photograph is preloaded as its likely LCP
 * image, so it skips the wipe — a clip-path that starts closed would hold back the very
 * paint the preload is there to hurry. Every other frame wipes in as it reaches the
 * viewport, including the ones further along a rail as they are scrolled into view.
 */
function Frame({ wipe, children }: { wipe: boolean; children: ReactNode }) {
  const className = "aspect-[3/2] border border-co-border bg-co-bg-alt";
  return wipe ? (
    <ClipReveal className={className}>{children}</ClipReveal>
  ) : (
    <div className={cn("relative overflow-hidden", className)}>{children}</div>
  );
}

/** A project's heading: number and plate count, name, city, then what was delivered. */
function PlateHeading({ project, index }: { project: Project; index: number }) {
  const plates = project.images.length;
  return (
    <Reveal className="grid grid-cols-1 items-end gap-x-[clamp(24px,3vw,48px)] gap-y-5 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="co-eyebrow">
          Project {pad(index + 1)}
          <span aria-hidden> — </span>
          {pad(plates)} {plates === 1 ? "plate" : "plates"}
        </p>
        <h3 id={`project-${project.slug}`} className="co-index mt-4">
          {project.name}
        </h3>
        {project.city ? <p className="co-data mt-3">{project.city}</p> : null}
      </div>
      <p className="max-w-[52ch] border-t border-co-ink pt-5 text-[15px] leading-[1.55] text-co-ink-soft lg:col-span-5">
        {project.delivered}
      </p>
    </Reveal>
  );
}

/**
 * Completed fit-outs as a drawing set: each project a plate — its name and what was
 * delivered, then every photograph at one large size on a sideways rail, pinned with
 * registration crosses. Client photographs show in their own colour — no `co-highkey`
 * (the client found it washed out) — at quality 90. Figure numbers run down the whole page. Only the fields a project
 * actually carries are printed — no city where none was shared, no counts, no sectors.
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

      {/* overflow-x-clip: each rail bleeds to the screen's right edge (see `co-plate-rail`). */}
      <section className="co-shell co-section overflow-x-clip">
        <SectionHeading eyebrow="01 / Projects" title="On site, after handover." className="mb-0" />

        {projects.map((project, index) => {
          const fig = firstFigure[index];
          const place = project.city ? `, ${project.city}` : "";
          const many = project.images.length > 1;

          return (
            <article
              key={project.slug}
              aria-labelledby={`project-${project.slug}`}
              className="grid grid-cols-[minmax(0,1fr)] gap-y-[clamp(24px,3vw,40px)] border-b border-co-border py-[clamp(48px,6vw,96px)]"
            >
              <PlateHeading project={project} index={index} />

              <ProjectRail label={`${project.name}${place}`} count={project.images.length}>
                {project.images.map((image, i) => {
                  const lcp = index === 0 && i === 0;
                  return (
                    <figure key={image}>
                      <div className="relative text-co-ink">
                        <Frame wipe={!lcp}>
                          <Image
                            src={image}
                            alt={`${project.name} — completed fit-out${many ? `, view ${i + 1}` : ""}`}
                            fill
                            sizes="(min-width: 768px) min(58vw, 860px), 86vw"
                            preload={lcp}
                            quality={90}
                            className="object-cover"
                          />
                        </Frame>
                        <RegistrationCross className="-left-2 -top-2" />
                        <RegistrationCross className="-bottom-2 -right-2" />
                      </div>
                      <FigureCaption n={fig + i} className="mt-3">
                        {project.name}
                        {place}
                        {many ? `, view ${i + 1}` : ""}
                      </FigureCaption>
                    </figure>
                  );
                })}
              </ProjectRail>
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
