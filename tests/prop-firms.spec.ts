import { test, expect } from "@playwright/test";
import { calculateConsistency } from "../src/lib/calculators/consistency";
import { comparisonFaqs, propPaths, comparisonHeading, comparisonTitle } from "../src/lib/prop-firms/content";
import { firms } from "../src/lib/prop-firms/firms";
import { siteOrigin } from "../src/lib/site";

test("consistency reproduces the brief's example and all preset limits", () => {
  expect(calculateConsistency("2400", "1500", "40")).toEqual({ percentage: 62.5, limit: 40, withinLimit: false, minimumTotal: 3750, additionalProfit: 1350 });
  for (const limit of [20, 30, 40, 50]) {
    const result = calculateConsistency("100", "500", String(limit));
    expect(result.percentage).toBe(500);
    expect(result.withinLimit).toBe(false);
    expect(result.minimumTotal).toBe(Math.ceil(50000 / (limit / 100)) / 100);
    expect(result.additionalProfit).toBeCloseTo(result.minimumTotal - 100, 2);
  }
});

test("cent rounding, exact boundaries, custom limits and loss-reduced totals stay correct", () => {
  expect(calculateConsistency("333.33", "100", "30")).toMatchObject({ withinLimit: false, minimumTotal: 333.34, additionalProfit: 0.01 });
  expect(calculateConsistency("333.34", "100", "30").withinLimit).toBe(true);
  expect(calculateConsistency("3750", "1500", "40")).toMatchObject({ withinLimit: true, additionalProfit: 0 });
  expect(calculateConsistency("1000", "100", "20")).toMatchObject({ withinLimit: true, minimumTotal: 500, additionalProfit: 0 });
  expect(calculateConsistency("50", "100", "20")).toMatchObject({ percentage: 200, minimumTotal: 500, additionalProfit: 450 });
  expect(calculateConsistency("100", "50", "12.5")).toMatchObject({ limit: 12.5, minimumTotal: 400, additionalProfit: 300 });
  expect(calculateConsistency("0.01", "0.01", "100")).toMatchObject({ withinLimit: true, minimumTotal: 0.01 });
  expect(calculateConsistency("1", "1000000000", "0.01")).toMatchObject({ minimumTotal: 10000000000000, additionalProfit: 9999999999999 });
});

test("invalid financial data is rejected rather than yielding Infinity or a false pass", () => {
  for (const invalid of ["", "0", "-1", "NaN", "Infinity", "1e3", "1,000", "5.555", "1000000001"]) {
    expect(() => calculateConsistency(invalid,"500","40")).toThrow();
    expect(() => calculateConsistency("1000",invalid,"40")).toThrow();
  }
  for (const invalid of ["0", "-20", "100.01", "0.001", "NaN", ""]) expect(() => calculateConsistency("1000","500",invalid)).toThrow();
});

test("prop-firm comparison retains crawlable copy, FAQ schema and canonical metadata", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const [path, heading, title, faqs, type] of [[propPaths.comparison, comparisonHeading, comparisonTitle, comparisonFaqs, "Article"]] as const) {
      const response = await page.goto(`http://127.0.0.1:3100${path}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1); await expect(page.locator("h1")).toHaveText(heading); await expect(page).toHaveTitle(title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin+path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
      await expect(page.locator('#faq details')).toHaveCount(3);
      for (const faq of faqs) {
        const length = faq.answer.split(/\s+/).length;
        expect(length, faq.question).toBeGreaterThanOrEqual(35); expect(length, faq.question).toBeLessThanOrEqual(55);
        await expect(page.locator('#faq details').filter({ hasText: faq.question }).locator('p')).toHaveText(faq.answer);
      }
      const graph=JSON.parse((await page.locator('main script[type="application/ld+json"]').textContent())!)["@graph"];
      expect(graph.some((node: { "@type": string })=>node["@type"]===type)).toBe(true);
      expect(graph.find((node: { "@type": string })=>node["@type"]==="FAQPage").mainEntity).toHaveLength(3);
      expect(JSON.stringify(graph)).not.toMatch(/ratingValue|aggregateRating/);
      expect(await page.locator('main').evaluate(node => [...node.querySelectorAll('a[href^="#"]')].every(a=>document.getElementById(a.getAttribute('href')!.slice(1))))).toBe(true);
    }
    await page.goto(`http://127.0.0.1:3100${propPaths.comparison}`);
    await expect(page.locator('#compared tbody tr')).toHaveCount(5);
    expect(await page.locator('#compared').evaluate(node=>node.previousElementSibling?.tagName)).toBe('HEADER');
    for (const firm of firms) await expect(page.locator(`#${firm.id} a`).first()).toHaveAttribute('href',firm.policyUrl);
    const comparisonWords = await page.locator('main').evaluate(node => {
      const parts = [node.querySelector('header p'), node.querySelector('#compared'), node.querySelector('article')];
      return parts.map(part => part?.textContent ?? '').join(' ').split(/\s+/).length;
    });
    expect(comparisonWords).toBeGreaterThanOrEqual(1300); expect(comparisonWords).toBeLessThanOrEqual(1700);
    const xml=await (await request.get('/sitemap.xml')).text();
    for (const path of Object.values(propPaths)) expect(xml).toContain(`<loc>${siteOrigin+path}</loc>`);
  } finally { await context.close(); }
});


test("comparison keeps contextual destinations live and fits small screens", async ({ page, request }) => {
  await page.goto(propPaths.comparison);
  const urls = await page.locator('main a[href^="/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!));
  for (const url of new Set(urls)) expect((await request.get(url)).status(), url).toBe(200);
  for (const width of [320, 390, 768, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
});
