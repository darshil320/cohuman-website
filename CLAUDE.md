@AGENTS.md

# Cohuman marketing + lead-gen website

Next.js (App Router) site for **Cohuman**, a Surat-based office-furniture brand
(legal entity: Furniture Concepts 2.0, founder Tushar Shah, "crafting spaces since
1989"). This is a rebrand/rebuild of an earlier "Furniture Concept 2.0" e-commerce
demo, converted from cart/checkout into a **lead-generation** site: every page ends
in a quote/enquiry CTA, not a purchase flow.

Full requirements live in `prospects/cohuman-quotation.md` (outside this repo) — this
file is the implementation-facing summary.

## Stack

- Next.js (App Router) + TypeScript, React 19
- Tailwind CSS v4 (tokens in `src/app/globals.css` via `@theme inline`, no
  `tailwind.config.*` needed)
- Hand-rolled shadcn-style primitives in `src/components/ui/` (button, input,
  textarea, select, label) — cva + `cn()` (`src/lib/utils.ts`), Radix primitives
  for Dialog/Label/Slot
- Zod for all form/API validation (`src/lib/leads/schema.ts`)
- Resend for lead emails, `@vercel/analytics` + `@vercel/speed-insights` for
  metrics
- Content: local JSON files (`src/data/*.json`) behind a repository interface —
  see "Data layer" below

## Data layer (CMS-swap seam)

`src/lib/catalog/`:
- `types.ts` — `Category`, `Collection`, `Product`, `Project`, `Space`, `Service`
- `repository.ts` — the `CatalogRepository` interface every page depends on
- `local-repository.ts` — reads `src/data/*.json`; the only implementation today
- `index.ts` — exports a single `catalog` instance. **To move to a headless CMS
  later** (open item — client hasn't confirmed they want self-serve editing),
  write a new class implementing `CatalogRepository` against the CMS and swap the
  instantiation in this one file. No page or component should ever import
  `src/data/*.json` directly except the local repository and, for form option
  lists, `enquiry-form.tsx`/`b2b-form.tsx`.

## Lead capture

Three separately-tracked lead sources (analytics `source` field), each with its
own API route and Zod schema:

| Source | Form component | API route | Where it appears |
|---|---|---|---|
| `product_enquiry` | `EnquiryForm` | `POST /api/enquiry` | Quote dialog (site-wide), catalog/product/collection "Enquire" buttons, contact page |
| `b2b_bulk_order` | `B2bForm` | `POST /api/b2b` | `/b2b` page (first-class, not a footer link) |
| `showroom_visit` | `ShowroomVisitForm` | `POST /api/showroom-visit` | Contact page, second tab |

`src/lib/leads/store.ts` (`recordLead`) does two things per submission: sends a
Resend email to `siteConfig.email`, and best-effort appends a JSONL line under
`.leads/` (gitignored). **Known limitation:** the JSONL log only persists on an
always-on server or in local dev — Vercel Functions have an ephemeral
filesystem, so in production the Resend email is the durable record for v1. If
lead volume grows enough to need a real log, replace `appendLocalLog` with a
proper store (Vercel KV/Postgres) — do not build a CRM here, that's a separate
engagement.

`RESEND_API_KEY` and `RESEND_FROM_EMAIL` are read from env; without
`RESEND_API_KEY` set, submissions still succeed (validated + logged) but no
email sends — set it before launch.

The quote dialog (`src/components/providers/quote-dialog-provider.tsx`) is a
global context (`useQuoteDialog().openQuote(subject?)`) — any component can pop
it with a prefilled "interest" subject (a product name, collection, service, or
space type).

## Placeholder content — do not ship as-is

- **`src/lib/site-config.ts`** — phone, WhatsApp number, email, showroom address,
  hours, map embed URL are all placeholders marked `TODO: confirm`. Nothing here
  is real.
- **`src/components/common/image-placeholder.tsx`** — every product/project/hero
  image renders a labelled gradient card until a real `src` is passed. Grep for
  `<ImagePlaceholder` usages without `src` before launch.
- **`src/data/products.json`, `projects.json`** — SKUs, specs and case studies
  are illustrative, carried over from the original demo. Real product data,
  photography, and project case studies (with permission to publish) are open
  items with the client.
- **`src/app/about/page.tsx`** — the "Partnerships" section intentionally has no
  logos. Whether MERRYFAIR/SPACEWOOD/Humanscale partnerships still apply to the
  Cohuman entity is unconfirmed; do not add them until Tushar/Vaibhav confirm.
- Pricing is shown only as a qualitative band (`budget`/`value`/`premium` →
  "Value"/"Mid"/"Premium") plus "Price on request" — whether real prices should
  ever be public is an open decision, not yet made.

## Explicit non-goals (do not add)

No cart/checkout/payment gateway, no user accounts/login, no AI room visualizer,
no CRM/pipeline dashboard, no i18n. All were in the original demo or requested
elsewhere and were deliberately cut to keep this a lead-gen site, not an
e-commerce or SaaS product.

## Commands

```bash
npm run dev      # local dev
npm run build    # production build
npm run lint      # eslint
```

## Conventions

- Tailwind: use only the default spacing scale (halves up to 3.5, then whole
  numbers) or explicit `[18px]`-style arbitrary values — fractional utilities
  like `p-4.5` or `gap-5.5` silently produce no CSS.
- Server components fetch via `catalog.*` and resolve display labels with
  `src/lib/catalog/resolve.ts` (`resolveCatLabel`, `resolveColName`); only
  components that open the quote dialog or manage local state (buttons, forms,
  filters) are client components.
- No `console.log` in committed code; surface errors via thrown errors / API
  error responses instead.
