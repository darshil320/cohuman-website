import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/*
  Site-wide share card, rendered once at build time.

  It replaces the photographic `public/og.jpg`: the card now carries the vector master logo
  (`public/brand/logo-primary.svg`) and
  the Signal type, so a link shared in WhatsApp, Slack or LinkedIn reads as Cohuman before
  anyone opens it. Routes that set their own `openGraph.images` (the collection pages)
  still win over this one.

  `ImageResponse` cannot read variable fonts or woff2, so `_og/` holds two static OFL
  instances pulled from Google Fonts: Archivo at wdth 125 / wght 600 (the display face)
  and Martian Mono at wdth 87.5 / wght 400 (the data face). The underscore keeps the
  folder out of the router.
*/

export const alt = "Cohuman — Engineered for two. Scaled for the floor.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CANVAS = "#FBF8EE";
const INK = "#231F20";
const STEEL = "#6B665D";
const HAIR = "#DCD6C4";
const GRID_COLUMNS = 12;
const GUTTER = 64;

export default async function OpengraphImage() {
  const [display, mono, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/app/_og/archivo-expanded-600.ttf")),
    readFile(join(process.cwd(), "src/app/_og/martian-mono-875-400.ttf")),
    readFile(join(process.cwd(), "public/brand/logo-primary.svg"), "base64"),
  ]);

  const columnWidth = (size.width - GUTTER * 2) / GRID_COLUMNS;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          color: INK,
          padding: `56px ${GUTTER}px`,
          position: "relative",
        }}
      >
        {Array.from({ length: GRID_COLUMNS + 1 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: GUTTER + i * columnWidth,
              width: 1,
              background: HAIR,
            }}
          />
        ))}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src={`data:image/svg+xml;base64,${logo}`} width={300} height={41} alt="" />
          <div style={{ fontFamily: "Martian Mono", fontSize: 16, color: STEEL, letterSpacing: 1 }}>
            OFFICE SYSTEMS — SURAT, IN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Archivo Expanded",
              fontSize: 70,
              lineHeight: 0.92,
              letterSpacing: -1.6,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>ENGINEERED FOR TWO.</span>
            <span style={{ color: STEEL }}>SCALED FOR THE FLOOR.</span>
          </div>

          {/* A dimension line, the device every product image on the site carries. */}
          <div style={{ display: "flex", alignItems: "center", marginTop: 44, width: 760 }}>
            <div style={{ width: 1, height: 13, background: INK }} />
            <div style={{ flex: 1, height: 1, background: INK }} />
            <div
              style={{
                fontFamily: "Martian Mono",
                fontSize: 15,
                padding: "0 14px",
                background: CANVAS,
              }}
            >
              DESKING · CABINS · MEETING — QUOTED TO YOUR FLOOR PLAN
            </div>
            <div style={{ flex: 1, height: 1, background: INK }} />
            <div style={{ width: 1, height: 13, background: INK }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Expanded", data: display, style: "normal", weight: 600 },
        { name: "Martian Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
