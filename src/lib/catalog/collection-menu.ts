import type { SeriesDefinition } from "@/lib/series";
import { pieceSizeLabel, type Piece } from "./piece-schema";
import { isPhotographed, type Collection } from "./types";

/**
 * Everything on /collections, grouped the way the 2026 catalogue groups it — PM x
 * Cohuman, then the workstation systems, then seating — and read by three places: the
 * header's Collections panel, the /collections page and the homepage. One builder, so
 * the three can never list different things.
 */

export interface CollectionItem {
  slug: string;
  title: string;
  /** One quiet line under the title: a catalogue size where there is one, else the type. */
  line: string;
  href: string;
  image: string;
  imageAlt: string;
  /** `cutout`: a render on white, multiplied onto the frame. `scene`: a room, cropped. */
  imageKind: "cutout" | "scene";
}

export interface CollectionGroup {
  id: "pm-x-cohuman" | "workstations" | "seating";
  label: string;
  blurb: string;
  items: CollectionItem[];
}

/** The photograph a desking system is shown by, when the collection has none of its own. */
const SYSTEM_PHOTO: Record<string, { src: string; alt: string }> = {
  pros: { src: "/pros/office.jpg", alt: "Stretch S desks with screens on an open office floor" },
  varidex: { src: "/varidex/office.jpg", alt: "Stretch V desks with screens beside a window" },
};

function pieceItem(piece: Piece): CollectionItem {
  const card = piece.views[0];
  return {
    slug: piece.slug,
    title: piece.name,
    line: piece.size ? pieceSizeLabel(piece.size) : piece.parts ? piece.parts.map((p) => p.label).join(" · ") : piece.type,
    href: `/products/${piece.slug}`,
    image: card.src,
    imageAlt: card.alt,
    imageKind: "cutout",
  };
}

function systemItem(collection: Collection, series: SeriesDefinition | undefined): CollectionItem | null {
  const href = `/collections/${collection.slug}`;
  const title = series?.wordmark ?? collection.wordmark ?? collection.name;
  const own = SYSTEM_PHOTO[collection.slug];
  if (own) {
    return { slug: collection.slug, title, line: collection.kicker, href, image: own.src, imageAlt: own.alt, imageKind: "scene" };
  }
  if (!isPhotographed(collection)) return null;
  const photo = collection.photos.find((p) => p.kind === "scene") ?? collection.photos[0];
  return {
    slug: collection.slug,
    title,
    line: collection.kicker,
    href,
    image: photo.src,
    imageAlt: photo.alt,
    imageKind: photo.kind,
  };
}

export function buildCollectionMenu({
  collections,
  pieces,
  series,
}: {
  collections: Collection[];
  pieces: Piece[];
  series: readonly SeriesDefinition[];
}): CollectionGroup[] {
  const bySlug = new Map(series.map((s) => [s.slug, s]));
  const systems = collections
    .map((c) => systemItem(c, bySlug.get(c.slug)))
    .filter((item): item is CollectionItem => item !== null);

  const groups: CollectionGroup[] = [
    {
      id: "pm-x-cohuman",
      label: "PM x Cohuman",
      blurb: "Executive desks, lounge seating, coffee tables and storage, designed in collaboration for Cohuman.",
      items: pieces.filter((p) => p.group === "pm-x-cohuman").map(pieceItem),
    },
    {
      id: "workstations",
      label: "Workstations",
      blurb: "Table systems for open-plan desks, meeting rooms and private cabins, each built around its own leg.",
      // The configurable and photographed systems, then the systems drawn as fixed pieces.
      items: [...systems, ...pieces.filter((p) => p.group === "workstations").map(pieceItem)],
    },
    {
      id: "seating",
      label: "Seating",
      blurb: "Office chairs for the workspace and the cabin.",
      items: pieces.filter((p) => p.group === "seating").map(pieceItem),
    },
  ];
  return groups.filter((group) => group.items.length > 0);
}
