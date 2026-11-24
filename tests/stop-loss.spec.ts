import { test, expect } from "@playwright/test";
import { stopLossDefinition } from "../src/lib/calculators/stop-loss-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path = "/calculators/forex-stop-loss-calculator";
test("stop-loss pips, cash/percentage budgets and wrong-side protection behave distinctly", async ({ page }) => {
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("1.09700");
  await page.getByLabel("Stop calculation method", { exact: true }).selectOption("money"); await page.getByLabel("Trade size", { exact: true }).fill("0.5"); await expect(page.locator("[data-result]")).toHaveText("1.09800");
  await page.getByText("Advanced assumptions and specification", { exact: true }).click(); await page.getByLabel("Total round-turn commission · account currency", { exact: true }).fill("10"); await page.getByLabel("Risk allowance includes", { exact: true }).selectOption("net"); await expect(page.locator("[data-result]")).toHaveText("1.09820");
  await page.getByLabel("Stop calculation method", { exact: true }).selectOption("price"); await page.getByLabel("Planned executable stop price", { exact: true }).fill("1.11"); await expect(page.locator("[data-result]")).toHaveCount(0);
});
test("ATR units and JPY closing-conversion assumptions are explicit", async ({ page }) => {
  await page.goto(path); await page.getByLabel("Stop calculation method", { exact: true }).selectOption("atr"); await expect(page.locator("[data-result]")).toHaveText("1.09500");
  await page.getByLabel("ATR value unit", { exact: true }).selectOption("price"); await page.getByLabel("Entered ATR value", { exact: true }).fill("0.0025"); await expect(page.locator("[data-result]")).toHaveText("1.09500");
  await page.getByLabel("Stop calculation method", { exact: true }).selectOption("pips"); await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY"); await page.getByLabel("Executable entry price", { exact: true }).fill("160"); await page.getByLabel("Trade size", { exact: true }).fill("1"); await page.getByLabel("Stop distance · pips", { exact: true }).fill("40"); await page.getByLabel("USD/JPY conversion rate", { exact: true }).fill("159.6");
  await expect(page.locator("[data-result]")).toHaveText("159.600"); await expect(page.locator("#calculation-result")).toContainText("USD 250.63"); await expect(page.locator("#calculation-result")).toContainText("not guaranteed");
});
test("rounded stop scenarios survive sharing and render price levels on small screens", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } }); });
  await page.goto(path); await page.getByLabel("Stop distance · pips", { exact: true }).fill("30.37"); await expect(page.locator("[data-result]")).toHaveText("1.09697"); await page.getByRole("button", { name: "Copy scenario link", exact: true }).click(); await page.goto(await page.evaluate(() => (window as Window & { copied?: string }).copied!)); await expect(page.locator("[data-result]")).toHaveText("1.09697");
  for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); } await expect(page.getByRole("figure", { name: "Entered trade price levels", exact: true })).toBeVisible();
});
test("stop-loss guide and default are server rendered with three FAQs and canonical metadata", async ({ browser, request }) => {
  expect(calculatorArticleWords(stopLossDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(stopLossDefinition)).toBeLessThanOrEqual(1800);
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage(); try { await page.goto("http://127.0.0.1:3100" + path); await expect(page.locator("h1")).toHaveCount(1); await expect(page.locator("[data-result]")).toHaveText("1.09700"); await expect(page.locator("#calculator-faq details")).toHaveCount(3); await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com" + path); expect(await (await request.get("/sitemap.xml")).text()).toContain(path); } finally { await context.close(); }
});
