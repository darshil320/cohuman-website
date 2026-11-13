"use client";

import { useEffect } from "react";

/**
 * The single scroll-reveal observer for the whole document.
 *
 * Every `[data-reveal]` element gets `data-shown` once when it first enters the viewport,
 * which is what starts the paused `co-rule` / `co-clip` / `co-reveal` animations. One
 * observer replaces one framer in-view watcher per component.
 *
 * The `co-js` class this pairs with is NOT set here — it is set by a blocking inline
 * script in the document head (see `layout.tsx`). That ordering is the whole point: the
 * CSS hides an un-shown element only while `html.co-js` is present, so if scripting is
 * off or a chunk fails, nothing is ever hidden. Adding the class from this effect would
 * run after first paint and make content visibly flash out before animating back in.
 *
 * Elements mounted later are picked up because the observer re-queries on every mutation
 * of the subtree it has already seen — cheap, because it only ever observes elements that
 * still lack `data-shown`.
 */
/** Far larger than any page, so "above the viewport" always falls inside the root. */
const SCROLLED_PAST_PX = 100_000;

export function RevealObserver() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      // The huge top margin counts everything ABOVE the viewport as seen. Chrome clips a
      // target by its own clip-path, and a hidden reveal is clipped to a zero-size line at
      // its leading edge (the top edge on phones). When a jump — an anchor link, a fast
      // fling, `scrollIntoView` — carries that edge from below the viewport to above it
      // between two frames, it never intersects the viewport itself, and the content
      // would stay hidden for good. Anything scrolled past is simply shown.
      { rootMargin: `${SCROLLED_PAST_PX}px 0px -10% 0px` },
    );

    const observeAll = () => {
      for (const node of document.querySelectorAll("[data-reveal]:not([data-shown])")) {
        observer.observe(node);
      }
    };

    observeAll();

    // Client navigation swaps the tree without remounting this component.
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
