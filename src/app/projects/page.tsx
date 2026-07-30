import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { CtaBand } from "@/components/common/cta-band";
import { catalog } from "@/lib/catalog";
import { projectPhoto } from "@/lib/stock-photos";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Recent Cohuman fit-outs across corporate, legal, education, research and coworking spaces.",
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
            A selection of recent fit-outs across corporate, legal, education, research and
            coworking. Client names and photography are shared with permission — details marked
            to be confirmed are awaiting sign-off.
          </p>
        </div>
      </section>

      {/*
        PLACEHOLDER GALLERY — these are illustrative case studies from the original
        demo, not real Cohuman projects. Swap for confirmed client work (with
        permission to publish) before launch.
      */}
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-[clamp(22px,2.6vw,38px)] px-[18px] py-[clamp(40px,5vw,72px)] pb-[clamp(64px,8vw,100px)] sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-11">
        {projects.map((pr) => (
          <article key={pr.slug} className="group flex flex-col">
            <div className="relative aspect-[4/3] overflow-hidden bg-co-hero-bg">
              <ImagePlaceholder
                hint={pr.slotHint}
                alt={pr.name}
                src={projectPhoto[pr.slug]}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mb-1.5 mt-[18px] text-[11.5px] font-semibold uppercase tracking-[0.16em] text-co-faint">
              {pr.sector} · {pr.city}
            </p>
            <h2 className="mb-2.5 font-display text-[clamp(22px,2.2vw,28px)] font-medium tracking-tight">
              {pr.name}
            </h2>
            <p className="mb-3.5 text-[15.5px] font-light leading-relaxed text-co-muted">
              {pr.scope}
            </p>
            <blockquote className="mb-4 border-l-2 border-co-green pl-4 font-display text-[16.5px] font-normal leading-tight text-co-ink-soft">
              {pr.quote}
            </blockquote>
            <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1.5 border-t border-co-border pt-3.5 text-[13.5px] text-co-muted-2">
              <span>{pr.meta}</span>
              <span className="text-co-faint">{pr.collections}</span>
            </div>
          </article>
        ))}
      </section>

      <CtaBand
        heading="Your floor could be the next one."
        body="Send the plan and the headcount. We will come back with test-fits and a costed schedule."
        buttonLabel="Start an enquiry"
      />
    </div>
  );
}
