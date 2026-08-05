import type { SeriesDefinition } from "../types";
import { PROS_CONFIGS, PROS_DEFAULT_SLUG } from "./configs";
import { PROS_ELEMENTS, PROS_SUPPORT_BEAM_NOTE } from "./elements";
import { PROS_PARTS } from "./parts";
import { PROS_FINISH_FILTERS, PROS_SWATCHES } from "./swatches";

/**
 * PROS — beam desking system. Ported from `PROS.pdf` by way of the Claude Design
 * source `PROS Series PDP.dc.html`.
 */
export const PROS_SERIES: SeriesDefinition = {
  slug: "pros",
  name: "PROS Series",
  wordmark: "PROS",
  eyebrow: "Beam desking system",
  promise: "Seven components. Fourteen configurations. One office.",
  intro:
    "A single A-leg and beam chassis carries every table in the range — from an 800mm single desk to a 4-metre boardroom. Specify once, extend for a decade.",
  workingHeightMm: 720,

  configs: PROS_CONFIGS,
  defaultConfigSlug: PROS_DEFAULT_SLUG,
  finishFilters: PROS_FINISH_FILTERS,

  elements: PROS_ELEMENTS,
  elementsSection: {
    eyebrow: "The element set",
    heading: "Every table is three beams and four legs.",
    blurb:
      "Nothing is bespoke. Add a beam length or a leg pair and the same chassis becomes a bench, a return, a boardroom table. Spares stay in stock because there are only seven part numbers to stock.",
  },
  elementsNote: PROS_SUPPORT_BEAM_NOTE,

  parts: PROS_PARTS,
  anatomySection: {
    eyebrow: "Anatomy",
    heading: "Ten parts, each with a gauge you can hold us to.",
  },
  // The near-elevation shot, not the three-quarter one: it is the only render where the
  // frame reads square-on, which is what makes the part callouts land on the real part.
  anatomyImage: "/pros/bench-2.jpg",
  anatomyImageSize: { w: 1400, h: 808 },
  anatomyCaption: "Bench · 2 seaters with side screens",

  swatches: PROS_SWATCHES,
  swatchesSection: {
    eyebrow: "Finishes",
    heading: "Two tops, one frame, no surprises on site.",
  },
  swatchesFootnote:
    "Swatches are rendered, not photographed — ask us for physical samples before you sign off a finish.",

  sizeChartSection: {
    eyebrow: "Size chart",
    heading: "Fourteen configurations, to the millimetre.",
    blurb:
      "Working height is 720mm throughout, so tops sit flush wherever two configurations meet. Select a row to load it into the viewer above.",
  },
  enquirySection: {
    eyebrow: "Enquire",
    heading: "Send us the floor. We'll send back the layout.",
    blurb:
      "Our team quotes PROS with the beam schedule worked out — so what you receive is a component list and a drawing, not a line item.",
  },

  // TODO(client): confirm these four with Tushar/Vaibhav, then replace the codes in
  // ./configs.ts and empty this list.
  inferredCodes: ["PROS-SCON-PC", "PROS-SCAB-1200", "PROS-CRED-1600", "PROS-WBOX-PC"],
};
