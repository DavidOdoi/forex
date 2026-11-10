import { test, expect } from "@playwright/test";
import { getReview, researchEntries } from "../src/lib/reviews/catalog";
import { publishedReviews, selectPublishedReviewEntries, visibleReviewEntries, getVisibleReview } from "../src/lib/reviews/visibility";
import { isReviewPublished } from "../src/lib/reviews/publication";
import { reviewMetadata } from "../src/lib/reviews/seo";
import { siteOrigin } from "../src/lib/site";
import { selectedReviewBrokers, isSelectedReviewSlug } from "../src/lib/reviews/selection";

test("website availability does not fabricate editorial approval or indexing eligibility", () => {
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


test("exactly four selected reviews are visible without exposing the archived bulk preview", async ({ page, request }) => {
  expect(researchEntries).toHaveLength(325); // Source archive is preserved.
  expect(visibleReviewEntries().map(entry => entry.slug)).toEqual(selectedReviewBrokers.map(broker => broker.slug));
  await page.goto("/reviews", { waitUntil: "networkidle" });
  await expect(page.locator("main article")).toHaveCount(4);
  await expect(page.getByRole("button", { name: "Preview unpublished research", exact: true })).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("4 entries");
  const html = await page.content();
  for (const entry of researchEntries.filter(entry => !isSelectedReviewSlug(entry.slug))) expect(html).not.toContain(`/reviews/${entry.slug}`);
  for (const broker of selectedReviewBrokers) {
    const link = page.locator("main article").filter({ has: page.getByRole("heading", { name: broker.name, exact: true }) }).getByRole("link", { name: "Read review", exact: true });
    await expect(link).toHaveAttribute("href", `/reviews/${broker.slug}`);
    const response = await request.get(`/reviews/${broker.slug}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    const data = await (await request.get(`/reviews/${broker.slug}/data`)).json();
    expect(data.review.status).toBe("draft");
    expect(data.review.overallScore).toBeNull();
    expect(data.review.relatedResearch).toHaveLength(3);
    expect(data.review.relatedResearch.every((entry: { slug: string }) => isSelectedReviewSlug(entry.slug))).toBe(true);
  }
  await page.getByRole("searchbox", { name: "Search broker reviews" }).fill("Pepperstone");
  await expect(page.locator("main article")).toHaveCount(1);
  await page.getByRole("link", { name: "Read review", exact: true }).click();
  await expect(page).toHaveURL(/\/reviews\/pepperstone$/);
  await expect(page.locator("h1")).toContainText("Pepperstone Review");
  const preview = await request.get("/api/review-research");
  expect(preview.status()).toBe(410);
  expect((await preview.json()).entries).toBeUndefined();
});

test("retired broker URLs are gone while only the selected four can appear in public navigation", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).not.toContain(`<loc>${siteOrigin}/reviews</loc>`);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  expect(urls).toHaveLength(37);
  for (const url of urls) {
    const response = await request.get(new URL(url).pathname);
    const html = await response.text();
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => new URL(match[1].replaceAll("&amp;", "&"), siteOrigin));
    for (const link of links.filter(link => link.origin === siteOrigin && /^\/reviews\/[^/]+/.test(link.pathname))) expect(isSelectedReviewSlug(link.pathname.split("/")[2]), url).toBe(true);
  }
  for (const slug of ["etoro", "4xc", "aaafx", "aafx-trading", "avatrade", "afterprime"]) {
    expect(getVisibleReview(slug)).toBeNull();
    for (const suffix of ["", "/data"]) {
      const response = await request.get(`/reviews/${slug}${suffix}`);
      expect(response.status(), slug+suffix).toBe(410);
      expect(response.headers()["x-robots-tag"]).toContain("noindex");
    }
  }
  expect((await request.get("/reviews/no-such-broker")).status()).toBe(404);
  const rules = await (await request.get("/robots.txt")).text();
  expect(rules).toContain("Allow: /");
  expect(rules).not.toContain("Disallow: /reviews");
});
