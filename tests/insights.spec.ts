import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { articleText, articleWordCount, insightArticles, insightGuides, insightImages } from "../src/lib/insights/catalog";
import { insightsIndexable, insightTitleTag } from "../src/lib/insights/seo";
import { siteOrigin } from "../src/lib/site";
import { linkPhrases } from "../src/lib/insights/link-phrases.mjs";
import type { InsightBlock } from "../src/lib/insights/catalog";

const words = (value: string) => (value.match(/[\p{L}\p{N}_]+(?:[’'-][\p{L}\p{N}_]+)*/gu) ?? []).length;

function editorialParts(block: InsightBlock) {
  if (block.type === "paragraph" || block.type === "callout") return block.content;
  if (block.type === "list") return block.items.flat();
  if (block.type === "table") return [...block.headers, ...block.rows.flat()].flat();
  if (block.type === "quick-answer") return [...linkPhrases(block.answer, block.anchors), ...block.points.flatMap(point => linkPhrases(point, block.anchors)), ...(block.table ? [...block.table.headers, ...block.table.rows.flat()].flat() : [])];
  return [];
}


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
    expect(articleWordCount(article), article.slug).toBeLessThanOrEqual(1800);
    expect(insightTitleTag(article).toLowerCase().startsWith(article.focusKeyword)).toBe(true);
    expect(insightTitleTag(article).length).toBeLessThanOrEqual(65);
    expect(article.slug).toBe(article.focusKeyword.replace(/\s+/g, "-"));
    expect(article.slug.length).toBeLessThan(75);
    expect(article.blocks[0].type).toBe("paragraph");
    expect(article.blocks[1].type).toBe("quick-answer");
    const intro = article.blocks[0];
    if (intro.type === "paragraph") {
      const text = intro.content.map(part => part.text).join("");
      expect(text.toLowerCase()).toContain(article.focusKeyword);
      expect(words(text)).toBeLessThanOrEqual(60);
    }
    const answer = article.blocks[1];
    if (answer.type === "quick-answer") {
      expect(words(answer.answer)).toBeLessThanOrEqual(65);
      expect(answer.points).toHaveLength(3);
    }
    expect(article.description.length).toBeGreaterThanOrEqual(150);
    expect(article.description.length).toBeLessThanOrEqual(160);
    expect(article.title.toLowerCase()).toContain(article.focusKeyword);
    expect(article.description.toLowerCase()).toContain(article.focusKeyword);
    expect(article.blocks.some(block => block.type === "heading" && block.level === 2 && block.text.toLowerCase().includes(article.focusKeyword))).toBe(true);
    const imageBlocks = article.blocks.filter(block => block.type === "image");
    expect(imageBlocks).toHaveLength(3);
    expect(imageBlocks.some(block => block.type === "image" && block.alt.toLowerCase().includes(article.focusKeyword))).toBe(true);
    expect(article.faqs).toHaveLength(3);
    for (const faq of article.faqs) {
      expect(words(faq.answer)).toBeGreaterThan(0);
      expect(words(faq.answer)).toBeLessThanOrEqual(35);
    }
    const inline = article.blocks.flatMap(editorialParts);
    const internal = inline.filter(part => part.href?.startsWith("/insights/"));
    expect(internal.length).toBeGreaterThanOrEqual(2);
    expect(new Set(inline.filter(part => part.href?.startsWith("https://")).map(part => part.href)).size).toBeGreaterThanOrEqual(3);
    for (const link of inline.filter(part => part.href?.startsWith("/insights/") || part.href?.startsWith("#"))) {
      const destination = new URL(link.href!, `${siteOrigin}/insights/${article.slug}`);
      const slug = destination.pathname.split("/").at(-1)!;
      expect(slugs.has(slug)).toBe(true);
      if (destination.hash) {
        const target = insightArticles.find(item => item.slug === slug)!;
        expect(target.blocks.some(block => (block.type === "heading" || block.type === "quick-answer") && block.id === destination.hash.slice(1))).toBe(true);
      }
    }
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
      const quickAnswer = page.locator("[data-quick-answer]");
      await expect(quickAnswer.getByRole("heading", { name: "Quick answer", exact: true })).toHaveCount(1);
      await expect(quickAnswer.locator("li")).toHaveCount(3);
      expect(await quickAnswer.evaluate(node => node.previousElementSibling === node.parentElement?.firstElementChild && node.previousElementSibling?.tagName === "P")).toBe(true);
      await expect(page).toHaveTitle(insightTitleTag(article));
      expect(await page.locator(".insight-content p").evaluateAll(nodes => nodes.every(node => (node.textContent?.match(/\S+/g) ?? []).length < 120))).toBe(true);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${siteOrigin}/insights/${article.slug}`);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", insightsIndexable ? "index, follow" : "noindex, follow");
      const links = article.blocks.flatMap(editorialParts).filter(part => part.href);
      await expect(page.locator(".insight-content .insight-context-link")).toHaveCount(links.filter(part => part.href!.startsWith("/") || part.href!.startsWith("#")).length);
      await expect(page.locator(".insight-content .insight-source-link")).toHaveCount(links.filter(part => part.href!.startsWith("https://")).length);
      await expect(quickAnswer.locator(".insight-summary-table")).toHaveCount(1);
      await expect(quickAnswer.locator("thead th")).toHaveCount(2);
      await expect(page.locator("figure.insight-figure img")).toHaveCount(3);
      await expect(page.locator("figure .insight-image-credit")).toHaveCount(3);
      await page.locator("figure img").evaluateAll(images => images.forEach(image => { (image as HTMLImageElement).loading = "eager"; }));
      await expect.poll(() => page.locator("figure img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
      const record = graph.find((item: { "@type": string }) => item["@type"] === "Article");
      expect(record.headline).toBe(article.title);
      expect(record.author.name).toBe("David Odoi");
      expect(record.datePublished).toBe(article.publishedAt);
      expect(record.dateModified).toBe(article.updatedAt);
      expect(record.wordCount).toBe(articleWordCount(article));
      const quick = article.blocks.find(block => block.type === "quick-answer");
      expect(record.abstract).toBe(quick?.type === "quick-answer" ? quick.answer : undefined);
      expect(JSON.stringify(graph)).not.toMatch(/AggregateRating|ratingValue/);
      const faq = graph.find((item: { "@type": string }) => item["@type"] === "FAQPage");
      expect(faq.mainEntity).toHaveLength(3);
      expect(await page.locator("#frequently-asked-questions").evaluate(heading => {
        let node = heading.nextElementSibling;
        let count = 0;
        while (node && node.tagName !== "H2") {
          if (node.tagName === "H3") count++;
          node = node.nextElementSibling;
        }
        return count;
      })).toBe(3);
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
      if (route !== "/insights" && route !== "/insights/image-credits") {
        const sizes = await page.locator(".insight-content p, .insight-content li, .insight-content td, .insight-content th, .insight-content caption, .insight-content figcaption, .insight-image-credit, .insight-author p, .insight-disclaimer p").evaluateAll(nodes => [...new Set(nodes.map(node => getComputedStyle(node).fontSize))]);
        expect(sizes, `${route} body fonts at ${width}px`).toEqual(["18px"]);
      }
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
  await expect(page.locator("h1")).toHaveText("Auto Trading: A Practical Guide to Forex Bots and Risk");
  expect(errors).toEqual([]);
});

test("reader-visible article copy stays under 1800 words and the answer card is easy to reach", async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const article of insightGuides) {
    await page.goto(`/insights/${article.slug}`);
    const text = await page.locator(".insight-article").evaluate(node => {
      let value = (node as HTMLElement).innerText;
      for (const element of node.querySelectorAll(".insight-kicker, .insight-byline, .insight-toc-mobile, .insight-author-role")) {
        value = value.replace((element as HTMLElement).innerText, "");
      }
      return value;
    });
    expect(words(text), article.slug).toBeLessThanOrEqual(1800);
    expect((await page.locator("[data-article-content] > p:first-child").textContent())!.toLowerCase()).toContain(article.focusKeyword);
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto("/insights/best-day-trading-app-for-beginners");
    await page.evaluate(() => document.fonts.ready);
    const answer = page.locator("[data-quick-answer]");
    await answer.scrollIntoViewIfNeeded();
    await expect(answer).toBeInViewport();
    await expect(answer.getByText("Start with TradingView", { exact: false })).toBeVisible();
    await page.screenshot({ path: `test-results/insights-quick-answer-${width}.png` });
  }
});

test("relevant anchor words are clickable and visibly underlined in summaries and comparisons", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/insights/best-day-trading-app-for-beginners");
  await page.mouse.move(0, 0);
  const answer = page.locator("[data-quick-answer]");
  const expected = [
    ["TradingView", "https://www.tradingview.com/support/solutions/43000516466-paper-trading-main-functionality/"],
    ["cTrader Mobile", "https://help.ctrader.com/ctrader-mobile/"],
    ["MT5 Mobile", "https://www.metatrader5.com/en/mobile-trading"],
  ];
  for (const [label, href] of expected) {
    const link = answer.getByRole("link", { name: label, exact: true }).first();
    await expect(link).toHaveAttribute("href", href);
    expect(await link.evaluate(node => getComputedStyle(node).textDecorationLine)).toContain("underline");
    expect(await link.evaluate(node => getComputedStyle(node).fontSize)).toBe("18px");
    await expect(answer.locator("table").getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  }
  const internal = answer.getByRole("link", { name: "placing, changing and cancelling orders", exact: true });
  await expect(internal).toHaveAttribute("href", "/insights/best-platforms-for-day-trading#run-the-same-demo-checklist-on-each-candidate");
  await internal.click();
  await expect(page).toHaveURL(/\/insights\/best-platforms-for-day-trading#run-the-same-demo-checklist-on-each-candidate$/);
  await expect(page.locator("#run-the-same-demo-checklist-on-each-candidate")).toBeInViewport();
  await page.goto("/insights/best-indicators-for-swing-trading");
  await page.locator('[data-quick-answer] a[href="#atr-translate-volatility-into-risk-aware-distances"]').first().click();
  await expect(page.locator("#atr-translate-volatility-into-risk-aware-distances")).toBeInViewport();
  await page.goto("/insights/best-laptop-computer-for-day-trading");
  const model = page.locator('[data-quick-answer] table').getByRole("link", { name: "T14 Gen 5 Intel", exact: true });
  await expect(model).toHaveAttribute("href", "https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_T14_Gen_5_Intel/ThinkPad_T14_Gen_5_Intel_Spec.pdf");
  await model.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/insights-summary-table-links-mobile.png" });
});
