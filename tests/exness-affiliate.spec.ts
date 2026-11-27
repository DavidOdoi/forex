import { test, expect } from "@playwright/test";
import { getReview } from "../src/lib/reviews/catalog";
import { accountOpeningHref } from "../src/lib/reviews/template";
import { isReviewPublished } from "../src/lib/reviews/publication";
import { exnessPartnerUrl, reviewPartnerDestination } from "../src/lib/partners";
import { countryAffiliates } from "../src/lib/country-guides/affiliate-agreements";

test("the owner link routes an evidenced global Exness CTA without changing its source or editorial status", () => {
  const review = getReview("exness")!.review;
  expect(accountOpeningHref(review)).toBe("https://one.toexness.com/a/5fvl1ylh6f");
  expect(review.accountOpening.url).toBe("https://my.exness.com/accounts/sign-up?lng=en");
  expect(review.accountOpening.partnerDestination).toBe(exnessPartnerUrl);
  expect(review.accountOpening.isAffiliate).toBe(true);
  expect(review.status).toBe("draft"); expect(isReviewPublished(review)).toBe(false);
  expect(review.overallScore).toBeNull();
});

test("a tracking URL cannot bypass missing evidence, unknown destinations, mismatched scopes or blank templates", () => {
  const missing = getReview("exness")!.review; missing.sources = []; expect(accountOpeningHref(missing)).toBeNull();
  const forged = getReview("exness")!.review; forged.accountOpening.partnerDestination = "https://example.com/unapproved"; expect(accountOpeningHref(forged)).toBeNull();
  const blank = getReview("exness")!.review; blank.status = "template"; expect(accountOpeningHref(blank)).toBeNull();
  const noFlag = getReview("exness")!.review; noFlag.accountOpening.isAffiliate = false; expect(accountOpeningHref(noFlag)).toBeNull();
  const wrongScope = getReview("exness")!.review; wrongScope.jurisdiction = "Kenya"; expect(accountOpeningHref(wrongScope)).toBeNull();
  expect(reviewPartnerDestination("exness", "Global", "https://my.exness.com.evil.example/accounts/sign-up")).toBeNull();
  expect(reviewPartnerDestination("exness", "Global", "https://name@my.exness.com/accounts/sign-up")).toBeNull();
  expect(reviewPartnerDestination("exness", "Global", "https://my.exness.com:444/accounts/sign-up")).toBeNull();
  expect(reviewPartnerDestination("exness", "Kenya", "https://my.exness.ke/accounts/sign-up")).toBeNull();
  expect(reviewPartnerDestination("xm", "Global", "https://my.exness.com/accounts/sign-up")).toBeNull();
  expect(getReview("xm")!.review.accountOpening.isAffiliate).toBe(false);
  expect(getReview("exness", "Seychelles")!.review.accountOpening.partnerDestination).toBeUndefined();
  expect(countryAffiliates.geoApprovals).toEqual([]);
});

test("all five Exness review buttons carry the exact partner link and nearby disclosure", async ({ page, request }) => {
  await page.goto("/reviews/exness");
  const buttons = page.getByRole("link", { name: "Open an account with Exness", exact: true });
  await expect(buttons).toHaveCount(5);
  for (const button of await buttons.all()) {
    await expect(button).toHaveAttribute("href", exnessPartnerUrl);
    await expect(button).toHaveAttribute("target", "_blank");
    await expect(button).toHaveAttribute("rel", "sponsored nofollow noopener noreferrer");
  }
  for (const cta of await page.locator("[data-account-cta]").all()) await expect(cta).toContainText("Affiliate link: we may receive compensation");
  await page.getByRole("button", { name: "Advertiser disclosure", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("may receive compensation");
  await page.keyboard.press("Escape");
  for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
  const data = await (await request.get("/reviews/exness/data")).json();
  expect(data.review.accountOpening.partnerDestination).toBe(exnessPartnerUrl);
  expect(data.review.accountOpening.isAffiliate).toBe(true);
});

test("commercial disclosures reflect active links while country-specific signup destinations remain scoped", async ({ page, request }) => {
  for (const path of ["/", "/about", "/reviews/exness"]) {
    await page.goto(path);
    await expect(page.locator("body > footer")).toContainText("Some broker links are affiliate links");
    await expect(page.locator("body > footer")).not.toContainText("There are currently no active affiliate referral links");
  }
  await page.goto("/"); await expect(page.locator("#faq")).toContainText("Some broker links are affiliate links");
  await page.goto("/about"); await expect(page.locator("#commercial-policy")).toContainText("may earn compensation");
  const sri = await (await request.get("/forex-brokers/sri-lanka")).text(); expect(sri).not.toContain(exnessPartnerUrl);
  expect(sri).toContain("https://my.exness.com/accounts/sign-up?lng=en");
  const recommendation = await (await request.get("/api/broker-recommendations?country=KE")).json();
  expect(JSON.stringify(recommendation)).not.toContain(exnessPartnerUrl);
  await page.goto("/reviews/xm");
  await expect(page.getByRole("link", { name: "Open an account with XM", exact: true }).first()).toHaveAttribute("href", "https://www.xm.com/goto/profile/en");
});
