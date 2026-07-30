import type { Metadata } from "next";
import { EnquireButton } from "@/components/common/enquire-button";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Space planning, turnkey fit-out, delivery & installation, and AMC aftercare — the whole fit-out, not just the furniture.",
};

export default async function ServicesPage() {
  const services = await catalog.getServices();

  return (
    <div>
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,78px)] sm:px-6 lg:px-11">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            Services
          </p>
          <h1 className="mb-4 max-w-[20ch] font-display text-[clamp(34px,5vw,62px)] font-medium leading-[1.02] tracking-tight">
            We do the drawings, the making and the aftercare.
          </h1>
          <p className="max-w-[58ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
            Furniture is the easy part. The value is in getting the layout right first and
            keeping it working for a decade afterwards.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,84px)] pb-[clamp(64px,8vw,100px)] sm:px-6 lg:px-11">
        {services.map((sv) => (
          <div
            key={sv.num}
            className="grid grid-cols-1 items-start gap-6 border-b border-co-border py-[clamp(30px,4vw,48px)] first:pt-0 last:border-b-0 lg:grid-cols-[280px_1fr] lg:gap-14"
          >
            <div>
              <p className="mb-3.5 font-display text-[13px] font-semibold tracking-wide text-co-green">
                {sv.num}
              </p>
              <h2 className="mb-3 max-w-[16ch] font-display text-[clamp(26px,3vw,38px)] font-medium leading-[1.05] tracking-tight">
                {sv.name}
              </h2>
              <p className="max-w-[36ch] text-base font-light leading-relaxed text-co-muted-2">
                {sv.blurb}
              </p>
            </div>
            <div>
              <p className="mb-[22px] max-w-none text-[clamp(16px,1.4vw,18px)] font-light leading-[1.6] text-co-ink-soft">
                {sv.detail}
              </p>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
                What is included
              </p>
              <div className="mb-6 grid gap-2">
                {sv.deliverables.map((d) => (
                  <div key={d} className="flex items-baseline gap-3">
                    <span className="mt-[-2px] h-[5px] w-[5px] shrink-0 bg-co-green" />
                    <span className="text-[15px] font-light leading-relaxed text-co-ink-soft">
                      {d}
                    </span>
                  </div>
                ))}
              </div>
              <EnquireButton variant="outline" subject={sv.name}>
                Enquire about {sv.name}
              </EnquireButton>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
