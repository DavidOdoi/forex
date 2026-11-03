import { test, expect } from "@playwright/test";
import { getReview, researchEntries, directoryEntries, reviewCountries } from "../src/lib/reviews/catalog";
import { reviewedFields } from "../src/lib/reviews/curated";
import { fieldValue } from "../src/lib/reviews/template";

test("all retail records retain identity, country separation and evidence integrity", () => {
  expect(researchEntries).toHaveLength(298);
  expect(new Set(researchEntries.map(e => e.slug)).size).toBe(298);
  expect(directoryEntries().filter(e => e.sourceCount > 0).length).toBeGreaterThan(230);
  const countries = new Set(researchEntries.flatMap(e => reviewCountries(e.slug)));
  for (const country of ["Kenya", "United Kingdom", "Australia", "Cyprus", "Seychelles", "Singapore", "United Arab Emirates", "Mauritius", "Cayman Islands"])
    expect(countries.has(country), country).toBe(true);
  for (const entry of researchEntries) {
    expect(entry.notes.reduce((n, note) => n + note.excerpt.split(/\s+/).length, 0)).toBeLessThanOrEqual(75);
    expect(entry.notes.every(note => entry.sources.some(s => s.id === note.sourceId))).toBe(true);
    for (const country of reviewCountries(entry.slug).length ? reviewCountries(entry.slug) : [undefined]) {
      const { review } = getReview(entry.slug, country)!;
      expect(review.status).toBe("draft");
      expect(review.overallScore).toBeNull();
      expect(review.accountOpening.url).toBeNull();
      for (const field of reviewedFields(review).filter(f => f.status === "verified")) {
        expect(fieldValue(field, review)).toBe(field.value);
        expect(field.jurisdiction).toBe(country);
      }
    }
  }
});

test("default template shows the populated FXPesa review, citations and five account placements", async ({ page, request }) => {
  await page.goto("/reviews/template");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FXPesa review");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("#key-data")).toContainText("US$100");
  await expect(page.locator("#fees")).toContainText("US$3.50");
  await expect(page.locator("#deposit-and-withdrawal")).toContainText("M-Pesa");
  await expect(page.locator(".review-source-list li")).toHaveCount(10);
  await expect(page.locator("[data-account-cta]")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "Open an account with FXPesa", exact: true })).toHaveCount(5);
  await page.locator("#key-data .review-citations a").first().click();
  await expect(page).toHaveURL(/#source-accounts$/);
  const json = await request.get("/reviews/fxpesa/data?country=Kenya");
  expect(json.headers()["x-robots-tag"]).toContain("noindex");
  const record = await json.json();
  expect(record.review.broker.name).toBe("FXPesa");
  expect(record.review.chapters).toHaveLength(7);
  expect(reviewedFields(record.review).filter(f => f.status === "verified").length).toBeGreaterThan(30);
});

test("country selector loads the correct entity and rejects unsupported country combinations", async ({ page, request }) => {
  await page.goto("/reviews/pepperstone?country=Australia");
  await expect(page.locator("#key-data")).toContainText("Pepperstone Group Limited");
  await expect(page.locator("#safety")).toContainText("414530");
  await expect(page.locator("#safety")).not.toContainText("CMA licence 128");
  await page.getByLabel("Country / entity profile").selectOption("Kenya");
  await expect(page).toHaveURL(/country=Kenya/);
  await expect(page.locator("#safety")).toContainText("Pepperstone Markets Kenya Limited");
  await expect(page.locator("#safety")).toContainText("128");
  await expect(page.locator("#safety")).not.toContainText("414530");
  await page.goto("/reviews/etoro?country=Singapore");
  await expect(page.locator("#safety")).toContainText("CMS101824");
  expect((await request.get("/reviews/etoro/data?country=Kenya")).status()).toBe(404);
  expect((await request.get("/reviews/not-a-real-broker")).status()).toBe(404);
});

test("directory search, status filters and pagination expose research without promoting unverified claims", async ({ page }) => {
  await page.goto("/reviews");
  await expect(page.getByRole("status")).toContainText("298 brokers");
  await expect(page.locator("article")).toHaveCount(24);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Page 2");
  await page.getByRole("searchbox", { name: "Search broker reviews" }).fill("eToro");
  await expect(page.getByRole("status")).toContainText("1 brokers");
  await expect(page.locator("article")).toContainText("Singapore");
  await page.getByRole("link", { name: "Open research draft" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("eToro review");
  await page.goto("/reviews");
  await page.getByLabel("Research status").selectOption("pending");
  await expect(page.locator("article").first()).toContainText("Research pending");
});

test("populated reviews and directory fit mobile and desktop without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/reviews", "/reviews/template", "/reviews/etoro?country=United%20Kingdom", "/reviews/aaafx"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${path} at ${width}px`).toBe(true);
      if (path === "/reviews/template") await page.screenshot({ path: `test-results/populated-review-${width}.png` });
    }
  }
  expect(errors).toEqual([]);
});
