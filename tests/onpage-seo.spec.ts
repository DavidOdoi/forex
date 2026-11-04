import { test, expect } from "@playwright/test";
import { getReview } from "../src/lib/reviews/catalog";
import { publicationBlockers, isReviewPublished } from "../src/lib/reviews/publication";
import { reviewHeading, reviewMetadata, reviewSitemapEntries, reviewStructuredData } from "../src/lib/reviews/seo";

function publicationFixture() {
  const review = structuredClone(getReview("exness")!.review);
  review.status = "published";
  // Fictional data is confined to this test fixture, never the public catalogue.
  review.author = { name: "Fixture Editor", role: "Editor", bio: "Fictional biography used only to test the publication contract.", profileUrl: "/authors/fixture-editor" };
  review.publication = { publishedAt: "2026-11-04", updatedAt: "2026-11-04", approvedAt: "2026-11-04", approvedBy: "Fixture Editor" };
  return review;
}

test("publication requires accountability, approval, dates and matching core evidence", () => {
  const draft = structuredClone(getReview("exness")!.review);
  expect(draft.author?.name).toBe("David Odoi");
  expect(isReviewPublished(draft)).toBe(false);
  draft.status = "published";
  expect(isReviewPublished(draft)).toBe(false);
  expect(publicationBlockers(draft).join(" ")).toContain("biography");
  const ready = publicationFixture();
  expect(publicationBlockers(ready)).toEqual([]);
  ready.publication!.approvedBy = "Unassigned person";
  expect(isReviewPublished(ready)).toBe(false);
  ready.publication!.approvedBy = "Fixture Editor";
  ready.publication!.updatedAt = "2026-11-03";
  expect(isReviewPublished(ready)).toBe(false);
  ready.publication!.updatedAt = "2026-11-04";
  ready.publication!.approvedAt = "2026-11-03";
  expect(isReviewPublished(ready)).toBe(false);
  ready.publication!.approvedAt = "2026-11-04";
  ready.sources = ready.sources.filter(source => source.id !== "global-minimum-deposit");
  expect(isReviewPublished(ready)).toBe(false);
  const wrongScope = publicationFixture();
  const fields = [...wrongScope.keyData, ...wrongScope.chapters.flatMap(chapter => chapter.panels.flatMap(panel => panel.fields))];
  fields.filter(field => field.id === "minimum-deposit").forEach(field => field.jurisdiction = "Australia");
  wrongScope.sources.find(source => source.id === "global-minimum-deposit")!.jurisdiction = "Australia";
  expect(isReviewPublished(wrongScope)).toBe(false);
});

test("only approved canonical articles can be indexable or enter the review sitemap", () => {
  const draft = getReview("exness")!.review;
  const ready = publicationFixture();
  expect(reviewMetadata(draft, true).robots).toEqual({ index: false, follow: true });
  expect(reviewMetadata(ready, true).robots).toEqual({ index: true, follow: true });
  expect(reviewMetadata(ready, false).robots).toEqual({ index: false, follow: true });
  expect(reviewMetadata(ready).alternates?.canonical).toMatch(/\/reviews\/exness$/);
  const demo = structuredClone(ready); demo.status = "template";
  const entries = reviewSitemapEntries([draft, demo, ready, structuredClone(ready)]);
  expect(entries).toHaveLength(1);
  expect(entries[0]).toEqual({ url: reviewMetadata(ready).alternates!.canonical, lastModified: "2026-11-04" });
});

test("Article schema uses real-record fields and never assumes broker review-star eligibility", () => {
  const draft = getReview("exness")!.review;
  expect(JSON.stringify(reviewStructuredData(draft))).not.toContain('"@type":"Article"');
  const ready = publicationFixture();
  ready.overallScore = { value: 4.8, outOf: 5, sourceIds: ["global-standard"], methodologyUrl: "https://example.com/fixture-method" };
  const graph = reviewStructuredData(ready)["@graph"] as Record<string, unknown>[];
  const article = graph.find(item => item["@type"] === "Article")!;
  expect(article.headline).toBe(reviewHeading(ready));
  expect(article.datePublished).toBe(ready.publication!.publishedAt);
  expect(article.dateModified).toBe(ready.publication!.updatedAt);
  expect(article.author).toMatchObject({ name: ready.author!.name });
  expect(JSON.stringify(graph)).not.toMatch(/AggregateRating|ratingValue|"@type":"Product"|"@type":"Review"/);
});

test("essential review content is server rendered with valid headings, anchors and visible FAQ schema", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:3100/reviews/exness");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toHaveText(reviewHeading(getReview("exness")!.review));
    await expect(page.locator("[data-illustrative-cost]")).toContainText("Not a measured Exness quote");
    await expect(page.locator("[data-illustrative-cost]")).toContainText("US$10 / 1.0 pip");
    await expect(page.locator("#fees")).toContainText("no inactivity or reactivation fee");
    await expect(page.locator("#fees")).toContainText("status can be withdrawn");
    await expect(page.locator(".br-accountability a")).toHaveText("David Odoi");
    await expect(page.locator("#safety")).toContainText("licence number not displayed");
    await expect(page.locator("#platforms")).toContainText(/forex, metals/i);
    const validation = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
      const headings = [...document.querySelectorAll('main h1, main h2, main h3')].filter(el => !el.closest('dialog')).map(el => Number(el.tagName[1]));
      return {
        uniqueIds: new Set(ids).size === ids.length,
        noSkippedHeadings: headings.every((level, index) => index === 0 ? level === 1 : level <= headings[index-1] + 1),
        missingAnchors: [...document.querySelectorAll('main a[href^="#"]')].map(el => el.getAttribute('href')!.slice(1)).filter(id => !document.getElementById(id)),
      };
    });
    expect(validation).toEqual({ uniqueIds: true, noSkippedHeadings: true, missingAnchors: [] });
    const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
    const faq = graph.find((item: { "@type": string }) => item["@type"] === "FAQPage");
    for (const question of faq.mainEntity) {
      const item = page.locator("#review-faq details").filter({ has: page.getByRole("heading", { name: question.name, exact: true }) });
      await expect(item.locator("p")).toHaveText(question.acceptedAnswer.text);
    }
  } finally { await context.close(); }
});

test("draft and demonstration responses remain noindex while crawlers can read their directives", async ({ page, request }) => {
  expect(await (await request.get("/robots.txt")).text()).toContain("Allow: /");
  for (const path of ["/reviews/exness", "/reviews/template", "/templates/exness-review.html"]) {
    const response = await page.goto(path);
    expect(response?.headers()["x-robots-tag"]).toBeUndefined();
    await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/reviews\/exness$/);
    if (path !== "/reviews/exness") await expect(page.locator(".br-demo-banner")).toContainText(/demonstration/i);
  }
  await page.goto("/authors/david-odoi");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("David Odoi");
  await expect(page.getByRole("main")).toContainText("professional biography and relevant experience have not yet been supplied");
});

test("specific menu and contextual links lead to existing content and section targets", async ({ page, request }) => {
  await page.goto("/reviews/exness");
  await expect(page.locator('#fees a[href="/tools#pip-calculator"]')).toHaveText("Calculate pip value");
  await expect(page.locator('#alternatives a[href="/reviews/pepperstone?country=Australia"]')).toHaveCount(1);
  const destinations = await page.locator('nav[aria-label="Main navigation"] a[href*="#"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!));
  expect(destinations).toContain("/tools#position-size");
  expect(destinations).toContain("/about#research-methodology");
  for (const href of destinations) {
    const [path, hash] = href.split("#");
    const response = await request.get(path);
    expect(response.status(), href).toBe(200);
    expect(await response.text(), href).toContain(`id="${hash}"`);
  }
});
