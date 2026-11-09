import { test, expect } from "@playwright/test";
import { getReview, researchEntries } from "../src/lib/reviews/catalog";
import { publishedReviews, selectPublishedReviewEntries } from "../src/lib/reviews/visibility";
import { isReviewPublished } from "../src/lib/reviews/publication";
import { reviewMetadata } from "../src/lib/reviews/seo";
import { siteOrigin } from "../src/lib/site";

test("drafts are excluded and only a genuinely approved record can enter the public directory", () => {
  expect(publishedReviews()).toEqual([]);
  const draft = getReview("exness")!.review;
  expect(selectPublishedReviewEntries([draft])).toEqual([]);
  const approved = structuredClone(draft);
  approved.status = "published";
  approved.author = { name: "Fixture Editor", role: "Editor", profileUrl: "/authors/fixture-editor", bio: "Fictional editor used only in this isolated publication test." };
  approved.publication = { publishedAt: "2026-11-06", updatedAt: "2026-11-06", approvedAt: "2026-11-06", approvedBy: "Fixture Editor" };
  expect(isReviewPublished(approved)).toBe(true);
  expect(selectPublishedReviewEntries([draft, approved])).toEqual([expect.objectContaining({ slug: "exness", href: "/reviews/exness", published: true })]);
  expect(reviewMetadata(approved, true).robots).toEqual({ index: true, follow: true });
  approved.publication.approvedBy = null;
  expect(selectPublishedReviewEntries([approved])).toEqual([]);
});

test("research is fetched only after preview is requested, and saved draft URLs stay usable with noindex headers", async ({ page, request }) => {
  let previewRequests = 0;
  page.on("request", request => { if (new URL(request.url()).pathname === "/api/review-research") previewRequests++; });
  await page.goto("/reviews", { waitUntil: "networkidle" });
  expect(previewRequests).toBe(0);
  await expect(page.locator('a[href^="/reviews/"]')).toHaveCount(0);
  const html = await page.content();
  for (const entry of researchEntries) expect(html).not.toContain(`/reviews/${entry.slug}`);
  await page.getByRole("button", { name: "Preview unpublished research", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("325 entries");
  expect(previewRequests).toBe(1);
  const draft = page.getByRole("link", { name: "Open research draft", exact: true }).first();
  await expect(draft).toHaveAttribute("rel", "nofollow");
  await draft.click();
  await expect(page).toHaveURL(/\/reviews\/4xc$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  const response = await request.get("/reviews/4xc");
  expect(response.status()).toBe(200);
  expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  const data = await request.get("/api/review-research");
  expect(data.headers()["x-robots-tag"]).toContain("noindex");
  expect(data.headers()["cache-control"]).toBe("no-store");
  expect((await data.json()).entries).toHaveLength(325);
});

test("public sitemap pages advertise no draft broker URLs and crawling remains allowed for removal directives", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).not.toContain(`<loc>${siteOrigin}/reviews</loc>`);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  expect(urls).toHaveLength(37);
  for (const url of urls) {
    const response = await request.get(new URL(url).pathname);
    const html = await response.text();
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => new URL(match[1].replaceAll("&amp;", "&"), siteOrigin));
    expect(links.filter(link => link.origin === siteOrigin && /^\/reviews\/[^/]+/.test(link.pathname)), url).toEqual([]);
  }
  const rules = await (await request.get("/robots.txt")).text();
  expect(rules).toContain("Allow: /");
  expect(rules).not.toContain("Disallow: /reviews");
  const preview = await request.get("/reviews/etoro?country=Singapore");
  expect(preview.status()).toBe(200);
  expect(preview.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  const data = await (await request.get("/reviews/aaafx/data")).json();
  expect(data.review.relatedResearch).toEqual([]);
});
