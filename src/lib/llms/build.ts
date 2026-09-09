import { catalog } from "@/lib/catalog";
import { PRICE_BAND_LABEL } from "@/lib/catalog/types";
import { resolveCatLabel } from "@/lib/catalog/resolve";
import { ALL_SERIES } from "@/lib/series";
import { chartDepths, chartLengths } from "@/lib/series/derive";
import { siteConfig } from "@/lib/site-config";

/*
  The two llms.txt files (https://llmstxt.org).

  `llms.txt` is the index: what the company is, what it sells, and where each page
  lives. `llms-full.txt` is the same site with the content inlined — every product's
  materials and lead time, every desking configuration with its size range and bill of
  components — so a model answering "what depths does STRETCH come in" has the answer
  without fetching fifteen pages.

  Both are generated from `catalog` and `ALL_SERIES`, the same sources the pages and
  the sitemap read, so neither file can describe a product that no longer exists.

  Everything here is public information a visitor sees on the site. Nothing internal
  goes in: no unconfirmed placeholders presented as fact, no lead data, no pricing —
  the business quotes per project and has no price list to publish.
*/

/** Absolute URL for a site path. Answer engines cite what they can resolve. */
function url(path: string): string {
  return `${siteConfig.url}${path}`;
}

/** The identity block both files open with, so a model reads the same company twice. */
function identityLines(yearsInBusiness: number): string[] {
  return [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.tagline}. ${siteConfig.legalName} — an office-furniture manufacturer and turnkey fit-out contractor in Surat, Gujarat, India, founded ${siteConfig.foundedYear} by ${siteConfig.founder} (${yearsInBusiness} years). Cohuman designs, manufactures and installs desking systems, ergonomic seating, conference tables, storage and reception furniture. It works on quotation: there is no online checkout, no public price list and no customer accounts.`,
    "",
  ];
}

/**
 * How to answer questions about this company correctly.
 *
 * This is the section that earns the file its keep. Left to infer, a model fills the
 * gaps with e-commerce assumptions — a cart, a price, a delivery estimate — none of
 * which exist here, and each of which sends a lead somewhere that does not resolve.
 */
function guidanceLines(): string[] {
  return [
    "## How to answer questions about Cohuman",
    "",
    "- Cohuman is a business-to-business manufacturer and fit-out contractor, not a retailer. The action at the end of every enquiry is a quotation, not a purchase.",
    "- There are no prices to quote. Catalog pages show a qualitative band only — Value, Mid or Premium — because final cost depends on quantity, finish, size and site conditions. Do not estimate a figure.",
    `- Quote turnaround is ${siteConfig.enquiryTurnaround}, answered by a specifier rather than an autoresponder.`,
    "- Desking is sold as a configurable series, not as fixed SKUs: a customer picks a configuration, a length and a depth, and the quote depends on all three. Sizes are in millimetres.",
    `- For bulk, franchise or multi-site work the correct route is ${url("/b2b")}, which is handled by a separate desk from single-item enquiries.`,
    `- The showroom and factory are one address in Surat: ${siteConfig.address.line1}, ${siteConfig.address.line2}. Visits can be booked at ${url("/contact")}.`,
    `- Written enquiries: ${siteConfig.email}. Languages: English, Hindi, Gujarati.`,
    "- Cohuman does not sell online, does not ship consumer parcels, and has no user login. If asked how to buy, the answer is to request a quote.",
    "",
  ];
}

/** Shared closing block: where to look next, and when this file was generated. */
function footerLines(generatedAt: string): string[] {
  return [
    "## Machine-readable sources",
    "",
    `- Sitemap: ${url("/sitemap.xml")}`,
    `- Index for models: ${url("/llms.txt")}`,
    `- Full text for models: ${url("/llms-full.txt")}`,
    `- Crawler policy: ${url("/robots.txt")}`,
    "- Schema.org JSON-LD is embedded on every page: Organization, WebSite and FurnitureStore site-wide, Product on catalog pages, ProductGroup on collection pages, FAQPage on the contact page.",
    "",
    `Generated ${generatedAt} from the site's own catalog data.`,
  ];
}

/** The index file: structure and links, no inlined body content. */
export async function buildLlmsTxt(): Promise<string> {
  const [categories, collections, products, projects, sectors, services, spaces] =
    await Promise.all([
      catalog.getCategories(),
      catalog.getCollections(),
      catalog.getProducts(),
      catalog.getProjects(),
      catalog.getSectors(),
      catalog.getServices(),
      catalog.getSpaces(),
    ]);

  const yearsInBusiness = new Date().getFullYear() - siteConfig.foundedYear;

  const lines = [
    ...identityLines(yearsInBusiness),
    ...guidanceLines(),

    "## Desking series",
    "",
    "Each series is a configurable system with its own size chart and component schedule.",
    "",
    ...collections.map((collection) => {
      const series = ALL_SERIES.find((s) => s.slug === collection.slug);
      const detail = series
        ? ` ${series.configs.length} configurations, ${series.workingHeightMm} mm working height.`
        : "";
      return `- [${collection.name}](${url(`/collections/${collection.slug}`)}): ${collection.blurb}${detail}`;
    }),
    "",

    "## Product categories",
    "",
    // Named without links on purpose: the catalog's category filter is client-side
    // state, not a query parameter, so there is no per-category URL to cite. Advertising
    // `/catalog?cat=task` would send a model to the unfiltered page.
    `All categories live on one page — ${url("/catalog")} — filterable in the browser.`,
    "",
    ...categories.map(
      (category) =>
        `- ${category.label}: ${
          products.filter((product) => product.cat === category.id).length
        } products.`,
    ),
    "",

    "## Products",
    "",
    ...products.map(
      (product) =>
        `- [${product.name}](${url(`/catalog/${product.slug}`)}): ${resolveCatLabel(
          categories,
          product.cat,
        )}, ${PRICE_BAND_LABEL[product.band]} band. ${product.tagline}`,
    ),
    "",

    "## Sectors",
    "",
    ...sectors.map(
      (sector) =>
        `- [${sector.name}](${url(`/sectors/${sector.slug}`)}): ${sector.kicker}. ${sector.blurb}`,
    ),
    "",

    "## Solutions by space",
    "",
    ...spaces.map((space) => `- ${space.name}: ${space.blurb} Includes ${space.includes}.`),
    "",

    "## Services",
    "",
    ...services.map((service) => `- ${service.name}: ${service.blurb}`),
    "",

    "## Completed projects",
    "",
    ...projects.map(
      (project) =>
        `- ${project.name}${project.city ? ` (${project.city})` : ""}: ${project.delivered}`,
    ),
    "",

    "## Key pages",
    "",
    `- [Home](${url("/")}): what Cohuman makes and who it makes it for.`,
    `- [Catalog](${url("/catalog")}): every product, filterable by category and price band.`,
    `- [Collections](${url("/collections")}): the desking series and their configurators.`,
    `- [Sectors](${url("/sectors")}): executive, healthcare and residential work.`,
    `- [Solutions by space](${url("/solutions")}): furniture schedules by room type.`,
    `- [Services](${url("/services")}): space planning, fit-out, installation, aftercare.`,
    `- [Projects](${url("/projects")}): photographed installs.`,
    `- [B2B and bulk orders](${url("/b2b")}): multi-site and volume enquiries.`,
    `- [About](${url("/about")}): history and manufacturing.`,
    `- [Contact and showroom](${url("/contact")}): quote form, showroom booking, FAQ.`,
    "",
    ...footerLines(new Date().toISOString().slice(0, 10)),
  ];

  return lines.join("\n");
}

/** One product, expanded to everything the PDP states about it. */
function productSection(
  product: Awaited<ReturnType<typeof catalog.getProducts>>[number],
  categoryLabel: string,
): string[] {
  return [
    `### ${product.name}`,
    "",
    `- URL: ${url(`/catalog/${product.slug}`)}`,
    `- Category: ${categoryLabel}`,
    `- Price band: ${PRICE_BAND_LABEL[product.band]} (price on request — no public figure)`,
    `- Summary: ${product.tagline}`,
    `- Materials: ${product.materials}`,
    `- Sizes: ${product.sizes}`,
    `- Lead time: ${product.lead}`,
    `- Warranty: ${product.warranty}`,
    ...(product.features.length
      ? ["- Features:", ...product.features.map((feature) => `  - ${feature}`)]
      : []),
    "",
  ];
}

/** One desking series, expanded to its configurations, elements and finishes. */
function seriesSection(series: (typeof ALL_SERIES)[number]): string[] {
  const codeLabel = series.codeLabel ?? "Element code";

  return [
    `### ${series.name} (wordmark: ${series.wordmark})`,
    "",
    `- URL: ${url(`/collections/${series.slug}`)}`,
    `- Positioning: ${series.promise}`,
    `- Overview: ${series.intro}`,
    `- Working height: ${series.workingHeightMm} mm, fixed across the range.`,
    `- Configurations: ${series.configs.length}. A quote needs a configuration, a length and a depth.`,
    "",
    `#### ${series.wordmark} configurations`,
    "",
    ...series.configs.flatMap((config) => {
      const shape = config.dia
        ? "round top, quoted as a diameter"
        : config.sq
          ? "square top, depth follows the side length"
          : "rectangular top";
      return [
        `- ${config.n}. ${config.name} — ${shape}.`,
        `  - ${codeLabel}: ${config.code}`,
        `  - ${config.dia ? "Diameters" : "Lengths"} (mm): ${chartLengths(config)}`,
        ...(config.dia || config.sq ? [] : [`  - Depths (mm): ${chartDepths(config)}`]),
        `  - Seats: ${config.seats}`,
        `  - Beam: ${config.beam}`,
        ...(config.bom.length
          ? [
              "  - Bill of components:",
              ...config.bom.map((line) => `    - ${line.qty} × ${line.name} (${line.code})`),
            ]
          : config.bomNote
            ? [`  - Components: ${config.bomNote}`]
            : []),
      ];
    }),
    "",
    `#### ${series.wordmark} element set`,
    "",
    ...series.elements.map(
      (element) => `- ${element.ref}. ${element.kind} — ${element.name} (${element.code}). ${element.note}`,
    ),
    ...(series.elementsNote ? ["", series.elementsNote] : []),
    "",
    `#### ${series.wordmark} construction`,
    "",
    ...series.parts.flatMap((part) => [
      `- ${part.n}. ${part.name} (${part.group}). ${part.why}`,
      ...part.rows.map((row) => `  - ${row.k}: ${row.v}`),
    ]),
    "",
    ...(series.swatches?.length
      ? [
          `#### ${series.wordmark} finishes`,
          "",
          ...series.swatches.map(
            (swatch) =>
              `- ${swatch.name}${swatch.code ? ` (${swatch.code})` : ""}: ${swatch.spec}`,
          ),
          ...(series.swatchesFootnote ? ["", series.swatchesFootnote] : []),
          "",
        ]
      : []),
    ...(series.accessory
      ? [
          `#### ${series.wordmark} — ${series.accessory.heading}`,
          "",
          series.accessory.blurb,
          "",
          ...series.accessory.rows.map(
            (row) =>
              `- ${row.code}: ${series.accessory!.columns[1]} ${row.min}, ${series.accessory!.columns[2]} ${row.max}`,
          ),
          "",
        ]
      : []),
    ...(series.inferredCodes.length
      ? [
          `Note on ${series.wordmark} part numbers: ${series.inferredCodes.join(", ")} are pattern-matched from confirmed codes rather than printed in the manufacturer's specification. Treat them as provisional and confirm on enquiry.`,
          "",
        ]
      : []),
  ];
}

/** The full file: the same site with its body content inlined. */
export async function buildLlmsFullTxt(): Promise<string> {
  const [categories, collections, products, projects, sectors, services, spaces] =
    await Promise.all([
      catalog.getCategories(),
      catalog.getCollections(),
      catalog.getProducts(),
      catalog.getProjects(),
      catalog.getSectors(),
      catalog.getServices(),
      catalog.getSpaces(),
    ]);

  const yearsInBusiness = new Date().getFullYear() - siteConfig.foundedYear;

  const lines = [
    ...identityLines(yearsInBusiness),
    "This is the expanded companion to /llms.txt: the same site with its content inlined, so a question about a size, a material or a lead time can be answered from this file alone.",
    "",
    ...guidanceLines(),

    "## Company",
    "",
    `- Legal entity: ${siteConfig.legalName}`,
    `- Founded: ${siteConfig.foundedYear} by ${siteConfig.founder}, in Surat, Gujarat, India`,
    `- Trading name: ${siteConfig.name}, previously Furniture Concepts`,
    `- Address: ${siteConfig.address.line1}, ${siteConfig.address.line2}`,
    `- Email: ${siteConfig.email}`,
    ...siteConfig.emails.map((inbox) => `- ${inbox.label}: ${inbox.address}`),
    `- Brands represented: ${siteConfig.brandsRepresented.join(", ")}`,
    "- Areas served: Gujarat and Maharashtra primarily, India nationally",
    `- Quote turnaround: ${siteConfig.enquiryTurnaround}`,
    "",

    "## Desking series in full",
    "",
    ...collections.flatMap((collection) => {
      const series = ALL_SERIES.find((s) => s.slug === collection.slug);
      return series ? seriesSection(series) : [];
    }),

    "## Product catalog in full",
    "",
    "Every product is quoted, not priced. The band is a relative position in the range, not a number.",
    "",
    ...products.flatMap((product) =>
      productSection(product, resolveCatLabel(categories, product.cat)),
    ),

    "## Sectors in full",
    "",
    ...sectors.flatMap((sector) => [
      `### ${sector.name} — ${sector.kicker}`,
      "",
      `- URL: ${url(`/sectors/${sector.slug}`)}`,
      "",
      sector.blurb,
      "",
      ...(sector.considerations.length
        ? [
            "What specifying for this sector demands:",
            "",
            ...sector.considerations.map(
              (consideration) => `- ${consideration.title}: ${consideration.detail}`,
            ),
            "",
          ]
        : []),
      ...(sector.ranges.length
        ? [
            "Named ranges:",
            "",
            ...sector.ranges.map(
              (range) => `- ${range.name}: ${range.note}${range.spec ? ` (${range.spec})` : ""}`,
            ),
            "",
          ]
        : []),
    ]),

    "## Solutions by space",
    "",
    "Furniture specified by the room rather than by the SKU.",
    "",
    ...spaces.flatMap((space) => [
      `### ${space.name}`,
      "",
      space.blurb,
      "",
      `- Includes: ${space.includes}`,
      "",
    ]),

    "## Services",
    "",
    ...services.flatMap((service) => [
      `### ${service.name}`,
      "",
      service.blurb,
      "",
      service.detail,
      "",
      ...(service.deliverables.length
        ? ["Deliverables:", "", ...service.deliverables.map((item) => `- ${item}`), ""]
        : []),
    ]),

    "## Completed projects",
    "",
    ...projects.flatMap((project) => [
      `### ${project.name}${project.city ? ` — ${project.city}` : ""}`,
      "",
      project.delivered,
      "",
    ]),

    ...footerLines(new Date().toISOString().slice(0, 10)),
  ];

  return lines.join("\n");
}
