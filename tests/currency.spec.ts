import { test, expect } from "@playwright/test";
import { currencyDefinition } from "../src/lib/calculators/currency-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path = "/calculators/currency-converter";
test("currency conversion exposes fees and reverses the quote convention without reusing provider charges", async ({ page }) => {
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("UGX 370,000");
  await page.getByLabel("Separate percentage fee (%)", { exact: true }).fill("1"); await page.getByLabel("Fixed fee · UGX", { exact: true }).fill("2000");
  await expect(page.locator("[data-result]")).toHaveText("UGX 364,300");
  await page.getByRole("button", { name: "Reverse currencies", exact: true }).click();
  await expect(page.getByLabel("Source currency", { exact: true })).toHaveValue("UGX"); await expect(page.getByLabel("Target currency", { exact: true })).toHaveValue("USD");
  await expect(page.getByLabel("Fixed fee · USD", { exact: true })).toHaveValue("0"); await expect(page.getByLabel("USD/UGX conversion rate", { exact: true })).toHaveValue("3700");
  await expect(page.locator("#calculation-result")).toContainText("not live");
});
test("currency cross and provider amounts retain their denominations", async ({ page }) => {
  await page.goto(path); await page.getByLabel("Source currency", { exact: true }).selectOption("EUR");
  await page.getByLabel("Conversion quotation", { exact: true }).selectOption("cross"); await page.getByLabel("Intermediate currency", { exact: true }).selectOption("USD");
  await page.getByLabel("EUR/USD conversion rate", { exact: true }).fill("1.1"); await page.getByLabel("USD/UGX conversion rate", { exact: true }).fill("3700");
  await expect(page.locator("[data-result]")).toHaveText("UGX 407,000");
  await page.getByLabel("Provider comparison", { exact: true }).selectOption("rate"); await page.getByLabel("Provider rate · UGX per 1 EUR", { exact: true }).fill("4000");
  await expect(page.locator("[data-result]")).toHaveText("UGX 400,000");
});
test("historical mode uses the requested date and cannot leak the previous date's quote", async ({ page }) => {
  const requests: string[] = [];
  await page.route("**/api/forex-rates**", route => { const url = new URL(route.request().url()); const date = url.searchParams.get("date"); requests.push(date ?? "daily"); return date === "2025-01-20" ? route.fulfill({ json: { provider: "Frankfurter", retrievedAt: "2026-11-24T12:00:00Z", rates: [{ base: "USD", quote: "EUR", rate: "0.9", source: "frankfurter", asOf: "2025-01-17T00:00:00Z" }] } }) : route.fulfill({ status: 503, json: { error: "No suitable historical data for this request." } }); });
  await page.goto(path); await page.getByLabel("Target currency", { exact: true }).selectOption("EUR"); await page.getByLabel("Conversion rate source", { exact: true }).selectOption("historical");
  await expect(page.locator("[data-result]")).toHaveText("EUR 90.00"); await expect(page.locator("#calculation-result")).toContainText("2025-01-17"); expect(requests).toContain("2025-01-20");
  await page.getByLabel("Requested historical reference date", { exact: true }).fill("2025-02-20"); await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.locator("[data-cost-workbench]")).toContainText("No suitable historical data");
});
test("currency share/reset, mobile and no-JavaScript metadata remain usable", async ({ page, browser, request }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } }); });
  await page.goto(path); await page.getByLabel("Amount to convert", { exact: true }).fill("250"); await page.getByRole("button", { name: "Copy scenario link", exact: true }).click(); await page.goto(await page.evaluate(() => (window as Window & { copied?: string }).copied!)); await expect(page.locator("[data-result]")).toHaveText("UGX 925,000");
  await page.getByRole("button", { name: "Reset", exact: true }).click(); await expect(page.locator("[data-result]")).toHaveText("UGX 370,000");
  for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
  expect(calculatorArticleWords(currencyDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(currencyDefinition)).toBeLessThanOrEqual(1800);
  const context = await browser.newContext({ javaScriptEnabled: false }); const staticPage = await context.newPage(); try { await staticPage.goto("http://127.0.0.1:3100" + path); await expect(staticPage.locator("[data-result]")).toHaveText("UGX 370,000"); await expect(staticPage.locator("h1")).toHaveCount(1); await expect(staticPage.locator("#calculator-faq details")).toHaveCount(3); await expect(staticPage.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com" + path); expect(await (await request.get("/sitemap.xml")).text()).toContain(path); } finally { await context.close(); }
});
