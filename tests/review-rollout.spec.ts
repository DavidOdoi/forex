import { test, expect } from "@playwright/test";
import { getReview, researchEntries, reviewCountries } from "../src/lib/reviews/catalog";
import { reviewIntroduction, reviewFocusKeyword } from "../src/lib/reviews/opening";
import { flowFaqs } from "../src/lib/reviews/flow";
import { reviewMetadata, reviewStructuredData } from "../src/lib/reviews/seo";
import { reviewPlatformImage, reviewMediaAssets } from "../src/lib/reviews/media";
import { verifiedSources } from "../src/lib/reviews/template";
import { wordCount } from "../src/lib/reviews/digest";

test("all broker scopes have their own opening and three honest FAQ answers without leaking Exness facts", () => {
  let scopes = 0;
  for (const entry of researchEntries) for (const country of reviewCountries(entry.slug)) {
    const { review } = getReview(entry.slug, country)!;
    const intro = reviewIntroduction(review).map(p => p.map(part => part.text).join(""));
    expect(intro).toHaveLength(2);
    expect(intro[0].toLowerCase()).toContain(reviewFocusKeyword(review).toLowerCase());
    expect(intro.every(p => wordCount(p) < 120)).toBe(true);
    const faqs = flowFaqs(review);
    expect(faqs, `${entry.slug}/${country}`).toHaveLength(3);
    expect(new Set(faqs.map(faq => faq.question)).size).toBe(3);
    for (const faq of faqs) {
      expect(wordCount(faq.answer)).toBeLessThanOrEqual(65);
      if (faq.evidence === "sourced") expect(verifiedSources(faq.sourceIds, review)).toBe(true);
      else expect(faq.sourceIds).toEqual([]);
    }
    const schema = reviewStructuredData(review)["@graph"] as { "@type": string; mainEntity?: unknown[] }[];
    const faq = schema.find(item => item["@type"] === "FAQPage")!;
    expect(faq.mainEntity).toHaveLength(3);
    expect(JSON.stringify(schema)).not.toMatch(/AggregateRating|ratingValue/);
    const metadata = reviewMetadata(review);
    expect(metadata.description?.toLowerCase().startsWith(reviewFocusKeyword(review).toLowerCase())).toBe(true);
    const image = reviewPlatformImage(review);
    if (image) expect(image.slug).toBe(entry.slug);
    if (entry.slug !== "exness") {
      expect(intro.join(" ")).not.toContain("Exness");
      expect(image?.src ?? "").not.toContain("exness");
    }
    scopes++;
  }
  expect(scopes).toBe(344);
  const wrongBrand = structuredClone(getReview("exness")!.review);
  wrongBrand.broker.slug = "aaafx";
  expect(reviewPlatformImage(wrongBrand)).toBeUndefined();
  const wrongScope = structuredClone(getReview("etoro")!.review);
  wrongScope.jurisdiction = "Singapore";
  expect(reviewPlatformImage(wrongScope)).toBeUndefined();
  expect(reviewMediaAssets).toHaveLength(6);
});

test("retail, country and institutional pages render the shared opening and matching FAQ data without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const [slug, country] of [["exness", undefined], ["xm", undefined], ["ic-markets", undefined], ["pepperstone", "Australia"], ["ig", undefined], ["fp-markets", undefined]] as const) {
      await page.goto(`http://127.0.0.1:3100/reviews/${slug}${country ? `?country=${country}` : ""}`);
      const { review } = getReview(slug, country)!;
      await expect(page.locator(".br-intro p")).toHaveCount(2);
      await expect(page.locator(".br-verdict-box h2")).toHaveText("Quick answer");
      await expect(page.locator("#review-faq details")).toHaveCount(3);
      const faqs = flowFaqs(review);
      await expect(page.locator("#review-faq h3")).toHaveText(faqs.map(faq => faq.question));
      await expect(page.locator("#review-faq details > p")).toHaveText(faqs.map(faq => faq.answer));
      await expect(page.locator('[data-account-cta]')).toHaveCount(review.providerType === "retail" ? 5 : 0);
      const image = reviewPlatformImage(review);
      await expect(page.locator('.br-opening-image img')).toHaveCount(image ? 1 : 0);
      if (image) {
        await page.locator('.br-opening-image img').scrollIntoViewIfNeeded();
        await expect.poll(() => page.locator('.br-opening-image img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBe(image.width);
        await expect(page.locator('.br-opening-image figcaption')).toContainText(`Image: ${review.broker.name}`);
      }
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      if (slug !== "exness") await expect(page.locator('[data-illustrative-cost]')).toContainText(`Not a measured ${review.broker.name} quote`);
    }
  } finally { await context.close(); }
});

test("new image and plain-text openings fit phones and retain the broker-specific cost calculator", async ({ page }) => {
  for (const slug of ['exness', 'xm', 'ic-markets', 'pepperstone', 'ig', 'fp-markets']) for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/reviews/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${slug}/${width}`).toBe(true);
    await expect(page.locator('.br-intro p')).toHaveCount(2);
  }
  await page.goto('/reviews/ic-markets#fees');
  await page.getByLabel('Standard lots', { exact: true }).fill('2');
  await expect(page.locator('[data-roundtrip-result]')).toContainText('US$20 / 1.0 pip');
});
