import { test, expect } from "@playwright/test";
import { isSelectedReviewSlug, selectedReviewBrokers } from "../src/lib/reviews/selection";
import { getReview, researchEntries, researchInventory, relatedReviewLinks } from "../src/lib/reviews/catalog";

test("all CSV identities have the shared template and valid, reciprocal research links", () => {
  expect(researchInventory).toEqual({ total: 325, retail: 298, separate: 27 });
  expect(researchEntries).toHaveLength(325);
  const types = Object.fromEntries(["retail", "institutional", "interbank", "introducing"].map(type => [type, researchEntries.filter(entry => entry.providerType === type).length]));
  expect(types).toEqual({ retail: 298, institutional: 14, interbank: 12, introducing: 1 });
  const incoming = new Map<string, number>();
  for (const entry of researchEntries) {
    const result = getReview(entry.slug)!;
    expect(result.review.author?.name).toBe("David Odoi");
    expect(result.review.providerType).toBe(entry.providerType);
    expect(result.review.status).toBe("draft");
    expect(result.review.overallScore).toBeNull();
    const links = relatedReviewLinks(entry.slug);
    expect(links).toHaveLength(3);
    expect(new Set(links.map(link => link.slug)).size).toBe(3);
    expect(links.some(link => link.slug === entry.slug)).toBe(false);
    for (const link of links) {
      const url = new URL(link.href, "https://example.com");
      const target = getReview(link.slug, url.searchParams.get("country") ?? undefined);
      expect(target, link.href).not.toBeNull();
      if (entry.providerType !== "introducing") expect(target!.review.providerType).toBe(entry.providerType);
      incoming.set(link.slug, (incoming.get(link.slug) ?? 0) + 1);
    }
  }
  for (const entry of researchEntries.filter(entry => entry.providerType !== "introducing")) expect(incoming.get(entry.slug) ?? 0, entry.slug).toBeGreaterThanOrEqual(2);
  for (const link of relatedReviewLinks("pepperstone", "Australia")) {
    const url = new URL(link.href, "https://example.com");
    expect(getReview(link.slug, url.searchParams.get("country") ?? undefined)).not.toBeNull();
  }
});


test("the selected review cards are crawlable without JavaScript and the bulk archive stays hidden", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:3100/reviews");
    await expect(page.locator("main article")).toHaveCount(selectedReviewBrokers.length);
    for (const broker of selectedReviewBrokers) await expect(page.locator(`main article a[href="/reviews/${broker.slug}"]`)).toBeVisible();
    const html = await page.content();
    for (const entry of researchEntries.filter(entry => !isSelectedReviewSlug(entry.slug))) expect(html).not.toContain(`/reviews/${entry.slug}`);
    await expect(page.getByRole("button", { name: "Preview unpublished research", exact: true })).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  } finally { await context.close(); }
});

test("institutional, interbank and introducing profiles remain in the source archive, not the public website", async ({ request }) => {
  for (const type of ["institutional", "interbank", "introducing"]) {
    const entry = researchEntries.find(record => record.providerType === type)!;
    const review = getReview(entry.slug)!.review;
    expect(review.providerType).toBe(type);
    expect(review.accountOpening.url).toBeNull();
    expect((await request.get(`/reviews/${entry.slug}`)).status()).toBe(410);
    expect((await request.get(`/reviews/${entry.slug}/data`)).status()).toBe(410);
  }
});

test("selected retail reviews retain their shared actions, cost explanations and related selected brokers", async ({ page }) => {
  await page.goto("/reviews/ic-markets");
  await expect(page.locator("main.br-review")).toHaveCount(1);
  await expect(page.locator("[data-account-cta]")).toHaveCount(5);
  await expect(page.locator("[data-illustrative-cost]")).toContainText("Not a measured IC Markets quote");
  await expect(page.locator("#platforms")).toBeAttached();
  await expect(page.locator('.br-related a[href^="/reviews/"]')).toHaveCount(selectedReviewBrokers.length - 1); // Other selected profiles; the library uses /reviews#all-providers.
  await expect(page.locator(".br-accountability a")).toHaveText("David Odoi");
  await expect(page.locator(".br-accountability")).toContainText("Available on site");
});

test("the smaller directory search and selected review pages fit mobile screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/reviews");
  await expect(page.getByRole("status")).toContainText(`${selectedReviewBrokers.length} entries`);
  await page.getByRole("searchbox", { name: "Search broker reviews" }).fill("XM");
  await expect(page.locator("main article")).toHaveCount(1);
  await page.getByRole("searchbox", { name: "Search broker reviews" }).fill("");
  await page.getByText("Browse the selected broker reviews", { exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const broker of selectedReviewBrokers) {
    await page.goto(`/reviews/${broker.slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), broker.slug).toBe(true);
  }
});
