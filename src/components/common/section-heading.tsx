import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** The mono section number and name, e.g. "01 / Systems". */
  eyebrow: string;
  title: string;
  /** Optional standfirst, set in the right-hand column. */
  blurb?: string;
  linkHref?: string;
  linkLabel?: string;
  /** `dark` for a section on the ink block. */
  tone?: "light" | "dark";
  /**
   * `columns` (default): label | title | standfirst on one baseline.
   * `stacked` (homepage): label, title and a short description under it on the left,
   * the link on the right — the client's Nov 2026 layout.
   */
  layout?: "columns" | "stacked";
  className?: string;
  titleClassName?: string;
}

/**
 * Section opener — the moodboard's `.sec-h`.
 *
 * Three columns on one baseline — mono label, display-caps title, standfirst — closed by
 * a 1px rule the full width of the shell. Every section on every route opens with it, so
 * the site reads as one drawing set. On phones the three stack.
 */
export function SectionHeading({
  eyebrow,
  title,
  blurb,
  linkHref,
  linkLabel,
  tone = "light",
  layout = "columns",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  if (layout === "stacked") {
    return (
      <StackedHeading
        eyebrow={eyebrow}
        title={title}
        blurb={blurb}
        linkHref={linkHref}
        linkLabel={linkLabel}
        dark={dark}
        className={className}
        titleClassName={titleClassName}
      />
    );
  }
  const hasAside = Boolean(blurb || (linkHref && linkLabel));

  return (
    <Reveal
      className={cn(
        "mb-[clamp(32px,3.4vw,48px)] grid grid-cols-1 items-end gap-x-[clamp(20px,2.5vw,40px)] gap-y-4 border-b pb-[clamp(20px,2vw,28px)] lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,420px)]",
        dark ? "border-co-panel-fg" : "border-co-ink",
        className,
      )}
    >
      <p className={cn("co-eyebrow lg:pb-1.5", dark && "text-co-panel-faint")}>{eyebrow}</p>
      {/*
        With no standfirst or link, the title takes both remaining columns and a 24ch
        measure; capped at 18ch beside a standfirst. Short titles (six words or fewer)
        keep either from stacking into four lines of capitals.
      */}
      <h2
        className={cn(
          "co-h2",
          hasAside ? "max-w-[18ch]" : "max-w-[24ch] lg:col-span-2",
          dark && "text-co-panel-fg",
          titleClassName,
        )}
      >
        {title}
      </h2>

      {hasAside ? (
        <div className="flex flex-col items-start gap-4 lg:pb-1">
          {blurb ? (
            <p
              className={cn(
                "max-w-[46ch] text-[15px] leading-[1.55]",
                dark ? "text-co-panel-muted" : "text-co-ink-soft",
              )}
            >
              {blurb}
            </p>
          ) : null}
          {linkHref && linkLabel ? (
            <Button asChild variant={dark ? "linkOnDark" : "link"} arrow>
              <Link href={linkHref}>{linkLabel}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </Reveal>
  );
}

/**
 * The stacked opener: a small mono label, the title, a short description under the
 * title, and the section's link on the right, closed by the same full-width rule. On
 * phones the link drops under the description.
 */
function StackedHeading({
  eyebrow,
  title,
  blurb,
  linkHref,
  linkLabel,
  dark,
  className,
  titleClassName,
}: Omit<SectionHeadingProps, "tone" | "layout"> & { dark: boolean }) {
  return (
    <Reveal
      className={cn(
        "mb-[clamp(32px,3.4vw,48px)] grid grid-cols-1 items-end gap-x-[clamp(20px,2.5vw,40px)] gap-y-6 border-b pb-[clamp(20px,2vw,28px)] lg:grid-cols-[minmax(0,1fr)_auto]",
        dark ? "border-co-panel-fg" : "border-co-ink",
        className,
      )}
    >
      <div>
        <p className={cn("co-eyebrow", dark && "text-co-panel-faint")}>{eyebrow}</p>
        <h2 className={cn("co-h2 mt-4 max-w-[24ch]", dark && "text-co-panel-fg", titleClassName)}>
          {title}
        </h2>
        {blurb ? (
          <p
            className={cn(
              "mt-4 max-w-[56ch] text-[15px] leading-[1.55]",
              dark ? "text-co-panel-muted" : "text-co-ink-soft",
            )}
          >
            {blurb}
          </p>
        ) : null}
      </div>
      {linkHref && linkLabel ? (
        <div className="lg:pb-1">
          <Button asChild variant={dark ? "linkOnDark" : "link"} arrow>
            <Link href={linkHref}>{linkLabel}</Link>
          </Button>
        </div>
      ) : null}
    </Reveal>
  );
}
