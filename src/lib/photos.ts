/**
 * Site photography.
 *
 * These are Cohuman's own photographs of completed installs, supplied by the client
 * (the shared Drive of project shoots) and cropped to web sizes under `public/`. They
 * replaced the Unsplash stock this file used to hold — nothing here is stock any more,
 * so it can be quoted as our work.
 *
 * Product renders live separately: `public/pros/` and `public/varidex/`, wired through
 * each series definition in `src/lib/series/`.
 */

export const sitePhotos = {
  heroOpenPlan: "/site/hero-open-plan.jpg",
  heroBenching: "/site/hero-benching.jpg",
  heroBoardroom: "/site/hero-boardroom.jpg",
  aboutCabin: "/site/about-cabin.jpg",
  aboutMeeting: "/site/about-meeting.jpg",
} as const;

/** Product category (`Product.cat`) → a photograph of that category in a finished space. */
export const categoryPhoto: Record<string, string> = {
  task: "/categories/task.jpg",
  exec: "/categories/exec.jpg",
  work: "/categories/work.jpg",
  conf: "/categories/conf.jpg",
  store: "/categories/store.jpg",
  sofa: "/categories/sofa.jpg",
};

/**
 * Collection (`Collection.slug`) → hero image. Not photography: both series carry the
 * manufacturer's own studio renders, extracted from their specification PDFs.
 */
export const collectionPhoto: Record<string, string> = {
  pros: "/pros/bench-4-screen.jpg",
  varidex: "/varidex/bench-4-screen.jpg",
};

/** Space (`Space.slug`) → a photograph of that space type in a finished install. */
export const spacePhoto: Record<string, string> = {
  cabin: "/spaces/cabin.jpg",
  workstation: "/spaces/workstation.jpg",
  meeting: "/spaces/meeting.jpg",
  lounge: "/spaces/lounge.jpg",
};
