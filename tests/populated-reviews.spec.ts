import { test, expect } from "@playwright/test";
import { getReview, researchEntries, directoryEntries, reviewCountries } from "../src/lib/reviews/catalog";
import { reviewedFields } from "../src/lib/reviews/curated";
import { fieldValue } from "../src/lib/reviews/template";
import { reviewDigest, wordCount } from "../src/lib/reviews/digest";
import { reviewAccounts, reviewQuickFacts } from "../src/lib/reviews/flow";
import { reviewStructuredData } from "../src/lib/reviews/seo";

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

test("short summaries keep critical charge exceptions and respect the evidence guard", () => {
  const { review } = getReview("fxpesa", "Kenya")!;
  const digest = reviewDigest(review);
  const costs = digest.sections.find(s => s.id === "fees")!.fields[0].value!;
  expect(costs).toContain("US$3.50 per lot, per side");
  expect(costs).toContain("Product-specific terms apply");
  const payments = digest.sections.find(s => s.id === "deposit-and-withdrawal")!.fields.map(f => f.value).join(" ");
  expect(payments).toContain("US$30");
  expect(payments).toContain("up to 15 working days");
  expect(reviewDigest(getReview("pepperstone", "Kenya")!.review).sections.flatMap(s => s.fields).map(f => f.value).join(" ")).toContain("US$25/£15");
  review.sources = [];
  expect(reviewDigest(review).sections.every(s => s.fields.length === 0)).toBe(true);
  expect(reviewDigest(review).minimum).toBeUndefined();
  expect(reviewDigest(review).lead).not.toContain("KES and USD");
});

test("every broker and country page stays under 1800 total words, including collapsed text", async ({ request }) => {
  test.setTimeout(120_000);
  const paths = researchEntries.flatMap(e => {
    const countries = reviewCountries(e.slug);
    return countries.length ? countries.map(country => `/reviews/${e.slug}?country=${encodeURIComponent(country)}`) : [`/reviews/${e.slug}`];
  });
  paths.push("/reviews/template");
  const counts: { path: string; words: number }[] = [];
  for (let i = 0; i < paths.length; i += 6) {
    await Promise.all(paths.slice(i, i + 6).map(async path => {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      const html = await response.text();
      // Count all server-rendered body copy, including closed FAQs, navigation,
      // the disclosure dialog and footer. Hydration scripts are not article text.
      const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)![1];
      const text = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
      const words = wordCount(text);
      expect(words, path).toBeLessThanOrEqual(1800);
      counts.push({ path, words });
    }));
  }
  const max = counts.sort((a, b) => b.words - a.words)[0];
  console.log(`Word cap: ${paths.length} pages checked; longest ${max.words} words (${max.path}).`);
});

test("review has useful internal and external links, country canonical metadata and truthful schema", async ({ page, request }) => {
  await page.goto("/reviews/etoro?country=Singapore");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/reviews\/etoro\?country=Singapore$/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /eToro Review 2026:.*Singapore/);
  const schema = await page.locator('script[type="application/ld+json"]').textContent();
  const graph = JSON.parse(schema!)["@graph"];
  expect(graph.map((item: { "@type": string }) => item["@type"])).toEqual(["BreadcrumbList", "FAQPage"]);
  expect(schema).not.toMatch(/AggregateRating|ratingValue/);
  const main = page.getByRole("main");
  for (const href of ["/reviews", "/tools", "/best-brokers", "/about#research-methodology"])
    await expect(main.locator(`a[href="${href}"]:visible`).first()).toBeVisible();
  await expect(main.locator('a[href="https://www.etoro.com/customer-service/regulation-license/"]').first()).toBeVisible();
  const response = await request.get("/about");
  expect(await response.text()).toContain('id="research-methodology"');
});

test("populated FXPesa review retains citations, complete research and five account placements", async ({ page, request }) => {
  await page.goto("/reviews/fxpesa?country=Kenya");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/FXPesa Review 2026/);
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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/eToro Review 2026/);
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
      if (path === "/reviews/template") {
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: `test-results/populated-review-${width}.png` });
        await page.locator("#fees").scrollIntoViewIfNeeded();
        await page.screenshot({ path: `test-results/populated-review-fees-${width}.png` });
      }
    }
  }
  expect(errors).toEqual([]);
});

test("reading navigation and commercial disclosure work with the keyboard", async ({ page }) => {
  await page.goto("/reviews/template");
  const disclosure = page.getByRole("button", { name: "Advertiser disclosure", exact: true });
  await disclosure.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("No affiliate link");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(disclosure).toBeFocused();
  await page.getByRole("navigation", { name: "Review sections" }).getByRole("link", { name: "Trading costs", exact: true }).click();
  await expect(page).toHaveURL(/#fees$/);
  await expect(page.locator("#fees")).toBeInViewport();
  const faq = page.locator("#review-faq details").first();
  await faq.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(faq).toHaveAttribute("open", "");
});

test("Exness template follows the requested table-first flow without unsupported figures", async ({ page }) => {
  await page.goto("/reviews/template");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Exness Review 2026");
  await expect(page.getByRole("complementary", { name: "Review verdict" })).toContainText("Not rated");
  await expect(page.locator(".br-quick-grid > div")).toHaveCount(9);
  await expect(page.locator(".br-quick-grid > div").first()).toContainText("Not verified");
  await expect(page.locator(".br-account-table tbody tr")).toHaveCount(4);
  await expect(page.locator(".br-account-table")).toContainText("From US$0.05 / lot / side");
  await expect(page.locator("#safety")).toContainText("162");
  await expect(page.locator("#safety")).not.toContainText("FCA");
  await expect(page.locator("#deposit-and-withdrawal")).toContainText("24/7");
  expect(await page.locator(".br-article .br-section[id]").evaluateAll(nodes => nodes.map(node => node.id))).toEqual(["overview", "account-opening", "fees", "deposit-and-withdrawal", "safety", "review-faq", "sources"]);
  const faqSchema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"].find((item: { "@type": string }) => item["@type"] === "FAQPage");
  expect(faqSchema.mainEntity.some((item: { name: string }) => item.name.includes("weekends"))).toBe(true);
  expect(faqSchema.mainEntity.some((item: { name: string }) => item.name.includes("market maker"))).toBe(false);
  const smallText = await page.locator("main *").evaluateAll(nodes => nodes.filter(node => node.getClientRects().length && getComputedStyle(node).visibility === "visible" && [...node.childNodes].some(child => child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) && parseFloat(getComputedStyle(node).fontSize) < 16).map(node => ({ text: node.textContent?.slice(0, 40), size: getComputedStyle(node).fontSize })));
  expect(smallText).toEqual([]);
});

test("mobile contents drawer opens, navigates and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/reviews/template");
  const contents = page.getByRole("navigation", { name: "Review sections" });
  const toggle = contents.getByRole("button", { name: "Contents" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await contents.getByRole("link", { name: "Account types", exact: true }).click();
  await expect(page).toHaveURL(/#account-opening$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#account-opening")).toBeInViewport();
});

test("account comparisons, quick facts and rating schema require matching evidence", () => {
  const { review } = getReview("exness", "Kenya")!;
  expect(reviewAccounts(review)).toHaveLength(4);
  expect(reviewQuickFacts(review).find(f => f.label === "Minimum deposit")!.state).toBe("unknown");
  expect(reviewAccounts(getReview("exness", "Seychelles")!.review)).toEqual([]);
  expect(JSON.stringify(reviewStructuredData(review))).not.toContain("ratingValue");
  review.status = "published";
  review.author = { name: "Test Editor", role: "Reviewer" };
  review.verifiedAt = "2026-11-03";
  review.overallScore = { value: 4.8, outOf: 5, methodologyUrl: "https://example.com/methodology", sourceIds: ["standard"] };
  const product = reviewStructuredData(review)["@graph"].find(item => (item as { "@type": string })["@type"] === "Product");
  expect(product).toBeTruthy();
  expect(JSON.stringify(product)).toContain('"ratingValue":4.8');
  expect(JSON.stringify(product)).not.toContain("aggregateRating");
  review.sources = [];
  expect(reviewAccounts(review)).toEqual([]);
  expect(reviewQuickFacts(review).every(f => f.state === "unknown")).toBe(true);
  expect(JSON.stringify(reviewStructuredData(review))).not.toContain("ratingValue");
});

test("standalone HTML includes embedded styles and schema with working native navigation", async ({ page, request }) => {
  const response = await request.get("/templates/exness-review.html");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("<style>");
  expect(html).not.toContain("/_next/");
  await page.goto("/templates/exness-review.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Exness Review 2026");
  await expect(page.locator('script:not([type="application/ld+json"])')).toHaveCount(0);
  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
  await expect(page.locator(".br-account-table tbody tr")).toHaveCount(4);
  await page.getByRole("navigation", { name: "Review sections" }).getByRole("link", { name: "Trading costs", exact: true }).click();
  await expect(page).toHaveURL(/exness-review\.html#fees$/);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
