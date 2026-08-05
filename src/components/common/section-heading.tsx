import Link from "next/link";
import { cn } from "@/lib/utils";

import { Reveal } from "@/components/ui/scroll-reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  linkHref,
  linkLabel,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-11",
        className,
      )}
    >
      <div>
        <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
          {eyebrow}
        </p>
        <h2
          className={cn(
            "max-w-[22ch] font-display text-[28px] font-medium leading-[1.05] tracking-tight sm:text-[36px] lg:text-[46px]",
            titleClassName,
          )}
        >
          {title}
        </h2>
      </div>
      {linkHref && linkLabel ? (
        <Link
          href={linkHref}
          className="border-b-[1.5px] border-co-green pb-0.5 text-[15px] font-semibold text-co-ink hover:text-co-green"
        >
          {linkLabel} →
        </Link>
      ) : null}
    </Reveal>
  );
}
