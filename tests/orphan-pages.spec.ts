import { test, expect } from "@playwright/test";
import { visibleReviews } from "../src/lib/reviews/visibility";
import { reviewUrl } from "../src/lib/reviews/seo";

test("regional review records have crawlable incoming links and a route back to the global review without JavaScript", async ({ request }) => {
  const records = visibleReviews().filter(review => review.jurisdiction !== "Global");
  expect(records.length).toBeGreaterThan(0);
  for (const review of records) {
    const global = await request.get(`/reviews/${review.broker.slug}`);
    const html = await global.text();
    const regional = new URL(reviewUrl(review));
    const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => new URL(match[1].replaceAll("&amp;", "&"), "https://www.devinforex.com"));
    expect(hrefs.some(href => href.pathname === regional.pathname && href.searchParams.get("country") === review.jurisdiction), reviewUrl(review)).toBe(true);
    const response = await request.get(regional.pathname + regional.search);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`href="/reviews/${review.broker.slug}"`);
  }
});
