import { catalog } from "@/lib/catalog";
import { siteConfig } from "@/lib/site-config";

// llms.txt (https://llmstxt.org) — a plain-text map of the site for AI
// answer engines (ChatGPT, Perplexity, Claude, etc.), generated from the same
// catalog data as the sitemap so it can't drift out of sync.
export async function GET() {
  const [categories, collections, services, sectors] = await Promise.all([
    catalog.getCategories(),
    catalog.getCollections(),
    catalog.getServices(),
    catalog.getSectors(),
  ]);

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.tagline}. ${siteConfig.legalName}, founded ${siteConfig.foundedYear} in Surat, Gujarat, India. Request-a-quote office furniture manufacturer and fit-out contractor — no online checkout, no public price list, no accounts.`,
    "",
    "## Company",
    `- Founded ${siteConfig.foundedYear} by ${siteConfig.founder} as Furniture Concepts, rebranded Cohuman.`,
    `- Typical quote turnaround: ${siteConfig.enquiryTurnaround}.`,
    "- Pricing is quote-based, shown only as qualitative bands (Value / Mid / Premium) on product pages — never a fixed public price.",
    "- No e-commerce cart, no user accounts, no AI room visualizer.",
    "",
    "## Product categories",
    ...categories.map((c) => `- ${c.label}`),
    "",
    "## Collections",
    ...collections.map((c) => `- [${c.name}](${siteConfig.url}/collections/${c.slug}): ${c.blurb}`),
    "",
    "## Sectors",
    ...sectors.map(
      (s) => `- [${s.name}](${siteConfig.url}/sectors/${s.slug}): ${s.kicker}. ${s.blurb}`,
    ),
    "",
    "## Services",
    ...services.map((s) => `- ${s.name}: ${s.blurb}`),
    "",
    "## Key pages",
    `- [Full catalog](${siteConfig.url}/catalog): every product, filterable by category and collection.`,
    `- [B2B / bulk orders](${siteConfig.url}/b2b): dedicated route for bulk and multi-site orders, separate from the standard enquiry form.`,
    `- [Solutions by space](${siteConfig.url}/solutions): furniture recommendations grouped by room type (cabin, workstation, meeting, lounge).`,
    `- [Projects](${siteConfig.url}/projects): completed fit-outs.`,
    `- [About](${siteConfig.url}/about): company history and manufacturing.`,
    `- [Contact & showroom](${siteConfig.url}/contact): quote form, showroom visit booking, FAQ.`,
    "",
    `Full sitemap: ${siteConfig.url}/sitemap.xml`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
