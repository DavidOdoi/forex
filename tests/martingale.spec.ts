import { test, expect } from "@playwright/test";
import { martingaleDefinition as d } from "../src/lib/calculators/martingale-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path = "/calculators/forex-martingale-calculator";
test("open grid shows costs once, growing exposure and the first constraint", async ({ page }) => {
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("USD -114.00");
  await expect(page.locator("#calculation-result")).toContainText("63,000 EUR");
  await expect(page.locator("#calculation-result")).toContainText("USD 1,373.40");
  await page.getByLabel("Closing bid/ask spread · pips", { exact: true }).fill("2");
  await expect(page.locator("[data-result]")).toHaveText("USD -126.60");
  await page.getByText("Advanced assumptions and specification", { exact: true }).click();
  await page.getByLabel("Opening commission per lot · account currency", { exact: true }).fill("3.5");
  await page.getByLabel("Closing commission per lot · account currency", { exact: true }).fill("3.5");
  await page.getByLabel("Fixed opening fee per position", { exact: true }).fill("1");
  await page.getByLabel("Signed accrued financing per open lot", { exact: true }).fill("-2");
  await expect(page.locator("[data-result]")).toHaveText("USD -138.27");
  await page.getByLabel("Maximum quantity per order", { exact: true }).fill("0.04");
  await expect(page.locator("#calculation-result")).toContainText("Level 4: Above per-order maximum");
  await expect(page.locator("#calculation-result")).toContainText("later rows are hypothetical");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.locator("[data-result]")).toHaveText("USD -114.00");
});
test("closed-trade mode supports stakes, asymmetric payoffs and private settings", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } }));
  await page.goto(path); await page.getByLabel("Martingale calculation mode", { exact: true }).selectOption("sequential");
  await page.getByLabel("Sequential quantity convention", { exact: true }).selectOption("stake");
  for (const [label, value] of [["Starting trade quantity", "1"], ["Number of completed consecutive losses", "4"], ["Minimum order quantity", "1"], ["Permitted quantity increment", "1"], ["Gross loss per one USD stake unit", "1"], ["Gross winning payoff per one USD stake unit", "1"]]) await page.getByLabel(label, { exact: true }).fill(value);
  await expect(page.locator("[data-result]")).toHaveText("USD 1.00");
  await expect(page.locator("#calculation-result")).toContainText("15 stake units · not open exposure");
  await page.getByLabel("Gross winning payoff per one USD stake unit", { exact: true }).fill("0.5");
  await expect(page.locator("[data-result]")).toHaveText("USD -7.00");
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click();
  const url = await page.evaluate(() => (window as Window & { copied?: string }).copied!);
  for (const key of ["balance", "startSize", "firstEntry", "lossPerUnit", "winPerUnit", "financing"]) expect(new URL(url).searchParams.has(key)).toBe(false);
  await page.goto(url); await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.locator("#calculation-result")).toContainText("without private financial data");
});
test("Martingale stays mobile friendly, server rendered, linked and indexable", async ({ page, browser, request }) => {
  expect(calculatorArticleWords(d)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(d)).toBeLessThanOrEqual(1800);
  await page.goto(path);
  for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
  await page.getByLabel("Grid currency pair", { exact: true }).selectOption("USD/JPY"); await expect(page.getByLabel("First executed entry price", { exact: true })).toHaveValue(""); await expect(page.locator("[data-result]")).toHaveCount(0);
  const ctx = await browser.newContext({ javaScriptEnabled: false }), p = await ctx.newPage();
  try { await p.goto("http://127.0.0.1:3100" + path); await expect(p.locator("[data-result]")).toHaveText("USD -114.00"); await expect(p.locator("#calculator-faq details")).toHaveCount(3); await expect(p.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com" + path); expect(await (await request.get("/sitemap.xml")).text()).toContain(path); const schema = await p.locator('script[type="application/ld+json"]').allTextContents(); expect(schema.join()).toContain("WebApplication"); } finally { await ctx.close(); }
  const anchors = d.sections.flatMap(s => s.paragraphs.flatMap(parts => parts.flatMap(p => p.href ? [p.href] : [])));
  for (const href of anchors.filter(href => href.startsWith("/"))) expect((await request.get(href)).status()).toBe(200);
});
