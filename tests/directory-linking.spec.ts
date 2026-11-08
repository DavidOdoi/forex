import { test, expect } from "@playwright/test";
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

test("the public directory does not expose draft links or data without an explicit preview action", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:3100/reviews");
    await expect(page.locator('a[href^="/reviews/"]')).toHaveCount(0);
    const html = await page.content();
    for (const entry of researchEntries) expect(html).not.toContain(`/reviews/${entry.slug}`);
    await expect(page.getByRole("button", { name: "Preview unpublished research", exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  } finally { await context.close(); }
});

test("institutional, interbank and introducing entries retain clear source and access limitations", async ({ page, request }) => {
  for (const type of ["institutional", "interbank", "introducing"]) {
    const entry = researchEntries.find(record => record.providerType === type)!;
    await page.goto(`/reviews/${entry.slug}`);
    await expect(page.locator("main.br-review")).toHaveCount(1);
    await expect(page.locator(".br-provider-note")).toContainText("Verification is pending");
    await expect(page.locator("[data-account-cta]")).toHaveCount(0);
    await expect(page.locator("#account-opening")).toContainText("minimum commitment");
    await expect(page.locator("#deposit-and-withdrawal")).toContainText("settlement timelines require verification");
    await expect(page.locator("[data-illustrative-cost]")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('.br-related a[href^="/reviews/"]')).toHaveCount(0);
    const json = (await (await request.get(`/reviews/${entry.slug}/data`)).json()).review;
    expect(json.accountOpening.url).toBeNull();
    expect(json.keyData.every((field: { status: string }) => field.status !== "verified")).toBe(true);
  }
});

test("ordinary retail profiles reuse the five actions, cost explanation, scope and related links", async ({ page }) => {
  await page.goto("/reviews/aaafx");
  await expect(page.locator("main.br-review")).toHaveCount(1);
  await expect(page.getByRole("complementary", { name: "Review verdict" })).toContainText("a full trading-cost and suitability verdict is pending");
  await expect(page.locator("[data-account-cta]")).toHaveCount(5);
  await expect(page.locator("[data-illustrative-cost]")).toContainText("Not a measured AAAFx quote");
  await expect(page.locator("[data-illustrative-cost]")).not.toContainText("Exness");
  await expect(page.locator("#platforms")).toBeAttached();
  await expect(page.locator(".br-related a")).toHaveCount(2);
  await expect(page.locator(".br-accountability a")).toHaveText("David Odoi");
});

test("provider filters and the expanded directory remain usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/reviews");
  await page.getByRole("button", { name: "Preview unpublished research", exact: true }).click();
  await page.getByLabel("Directory type", { exact: true }).selectOption("institutional");
  await expect(page.getByRole("status")).toContainText("14 entries");
  await expect(page.locator("article")).toHaveCount(14);
  await page.getByLabel("Directory type", { exact: true }).selectOption("interbank");
  await expect(page.getByRole("status")).toContainText("12 entries");
  await page.getByLabel("Directory type", { exact: true }).selectOption("retail");
  await expect(page.getByRole("status")).toContainText("298 entries");
  await page.getByText("Browse the complete directory", { exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/reviews/advanced-markets");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
