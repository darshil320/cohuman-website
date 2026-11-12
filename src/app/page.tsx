import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { BuildWorkstation } from "@/components/home/build-workstation";
import { FilmIntro } from "@/components/home/film-intro";
import { HeroCarousel, type HeroPanel } from "@/components/home/hero-carousel";
import { SignalHeroPanel } from "@/components/home/signal-hero";
import { SpaceTiles } from "@/components/home/space-tiles";
import { VisitAndEnquire } from "@/components/home/visit-and-enquire";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { CollectionCard } from "@/components/collections/collection-card";
import { catalog, pieceLeadImage, type Piece } from "@/lib/catalog";
import { buildCollectionMenu, type CollectionItem } from "@/lib/catalog/collection-menu";
import { LEAD_FILM, type HeroFilm } from "@/lib/hero-films";
import { publicFileExists } from "@/lib/public-assets";
import { ALL_SERIES, VARIDEX_SERIES, type SeriesConfig } from "@/lib/series";
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
const HERO_CONFIG_SLUG = "face-to-face";

/**
 * PM x Cohuman on the homepage: each piece in its room, not on white — the scene is what
 * sells a designer piece. Same card as everywhere else, with the room shot swapped in.
 */
function designerItems(pieces: Piece[]): CollectionItem[] {
  return pieces
    .filter((piece) => piece.group === "pm-x-cohuman")
    .map((piece) => {
      const lead = pieceLeadImage(piece);
      return {
        slug: piece.slug,
        title: piece.name,
        line: piece.type,
        href: `/products/${piece.slug}`,
        image: lead.src,
        imageAlt: lead.alt,
        imageKind: lead.kind,
      };
    });
}

/** The product the lead film shows: ARQ, from PM x Cohuman. */
const HERO_PRODUCT = { name: "ARQ executive desk", href: "/products/arq" };

/**
 * A film as it can actually play: a missing video file leaves the poster as a still.
 * Checked on the server, so the client never requests a file that is not there.
 */
function playable(film: HeroFilm): HeroFilm {
  return { ...film, video: playableVideo(film.video), mobile: playableMobile(film.mobile) };
}

function playableVideo(video: HeroFilm["video"]): HeroFilm["video"] {
  if (!video || !publicFileExists(video.mp4)) return undefined;
  const webm = video.webm && publicFileExists(video.webm) ? video.webm : undefined;
  return { mp4: video.mp4, webm };
}

/** The portrait cut survives only if its poster exists; its video follows the same rule. */
function playableMobile(mobile: HeroFilm["mobile"]): HeroFilm["mobile"] {
  if (!mobile || !publicFileExists(mobile.poster)) return undefined;
  return { poster: mobile.poster, video: playableVideo(mobile.video) };
}

/**
 * The hero: the lead film alone, carrying the page's claim. The Nov 2026 review removed
 * the panel selector and the comparison film. Without the lead film's poster, the
 * measured panel opens the hero instead and keeps the H1.
 */
function heroPanels(config: SeriesConfig): HeroPanel[] {
  if (publicFileExists(LEAD_FILM.poster)) {
    return [{ kind: "film" as const, film: playable(LEAD_FILM), overlay: <FilmIntro product={HERO_PRODUCT} /> }];
  }
  return [
    {
      kind: "content" as const,
      label: "Index",
      node: <SignalHeroPanel series={VARIDEX_SERIES} config={config} lead />,
    },
  ];
}

export default async function HomePage() {
  const [spaces, projects, collections, pieces] = await Promise.all([
    catalog.getSpaces(),
    catalog.getProjects(),
    catalog.getCollections(),
    catalog.getPieces(),
  ]);
  const groups = buildCollectionMenu({ collections, pieces, series: ALL_SERIES });
  const systems = groups.flatMap((g) => (g.id === "workstations" || g.id === "seating" ? g.items : []));

  const heroConfig =
    VARIDEX_SERIES.configs.find((c) => c.slug === HERO_CONFIG_SLUG) ?? VARIDEX_SERIES.configs[0];
  const featured = projects.slice(0, 3);

  // Figure numbers run down the page like a drawing set: hero 01, spaces 02–05, …
  const firstProjectFigure = 2 + spaces.length;

  return (
    <div>
      <HeroCarousel panels={heroPanels(heroConfig)} />

      {/* 01 — PM x Cohuman: the designer pieces, each in its room. Catalogue order. */}
      <section className="co-shell co-section">
        <SectionHeading
          layout="stacked"
          eyebrow="01 / PM x Cohuman"
          title="Designed in collaboration."
          blurb="Executive desks, lounge seating, a coffee table and a library, designed for Cohuman."
          linkHref="/collections#pm-x-cohuman"
          linkLabel="All PM x Cohuman"
        />
        <PictureGrid items={designerItems(pieces)} />
      </section>

      {/* 02 — Systems and seating: one photograph each, in the catalogue's order. */}
      <section className="co-shell co-section">
        <SectionHeading
          layout="stacked"
          eyebrow="02 / Systems"
          title="One system, multiple possibilities."
          blurb="Each system is built around its own leg; tops, sizes and layouts vary within it."
          linkHref="/collections#workstations"
          linkLabel="All workstations"
        />
        <PictureGrid items={systems} />
      </section>

      <SpaceTiles spaces={spaces} eyebrow="03 / Spaces" firstFigure={2} />

      {/* 03 — Projects */}
      <section className="co-shell co-section">
        <SectionHeading
          layout="stacked"
          eyebrow="04 / Projects"
          title="Floors we’ve finished."
          blurb="Drawn, made and installed by us, photographed on site after handover."
          linkHref="/projects"
          linkLabel="All projects"
        />
        {/* A swipe rail on phones (`co-rail`); the lead project and two beside it from md. */}
        <StaggerContainer className="co-rail md:grid md:grid-cols-[2fr_1fr] md:grid-rows-[auto_auto] md:gap-6">
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
                      sizes={i === 0 ? "(min-width: 768px) 62vw, 80vw" : "(min-width: 768px) 31vw, 80vw"}
                      quality={90}
                      className="object-cover"
                    />
                  </ClipReveal>
                  <FigureCaption n={firstProjectFigure + i} className="mt-3">
                    {pr.name}
                    {pr.city ? `, ${pr.city}` : ""}
                  </FigureCaption>
                </figure>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <BuildWorkstation eyebrow="05 / Build" />

      <VisitAndEnquire eyebrow="06 / Visit" />
    </div>
  );
}

/** Four across from `lg`, a swipe rail on phones — pictures first, a name and a line. */
function PictureGrid({ items }: { items: CollectionItem[] }) {
  return (
    <ul className="co-rail list-none p-0 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.slug}>
          <CollectionCard item={item} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 80vw" />
        </li>
      ))}
    </ul>
  );
}
