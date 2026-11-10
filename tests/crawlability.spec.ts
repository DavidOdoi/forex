import { test, expect } from "@playwright/test";
import { deploymentAllowsIndexing, indexable, publicPaths, siteOrigin } from "../src/lib/site";
import { publishedReviews } from "../src/lib/reviews/visibility";

test("the confirmed public domain is indexable without requiring a redundant environment variable", () => {
  expect(siteOrigin).toBe(new URL(process.env.SITE_URL?.trim() || "https://devinforex-five.vercel.app").origin);
  expect(deploymentAllowsIndexing(undefined)).toBe(true);
  expect(deploymentAllowsIndexing("production")).toBe(true);
  expect(deploymentAllowsIndexing("preview")).toBe(false);
  expect(deploymentAllowsIndexing("development")).toBe(false);
});

test("robots advertises the canonical sitemap and every sitemap URL is unique, crawlable and indexable", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(robots.headers()["content-type"]).toContain("text/plain");
  const rules = await robots.text();
  expect(rules).toContain("Allow: /");
  expect(rules).not.toMatch(/Disallow: \/(?:\s|$)/);
  if (indexable) expect(rules).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");
  const xml = await response.text();
  expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll("&amp;", "&"));
  expect(new Set(urls).size).toBe(urls.length);
  if (indexable) for (const path of publicPaths.filter(path => path !== "/reviews" || publishedReviews().length > 0)) expect(urls).toContain(new URL(path, siteOrigin).href);
  for (const url of urls) {
    const parsed = new URL(url);
    expect(parsed.origin).toBe(siteOrigin);
    expect(parsed.hash).toBe("");
    const page = await request.get(parsed.pathname + parsed.search, { maxRedirects: 0 });
    expect(page.status(), url).toBe(200);
    expect(page.headers()["x-robots-tag"] ?? "", url).not.toMatch(/noindex/i);
    const html = await page.text();
    expect(html, url).toMatch(/name="robots" content="index, follow"/);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    expect(canonical, url).not.toBeNull();
    expect(new URL(canonical![1]).href, url).toBe(url);
  }
});

test("unfinished profiles, previews and data endpoints are excluded without blocking noindex discovery", async ({ request, page }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/reviews", "/reviews/exness", "/reviews/aaafx", "/reviews/aafx-trading", "/reviews/template", "/best-brokers", "/find-my-broker", "/authors/david-odoi", "/insights/image-credits"]) {
    expect(xml).not.toContain(`<loc>${siteOrigin}${path}</loc>`);
    const response = await page.goto(path);
    if (["/reviews/aaafx", "/reviews/aafx-trading"].includes(path)) {
      expect(response?.status()).toBe(410);
      expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    } else await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
  const data = await request.get("/reviews/aaafx/data");
  expect(data.status()).toBe(410);
  expect(data.headers()["x-robots-tag"].split(/,\s*/)).toContain("noindex");
});
