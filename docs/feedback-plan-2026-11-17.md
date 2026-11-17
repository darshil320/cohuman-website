# Website feedback plan (review meeting, Nov 2026)

What the meeting asked for, mapped to the code, with priority, owner and blockers.
P0 = must ship before go-live. P1/P2 = enhancements. Devan and Smit decide the final P0 cut.

Status key: **Done** (in the current uncommitted batch) · **Ready** (can build now) ·
**Blocked** (waiting on an input, named) · **Confirm** (a decision or data check first).

---

## Already done (uncommitted, not yet deployed)

| Item | Note |
|---|---|
| "PM x Cohuman" renamed "Designer collab" | Menu, /collections, homepage, breadcrumbs, sitemap, llms.txt. Anchor is now `#designer-collab`. |
| Designer credit on the 8 pieces | "Designed by Parth Makwana" under the name and in the spec panel. Wording changes to "Collection 1 — designed by Parth Makwana" (F1). |
| One PDP layout for every product | `ProductSpecLayout`: name + viewer + thumbnails left, ink spec panel right. Pieces, Type A, STRETCH F, APEX, ELEMENT, Stretch E/R. |
| Lower gallery removed | `SeriesConfigGallery` commented out; no placeholder (meeting decision). |
| Config picker under the main image, no flight animation | Stretch S / V pages. |
| Founder photos on /about | |

---

## A. Homepage

| # | Change | Pri | Status | Where |
|---|---|---|---|---|
| A1 | Desktop hero: the rotating arc table video, full 1080p | P0 | **Blocked**: the file from the Drive | `public/video/`, `src/lib/hero-films.ts`. Re-encode MP4 + WebM + poster, then re-measure the clear bands so the hero text doesn't sit on the table (as before). |
| A2 | Mobile hero: 9:16 cut, showing the table height (the current one is 5 s) | P0 | **Blocked**: Parth reframes it. Fallback: I crop a 9:16 cut from A1 with ffmpeg and send it for approval. | `LEAD_FILM.mobile` |
| A3 | Two more ~10 s clips, Stretch S and Stretch V, made like the arc table video | P0 | **Blocked**: the clips (Darshil edits; Gemini source `gemini_generated_video_*.mp4` in Downloads may be one). | Bring back the hero's multi-panel carousel (`heroPanels` in `src/app/page.tsx`; the controls already support several panels) or one film per product section; see Q6. |
| A4 | Remove "Solutions" from the main nav | P0 | **Ready** | `src/lib/nav.ts` (main nav only; the page and footer link stay). |
| A5 | Drop "Surat" from the "Office systems — Surat, IN" label | P0 | **Ready** | `film-intro.tsx`, `signal-hero.tsx`. Coordinates stay. |
| — | "Collections" stays in the nav | — | Decision, no change | |

## B. Configurator (/configure), reworked system-first

| # | Change | Pri | Status | Where |
|---|---|---|---|---|
| B1 | New step order: **System → Top & finish → Partition → Electrical → Extras → Configuration (sharing / non-sharing)** | P0 | **Blocked** for steps 3–5 contents (Devan's extras list) | `configurator.tsx` `STEPS`, `configurator-steps.tsx`, `src/lib/configurator/*` |
| B2 | Step 1 "Which system?" with a small leg photo per option: Stretch S, Stretch V, Stretch F, Apex, Element, square legs, loop legs | P0 | **Confirm** (Q2, Q3): only S and V have spec data; F/Apex/Element have photos only; square and loop legs have nothing on the site. | Leg crops from existing photos for S, V, F, Apex, Element. |
| B3 | "System" instead of "series" in all visitor-facing copy | P0 | **Ready** | Configurator, PDP eyebrows, enquiry lines ("Series: Stretch S" → "System: Stretch S"), llms.txt. Code identifiers stay. |
| B4 | "Both run at 720mm" becomes "Standard height is 750 mm of the table top" | P0 | **Confirm** (Q1): the spec data says 720 (`workingHeightMm: 720` in both series), and that number is shown in the spec panel, the size labels and the enquiry. The text alone can't say 750 while the data says 720. | `pros/index.ts`, `varidex/index.ts`, `derive.test.ts` |
| B5 | Renames: Single table → **Cabin table**, Return table → **Cabin return table** | P0 | **Ready** | `pros/configs.ts`, `varidex/configs.ts` (names and `short`) |
| B6 | Fixed sizes, not ranges. Cabin table: **1200 × 600** or **1400 × 700** | P0 | **Confirm**: fixed sizes for every other table type (Devan / Jigar) | Series `configs` (lens/deps become fixed pairs); `derive.ts` range labels |
| B7 | Sharing / non-sharing tag on every bench option | P0 | **Ready** for the existing benches (bench, in-line bench = non-sharing? face-to-face = sharing); **Confirm** the mapping | config data + picker card |
| B8 | Meeting and conference tables commented out, moved to phase 2 | P0 | **Ready** | `configs.ts` (comment out, keep the data) |
| B9 | Top finishes: cores (laminate, ply…) from the catalogue's second-last page | P1 | **Ready** to extract from `Cohuman_Catalogue_2026_v18.pdf` | `src/lib/finishes.ts` (already has cores, text only) feeds the step |
| B10 | Configurator image as a carousel showing the chosen partition + top + base together | P2 | **Blocked**: needs a render per combination (AI shot list, E). A layered composite would be inaccurate. | |

## C. PDP cleanup (Stretch S / V)

| # | Change | Pri | Status | Where |
|---|---|---|---|---|
| C1 | Remove the bill of components list (and so "medium beam" lines) | P0 | **Ready** | `series-spec-block.tsx`. Part codes still go in the enquiry. |
| C2 | Lower gallery removed, no placeholder; later, completed-site photos with these legs | P0 / P2 | **Done** / **Blocked**: supplier photos (Smit) | |
| C3 | Anatomy: drop "Side bar", rename "Adjustable foot" → **Leveler**, enlarge the image, remove the "Ten / Thirteen parts…" heading text | P0 | **Ready** | `pros/parts.ts`, `varidex/parts.ts`, `*/index.ts` anatomy heading, `series-anatomy.tsx` |
| C4 | Make the wire box visible in the anatomy image | P2 | **Blocked**: an image that shows it | |
| C5 | Stretch R / E (and other) pages crop the legs off; better image quality | P0 | **Ready** for the crop (show cut-outs whole, `object-contain`); **Blocked** for quality (Smit's upscaled images) | `ProductViewer`, `public/stretch-r|e/` |

## D. One layout for every product

| # | Change | Pri | Status | Where |
|---|---|---|---|---|
| D1 | Every PDP copies the Stretch S page | P0 | **Done** (base layout) | |
| D2 | Show the gaps: every product panel carries the same rows as Stretch S (system, length, depth, height, seats, configurations, top finish, frame finish, legs), with **"Not available"** where we have no data | P0 | **Ready** | `ProductSpecLayout` rows; one shared row list so the gaps line up |
| D3 | Missing-data sheet: one row per product, one column per Stretch S field, filled / not available | P0 | **Ready** | `docs/cohuman-missing-data.xlsx` (extends the spec template). This is what Devan and Darshil fill in together. |
| D4 | Designer collab may get an elevated layout later; everything else stays generic | P2 | Decision, later | |

## E. More product images (AI, Gemini)

| # | Change | Pri | Status |
|---|---|---|---|
| E1 | More images for the other products, matching Stretch S (angles, white or plain backgrounds, **no people**) | P0 | **Blocked**: images are made by the team in Gemini (Claude can't generate images). |
| E2 | Shot list: hero homepage video; cabin table with modesty only; cabin table with white credenza (×2); conference table with one centre leg, two centre legs, crowd mid leg | P0 | Source images for Stretch R and Stretch E are on the Drive. |
| E3 | My part: a prompt template per shot; an ingest script (sRGB, crop, 1920 px, white backdrop multiplied cleanly like the catalogue cut-outs); alt text; wiring into `collections.json` / `pieces.json` | P0 | **Ready** to prepare |

## F. Designer collab, Ergohuman, phone booth

| # | Change | Pri | Status | Where |
|---|---|---|---|---|
| F1 | Under "Designer collab": "Collection 1 — designed by Parth Makwana" | P0 | **Ready** | Collections menu, /collections, homepage section, PDP credit. Data shaped so a "Collection 2" can be added later. |
| F2 | Website data matches the catalogue | P0 | Ongoing; D3 sheet tracks it | |
| F3 | Ergohuman: always the full name; versions (headrest, leg rest) become spec rows, no "Plus" label | P0 | **Ready**; **Confirm** what "full name" is (Q5) | `pieces.json` (ergohuman), PDP rows |
| F4 | Ergohuman colours: black and grey, black photos + one grey photo | P1 | **Blocked**: grey photo | |
| F5 | Phone booth product page | P1 | **Blocked**: catalogue PDF / link (Smit); **Confirm** group (Q4) | New `pieces.json` entry |
| — | Ergohuman on the arc table at the stall | — | Event, no site change | |

## G. Admin

| # | Item | Status |
|---|---|---|
| G1 | Post the P0/P1/P2 list on the group | I draft it from this file |
| G2 | Launch event: none now; architects' meetup / factory visit later | No site change |

---

## Execution order

1. **Batch 1, ready now (P0, no inputs needed):** A4, A5, B3, B5, B8, C1, C3, C5 (crop), D2, D3, F1, F3. Then ship with the current uncommitted batch.
2. **Batch 2, configurator rework:** B1, B2, B6, B7, then B9, after Q1–Q3 and Devan's extras list.
3. **Batch 3, media:** A1, A2, A3 as the videos arrive; E3 pipeline ready before the AI images land; C5 quality, F4, F5.
4. **Phase 2:** B10, C4, completed-site gallery (C2), meeting/conference tables back, designer collab elevated layout.

## Inputs needed (who)

- Arc table 1080p video from the Drive (Darshil / Drive), 9:16 reframe (Parth)
- Stretch S and Stretch V 10 s clips (Darshil)
- Configurator extras list: partitions, electrical, extras (Devan)
- Fixed sizes per table type; standard height 750 confirmation (Devan / Jigar)
- Leg systems "square legs" and "loop legs": names, photos, sizes (Devan)
- Upscaled product images (Smit), completed-site photos (Smit, from the legs supplier)
- Phone booth catalogue PDF (Smit), Ergohuman grey photo

## Answers (Darshil, 17 Nov 2026)

1. **Height:** 750 mm is the real standard. Change the data (`workingHeightMm`), not only the sentence. Moves B4 to Batch 1.
2. **Square legs, loop legs:** separate systems, each with its own page. Need name, photos and sizes (Devan).
3. **F, Apex, Element in the configurator:** yes, same table types and fixed sizes as S / V. Sizes still to come from Devan / Jigar, so they show "Not available" until then.
4. **Phone booth:** a new group in the Collections menu.
5. **Ergohuman:** the name must never break ("Ergohuma / n" on the live PDP). Fixed by the shared layout's smaller heading, checked from 320 to 1440 px. Ships with the next deploy.
6. **Homepage videos:** three hero slides, in order: 1 the arc table (ARQ), 2 Stretch S, 3 Stretch V. Darshil is sending the Stretch S and V clips.
