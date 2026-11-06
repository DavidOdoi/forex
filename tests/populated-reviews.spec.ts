import { test, expect } from "@playwright/test";
import { getReview, researchEntries, directoryEntries, reviewCountries } from "../src/lib/reviews/catalog";
import { curatedReview, reviewedFields } from "../src/lib/reviews/curated";
import { fieldValue } from "../src/lib/reviews/template";
import { reviewDigest, wordCount } from "../src/lib/reviews/digest";
import { reviewAccounts, reviewQuickFacts } from "../src/lib/reviews/flow";
import { reviewStructuredData } from "../src/lib/reviews/seo";

test("all directory records retain identity, country separation and evidence integrity", () => {
  expect(researchEntries).toHaveLength(325);
  expect(new Set(researchEntries.map(e => e.slug)).size).toBe(325);
  expect(directoryEntries().filter(e => e.sourceCount > 0).length).toBeGreaterThan(200);
  const countries = new Set(researchEntries.flatMap(e => reviewCountries(e.slug)));
  for (const country of ["Global", "United Kingdom", "Australia", "Cyprus", "Seychelles", "Singapore", "United Arab Emirates", "Mauritius", "Cayman Islands"])
    expect(countries.has(country), country).toBe(true);
  for (const entry of researchEntries) {
    expect(entry.notes.reduce((n, note) => n + note.excerpt.split(/\s+/).length, 0)).toBeLessThanOrEqual(75);
    expect(entry.notes.every(note => entry.sources.some(s => s.id === note.sourceId))).toBe(true);
    for (const country of reviewCountries(entry.slug).length ? reviewCountries(entry.slug) : [undefined]) {
      const { review } = getReview(entry.slug, country)!;
      expect(review.status).toBe("draft");
      expect(review.overallScore).toBeNull();
      if (review.accountOpening.url) expect(review.accountOpening.isAffiliate).toBe(false);
      for (const field of reviewedFields(review).filter(f => f.status === "verified")) {
        expect(fieldValue(field, review)).toBe(field.value);
        expect(field.jurisdiction).toBe(country);
      }
    }
  }
});

test("short summaries keep critical charge exceptions and respect the evidence guard", () => {
  const review = curatedReview("FXPesa", "fxpesa");
  const digest = reviewDigest(review);
  const costs = digest.sections.find(s => s.id === "fees")!.fields[0].value!;
  expect(costs).toContain("US$3.50 per lot, per side");
  expect(costs).toContain("Product-specific terms apply");
  const payments = digest.sections.find(s => s.id === "deposit-and-withdrawal")!.fields.map(f => f.value).join(" ");
  expect(payments).toContain("US$30");
  expect(payments).toContain("up to 15 working days");
  expect(reviewDigest(curatedReview("Pepperstone", "pepperstone")).sections.flatMap(s => s.fields).map(f => f.value).join(" ")).toContain("US$25/£15");
  review.sources = [];
  expect(reviewDigest(review).sections.every(s => s.fields.length === 0)).toBe(true);
  expect(reviewDigest(review).minimum).toBeUndefined();
  expect(reviewDigest(review).lead).not.toContain("KES and USD");
});

test("every broker and country review stays under 1800 words, including collapsed text", async ({ request }) => {
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
      // Count the full review, including its navigation, closed FAQs, disclosure
      // dialog and source footer. Shared site chrome is not article content.
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
      expect(main, `${path} contains the complete review`).toBeDefined();
      const text = main!.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
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

test("global Exness review retains citations, research and five official account links", async ({ page, request }) => {
  await page.goto("/reviews/exness");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Exness Review 2026: Fees, Safety & Account Types");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator(".br-account-table")).toContainText("US$3.50");
  await expect(page.getByRole("columnheader", { name: "Minimum first deposit" })).toBeVisible();
  const minimums = page.locator(".br-account-table tbody tr td:last-child");
  await expect(minimums.first()).toHaveText("Varies by payment method and region");
  await expect(minimums.nth(1)).toHaveText("Varies by payment method and region");
  for (const row of [2, 3, 4]) await expect(minimums.nth(row)).toHaveText("From US$200; region-dependent");
  await expect(minimums.locator("a")).toHaveCount(5);
  await expect(minimums.first().locator("a")).toHaveAttribute("href", /get\.exness\.help\/hc\/en-us\/articles\/17537782786588/);
  await expect(minimums.nth(1).locator("a")).toHaveAttribute("href", /get\.exness\.help\/hc\/en-us\/articles\/360011554840/);
  await expect(page.locator("#deposit-and-withdrawal")).toContainText("24/7");
  await expect(page.locator(".review-source-list li")).toHaveCount(15);
  await expect(page.locator("[data-account-cta]")).toHaveCount(5);
  const links = page.getByRole("link", { name: "Open an account with Exness", exact: true });
  await expect(links).toHaveCount(5);
  await expect(links.first()).toHaveAttribute("href", "https://my.exness.com/accounts/sign-up?lng=en");
  await expect(links.first()).not.toHaveAttribute("rel", /sponsored/);
  await expect(page.getByRole("main")).not.toContainText(/Kenya|M-Pesa|KES\b/);
  await page.locator("#key-data .review-citations a").first().click();
  await expect(page).toHaveURL(/#source-global-minimum-deposit$/);
  const json = await request.get("/reviews/exness/data");
  expect(json.headers()["x-robots-tag"]).toContain("noindex");
  const record = await json.json();
  expect(record.review.jurisdiction).toBe("Global");
  expect(record.review.chapters).toHaveLength(7);
  const minimum = record.review.keyData.find((field: { id: string }) => field.id === "minimum-deposit");
  expect(minimum.checkedAt).toBe("2026-11-06");
  expect(minimum.value).toContain("depending on region");
  expect(reviewedFields(record.review).filter(f => f.status === "verified").length).toBeGreaterThan(18);
});

test("review scope loads distinct entity profiles without a regional site default", async ({ page, request }) => {
  await page.goto("/reviews/pepperstone?country=Australia");
  await expect(page.locator("#safety")).toContainText("414530");
  await page.getByLabel("Review scope").selectOption("Global");
  await expect(page).toHaveURL(/country=Global/);
  await expect(page.getByLabel("Review scope")).toHaveValue("Global");
  await expect(page.locator("#safety")).toContainText("Pepperstone Group Limited");
  await expect(page.getByRole("main")).not.toContainText(/Kenya|CMA licence 128/);
  await page.goto("/reviews/etoro?country=Singapore");
  await expect(page.locator("#safety")).toContainText("CMS101824");
  expect((await request.get("/reviews/etoro/data?country=Kenya")).status()).toBe(404);
  expect((await request.get("/reviews/not-a-real-broker")).status()).toBe(404);
});

test("directory search, status filters and pagination expose research without promoting unverified claims", async ({ page }) => {
  await page.goto("/reviews");
  await expect(page.getByRole("status")).toContainText("325 entries");
  await expect(page.locator("article")).toHaveCount(24);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Page 2");
  await page.getByRole("searchbox", { name: "Search broker reviews" }).fill("eToro");
  await expect(page.getByRole("status")).toContainText("1 entry");
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
  await expect(page.getByRole("dialog")).toContainText("No affiliate tracking");
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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Exness Review 2026: Fees, Safety & Account Types");
  await expect(page.getByRole("complementary", { name: "Review verdict" })).toContainText("Not rated");
  await expect(page.locator(".br-quick-grid > div")).toHaveCount(9);
  await expect(page.locator(".br-quick-grid > div").first()).toContainText("professional: from US$200");
  await expect(page.locator(".br-account-table tbody tr")).toHaveCount(5);
  await expect(page.locator(".br-account-table")).toContainText("From US$0.05 / lot / side");
  await expect(page.locator("#safety")).toContainText("730729");
  await expect(page.locator("#safety")).toContainText("Does not offer services to retail clients");
  await expect(page.locator("#deposit-and-withdrawal")).toContainText("24/7");
  expect(await page.locator(".br-article .br-section[id]").evaluateAll(nodes => nodes.map(node => node.id))).toEqual(["overview", "account-opening", "fees", "deposit-and-withdrawal", "safety", "platforms", "alternatives", "customer-reviews", "review-faq", "sources"]);
  const faqSchema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"].find((item: { "@type": string }) => item["@type"] === "FAQPage");
  expect(faqSchema.mainEntity.some((item: { name: string }) => item.name.includes("weekends"))).toBe(true);
  expect(faqSchema.mainEntity.some((item: { name: string }) => item.name.includes("market maker"))).toBe(false);
  expect(faqSchema.mainEntity).toHaveLength(3);
  await expect(page.locator("#review-faq details")).toHaveCount(3);
  await expect(page.locator(".br-verdict-box").getByRole("heading", { name: "Quick answer" })).toBeVisible();
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
  const { review } = getReview("exness")!;
  expect(reviewAccounts(review)).toHaveLength(5);
  expect(reviewQuickFacts(review).find(f => f.label === "Minimum deposit")!.state).toBe("text");
  const withoutDepositSource = structuredClone(review);
  withoutDepositSource.sources = withoutDepositSource.sources.filter(source => source.id !== "global-minimum-deposit");
  expect(reviewAccounts(withoutDepositSource)).toHaveLength(5);
  expect(reviewAccounts(withoutDepositSource).every(account => account.minimum === "Not verified")).toBe(true);
  expect(reviewQuickFacts(withoutDepositSource).find(f => f.label === "Minimum deposit")!.state).toBe("unknown");
  expect(reviewAccounts(getReview("exness", "Seychelles")!.review)).toEqual([]);
  const withoutCentEvidence = structuredClone(review);
  withoutCentEvidence.sources = withoutCentEvidence.sources.filter(source => source.id !== "global-cent");
  expect(reviewAccounts(withoutCentEvidence).map(account => account.name)).not.toContain("Standard Cent");
  expect(JSON.stringify(reviewStructuredData(review))).not.toContain("ratingValue");
  review.status = "published";
  review.author = { name: "Test Editor", role: "Reviewer" };
  review.verifiedAt = "2026-11-03";
  review.overallScore = { value: 4.8, outOf: 5, methodologyUrl: "https://example.com/methodology", sourceIds: ["global-standard"] };
  const product = reviewStructuredData(review)["@graph"].find(item => (item as { "@type": string })["@type"] === "Product");
  expect(product).toBeUndefined();
  expect(JSON.stringify(reviewStructuredData(review))).not.toContain("ratingValue");
  expect(JSON.stringify(reviewStructuredData(review))).not.toContain("aggregateRating");
  review.sources = [];
  expect(reviewAccounts(review)).toEqual([]);
  expect(reviewQuickFacts(review).every(f => f.state === "unknown")).toBe(true);
  expect(JSON.stringify(reviewStructuredData(review))).not.toContain("ratingValue");
});

test("Exness cost tool scales both commission sides and rejects missing or invalid inputs", async ({ page }) => {
  await page.goto("/reviews/exness#fees");
  const calculator = page.locator("[data-illustrative-cost]");
  const result = calculator.locator("[data-roundtrip-result]");
  await expect(result).toContainText("US$10 / 1.0 pip");
  await calculator.getByLabel("Standard lots", { exact: true }).fill("0.1");
  await expect(result).toContainText("US$1 / 1.0 pip");
  await calculator.getByLabel("US$/lot/side", { exact: true }).fill("0");
  await expect(result).toContainText("US$0.3 / 0.3 pips");
  await calculator.getByLabel("Spread (pips)", { exact: true }).fill("0");
  await expect(result).toContainText("US$0 / 0.0 pips");
  await calculator.getByLabel("Standard lots", { exact: true }).fill("");
  await expect(result).toContainText("Complete all three fields");
  await expect(result).not.toContainText("US$");
  await calculator.getByLabel("Standard lots", { exact: true }).fill("-1");
  await expect(result).toContainText("Standard lots must be at least 0.01");
  await calculator.getByLabel("Standard lots", { exact: true }).fill("1");
  await calculator.getByLabel("US$/lot/side", { exact: true }).fill("3.5");
  await expect(result).toContainText("US$7 / 0.7 pips");
});

test("Exness mobile account comparison reads as cards with uniform body text", async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/reviews/template#account-opening");
    await expect(page.locator(".br-account-table tbody tr")).toHaveCount(5);
    const layout = await page.evaluate(() => ({
      overflows: document.documentElement.scrollWidth > innerWidth,
      accountTableOverflows: (() => { const table = document.querySelector(".br-account-table")!; return table.scrollWidth > table.clientWidth; })(),
      openingOrder: (() => {
        const answer = document.querySelector('.br-verdict-box')!.getBoundingClientRect();
        const image = document.querySelector('.br-opening-image')!.getBoundingClientRect();
        const facts = document.querySelector('.br-quick-section')!.getBoundingClientRect();
        return answer.bottom <= image.top && image.bottom <= facts.top;
      })(),
      bodySizes: [...new Set([...document.querySelectorAll('.br-tradeoffs p, .br-comparison td, .br-intro, .br-verdict-copy > p, .br-cost-example p')].map(el => getComputedStyle(el).fontSize))],
    }));
    expect(layout).toEqual({ overflows: false, accountTableOverflows: false, openingOrder: true, bodySizes: ["18px"] });
  }
});

test("standalone HTML includes embedded styles and schema with working native navigation", async ({ page, request }) => {
  const response = await request.get("/templates/exness-review.html");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("<style>");
  expect(html).not.toContain("/_next/");
  expect(html).not.toMatch(/Kenya|M-Pesa|USD\/KES/);
  await page.goto("/templates/exness-review.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Exness Review 2026: Fees, Safety & Account Types");
  await expect(page.locator(".br-account-table tbody tr td:last-child")).toHaveText([
    "Varies by payment method and region", "Varies by payment method and region", "From US$200; region-dependent", "From US$200; region-dependent", "From US$200; region-dependent",
  ]);
  await expect(page.locator('script:not([type="application/ld+json"])')).toHaveCount(0);
  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
  await expect(page.locator("#key-data .br-opening-image img")).toHaveAttribute("src", "https://devinforex-five.vercel.app/images/reviews/exness-terminal-preview.webp");
  const image = await request.get("/images/reviews/exness-terminal-preview.webp");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toMatch(/image\/webp/);
  expect((await image.body()).byteLength).toBeLessThan(50_000);
  await expect(page.locator(".br-account-table tbody tr")).toHaveCount(5);
  await page.getByRole("navigation", { name: "Review sections" }).getByRole("link", { name: "Trading costs", exact: true }).click();
  await expect(page).toHaveURL(/exness-review\.html#fees$/);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("global branding, expanded sourced pros and cons, and Trustpilot links are explicit", async ({ page, request }) => {
  for (const route of ["/", "/best-brokers", "/reviews", "/insights", "/find-my-broker", "/reviews/template"]) {
    await page.goto(route);
    await expect(page.locator("body")).not.toContainText(/Kenya|Kenyan|M-Pesa|USD\/KES|🇰🇪/);
  }
  await expect(page.getByLabel("Review scope")).toHaveValue("Global");
  await expect(page.locator(".br-tradeoffs > div").first().locator("li")).toHaveCount(5);
  await expect(page.locator(".br-tradeoffs > div").last().locator("li")).toHaveCount(5);
  for (const point of await page.locator(".br-tradeoffs li").all()) {
    await expect(point.locator("p")).toContainText(/.{25}/);
    await expect(point.locator("a")).toHaveAttribute("href", /^https:\/\/(www\.exness\.com|get\.exness\.help)\//);
  }
  const trustpilot = page.getByRole("link", { name: /Find Exness customer reviews on Trustpilot/ });
  await expect(trustpilot).toHaveAttribute("href", /https:\/\/www\.trustpilot\.com\/search\?query=exness\.com/);
  await expect(page.locator("#customer-reviews")).toContainText("no rating or count was collected");
  const account = page.getByRole("link", { name: "Open an account with Exness", exact: true }).first();
  expect(await account.evaluate(el => getComputedStyle(el).backgroundImage)).toContain("linear-gradient");
  await expect(account).toHaveAttribute("rel", "noopener noreferrer");
  expect((await (await request.get("/reviews/exness/data")).json()).review.customerReviews.rating).toBeNull();
});
