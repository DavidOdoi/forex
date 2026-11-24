import { test, expect } from "@playwright/test";
import { leverageDefinition } from "../src/lib/calculators/leverage-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path = "/calculators/forex-leverage-calculator";
test("effective exposure stays separate from permitted leverage and collateral", async ({ page }) => {
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("10:1"); await expect(page.locator("#calculation-result")).toContainText("USD 1,000.00");
  await page.getByLabel("Entered permitted leverage", { exact: true }).fill("100"); await expect(page.locator("[data-result]")).toHaveText("10:1"); await expect(page.locator("#calculation-result")).toContainText("USD 500.00");
  await page.getByLabel("Entered margin convention", { exact: true }).selectOption("percent"); await page.getByLabel("Entered margin requirement (%)", { exact: true }).fill("2"); await expect(page.locator("[data-result]")).toHaveText("10:1");
  await page.getByLabel("Current account equity", { exact: true }).fill("0"); await expect(page.locator("[data-result]")).toHaveCount(0);
});
test("trade notional reuses contract and conversion logic with base-account identity", async ({ page }) => {
  await page.goto(path); await page.getByLabel("Exposure input", { exact: true }).selectOption("trade"); await page.getByLabel("Current account equity", { exact: true }).fill("11000");
  await expect(page.locator("[data-result]")).toHaveText("10:1"); await expect(page.locator("#calculation-result")).toContainText("USD 110,000.00"); await expect(page.locator("#calculation-result")).toContainText("USD 2,200.00");
  await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY"); await expect(page.getByLabel("Notional reference price", { exact: true })).toHaveCount(0); await expect(page.locator("#calculation-result")).toContainText("USD 100,000.00");
});
test("available-margin warnings, proportional bars and saved scenarios fit phones", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } }); });
  await page.goto(path); await page.getByText("Advanced assumptions and specification", { exact: true }).click(); await page.getByLabel("Existing account used margin", { exact: true }).fill("4500"); await page.getByLabel("Platform available margin (optional)", { exact: true }).fill("400");
  await expect(page.locator("#calculation-result")).toContainText("exceeds the separately entered platform available margin"); await expect(page.getByRole("figure", { name: "Exposure and equity comparison", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click(); await page.goto(await page.evaluate(() => (window as Window & { copied?: string }).copied!)); await expect(page.locator("[data-result]")).toHaveText("10:1");
  for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
});
test("leverage content, canonical, sitemap and three FAQs render without JavaScript", async ({ browser, request }) => {
  expect(calculatorArticleWords(leverageDefinition)).toBeGreaterThanOrEqual(1500); expect(calculatorArticleWords(leverageDefinition)).toBeLessThanOrEqual(1800);
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage(); try { await page.goto("http://127.0.0.1:3100" + path); await expect(page.locator("h1")).toHaveCount(1); await expect(page.locator("[data-result]")).toHaveText("10:1"); await expect(page.locator("#calculator-faq details")).toHaveCount(3); await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com" + path); expect(await (await request.get("/sitemap.xml")).text()).toContain(path); } finally { await context.close(); }
});
