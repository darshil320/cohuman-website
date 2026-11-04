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
  // Previous shot, kept on disk: another brand's chairs were in frame (client request).
  // workstation: "/spaces/workstation.jpg",
  workstation: "/spaces/workstation-google.jpg",
  meeting: "/spaces/meeting.jpg",
  lounge: "/spaces/lounge.jpg",
};

/**
 * Systems-index row → its hover preview: a technical line drawing (ink on transparent),
 * traced from the system's own render by `scripts/trace-line-drawing.py`, so it shows the
 * real product as an outline rather than a photograph. Keys are collection slugs, plus
 * `meeting` for the meeting-table row. A row without an entry shows no preview — APEX
 * and ELEMENT were only supplied as room shots, which do not trace cleanly.
 */
export const lineDrawing: Record<string, string> = {
  pros: "/lines/pros-bench.png",
  varidex: "/lines/varidex-bench.png",
  fulcrum: "/lines/fulcrum-elevation.png",
  meeting: "/lines/pros-meeting.png",
};
