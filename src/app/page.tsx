import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/common/cta-band";
import { SectionHeading } from "@/components/common/section-heading";
import { FilmBand, FilmIntro } from "@/components/home/film-intro";
import { HeroCarousel, type HeroPanel } from "@/components/home/hero-carousel";
import { SignalHeroPanel } from "@/components/home/signal-hero";
import { SpaceTiles } from "@/components/home/space-tiles";
import { SystemsIndex, type SystemRow } from "@/components/home/systems-index";
import { Button } from "@/components/ui/button";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { IndexRow } from "@/components/ui/index-row";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { catalog } from "@/lib/catalog";
import { COMPARE_FILM, HERO_FILMS, LEAD_FILM, type HeroFilm } from "@/lib/hero-films";
import { publicFileExists } from "@/lib/public-assets";
import { PROS_SERIES, VARIDEX_SERIES, spanLabel, type SeriesConfig, type SeriesDefinition } from "@/lib/series";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/*
  The homepage declares its own canonical rather than leaning on the root layout, which
  no longer sets one — every route now states its own. Title and description come from
  the layout defaults, which are already written for this page.
*/
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** The hero's measured object: STRETCH V's four-seat face-to-face bench. */
const HERO_CONFIG_SLUG = "face-to-face-short";

/** Meeting tables across both chassis — the rows the "Meeting" system spans. */
const isMeetingConfig = (slug: string) => slug.startsWith("meet") || slug === "square";

function defaultImage(series: SeriesDefinition): string | undefined {
  return series.configs.find((c) => c.slug === series.defaultConfigSlug)?.image;
}

/**
 * The systems index, built from data rather than written as copy: the STRETCH S, STRETCH V
 * and Meeting ranges are `spanLabel` over the real configurations, so the homepage can
 * never quote a size the configurator does not offer. Systems without a measured range
 * say what they are instead of inventing one.
 */
function systemRows(): SystemRow[] {
  const meeting = [...PROS_SERIES.configs, ...VARIDEX_SERIES.configs].filter((c) =>
    isMeetingConfig(c.slug),
  );

  return [
    {
      n: "01",
      title: PROS_SERIES.wordmark,
      type: PROS_SERIES.eyebrow,
      range: spanLabel(PROS_SERIES.configs),
      href: `/collections/${PROS_SERIES.slug}`,
      image: defaultImage(PROS_SERIES),
    },
    {
      n: "02",
      title: VARIDEX_SERIES.wordmark,
      type: VARIDEX_SERIES.eyebrow,
      range: spanLabel(VARIDEX_SERIES.configs),
      href: `/collections/${VARIDEX_SERIES.slug}`,
      image: defaultImage(VARIDEX_SERIES),
    },
    {
      n: "03",
      // The client's name for the cabin system; it has no series data yet, so it links to
      // the executive sector and states what it is rather than a measured range.
      title: "STRETCH F",
      type: "Manager and director rooms",
      range: "Desk + storage + seating",
      href: "/sectors/executive",
      image: "/pros/manager-cabinet.jpg",
    },
    {
      n: "04",
      title: "Meeting",
      type: "Square, round and boardroom tables",
      range: spanLabel(meeting),
      href: "/solutions",
      image: "/pros/meet-long.jpg",
    },
    {
      n: "05",
      title: "Seating",
      type: "Task, executive, visitor",
      range: "Price on request",
      quoteSubject: "Seating",
    },
    {
      n: "06",
      title: "Storage",
      type: "Pedestals, side cabinets, credenzas",
      range: "Price on request",
      quoteSubject: "Storage",
    },
  ];
}

/**
 * A film as it can actually play: a missing video file leaves the poster as a still.
 * Checked on the server, so the client never requests a file that is not there.
 */
function playable(film: HeroFilm): HeroFilm {
  if (!film.video || !publicFileExists(film.video.mp4)) return { ...film, video: undefined };
  const webm = film.video.webm && publicFileExists(film.video.webm) ? film.video.webm : undefined;
  return { ...film, video: { mp4: film.video.mp4, webm } };
}

/**
 * The hero's panels, in order: the lead film carrying the page's claim (when its poster
 * exists), the previous film design for the client to compare against it, then the
 * measured bench, then any further films. Without the lead film the
 * measured panel opens the hero and keeps the H1.
 */
function heroPanels(config: SeriesConfig): HeroPanel[] {
  const lead = publicFileExists(LEAD_FILM.poster) ? playable(LEAD_FILM) : null;
  const compare = lead && publicFileExists(COMPARE_FILM.poster) ? playable(COMPARE_FILM) : null;
  const films = HERO_FILMS.filter((film) => publicFileExists(film.poster)).map(playable);
  return [
    ...(lead ? [{ kind: "film" as const, film: lead, overlay: <FilmIntro /> }] : []),
    ...(compare ? [{ kind: "film" as const, film: compare, overlay: <FilmBand /> }] : []),
    {
      kind: "content" as const,
      label: "Index",
      node: <SignalHeroPanel series={VARIDEX_SERIES} config={config} lead={!lead} />,
    },
    ...films.map((film) => ({ kind: "film" as const, film })),
  ];
}

export default async function HomePage() {
  const [spaces, services, projects] = await Promise.all([
    catalog.getSpaces(),
    catalog.getServices(),
    catalog.getProjects(),
  ]);

  const heroConfig =
    VARIDEX_SERIES.configs.find((c) => c.slug === HERO_CONFIG_SLUG) ?? VARIDEX_SERIES.configs[0];
  const featured = projects.slice(0, 3);
  const showroom = siteConfig.suratPhotos.find((photo) => publicFileExists(photo.src));

  // Figure numbers run down the page like a drawing set: hero 01, spaces 02–05, …
  const firstProjectFigure = 2 + spaces.length;
  const showroomFigure = firstProjectFigure + featured.length;

  return (
    <div>
      <HeroCarousel panels={heroPanels(heroConfig)} />

      {/* 01 — Systems: every system as a row you can scan like a parts list. */}
      <section className="co-shell co-section">
        <SectionHeading
          eyebrow="01 / Systems"
          title="Two chassis. Every table."
          blurb="Both desking systems run at 720mm, so tops sit flush wherever two configurations meet. Pick a system, then a configuration, a length and a depth."
          linkHref="/collections"
          linkLabel="All collections"
          className="mb-0 border-b-0"
        />
        <Reveal>
          <SystemsIndex rows={systemRows()} />
        </Reveal>
      </section>

      <SpaceTiles spaces={spaces} firstFigure={2} />

      {/* 03 — Projects */}
      <section className="co-shell co-section">
        <SectionHeading
          eyebrow="03 / Projects"
          title="Floors we’ve finished."
          blurb="Drawn, made and installed by us — photographed on site after handover."
          linkHref="/projects"
          linkLabel="All projects"
        />
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr] md:grid-rows-[auto_auto]">
          {featured.map((pr, i) => (
            <StaggerItem key={pr.slug} className={cn(i === 0 && "md:row-span-2")}>
              <Link href="/projects" className="group flex h-full flex-col">
                <figure className="flex h-full flex-col">
                  <ClipReveal
                    className={cn(
                      "border border-co-border bg-co-bg-alt",
                      i === 0 ? "aspect-[4/3] md:aspect-auto md:min-h-[520px] md:flex-1" : "aspect-[4/3]",
                    )}
                  >
                    <Image
                      src={pr.images[0]}
                      alt={`${pr.name} — completed fit-out`}
                      fill
                      sizes={i === 0 ? "(min-width: 768px) 62vw, 100vw" : "(min-width: 768px) 31vw, 100vw"}
                      className="co-highkey object-cover"
                    />
                  </ClipReveal>
                  <FigureCaption n={firstProjectFigure + i} className="mt-3">
                    {pr.name}
                    {pr.city ? `, ${pr.city}` : ""}
                  </FigureCaption>
                </figure>
                <p className="mt-2 line-clamp-2 max-w-[56ch] text-[14px] leading-relaxed text-co-muted">
                  {pr.delivered}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 04 — Scope: the services as index rows. */}
      <section className="co-shell co-section">
        <SectionHeading
          eyebrow="04 / Scope"
          title="The whole fit-out."
          blurb="Most clients come to us with a floor plate and a headcount. We take it from there — layout, specification, manufacture, install, and a service contract that keeps it all working."
          linkHref="/services"
          linkLabel="Our services"
          className="mb-0"
        />
        <Reveal>
          {services.map((sv) => (
            <IndexRow
              key={sv.num}
              n={sv.num}
              title={sv.name}
              type={sv.blurb}
              range={sv.deliverables[0]}
              href="/services"
            />
          ))}
        </Reveal>
      </section>

      {/* 05 — Showroom visit */}
      <section className="border-t border-co-ink bg-co-bg-alt">
        <div
          className={cn(
            "co-shell co-section grid grid-cols-1 items-center gap-x-[clamp(28px,5vw,96px)] gap-y-10",
            showroom && "lg:grid-cols-[1.1fr_1fr]",
          )}
        >
          {showroom ? (
            <figure className="relative">
              <RegistrationCross className="-left-2 -top-2 z-10" />
              <ClipReveal className="aspect-[16/10] border border-co-border">
                <Image
                  src={showroom.src}
                  alt={showroom.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="co-highkey object-cover"
                />
              </ClipReveal>
              <div className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1">
                <FigureCaption n={showroomFigure} as="span">
                  {showroom.caption}
                </FigureCaption>
                <span className="co-data text-co-muted-2">{siteConfig.coordinates.label}</span>
              </div>
            </figure>
          ) : null}

          <Reveal>
            <p className="co-eyebrow">05 / Showroom</p>
            <h2 className="co-h2 mt-5 max-w-[14ch]">Sit on it before you specify it.</h2>
            <p className="co-lead mt-6 max-w-[40ch]">
              Both desking systems are set up on Hazira Road, in Surat. Bring the floor plan —
              we will lay the configurations out at the sizes you are considering.
            </p>
            <p className="co-data mt-6 text-co-ink">{siteConfig.address.line1}</p>
            <p className="co-data text-co-muted-2">{siteConfig.address.line2}</p>
            <Button asChild variant="secondary" className="mt-8">
              <Link href="/contact">Book a showroom visit</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <CtaBand
        tone="light"
        heading="Send us your floor plan."
        body={`Get a costed proposal back — no cart, no checkout, a real specification from a real person, usually inside ${siteConfig.enquiryTurnaround}.`}
      />
    </div>
  );
}
