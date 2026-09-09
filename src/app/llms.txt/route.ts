import { buildLlmsTxt } from "@/lib/llms/build";

/*
  llms.txt (https://llmstxt.org) — the index a model reads to understand what this site
  is and where each page lives. Generated from the same catalog data as the sitemap, so
  it cannot drift out of sync with the pages it points at. The expanded companion, with
  every size and specification inlined, is at /llms-full.txt.
*/
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  return new Response(await buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
