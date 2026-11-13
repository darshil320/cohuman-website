# Performance

## Baseline: 2026-11-13, before the UX and animation pass

- Commit: `30defe4` (main), measured on branch `ux/animation-pass` before any change
- Build: `npm run build`, served with `next start -p 3210` on a local machine
- Tool: Lighthouse 12, mobile form factor, simulated throttling (Lighthouse defaults:
  4x CPU slowdown, slow 4G), headless Chrome, performance category only
- Runs: 3 per route; the table shows the median of each metric
- JS = transfer size of every `Script` request in the run

| Route | Score | LCP | CLS | TBT (INP proxy) | JS transferred |
|---|---|---|---|---|---|
| `/` | 79 | 5.14 s | 0.000 | 83 ms | 260 KiB |
| `/collections/pros` | 80 | 3.13 s | 0.000 | 532 ms | 504 KiB |
| `/contact` | 77 | 4.00 s | 0.000 | 398 ms | 245 KiB |

**Already over budget before this pass:** every route scores under 90 and has an LCP over
2.5 s. On `/` and `/contact` the LCP element is the ORGATEC popup's description
(`orgatec-popup.tsx`). The popup opens 1.5 s after hydration, so its paint, not the hero,
sets LCP (render delay is about 3.5–3.7 s). On `/collections/pros` it's the first studio
render in the spec block (render delay is about 4.1 s; TBT comes from the WebGL viewer and
three.js). TTFB on a local server is 0.47–0.63 s.

### Re-baseline, same session

The first `/collections/pros` and `/contact` numbers above were taken while the machine
was also running other work: TBT read 532 ms and 398 ms, against 60–90 ms and 0 ms when
`main` was rebuilt and re-measured. `/collections/pros` also has a bimodal simulated LCP
(2.8 s or 3.7 s in different runs on the same build). So the before/after comparison below
uses a **paired** run: `main` (`30defe4`) and the branch were each built and measured
back to back, on an idle machine, with the setup above.

## After: 2026-11-13, branch `ux/animation-pass` (`efa0e81`), paired with `main`

| Route | Metric | Before (`main`) | After (branch) | Change |
|---|---|---|---|---|
| `/` | Score | 81 | 82 | +1 |
| | LCP | 5.10 s | 4.89 s | −4% |
| | CLS | 0.000 | 0.000 | — |
| | TBT | 4 ms | 3 ms | — |
| | JS transferred | 260 KiB | 217 KiB | **−43 KiB (−17%)** |
| `/collections/pros` | Score | 89 | 90 | +1 |
| | LCP | 3.74 s | 3.69 s | −1% |
| | CLS | 0.000 | 0.000 | — |
| | TBT | 90 ms | 83 ms | −8% |
| | JS transferred | 504 KiB | 500 KiB | −4 KiB |
| `/contact` | Score | 89 | 90 | +1 |
| | LCP | 3.74 s | 3.59 s | −4% |
| | CLS | 0.000 | 0.000 | — |
| | TBT | 0 ms | 0 ms | — |
| | JS transferred | 245 KiB | 202 KiB | **−43 KiB (−17%)** |

Per-run LCP (ms):

- before: `/` 5096, 5136, 5096 · `/collections/pros` 3742, 3738, 3737 · `/contact` 3745, 3744, 3743
- after: `/` 5056, 4891, 4872 · `/collections/pros` 3691, 3696, 3371 · `/contact` 3675, 3593, 3369

**No metric regressed.** The JS saving is framer-motion leaving every page except the
ones that use it (the series pages and the lightbox). The header overlays are CSS now,
and the root `MotionConfig` is gone.

**Still over budget, and not caused by this pass:**

- LCP > 2.5 s on every route.
- Score < 90 on `/`.

On `/` and `/contact` the LCP element is still the ORGATEC popup's description: a modal
that opens 1.5 s after hydration on every first visit. Retiring it (the show ends
21 Nov 2026), or making it non-modal or opening it on first interaction, is the single
largest LCP lever. It is a client decision, so it is listed as PROPOSE in UX-ANIMATION.md.
On `/collections/pros` the LCP is the viewer poster; its render delay comes from three.js
and the WebGL stage.

**Bisect, logged:** the after run first read 3.70 s against the 3.13 s first baseline on
`/collections/pros`. The commit before the header change (`5127358`) measured 3.75 s,
and `main` itself re-measured 3.74 s median. That is measurement noise, not a regression,
so nothing was reverted.
