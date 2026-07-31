import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

// Explicit allow rules for AI answer-engine crawlers, on top of the wildcard
// below — keeps this site fetchable/citable by AI search even if a future
// blanket disallow for unnamed bots is added.
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
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
