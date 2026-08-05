import type { Metadata } from "next";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { EnquireButton } from "@/components/common/enquire-button";
import { catalog } from "@/lib/catalog";
import { spacePhoto } from "@/lib/photos";
import { TextReveal } from "@/components/ui/text-reveal";

export const metadata: Metadata = {
  title: "Workspace Solutions",
  description:
    "Specified by the room, not the SKU — cabin, workstation, meeting and lounge furniture schedules from Cohuman.",
};

const PROCESS_STEPS = [
  { num: "01", name: "Plan", blurb: "Your floor plan and headcount become two or three test-fits with real seat counts." },
  { num: "02", name: "Specify", blurb: "Finishes, fabrics and edge details chosen from samples you can hold, not a swatch on a screen." },
  { num: "03", name: "Make & install", blurb: "Manufactured to the schedule, delivered by floor, installed by our own crews." },
  { num: "04", name: "Look after", blurb: "An annual contract, stocked spares, and re-upholstery instead of replacement." },
];

export default async function SolutionsPage() {
  const spaces = await catalog.getSpaces();

  return (
    <div>
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,78px)] sm:px-6 lg:px-11">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            Workspace solutions
          </p>
          <h1 className="mb-4 max-w-[20ch] font-display text-[clamp(34px,5vw,62px)] font-medium leading-[1.02] tracking-tight">
            <TextReveal>Specified by the room, not the SKU.</TextReveal>
          </h1>
          <p className="max-w-[58ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
            Most enquiries start with a room and a headcount rather than a product code. Pick
            the space you are fitting out and we will send back a schedule for it.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1320px] gap-[clamp(34px,4.5vw,62px)] px-[18px] py-[clamp(44px,6vw,84px)] sm:px-6 lg:px-11">
        {spaces.map((sp, i) => (
          <div
            key={sp.slug}
            className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12"
          >
            <div
              className="group relative aspect-[16/11] overflow-hidden bg-co-hero-bg"
              style={{ order: i % 2 === 1 ? 2 : 0 }}
            >
              <ImagePlaceholder
                hint={sp.slotHint}
                alt={sp.name}
                src={spacePhoto[sp.slug]}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div>
              <p className="mb-3.5 font-display text-[12.5px] font-semibold tracking-wide text-co-green">
                {sp.num} · Space type
              </p>
              <h2 className="mb-3.5 font-display text-[clamp(28px,3.4vw,42px)] font-medium leading-[1.05] tracking-tight">
                {sp.name}
              </h2>
              <p className="mb-[22px] max-w-[46ch] text-[clamp(16px,1.4vw,18.5px)] font-light leading-relaxed text-co-muted">
                {sp.blurb}
              </p>
              <div className="mb-6 border-t border-co-border pt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
                  Typically specified
                </p>
                <p className="text-[15px] font-light leading-relaxed text-co-ink-soft">
                  {sp.includes}
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <EnquireButton subject={`${sp.name} — full room schedule`}>
                  Get a {sp.name} schedule
                </EnquireButton>
                <Link
                  href="/catalog"
                  className="border border-co-border-strong px-[22px] py-3 text-[15px] font-semibold text-co-muted hover:border-co-ink hover:bg-co-bg-alt hover:text-co-ink"
                >
                  Browse products
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-co-panel">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
          <h2 className="mb-[clamp(28px,3.5vw,44px)] max-w-[24ch] font-display text-[clamp(25px,3vw,40px)] font-medium leading-[1.08] tracking-tight text-co-panel-fg">
            <TextReveal>How a whole floor comes together.</TextReveal>
          </h2>
          <div className="grid grid-cols-1 gap-px border border-co-panel-border bg-co-panel-border sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((ps) => (
              <div key={ps.num} className="bg-co-panel p-[clamp(24px,3vw,34px)] px-[clamp(20px,2.4vw,28px)]">
                <p className="mb-5 font-display text-[13px] font-semibold tracking-wide text-co-green">
                  {ps.num}
                </p>
                <h3 className="mb-2 font-display text-xl font-medium tracking-tight text-co-panel-fg">
                  {ps.name}
                </h3>
                <p className="text-[14.5px] font-light leading-relaxed text-co-panel-muted">
                  {ps.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
