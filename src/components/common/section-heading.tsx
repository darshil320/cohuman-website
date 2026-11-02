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
  className,
  titleClassName,
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <Reveal
      className={cn(
        "mb-[clamp(32px,3.4vw,48px)] grid grid-cols-1 items-end gap-x-[clamp(20px,2.5vw,40px)] gap-y-4 border-b pb-[clamp(20px,2vw,28px)] lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,420px)]",
        dark ? "border-co-panel-fg" : "border-co-ink",
        className,
      )}
    >
      <p className={cn("co-eyebrow lg:pb-1.5", dark && "text-co-panel-faint")}>{eyebrow}</p>
      <h2 className={cn("co-h2 max-w-[18ch]", dark && "text-co-panel-fg", titleClassName)}>{title}</h2>

      {blurb || (linkHref && linkLabel) ? (
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
      ) : (
        <span aria-hidden className="hidden lg:block" />
      )}
    </Reveal>
  );
}
