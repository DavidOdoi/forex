import { test, expect } from "@playwright/test";
import snapshots from "../src/data/trustpilot-snapshots.json";
import evidence from "../docs/research-handoffs/trustpilot-profile-checks-2026-11-27.json";
import { selectedReviewBrokers } from "../src/lib/reviews/selection";
import { getReview, reviewCountries } from "../src/lib/reviews/catalog";
import { reviewStructuredData } from "../src/lib/reviews/seo";

test("every selected broker has a matched, dated public-profile snapshot without editorial stars", () => {
  expect(new Set(snapshots.map(x => x.slug))).toEqual(new Set(selectedReviewBrokers.map(x => x.slug)));
  expect(snapshots.filter(x => x.rating !== null)).toHaveLength(19);
  for (const broker of selectedReviewBrokers) {
    const source = evidence.find(x => x.brokerSlug === broker.slug)!;
    for (const country of reviewCountries(broker.slug)) {
      const review = getReview(broker.slug, country)!.review, customer = review.customerReviews!;
      expect(customer.evidenceOrigin).toBe("direct-profile-check");
      expect(customer.checkedAt).toBe("2026-11-27");
      expect(customer.url).toBe(source.finalUrl);
      expect(customer.profileDomain).toBe(source.profileDomain);
      expect(customer.reviewCount).toBe(source.reviewCount);
      expect(customer.rating).toBe(source.publicScore);
      expect(review.overallScore).toBeNull();
      expect(JSON.stringify(reviewStructuredData(review))).not.toMatch(/aggregateRating|ratingValue/i);
      expect(source.httpStatus).toBe(200); expect(source.sha256).toMatch(/^[a-f0-9]{64}$/);
    }
  }
});

test("withheld scores stay unavailable despite internal values or unlinked submitted numbers", () => {
  for (const slug of ["xm", "z-forex"]) {
    const customer = getReview(slug)!.review.customerReviews!;
    expect(customer.rating).toBeNull(); expect(customer.ratingStatus).toBe("unavailable");
    expect(customer.notice).toContain("Trustpilot withholds");
  }
  const cmc = getReview("cmc-markets")!.review.customerReviews!;
  expect(cmc.rating).toBe(4.3); expect(cmc.profileDomain).toBe("www.cmcmarkets.com");
  expect(cmc.regionalProfiles).toEqual([{ label: "CMC Markets Australian website profile", url: "https://www.trustpilot.com/review/cmcmarkets.com.au", rating: 1.7, reviewCount: 51, checkedAt: "2026-11-27" }]);
  expect(getReview("etoro")!.review.customerReviews!.rating).toBe(4.0);
  expect(getReview("fusion-markets")!.review.customerReviews!.rating).toBe(4.8);
});

for (const snapshot of snapshots) test(`${snapshot.slug}: checked Trustpilot score, count and link are server rendered`, async ({ request }) => {
  const response = await request.get(`/reviews/${snapshot.slug}`); expect(response.status()).toBe(200);
  const html = await response.text(), section = html.match(/<section[^>]*id="customer-reviews"[^>]*>([\s\S]*?)<\/section>/)![1];
  expect(section).toContain(snapshot.url); expect(section).toContain(snapshot.profileDomain);
  expect(section).toContain(snapshot.reviewCount.toLocaleString("en-US")); expect(section).toMatch(/datetime="2026-11-27"/i);
  if (snapshot.rating === null) { expect(section).toContain("Rating unavailable"); expect(section).not.toContain("br-trustpilot-stars"); }
  else { expect(section).toContain(snapshot.rating.toFixed(1)); expect(section).toContain("br-trustpilot-stars"); }
  const data = await (await request.get(`/reviews/${snapshot.slug}/data`)).json();
  expect(data.review.customerReviews.rating).toBe(snapshot.rating); expect(data.review.customerReviews.reviewCount).toBe(snapshot.reviewCount);
});

test("customer ratings remain separate from editorial verdicts and fit mobile screens", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  for (const slug of ["exness", "xm", "z-forex", "cmc-markets"]) {
    await page.goto(`/reviews/${slug}`);
    await expect(page.locator(".br-rating")).toContainText("Not rated");
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await expect(page.locator("#customer-reviews")).toContainText("separate profile");
  await expect(page.locator(".br-trustpilot-stars svg")).toHaveCount(5);
  await expect(page.locator(".br-trustpilot-stars svg").last().locator("clipPath rect")).toHaveAttribute("width", "7.2000");
  await page.locator("#customer-reviews").screenshot({ path: "test-results/trustpilot-cmc-desktop.png" });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.locator("#customer-reviews").screenshot({ path: "test-results/trustpilot-cmc-mobile.png" });
  expect(errors).toEqual([]);
});
