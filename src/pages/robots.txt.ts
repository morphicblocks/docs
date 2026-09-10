import type { APIRoute } from "astro";

// Served at /robots.txt. The site URL comes from PUBLIC_SITE_URL via the
// `site` option in astro.config.mjs, so nothing is hardcoded here. Starlight
// generates the sitemap itself whenever `site` is set.
export const GET: APIRoute = ({ site }) => {
  const lines = ["User-agent: *", "Allow: /"];
  if (site) lines.push("", `Sitemap: ${new URL("sitemap-index.xml", site).href}`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
