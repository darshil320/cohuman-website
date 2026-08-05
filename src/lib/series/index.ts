export * from "./types";
export * from "./derive";

import { PROS_SERIES } from "./pros";
import type { SeriesDefinition } from "./types";
import { VARIDEX_SERIES } from "./varidex";

/**
 * Every desking series, in the order they appear on /collections. Each one is served at
 * /collections/<slug> by the shared series PDP — adding a series means adding a
 * definition here plus a matching entry in src/data/collections.json.
 */
export const ALL_SERIES: SeriesDefinition[] = [PROS_SERIES, VARIDEX_SERIES];

export function findSeries(slug: string): SeriesDefinition | null {
  return ALL_SERIES.find((series) => series.slug === slug) ?? null;
}

export function seriesSlugs(): string[] {
  return ALL_SERIES.map((series) => series.slug);
}

export { PROS_SERIES, VARIDEX_SERIES };
