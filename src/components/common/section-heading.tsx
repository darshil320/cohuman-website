import Link from "next/link";
import { cn } from "@/lib/utils";

import { Reveal } from "@/components/ui/scroll-reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Optional standfirst set beside the title, as the reference sets its section copy. */
  blurb?: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
  titleClassName?: string;
}

/**
 * Section opener used across the site.
 *
 * Title left, optional standfirst and link right, on the shared type scale — so every
 * section on every route opens at exactly the same size and tracking.
 */
export function SectionHeading({
  eyebrow,
  title,
  blurb,
  linkHref,
  linkLabel,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-[clamp(34px,4.4vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-end gap-x-[clamp(20px,3vw,48px)] gap-y-6",
        className,
      )}
    >
      <div>
        <p className="co-eyebrow mb-4">{eyebrow}</p>
        <h2 className={cn("co-h2 max-w-[20ch]", titleClassName)}>{title}</h2>
      </div>

      {blurb || (linkHref && linkLabel) ? (
        <div className="flex flex-col items-start gap-5 lg:items-end">
          {blurb ? <p className="co-lead max-w-[46ch] lg:text-right">{blurb}</p> : null}
          {linkHref && linkLabel ? (
            <Link
              href={linkHref}
              className="group inline-flex items-center gap-2.5 border-b-2 border-co-ink pb-1.5 text-[14px] font-semibold text-co-ink transition-colors hover:border-co-placeholder hover:text-co-muted"
            >
              {linkLabel}
              <svg
                aria-hidden
                width="13"
                height="9"
                viewBox="0 0 13 9"
                fill="none"
                className="transition-transform duration-300 ease-[var(--ease-co)] group-hover:translate-x-1"
              >
                <path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
          ) : null}
        </div>
      ) : null}
    </Reveal>
  );
}
