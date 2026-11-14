import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { deploymentAllowsIndexing, indexable, publicPaths, siteOrigin } from "../src/lib/site";
import { visibleReviews } from "../src/lib/reviews/visibility";
import { reviewUrl, reviewMetadata } from "../src/lib/reviews/seo";
import { isReviewPublished } from "../src/lib/reviews/publication";
import { countryGuides, countryRegistry } from "../src/lib/country-guides/catalog";
import { countryGuidePath, countryGuideMetadata } from "../src/lib/country-guides/seo";
import { guideApproved } from "../src/lib/country-guides/publication";
import { insightArticles } from "../src/lib/insights/catalog";
import { calculators, toolPath } from "../src/lib/calculators/catalog";
import { hubPaths } from "../src/lib/metals/content";

function staticContentPaths(directory = "src/app"): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return staticContentPaths(path);
    if (entry.name !== "page.tsx" || path.includes("[") || readFileSync(path, "utf8").includes("permanentRedirect(")) return [];
    const route = "/" + relative("src/app", directory).split("/").filter(part => part && !part.startsWith("(")).join("/");
    return route === "/reviews/template" ? [] : [route];
  });
}

test("the canonical production domain is indexable while preview and development deployments remain excluded", () => {
  expect(siteOrigin).toBe(new URL(process.env.SITE_URL?.trim() || "https://www.devinforex.com").origin);
  expect(deploymentAllowsIndexing(undefined)).toBe(true);
  expect(deploymentAllowsIndexing("production")).toBe(true);
  expect(deploymentAllowsIndexing("preview")).toBe(false);
  expect(deploymentAllowsIndexing("development")).toBe(false);
});

test("owner-authorised indexing preserves factual and editorial verification status", () => {
  for (const review of visibleReviews()) {
    expect(isReviewPublished(review)).toBe(false);
    expect(review.publication?.approvedBy ?? null).toBeNull();
    expect(review.overallScore).toBeNull();
    expect(reviewMetadata(review, true).robots).toEqual({ index: true, follow: true });
    expect(reviewMetadata(review, false).robots).toEqual({ index: false, follow: true });
  }
  for (const country of countryGuides) {
    expect(guideApproved(country, countryRegistry, "2026-11-14")).toBe(false);
    expect(countryGuideMetadata(country).robots).toEqual({ index: indexable, follow: true });
  }
});

test("the complete sitemap covers all public content and every URL is canonical, crawlable and indexable", async ({ request }) => {
  test.setTimeout(120_000);
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
  const expected = new Set([
    ...staticContentPaths(), ...publicPaths,
    ...visibleReviews().map(review => reviewUrl(review)),
    ...countryGuides.map(country => countryGuidePath(country.slug)),
    ...insightArticles.map(article => `/insights/${article.slug}`),
    ...calculators.map(toolPath), ...hubPaths,
  ].map(path => new URL(path, siteOrigin).href));
  expect(new Set(urls)).toEqual(indexable ? expected : new Set());
  for (let i = 0; i < urls.length; i += 6) await Promise.all(urls.slice(i, i + 6).map(async url => {
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
    expect(new URL(canonical![1].replaceAll("&amp;", "&")).href, url).toBe(url);
  }));
  console.log(`Indexing audit: ${urls.length} canonical content URLs, all HTTP 200 with index/follow and no blocking response headers.`);
});

test("duplicate templates, retired URLs and data responses remain outside the content sitemap", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/reviews/aaafx", "/reviews/template", "/templates/exness-review.html", "/reviews/exness/data", "/api/metals"]) {
    expect(xml).not.toContain(`<loc>${siteOrigin}${path}</loc>`);
    const response = await request.get(path);
    expect(response.headers()["x-robots-tag"], path).toContain("noindex");
  }
  expect((await request.get("/reviews/aaafx")).status()).toBe(410);
  for (const path of ["/how-to-start-forex-trading-in-south-africa", "/usdc-vs-ethereum-sending-money"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toContain("/insights/");
  }
});
