import { test, expect } from "@playwright/test";
import { calculateConsistency } from "../src/lib/calculators/consistency";
import { comparisonFaqs, consistencyFaqs, propPaths, comparisonHeading, comparisonTitle, calculatorHeading, calculatorTitle } from "../src/lib/prop-firms/content";
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

test("both pages ship crawlable copy, accurate FAQ schema and distinct canonical metadata", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const [path, heading, title, faqs, type] of [[propPaths.comparison, comparisonHeading, comparisonTitle, comparisonFaqs, "Article"], [propPaths.calculator, calculatorHeading, calculatorTitle, consistencyFaqs, "WebApplication"]] as const) {
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
    await expect(page.locator('main noscript')).toBeVisible();
    const calculatorWords = (await page.locator('article').textContent())!.split(/\s+/).length;
    expect(calculatorWords).toBeGreaterThanOrEqual(500); expect(calculatorWords).toBeLessThanOrEqual(800);
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

test("calculator updates instantly, validates inputs, supports custom rules and resets", async ({ page }) => {
  await page.goto(propPaths.calculator);
  await expect(page.locator('[data-result="percentage"]')).toHaveText('62.5%');
  await expect(page.locator('[data-result="minimum"]')).toHaveText('$3,750.00');
  await expect(page.locator('[data-result="additional"]')).toHaveText('$1,350.00');
  await page.getByLabel('Total net profit ($)',{exact:true}).fill('3750');
  await expect(page.getByText('Within selected limit',{exact:true})).toBeVisible();
  await expect(page.locator('[data-result="additional"]')).toHaveText('$0.00');
  await page.getByRole('radio',{name:'Custom',exact:true}).check();
  await page.getByLabel('Custom limit (%)',{exact:true}).fill('20');
  await expect(page.locator('[data-result="minimum"]')).toHaveText('$7,500.00');
  await page.getByLabel('Total net profit ($)',{exact:true}).fill('0');
  await expect(page.locator('[data-result]')).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('greater than zero');
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await expect(page.getByLabel('Total net profit ($)',{exact:true})).toHaveValue('');
  await expect(page.getByLabel('Highest profitable trading day ($)',{exact:true})).toHaveValue('');
  await expect(page.getByRole('radio',{name:'40%',exact:true})).toBeChecked();
});

test("keyboard controls and small screens keep results accessible without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height:844 });
  await page.goto(propPaths.calculator);
  await page.getByRole('radio',{name:'40%',exact:true}).focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio',{name:'50%',exact:true})).toBeChecked();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuetext',/selected limit 50 percent; above limit/);
  await page.getByLabel('Total net profit ($)',{exact:true}).fill('1000000000');
  await page.getByLabel('Highest profitable trading day ($)',{exact:true}).fill('1000000000');
  await page.getByRole('radio',{name:'Custom',exact:true}).check();
  await page.getByLabel('Custom limit (%)',{exact:true}).fill('0.01');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height:900 });
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`calculator at ${width}px`).toBe(true);
  }
  await page.goto(propPaths.comparison);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height:900 });
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`comparison at ${width}px`).toBe(true);
    expect(await page.locator('article p').first().evaluate(node=>parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16);
  }
});

test("contextual internal destinations exist and new resources are discoverable from hubs", async ({ page, request }) => {
  const visited = new Set<string>();
  for (const path of Object.values(propPaths)) {
    await page.goto(path);
    const urls=await page.locator('main a[href^="/"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')!));
    expect(new Set(urls.map(url=>url.split('#')[0])).size).toBeGreaterThanOrEqual(5);
    for (const url of urls) {
      if(visited.has(url))continue;visited.add(url);
      expect((await request.get(url)).status(),url).toBe(200);
    }
  }
  await page.goto('/tools');await expect(page.locator('main a[href="'+propPaths.calculator+'"]').first()).toBeVisible();
  await page.goto('/insights');await expect(page.locator('main a[href="'+propPaths.comparison+'"]')).toBeVisible();
});
