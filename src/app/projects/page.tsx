import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/common/cta-band";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Completed Cohuman fit-outs — workstation floors, executive cabins, boardrooms and reception areas, photographed on site.",
};

export default async function ProjectsPage() {
  const projects = await catalog.getProjects();

  return (
    <div>
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,78px)] sm:px-6 lg:px-11">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            Projects
          </p>
          <h1 className="mb-4 max-w-[18ch] font-display text-[clamp(34px,5vw,62px)] font-medium leading-[1.02] tracking-tight">
            Floors we have finished.
          </h1>
          <p className="max-w-[58ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
            Photographed on site after handover. Some of these are named, some are known by
            the unit they were built into — where a client has not asked to be listed, we do
            not list them.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1320px] gap-[clamp(40px,5vw,72px)] px-[18px] py-[clamp(40px,5vw,72px)] pb-[clamp(64px,8vw,100px)] sm:px-6 lg:px-11">
        {projects.map((project, index) => {
          const [lead, ...rest] = project.images;
          return (
            <article
              key={project.slug}
              className="grid gap-[clamp(16px,2vw,28px)] border-b border-co-border pb-[clamp(36px,4.4vw,60px)] last:border-b-0 last:pb-0"
            >
              <div className="grid items-start gap-[clamp(18px,2.4vw,40px)] lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.45fr)]">
                <div className="relative aspect-[3/2] overflow-hidden bg-co-hero-bg">
                  <Image
                    src={lead}
                    alt={`${project.name} — completed fit-out`}
                    fill
                    sizes="(min-width: 1024px) 64vw, 100vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                </div>
                <div>
                  {project.city ? (
                    <p className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-co-faint">
                      {project.city}
                    </p>
                  ) : null}
                  <h2 className="mb-3 font-display text-[clamp(24px,2.6vw,34px)] font-medium tracking-tight">
                    {project.name}
                  </h2>
                  <p className="text-[15.5px] font-light leading-relaxed text-co-muted">
                    {project.delivered}
                  </p>
                </div>
              </div>

              {rest.length > 0 ? (
                <ul className="grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4">
                  {rest.map((image, i) => (
                    <li key={image} className="relative aspect-[4/3] overflow-hidden bg-co-hero-bg">
                      <Image
                        src={image}
                        alt={`${project.name} — view ${i + 2}`}
                        fill
                        sizes="(min-width: 640px) 22vw, 45vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </section>

      <CtaBand
        heading="Your floor could be the next one."
        body="Send the plan and the headcount. We will come back with test-fits and a costed schedule."
        buttonLabel="Start an enquiry"
      />
    </div>
  );
}
