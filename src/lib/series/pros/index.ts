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
  name: "Stretch S",
  wordmark: "Stretch S",
  eyebrow: "Beam desking system",
  promise: "Seven components. Six table types. One office.",
  intro:
    "A single splayed leg and beam chassis carries every table in the range — from an 800 mm round table to a 4-metre meeting table. Specify once, extend for a decade.",
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
  anatomyCaption: "Bench with side screens",

  swatches: PROS_SWATCHES,
  swatchesSection: {
    eyebrow: "Finishes",
    heading: "Two tops, one frame, no surprises on site.",
  },
  swatchesFootnote:
    "Swatches are rendered, not photographed — ask us for physical samples before you sign off a finish.",

  enquirySection: {
    eyebrow: "Enquire",
    heading: "Send us the floor. We’ll send back the layout.",
    blurb:
      "Our team quotes PROS with the beam schedule worked out — so what you receive is a component list and a drawing, not a line item.",
  },

  // TODO(client): confirm these with Tushar/Vaibhav, then replace the codes in
  // ./configs.ts and empty this list. CHSS-ST-SB200 is the single table at 1800/2000,
  // which the catalogue offers and PROS.pdf gives no code for.
  inferredCodes: ["CHSS-WBOX-PC", "CHSS-ST-SB200"],
};
