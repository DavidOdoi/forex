import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { articleText, articleWordCount, insightArticles, insightGuides, insightImages } from "../src/lib/insights/catalog";
import { insightsIndexable } from "../src/lib/insights/seo";
import { siteOrigin } from "../src/lib/site";

const words = (value: string) => (value.match(/[\p{L}\p{N}_]+(?:[’'-][\p{L}\p{N}_]+)*/gu) ?? []).length;

test("published guides retain complete copy, evidence links, real image files and matching FAQ records", () => {
  expect(insightGuides).toHaveLength(10);
  expect(insightArticles).toHaveLength(11);
  expect(new Set(insightArticles.map(article => article.slug)).size).toBe(11);
  expect(insightImages).toHaveLength(19);
  const slugs = new Set(insightArticles.map(article => article.slug));
  for (const image of insightImages) {
    expect(createHash("sha256").update(readFileSync(join(process.cwd(), "public", image.src))).digest("hex")).toBe(image.sha256);
    expect(image.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
    expect(image.licenseUrl).toMatch(/^https:\/\/creativecommons\.org\//);
    expect(image.creator.length).toBeGreaterThan(0);
  }
  for (const article of insightGuides) {
    expect(articleWordCount(article), article.slug).toBeGreaterThanOrEqual(1650);
    expect(articleWordCount(article), article.slug).toBeLessThanOrEqual(1750);
    expect(article.description.length).toBeGreaterThanOrEqual(150);
    expect(article.description.length).toBeLessThanOrEqual(160);
    expect(article.title.toLowerCase()).toContain(article.focusKeyword);
    expect(article.description.toLowerCase()).toContain(article.focusKeyword);
    expect(article.blocks.some(block => block.type === "heading" && block.level === 2 && block.text.toLowerCase().includes(article.focusKeyword))).toBe(true);
    const imageBlocks = article.blocks.filter(block => block.type === "image");
    expect(imageBlocks).toHaveLength(3);
    expect(imageBlocks.some(block => block.type === "image" && block.alt.toLowerCase().includes(article.focusKeyword))).toBe(true);
    expect(article.faqs).toHaveLength(4);
    for (const faq of article.faqs) {
      expect(words(faq.answer)).toBeGreaterThanOrEqual(40);
      expect(words(faq.answer)).toBeLessThanOrEqual(60);
    }
    const inline = article.blocks.flatMap(block => block.type === "paragraph" ? block.content : block.type === "table" ? [...block.headers, ...block.rows.flat()].flat() : []);
    const internal = inline.filter(part => part.href?.startsWith("/insights/"));
    expect(internal).toHaveLength(2);
    expect(inline.filter(part => part.href?.startsWith("https://"))).toHaveLength(3);
    for (const link of internal) expect(slugs.has(link.href!.split("/").at(-1)!)).toBe(true);
    expect(articleText(article)).not.toMatch(/this draft|records were supplied|IMAGE:/i);
  }
});

test("Insights replaces placeholders with links to all ten published guides", async ({ page }) => {
  await page.goto("/insights");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("[data-insight-card]")).toHaveCount(10);
  await expect(page.locator("main")).not.toContainText("Coming soon");
  for (const article of insightGuides) await expect(page.locator(`[data-insight-card] h3 a[href="/insights/${article.slug}"]`)).toHaveText(article.title);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", insightsIndexable ? "index, follow" : "noindex, follow");
});

test("all ten article URLs render essential content, images, citations and schema without site JavaScript", async ({ browser }) => {
  test.setTimeout(120000);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const article of insightGuides) {
      const response = await page.goto(`http://127.0.0.1:3100/insights/${article.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveText(article.title);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${siteOrigin}/insights/${article.slug}`);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", insightsIndexable ? "index, follow" : "noindex, follow");
      await expect(page.locator(".insight-content .insight-context-link")).toHaveCount(2);
      await expect(page.locator(".insight-content .insight-source-link")).toHaveCount(3);
      await expect(page.locator("figure.insight-figure img")).toHaveCount(3);
      await expect(page.locator("figure .insight-image-credit")).toHaveCount(3);
      await page.locator("figure img").evaluateAll(images => images.forEach(image => { (image as HTMLImageElement).loading = "eager"; }));
      await expect.poll(() => page.locator("figure img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
      const record = graph.find((item: { "@type": string }) => item["@type"] === "Article");
      expect(record.headline).toBe(article.title);
      expect(record.author.name).toBe("David Odoi");
      expect(record.datePublished).toBe(article.publishedAt);
      expect(JSON.stringify(graph)).not.toMatch(/AggregateRating|ratingValue/);
      const faq = graph.find((item: { "@type": string }) => item["@type"] === "FAQPage");
      expect(faq.mainEntity).toHaveLength(4);
      for (const question of faq.mainEntity) {
        const heading = page.locator(".insight-content h3").filter({ hasText: question.name });
        await expect(heading).toHaveText(question.name);
        await expect(heading.locator("+ p")).toHaveText(question.acceptedAnswer.text);
      }
      expect(await page.evaluate(() => {
        const ids = [...document.querySelectorAll("[id]")].map(node => node.id);
        return new Set(ids).size === ids.length && [...document.querySelectorAll('.insight-toc a[href^="#"]')].every(node => document.getElementById(node.getAttribute("href")!.slice(1)));
      })).toBe(true);
    }
  } finally { await context.close(); }
});

test("published guides and the companion reading list enter the sitemap while broker drafts stay excluded", async ({ request, page }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  if (insightsIndexable) {
    for (const article of insightArticles) expect(sitemap).toContain(`${siteOrigin}/insights/${article.slug}`);
    expect(await (await request.get("/robots.txt")).text()).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
  }
  expect(sitemap).not.toContain("/reviews/exness");
  expect(sitemap).not.toContain("/insights/image-credits");
  await page.goto("/insights/best-indicators-for-swing-trading");
  await page.locator('.insight-context-link[href="/insights/best-swing-trading-books"]').click();
  await expect(page).toHaveURL(/\/insights\/best-swing-trading-books$/);
  await expect(page.locator("h1")).toHaveText("Best Swing Trading Books: A Practical Reading List");
  expect((await request.get("/insights/not-a-published-guide")).status()).toBe(404);
  await page.goto("/reviews/exness");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("guide navigation, tables, image credits and gallery fit desktop and small mobile screens", async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/insights", "/insights/image-credits", ...insightGuides.map(article => `/insights/${article.slug}`)]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} at ${width}`).toBe(true);
      expect(await page.locator("main").evaluate(node => getComputedStyle(node).backgroundColor)).toBe("rgb(255, 255, 255)");
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/insights/best-day-trading-app-for-beginners");
  const drawer = page.locator(".insight-toc-mobile");
  await expect(drawer).not.toHaveAttribute("open", "");
  await drawer.locator("summary").click();
  await drawer.getByRole("link", { name: "Frequently asked questions", exact: true }).click();
  const heading = page.locator("#frequently-asked-questions");
  await expect(heading).toBeInViewport();
  const headerBottom = await page.locator("body > header").evaluate(node => node.getBoundingClientRect().bottom);
  expect((await heading.boundingBox())!.y).toBeGreaterThanOrEqual(headerBottom);
  await page.goto("/insights/image-credits");
  await expect(page.locator(".insight-credit-card")).toHaveCount(19);
  await page.goto("/insights");
  await page.locator('[data-insight-card] h3 a[href="/insights/auto-trading"]').click();
  await expect(page.locator("h1")).toHaveText("Auto Trading: How to Evaluate Forex Bots Before You Risk Money");
  expect(errors).toEqual([]);
});
