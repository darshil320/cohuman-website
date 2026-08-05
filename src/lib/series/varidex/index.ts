import type { SeriesDefinition } from "../types";
import { VARIDEX_CONFIGS, VARIDEX_DEFAULT_SLUG } from "./configs";
import { VARIDEX_BEAM_NOTE, VARIDEX_ELEMENTS } from "./elements";
import { VARIDEX_PARTS } from "./parts";

/**
 * VARIDEX — adjustable-beam desking system, ported from `VARIDEX.pdf`.
 *
 * Differences from PROS, all of them driven by what the PDF actually documents:
 * no named finishes (the spec gives materials, not colours), so there is no finish
 * filter and no swatch board; sizes are ranges rather than discrete steps; and the
 * retractable wire channel is quoted by SKU and travel, which is what `accessory` is for.
 */
export const VARIDEX_SERIES: SeriesDefinition = {
  slug: "varidex",
  name: "VARIDEX Series",
  wordmark: "VARIDEX",
  eyebrow: "Adjustable-beam desking system",
  promise: "Eight components. Every top quoted as a range.",
  intro:
    "The beam adjusts, so one chassis covers a span of sizes instead of one. Specify the top you want between the listed limits and the frame takes it up — desks, returns, benches and meeting tables off the same eight part numbers.",
  workingHeightMm: 720,
  codeLabel: "Lead component",

  configs: VARIDEX_CONFIGS,
  defaultConfigSlug: VARIDEX_DEFAULT_SLUG,

  elements: VARIDEX_ELEMENTS,
  elementsSection: {
    eyebrow: "The element set",
    heading: "Three beams, five leg packages.",
    blurb:
      "Beams are named for the range of top they carry. Legs come as a four-set, a pair, or as bench end and mid legs — which is the whole vocabulary of the system.",
  },
  elementsNote: VARIDEX_BEAM_NOTE,

  parts: VARIDEX_PARTS,
  anatomySection: {
    eyebrow: "Anatomy",
    heading: "Thirteen parts, each with a gauge you can hold us to.",
  },
  anatomyImage: "/varidex/bench-4-screen.jpg",
  anatomyCaption: "Face to face bench · 4 seaters with side screens",

  accessory: {
    eyebrow: "Cable management",
    heading: "A wire channel that travels with the beam.",
    blurb:
      "Because the beam adjusts, the tray under it has to as well. Two lengths cover the range — specify by the span you need, not by the table.",
    columns: ["Item", "Min", "Max"],
    rows: [
      { code: "VARI-FTF120160-PC", min: "1200mm", max: "1600mm" },
      { code: "VARI-FTF170210-PC", min: "1700mm", max: "2100mm" },
    ],
    parts: [
      {
        name: "Horizontal wire tray",
        note: "Runs the length of the beam under the tops, holding the power rail.",
      },
      {
        name: "Vertical wire tray",
        note: "Takes the drop down the leg line to the floor box, out of sight.",
      },
    ],
  },

  gallery: {
    eyebrow: "Also in the range",
    heading: "Four more tops the specification documents.",
    blurb:
      "These are photographed and specified in the VARIDEX sheet but carry no size table or component schedule in it — so we quote them from the drawing rather than list sizes we cannot stand behind.",
    items: [
      {
        image: "/varidex/meet-round.jpg",
        imageAlt: "VARIDEX round meeting table with two chairs",
        name: "Round meeting top",
        note: "Same leg pair and adjustable foot as the square top.",
      },
      {
        image: "/varidex/l-shape.jpg",
        imageAlt: "VARIDEX L shape table",
        name: "L shape table",
        note: "Adds the straight connector and a second outer beam.",
      },
      {
        image: "/varidex/manager.jpg",
        imageAlt: "VARIDEX manager table with return",
        name: "Manager table",
        note: "Return carried on the supportive wood box rather than a leg.",
      },
      {
        image: "/varidex/manager-cabinet.jpg",
        imageAlt: "VARIDEX manager table with credenza and side cabinet",
        name: "Manager table with cabinet",
        note: "The manager frame plus a credenza run behind the desk.",
      },
    ],
  },

  sizeChartSection: {
    eyebrow: "Size chart",
    heading: "Ten configurations, quoted as ranges.",
    blurb:
      "Working height is 720mm throughout. The specification quotes each top between two limits rather than as fixed sizes — pick the nearest limit here and we confirm the exact top on the quote. Select a row to load it into the viewer above.",
  },
  enquirySection: {
    eyebrow: "Enquire",
    heading: "Tell us the span. We'll set the beam.",
    blurb:
      "Send the floor plate and the headcount and you get back a component schedule and a drawing — with the beam and channel lengths already worked out.",
  },

  // Every VARIDEX part number on this page is printed in the PDF.
  inferredCodes: [],
};
