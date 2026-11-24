import { test, expect } from "@playwright/test";
import { takeProfitDefinition } from "../src/lib/calculators/take-profit-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path = "/calculators/forex-take-profit-calculator";
test("take-profit monetary and ratio modes respect direction, fees and price increments", async ({ page }) => {
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("1.10500");
  await page.getByLabel("Profit-target calculation", { exact: true }).selectOption("money"); await expect(page.locator("[data-result]")).toHaveText("1.10750");
  await page.getByLabel("Monetary profit basis", { exact: true }).selectOption("net"); await page.getByText("Advanced assumptions and specification", { exact: true }).click(); await page.getByLabel("Total round-turn commission · account currency", { exact: true }).fill("10"); await expect(page.locator("[data-result]")).toHaveText("1.10800");
  await page.getByLabel("Profit-target calculation", { exact: true }).selectOption("ratio"); await page.getByLabel("Planned executable stop price", { exact: true }).fill("1.0975"); await expect(page.locator("[data-result]")).toHaveText("1.10500");
  await page.getByLabel("Trade direction", { exact: true }).selectOption("sell"); await expect(page.locator("[data-result]")).toHaveCount(0); await page.getByLabel("Planned executable stop price", { exact: true }).fill("1.1025"); await expect(page.locator("[data-result]")).toHaveText("1.09500");
});
test("take-profit JPY conversion and target visualization disclose frozen-rate assumptions", async ({ page }) => {
  await page.goto(path); await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY"); await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.getByLabel("Executable entry price", { exact: true }).fill("160"); await page.getByLabel("Target distance · pips", { exact: true }).fill("20"); await page.getByLabel("USD/JPY conversion rate", { exact: true }).fill("160");
  await expect(page.locator("[data-result]")).toHaveText("160.200"); await expect(page.locator("#calculation-result")).toContainText("USD 25.00"); await expect(page.locator("#calculation-result")).toContainText("frozen assumptions"); await expect(page.getByRole("figure", { name: "Entered trade price levels", exact: true })).toBeVisible();
});
test("take-profit saved scenarios, reset and mobile price levels remain usable", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } }); });
  await page.goto(path); await page.getByLabel("Target distance · pips", { exact: true }).fill("50.37"); await expect(page.locator("[data-result]")).toHaveText("1.10504");
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click(); await page.goto(await page.evaluate(() => (window as Window & { copied?: string }).copied!)); await expect(page.locator("[data-result]")).toHaveText("1.10504");
  for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
  await page.getByRole("button", { name: "Reset", exact: true }).click(); await expect(page.locator("[data-result]")).toHaveText("1.10500");
});
test("take-profit content and default render without JavaScript with canonical metadata and three FAQs", async ({ browser, request }) => {
  expect(calculatorArticleWords(takeProfitDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(takeProfitDefinition)).toBeLessThanOrEqual(1800);
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage(); try { await page.goto("http://127.0.0.1:3100" + path); await expect(page.locator("h1")).toHaveCount(1); await expect(page.locator("[data-result]")).toHaveText("1.10500"); await expect(page.locator("#calculator-faq details")).toHaveCount(3); await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com" + path); expect(await (await request.get("/sitemap.xml")).text()).toContain(path); } finally { await context.close(); }
});
