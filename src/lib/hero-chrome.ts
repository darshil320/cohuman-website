import { useSyncExternalStore } from "react";

/**
 * What the site header needs to know about a full-bleed hero underneath it.
 *
 * The homepage hero runs edge to edge behind the header. While the two overlap the header
 * drops its canvas ground and goes transparent, and on a dark panel (a film) it switches
 * to light type and the reversed logo. The hero publishes this; the header subscribes.
 * A module-level store rather than context, because the header sits outside the page tree
 * that renders the hero.
 *
 * `overHero` is false on the server and on every route without a hero, so the header's
 * server HTML is always the solid bar.
 */
export interface HeroChrome {
  overHero: boolean;
  tone: "light" | "dark";
}

const SERVER_STATE: HeroChrome = { overHero: false, tone: "light" };

let state: HeroChrome = SERVER_STATE;
const listeners = new Set<() => void>();

export function setHeroChrome(next: Partial<HeroChrome>): void {
  const merged = { ...state, ...next };
  if (merged.overHero === state.overHero && merged.tone === state.tone) return;
  state = merged;
  for (const listener of listeners) listener();
}

export function resetHeroChrome(): void {
  setHeroChrome(SERVER_STATE);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useHeroChrome(): HeroChrome {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
}
