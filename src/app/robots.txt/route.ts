import { siteConfig } from "@/lib/site-config";

/*
  robots.txt as a route handler rather than the `robots.ts` metadata convention.

  The convention's `MetadataRoute.Robots` type only models `User-agent`, `Allow`,
  `Disallow`, `Crawl-delay`, `Sitemap` and `Host` — there is no way to emit the
  `Llms-txt` / `Llms-full-txt` lines that point answer-engine crawlers at the two
  llms.txt files, and pretending they are sitemaps would put plain text in a field
  that is parsed as XML. Writing the file directly is the only way to advertise them.

  Behaviour is otherwise identical to what the convention produced: everything
  crawlable except /api/, one explicit rule per AI crawler on top of the wildcard,
  and the sitemap.
*/

// Named explicitly on top of the wildcard so this site stays fetchable and citable by
// AI search even if a blanket disallow for unnamed bots is ever added below.
const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "Amazonbot",
  "meta-externalagent",
  "cohere-ai",
  "YouBot",
];

/** One `User-agent` block. `/api/` is POST-only lead intake — nothing to index. */
function agentBlock(userAgent: string): string[] {
  return [`User-agent: ${userAgent}`, "Allow: /", "Disallow: /api/", ""];
}

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const body = [
    ...agentBlock("*"),
    ...AI_CRAWLER_USER_AGENTS.flatMap(agentBlock),
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
    // Non-standard but widely read by answer-engine crawlers, and harmless to the ones
    // that ignore unknown directives: robots.txt parsers are required to skip lines
    // they do not recognise.
    `Llms-txt: ${siteConfig.url}/llms.txt`,
    `Llms-full-txt: ${siteConfig.url}/llms-full.txt`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
