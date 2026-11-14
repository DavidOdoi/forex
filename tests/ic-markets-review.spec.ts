import { indexable } from "../src/lib/site";
import { test, expect } from "@playwright/test";
import { getReview } from "../src/lib/reviews/catalog";
import { checkedField, reviewAccounts, reviewQuickFacts, verdictSentences } from "../src/lib/reviews/flow";
import { fieldValue, hasDisplayableField, accountOpeningHref } from "../src/lib/reviews/template";
import { reviewedFields } from "../src/lib/reviews/curated";
import { publicationBlockers, isReviewPublished } from "../src/lib/reviews/publication";
import { reviewStructuredData } from "../src/lib/reviews/seo";
import { wordCount } from "../src/lib/reviews/digest";

const ic = () => getReview("ic-markets")!.review;
test("IC Markets uses attributed supplied evidence, separated entities and ordinary Seychelles accounts", () => {
  const review = ic();
  expect(review.suppliedResearch?.reportedResearchDate).toBe("2026-11-10");
  expect(review.suppliedResearch?.independentRecheck).toBe("blocked");
  expect(review.sources.every(source => source.evidenceOrigin === "user-supplied-dossier")).toBe(true);
  const fields = reviewedFields(review).filter(field => field.value !== null);
  expect(fields.length).toBeGreaterThan(20);
  expect(fields.every(field => field.status === "supplied-research" && hasDisplayableField(field, review))).toBe(true);
  const accounts = reviewAccounts(review);
  expect(accounts.map(row => row.name)).toEqual(["Standard", "Raw Spread", "Raw Spread cTrader"]);
  expect(accounts.every(row => row.category.includes("Seychelles"))).toBe(true);
  expect(accounts.every(row => row.minimum.startsWith("No minimum advertised"))).toBe(true);
  expect(accounts[1].roundTripCommission).toBe("US$7 / FX lot");
  expect(accounts[2].commission).toBe("US$3 / US$100,000 traded / side");
  expect(accounts[2].roundTripCommission).toContain("unchanged US$100,000 notional");
  const facts = reviewQuickFacts(review);
  expect(facts).toHaveLength(9); expect(facts.every(f => f.state !== "unknown")).toBe(true);
  expect(facts.find(f => f.label === "Minimum deposit")!.value).toContain("US$200 equivalent; Cyprus: €200");
  expect(checkedField(review, "leverage-by-product-and-region")!.value).toContain("progressive exposure portions");
  expect(checkedField(review, "negative-balance-protection")!.value).toContain("for all claimants");
  expect(review.entities?.map(entity => entity.country)).toEqual(["Seychelles", "Cyprus", "Australia", "Bahamas", "Cayman Islands"]);
  expect(review.entities?.find(entity => entity.country === "Cayman Islands")!.note).toContain("historical");
});
test("reported findings cannot be silently promoted to verified, published or account-opening claims", () => {
  const review = ic();
  const field = checkedField(review, "minimum-deposit")!;
  field.status = "verified";
  expect(fieldValue(field, review)).toBe("Needs verification");
  expect(hasDisplayableField(field, review)).toBe(false);
  expect(accountOpeningHref(review)).toBeNull();
  expect(review.overallScore).toBeNull(); expect(review.verifiedAt).toBeNull();
  review.status = "published";
  review.publication = { publishedAt: "2026-11-10", updatedAt: "2026-11-10", approvedAt: "2026-11-10", approvedBy: review.author!.name };
  expect(isReviewPublished(review)).toBe(false);
  expect(publicationBlockers(review).join(" ")).toContain("primary-source rechecks");
  const schema = JSON.stringify(reviewStructuredData(review));
  expect(schema).not.toMatch(/AggregateRating|ratingValue|datePublished/);
  expect(review.customerReviews).toMatchObject({ publisher: "Trustpilot", rating: 4.8, reviewCount: 57517, checkedAt: "2026-11-10" });
  expect(review.customerReviews?.researchNote).toContain("not our editorial score");
});
test("missing or mismatched dossier provenance suppresses financial facts and does not affect other scopes", () => {
  for (const kind of ["date", "origin", "dossier", "scope", "source"] as const) {
    const review = ic();
    if (kind === "date") review.sources.find(s => s.id === "ic-global-accounts")!.checkedAt = "2026-11-09";
    if (kind === "origin") delete review.sources.find(s => s.id === "ic-global-accounts")!.evidenceOrigin;
    if (kind === "dossier") delete review.suppliedResearch;
    if (kind === "scope") review.jurisdiction = "Cyprus";
    if (kind === "source") review.sources = review.sources.filter(s => s.id !== "ic-global-accounts");
    expect(reviewAccounts(review), kind).toEqual([]);
    expect(reviewQuickFacts(review).find(f => f.label === "Minimum deposit")!.state, kind).toBe("unknown");
    expect(verdictSentences(review).join(" "), kind).not.toContain("US$200");
  }
  expect(getReview("ic-markets", "Seychelles")!.review.suppliedResearch).toBeUndefined();
  for (const slug of ["exness", "xm", "pepperstone"]) {
    const review = getReview(slug)!.review;
    expect(review.suppliedResearch).toBeUndefined();
    expect(review.sources.some(source => source.id.startsWith("ic-"))).toBe(false);
  }
});
test("full research retains conflicts, funding limits, conversion units, early access and unresolved security", () => {
  const review = ic();
  const findings = review.suppliedResearch!.reportedFindings;
  const text = findings.flatMap(section => section.findings).join(" ");
  for (const term of ["Raw Pro", "early-access", "0.01", "0.8", "USDC", "12:00 AEST/AEDT", "2–14", "30 inactive", "Mac", "2FA", "all claimants", "Cayman", "13:05 EAT", "not an exact fetch"]) expect(text).toContain(term);
  for (const section of findings) for (const id of section.sourceIds) expect(review.sources.some(source => source.id === id), id).toBe(true);
});
test("updated shared template renders supplied findings and three FAQs without JavaScript, retaining verification disclosures and word cap", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    const response = await page.goto("/reviews/ic-markets"); expect(response!.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("IC Markets Review");
    await expect(page.getByRole("complementary", { name: "Supplied research status" })).toContainText("not our independent verification");
    await expect(page.locator(".br-meta")).toContainText("Dossier research date 10 Nov 2026");
    await expect(page.locator(".br-meta")).not.toContainText("Latest source check");
    await expect(page.locator(".br-account-table tbody tr")).toHaveCount(3);
    await expect(page.locator(".br-account-table")).toContainText("US$100,000 traded / side");
    await expect(page.locator(".br-quick-grid")).toContainText("US$200 equivalent; Cyprus: €200");
    await expect(page.locator("#fees")).toContainText("US$7.83");
    await expect(page.locator("#fees")).toContainText("A$20-equivalent");
    await expect(page.locator("#deposit-and-withdrawal")).toContainText("2–14");
    await expect(page.locator("#safety")).toContainText("Global FAQ warns");
    await expect(page.locator("#safety")).toContainText("historical match");
    await expect(page.locator("#customer-reviews")).toContainText("4.8/5 from 57,517");
    await expect(page.locator(".br-rating")).toHaveText("Not rated");
    await expect(page.locator("#review-faq details")).toHaveCount(3);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", indexable ? "index, follow" : "noindex, follow");
    await expect(page.getByRole("link", { name: "Open an account with IC Markets", exact: true })).toHaveCount(0);
    const html = await response!.text();
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)![1];
    const count = wordCount(main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));
    console.log(`IC Markets complete review: ${count} words.`); expect(count).toBeLessThanOrEqual(1800);
    const data = await (await request.get("/reviews/ic-markets/data")).json();
    expect(data.review.suppliedResearch.reportedFindings.length).toBeGreaterThanOrEqual(10);
    expect(data.review.customerReviews.reviewCount).toBe(57517);
    const citationTargets = await page.locator('main a[href^="#source-"]').evaluateAll(links => links.every(link => document.getElementById(link.getAttribute("href")!.slice(1))));
    expect(citationTargets).toBe(true);
  } finally { await context.close(); }
});
test("updated review remains readable on phones and desktop with working disclosure and calculator", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("/reviews/ic-markets");
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), String(width)).toBe(true);
  }
  await page.locator(".br-entity-details summary").click();
  await expect(page.getByRole("region", { name: "Group legal entities" })).toBeVisible();
  await page.getByLabel("Standard lots", { exact: true }).fill("2");
  await expect(page.locator("[data-roundtrip-result]")).toContainText("US$20 / 1.0 pip");
  await page.locator(".br-quick-section").screenshot({ path: "test-results/ic-markets-quick-facts-desktop.png" });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.getByRole("region", { name: "Account comparison", exact: true }).screenshot({ path: "test-results/ic-markets-accounts-mobile.png" });
  expect(errors).toEqual([]);
});
