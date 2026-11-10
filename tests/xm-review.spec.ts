import { test, expect } from "@playwright/test";
import { getReview } from "../src/lib/reviews/catalog";
import { checkedField, reviewAccounts, reviewQuickFacts, verdictSentences } from "../src/lib/reviews/flow";
import { accountOpeningHref, fieldValue } from "../src/lib/reviews/template";
import { reviewedFields } from "../src/lib/reviews/curated";
import { reviewStructuredData } from "../src/lib/reviews/seo";

const xm = () => getReview("xm")!.review;
test("XM Global has current sourced pricing and nine meaningful quick facts without fabricated ratings", () => {
  const review = xm();
  expect(review.status).toBe("draft");
  const rows = reviewAccounts(review);
  expect(rows.map(row => row.name)).toEqual(["Standard", "Ultra Low", "Shares"]);
  expect(rows[0].spread).toBe("EUR/USD from 1.6 pips");
  expect(rows[1].spread).toBe("EUR/USD from 0.8 pips");
  expect(rows[2].minimum).toContain("10,000");
  expect(rows[2].commission).not.toContain("No separate");
  const facts = reviewQuickFacts(review);
  expect(facts).toHaveLength(9);
  expect(facts.every(fact => fact.state !== "unknown" && fact.sourceIds.length > 0)).toBe(true);
  expect(facts.find(fact => fact.label === "Maximum leverage")!.value).toContain("1:1000");
  expect(facts.find(fact => fact.label === "Accepts US citizens")!.state).toBe("no");
  expect(checkedField(review,"inactivity-fee")!.value).toContain("different charges");
  for (const field of reviewedFields(review).filter(field => field.status === "verified")) expect(fieldValue(field, review)).toBe(field.value);
  expect(review.overallScore).toBeNull();
  expect(review.customerReviews?.rating).toBeNull();
  expect(review.customerReviews?.reviewCount).toBeNull();
  expect(accountOpeningHref(review)).toBe("https://www.xm.com/goto/profile/en");
  expect(review.accountOpening.isAffiliate).toBe(false);
  expect(JSON.stringify(reviewStructuredData(review))).not.toMatch(/ratingValue|aggregateRating/);
});

test("removing, redating or changing scope of XM evidence suppresses its financial claims", () => {
  for (const kind of ["remove","redate","scope"] as const) {
    const review = xm();
    if (kind === "remove") review.sources = review.sources.filter(source => source.id !== "xm-accounts");
    if (kind === "redate") review.sources.find(source => source.id === "xm-accounts")!.checkedAt = "2026-11-09";
    if (kind === "scope") review.jurisdiction = "Cyprus";
    expect(reviewAccounts(review)).toEqual([]);
    expect(accountOpeningHref(review)).toBeNull();
    expect(verdictSentences(review).join(" ")).not.toContain("1.6");
    expect(reviewQuickFacts(review).find(fact => fact.label === "Minimum deposit")!.state).toBe("unknown");
  }
  const review = xm();review.sources = [];
  expect(verdictSentences(review).join(" ")).not.toContain("1.6");
});

test("XM Global terms do not leak into its Cyprus profile or another broker", () => {
  const regional = getReview("xm", "Cyprus")!.review;
  expect(regional.accountComparisons).toBeUndefined();
  expect(regional.verdictEvidence).toBeUndefined();
  expect(regional.sources.some(source => source.id === "xm-accounts")).toBe(false);
  for (const slug of ["exness","pepperstone","ic-markets"]) {
    const review = getReview(slug)!.review;
    expect(review.accountComparisons).toBeUndefined();
    expect(review.sources.some(source => source.id.startsWith("xm-"))).toBe(false);
  }
});

test("XM's account table, quick facts, three FAQs and funding conditions render without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    const response = await page.goto("http://127.0.0.1:3100/reviews/xm");
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText("XM Review");
    await expect(page.locator('.br-quick-grid > div')).toHaveCount(9);
    await expect(page.locator('.br-quick-grid')).not.toContainText("Not verified");
    await expect(page.locator('.br-account-table tbody tr')).toHaveCount(3);
    await expect(page.locator('.br-account-table')).toContainText("1.6 pips");
    await expect(page.locator('.br-account-table')).toContainText("0.8 pips");
    await expect(page.locator('#deposit-and-withdrawal')).toContainText("2–5 business days");
    await expect(page.locator('#platforms')).toContainText("40,001");
    await expect(page.locator('#review-faq details')).toHaveCount(3);
    const accountLinks = page.getByRole('link', { name:'Open an account with XM',exact:true });
    await expect(accountLinks).toHaveCount(5);
    await expect(accountLinks.first()).toHaveAttribute('href','https://www.xm.com/goto/profile/en');
    await expect(page.locator('#customer-reviews a')).toHaveAttribute("href","https://www.trustpilot.com/review/xm.com");
    await expect(page.locator('#customer-reviews')).not.toContainText("3,096");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content","noindex, nofollow");
  } finally { await context.close(); }
});

test("XM facts and account rows stay readable on small screens without browser errors", async ({ page }) => {
  const errors: string[] = [];page.on("pageerror",error => errors.push(error.message));
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height:900 });
    await page.goto("/reviews/xm");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),String(width)).toBe(true);
  }
  expect(errors).toEqual([]);
});
