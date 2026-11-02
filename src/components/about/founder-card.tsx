import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { RegistrationCross } from "@/components/ui/registration-cross";
import type { Founder } from "@/lib/catalog";

/**
 * One co-founder, as a figure on a drawing sheet.
 *
 * Square photo frame with a registration cross and a figure caption ("Fig. 0X — Name,
 * Role"), the name in display caps, role and focus areas in mono, the bio in Archivo.
 * The photograph is shown as supplied — no high-key grade, which is for interiors, not
 * people. Where no photo has been supplied the frame stays, labelled, and empty: never a
 * stock face.
 */
export function FounderCard({ founder, figure }: { founder: Founder; figure: number }) {
  return (
    <article className="flex flex-col">
      <figure>
        <div className="relative">
          {founder.photo ? (
            <ClipReveal className="aspect-square border border-co-border bg-co-bg-alt">
              <Image
                src={founder.photo.src}
                alt={founder.photo.alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
            </ClipReveal>
          ) : (
            <div
              role="img"
              aria-label={`Photograph of ${founder.name} to follow`}
              className="flex aspect-square items-end border border-co-border bg-co-bg-alt p-4"
            >
              <span className="co-eyebrow">Photograph to follow</span>
            </div>
          )}
          <RegistrationCross className="-left-2 -top-2 z-10 text-co-ink" />
        </div>
        <FigureCaption n={figure} className="mt-3">
          {founder.name}, {founder.role}
        </FigureCaption>
      </figure>

      <h3 className="co-h2 mt-7 border-t border-co-ink pt-5">{founder.name}</h3>
      <p className="co-data mt-3">{founder.role}</p>
      <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.55] text-co-ink-soft">{founder.bio}</p>

      {founder.quote ? (
        <blockquote className="mt-6 border-l-2 border-co-ink pl-4 text-[17px] leading-[1.45] text-co-ink">
          “{founder.quote}”
        </blockquote>
      ) : null}

      <div className="mt-6">
        <p className="co-eyebrow mb-2.5">Focus</p>
        <ul className="flex flex-wrap gap-2">
          {founder.focus.map((area) => (
            <li key={area} className="co-data border border-co-ink px-2.5 py-1">
              {area}
            </li>
          ))}
        </ul>
      </div>

      {founder.linkedin ? (
        <Button asChild variant="link" arrow className="mt-6 self-start">
          <a href={founder.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn<span className="sr-only"> — {founder.name} (opens in a new tab)</span>
          </a>
        </Button>
      ) : null}
    </article>
  );
}
