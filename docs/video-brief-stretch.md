# Stretch hero films — source analysis and editing prompt

Two short hero films for the homepage, one per system, each delivered as a **desktop**
(16:9) and a **mobile** (9:16) cut. Section 1 is what the source files contain; section 2 is
the prompt to hand to Claude (it is self-contained — paste it with the source file).

---

## 1. The source films (Drive → Workstation → Strech S / Strech V → Source)

### Stretch S — `Stretch S Video (LX).mp4`

- 1:59 (118.8 s), 1920 × 1080, 25 fps, HEVC, AAC audio, 31.9 MB.
- Animated 3D explainer on a pale blue-grey studio ground (#DAE4EE → #F4F6FA), white
  tubular legs, light oak tops.
- **Problems to fix:** it uses the system's **old name "PRO"** ("PRO", "WHY IS PRO ?",
  "PRO-V / PRO-S"); a black-and-green **logo pill is burned into the top-right corner** of
  every frame (x 1706–1884, y 35–126 at 1920 × 1080); a **"LEADEX" watermark** shows over
  the floor plan near the end; the last ~2 s are black.
- The file `Stretch System Video.mp4` (1:59, 30 fps, H.264) is the **same film already
  renamed "STRETCH" / "Stretch S" / "Stretch V"** — use it as the source for Stretch S.

Timeline (seconds, `Stretch System Video.mp4`):

| Time | What it shows |
|---|---|
| 0–3 | Title card "STRETCH" |
| 3–9 | One leg arm swings into a V — the splayed leg joint |
| 9–12 | "WHY STRETCH" |
| 12–24 | Leg, joint and bracket meet; a pair of legs; the short beam slots between them |
| 24–34 | Beam lengths with dimension lines; "Short beam", "Long beam" |
| 34–36 | "AND THEN ?" |
| 36–48 | Legs with a mid leg; the long multi-seat beam with dimension lines |
| 48–84 | The configurations build, each with a parts list on the left: bench, face-to-face bench with screen, meeting table, round table, square table, single desk, L-shaped desk |
| 84–92 | "SIX ELEMENTS" (the parts, highlighted in blue) |
| 92–98 | "SIX CARTONS" (flat-packed) |
| 98–100 | "TWO DESIGNS" |
| 100–104 | Stretch V and Stretch S side by side, labelled |
| 104–110 | Both dressed as workstations with chairs and screens |
| 110–114 | Camera rises over a full office floor, then a top-down plan |
| 114–117 | Cohuman wordmark, centred |
| 117–119 | "MAKE IT WORK", then black |

Strongest material for a short film: the leg joint (3–9), the beam slotting in (18–24),
two or three configurations building (48–84), side-by-side S / V (100–104), the office
rise (104–114), the wordmark (114–117).

### Stretch V — `Stretch V Video (LX).mp4`

- 2:25 (145 s), 1920 × 1080, 25 fps, H.264, AAC audio, 22.2 MB. `Stretch V Video -
  Orgatec.mp4` (2:26, 30 fps) is an alternative export.
- **An assembly guide**, not a showcase: white frame on a saturated **lime-green ground**
  (off-brand; reads as a manual), with numbered steps and screw call-outs.
- **Problems to fix:** the green ground; small technical call-out boxes ("M8*20mm screw with
  8mm allen key") unreadable at hero size; a faint watermark on the final render; black
  from ~2:16.

Timeline (seconds):

| Time | What it shows |
|---|---|
| 0–4 | Parts overview: leg, bench side leg, bench mid leg, horizontal bar, table top, screen, power system |
| 4–18 | Step 1 "Fixing the side leg" — leg arm and beam, M8 × 12 screw, 5 mm Allen key |
| 18–42 | Step 2 "Fixing the mid leg" — M8 × 20 screw, 8 mm Allen key |
| 42–56 | Step 3 "Fixing horizontal beam" — the frame stands as a full bench |
| 56–66 | Step 4 — the top from below, M6 × 20 screws |
| 66–80 | Step 5 — the centre screen fixed through the top |
| 80–100 | Step 6 — the cable tray clips under the top (M4 × 20) |
| 100–132 | Under the top: cable tray, power box, wire management; screens in place |
| 132–136 | The finished bench with centre screens, white frame, three-quarter view |
| 136–145 | Fade to black |

Strongest material: the parts overview (0–4), the frame standing (42–56), the top dropping
on (56–66), the screen going in (66–80), the power box and cable tray (100–132), the
finished bench (132–136).

---

## 2. The prompt (paste into Claude with ONE source file)

> Replace the bracketed parts for each film. Run it once for Stretch S (source:
> `Stretch System Video.mp4`) and once for Stretch V (source: `Stretch V Video (LX).mp4`).

```text
You are editing a hero film for the homepage of Cohuman (www.cohuman.in), an Indian
office-furniture brand. You have the source video attached and ffmpeg available. Produce
two finished films from it — a DESKTOP cut and a MOBILE cut — plus posters and a short
edit log. Work only from the attached footage: do not invent products, sizes or claims.

PRODUCT: [Stretch S — "a splayed tubular leg that carries a whole office from one set of
parts: legs and beams combine into single desks, benches, meeting tables and manager
desks." Frame: white or charcoal grey.]
[Stretch V — "an upright leg on an adjustable beam frame; the beams extend to suit a range
of top lengths, and a retractable wire channel carries cables between facing desks."
Frame: charcoal grey.]
Standard table height: 750 mm. Do not show or state any other size, price or part code.

SOURCE: [file name], 1920×1080, [25/30] fps. Its timeline (seconds):
[paste the timeline table for this film from section 1]

GOAL
A short, social-native product film — the pace and directness of a UGC / short-form
video (one idea per shot, a new beat every 1.5–3 s, nothing lingers) — but finished like a
brand film: clean, precise, quietly futuristic. It plays muted, on loop, full-screen
behind the homepage header. Story in four beats:
  1. Brand — the Cohuman wordmark, centred, on a clean ground (≈2 s).
  2. The idea — the system's name, centred, then the one thing that makes it work
     [Stretch S: the splayed leg joint and one set of parts]
     [Stretch V: the adjustable beam and the cable channel].
  3. Proof — the system building itself: leg → beam → top → [screen / configurations],
     2–4 of the strongest moments from the timeline, in a logical build order.
  4. Payoff — the finished system in a real office, then the Cohuman wordmark again,
     centred, held long enough to read (≥1.5 s). End on a frame that loops cleanly back
     to the first.

LENGTHS
- Desktop: 20–28 s.  Mobile: 12–18 s (a tighter edit, not just a crop of the desktop one).

FIX IN THE SOURCE (mandatory)
- Remove the logo pill burned into the top-right corner (1920×1080: x 1706–1884,
  y 35–126) with ffmpeg delogo — never by cropping or zooming, which pushes the centred
  wordmark off-centre and cuts it.
- Never show the old name "PRO", "PRO-S" or "PRO-V". Skip those shots or cover the text.
- Never show "LEADEX" or any supplier watermark. Never use the black tail.
- [Stretch V: the lime-green ground is off-brand. Grade every shot to the brand's warm
  ivory/pale-grey ground (see STYLE); if a clean key is not possible, keep shots tight on
  the white frame where the green is least present, and desaturate the ground.]
- Drop every small technical call-out (screw sizes, step labels) — unreadable at hero size.

STYLE (Cohuman's "Signal" design system — follow exactly)
- Ground: warm ivory #FBF8EE or a pale cool grey close to the source studio (#EEF2F6). No
  gradients, no glows, no lens flares, no glass, no particle effects.
- Ink #231F20 for any type. Green #5EB646 only as a tiny accent (it is the logo's
  colour; never a background, never a fill behind text).
- Type: Sequel Sans if available, else a clean grotesk (Inter / Helvetica). Titles in
  natural case or the source's own caps titles, set large and centred; at most 3–4 words
  on screen at once. Supers allowed: the system name, "One set of parts", "Standard
  height 750 mm", "[Stretch S / Stretch V] by Cohuman". Nothing else.
- Motion: "plotter, not fade" — reveals wipe left to right or draw like a line; cuts are
  clean; transitions ≤ 0.5 s. No bounces, no spins, no zoom-punches, no whip pans.
- Keep the composition calm and centred; the product never touches a frame edge.

SAFE ZONES (the website draws over the film)
- Desktop 1920×1080: keep the top 120 px clear (transparent site header with logo and
  "Get a quote"), and the bottom 100 px clear (slide dots, centre). Keep the product and
  any type inside the centre 80% of the width.
- Mobile 1080×1920: keep the top 200 px and bottom 220 px clear. Build this cut for the
  portrait frame — reframe each shot on the product (no letterboxing, no blurred fill),
  scale type up for a phone, and choose shots that read in a narrow frame (single legs,
  close-ups, the top dropping on) over wide ones.

DELIVERABLES
- stretch-[s|v]-desktop.mp4  — 1920×1080, 30 fps, H.264 High, yuv420p, CRF 21–23,
  -movflags +faststart, NO audio track. Target ≤ 6 MB.
- stretch-[s|v]-desktop.webm — VP9, CRF 34–36, no audio.
- stretch-[s|v]-mobile.mp4 / .webm — 1080×1920 (or 720×1280 if over budget), same
  settings. Target ≤ 3 MB.
- stretch-[s|v]-desktop-poster.jpg and -mobile-poster.jpg — the first frame of each
  (it is what paints first and what reduced-motion visitors see), JPEG q≈85.
- edit-log.md — the cut list (source in/out times → output times), every super's text and
  timing, the delogo coordinates used, and the exact ffmpeg commands, so the edit can be
  reproduced.

CHECK BEFORE YOU FINISH
- Play each film start to end and back to the start: the loop point must not jump.
- Grab a frame every second and confirm: no "PRO", no "LEADEX", no corner pill, no black
  frames, nothing in the safe zones, the wordmark fully in frame and centred.
- Report both files' durations and sizes.
```

---

## 3. Notes for when the films come back

- They drop into `public/video/` and `SYSTEM_FILM` in `src/lib/hero-films.ts` (desktop
  `video`, portrait `mobile` cut, `poster`s). With two films (S and V), the hero becomes
  three slides: ARQ, Stretch S, Stretch V.
- Re-check the hero text overlay on slide 1 only — slides 2 and 3 carry no text.
