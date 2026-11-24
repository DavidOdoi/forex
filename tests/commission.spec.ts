import { test, expect } from "@playwright/test";
import { commissionDefinition } from "../src/lib/calculators/commission-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path = "/calculators/forex-commission-calculator";
test("commission minimums, custom partial closes and prepaid round turns have distinct totals", async ({ page }) => {
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("USD 1.40");
  await page.getByText("Advanced assumptions and specification", { exact: true }).click();
  await page.getByLabel("Custom executed order list", { exact: true }).selectOption("yes");
  await page.getByLabel("Executed orders · side,volume,price", { exact: true }).fill("entry,0.1\nexit,0.04\nexit,0.06");
  await page.getByLabel("Minimum per charged executed order", { exact: true }).fill("1");
  await expect(page.locator("[data-result]")).toHaveText("USD 3.00");
  await page.getByLabel("Commission charging basis", { exact: true }).selectOption("lot-roundturn");
  await page.getByLabel("Full round-turn fee per billed lot", { exact: true }).fill("7");
  await page.getByLabel("Round-turn billing timing", { exact: true }).selectOption("entry");
  await expect(page.locator("[data-result]")).toHaveText("USD 1.00"); await expect(page.locator("#calculation-result")).toContainText("prepaid");
});
test("commission percentage notionals use separate prices and reject the wrong denomination", async ({ page }) => {
  await page.goto(path); await page.getByLabel("Commission charging basis", { exact: true }).selectOption("percent-notional");
  await page.getByLabel("Trade size", { exact: true }).fill("1"); await page.getByLabel("Entry fee · percent (e.g. 0.002)", { exact: true }).fill("0.002");
  await page.getByLabel("Entry executable price", { exact: true }).fill("1.1"); await page.getByLabel("Exit executable price", { exact: true }).fill("1.2");
  await expect(page.locator("[data-result]")).toHaveText("USD 4.60");
  await page.getByLabel("Commission denomination", { exact: true }).selectOption("EUR"); await expect(page.locator("[data-result]")).toHaveCount(0);
  await expect(page.locator("#calculation-result")).toContainText("must match");
});
test("commission order lists survive sharing and mobile controls remain readable", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } }); });
  await page.goto(path); await page.getByText("Advanced assumptions and specification", { exact: true }).click(); await page.getByLabel("Custom executed order list", { exact: true }).selectOption("yes");
  const rows = "entry,1,1.1\nexit,0.1,1.11\nexit,0.1,1.12\nexit,0.1,1.13\nexit,0.2,1.14\nexit,0.5,1.15";
  await page.getByLabel("Executed orders · side,volume,price", { exact: true }).fill(rows); await page.getByRole("button", { name: "Copy scenario link", exact: true }).click(); await page.goto(await page.evaluate(() => (window as Window & { copied?: string }).copied!));
  await page.getByText("Advanced assumptions and specification", { exact: true }).click(); await expect(page.getByLabel("Executed orders · side,volume,price", { exact: true })).toHaveValue(rows); await expect(page.locator("[data-result]")).toHaveText("USD 7.00");
  for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
});
test("commission article, default and FAQs are server rendered with canonical metadata", async ({ browser, request }) => {
  expect(calculatorArticleWords(commissionDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(commissionDefinition)).toBeLessThanOrEqual(1800);
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage(); try { await page.goto("http://127.0.0.1:3100" + path); await expect(page.locator("h1")).toHaveCount(1); await expect(page.locator("[data-result]")).toHaveText("USD 1.40"); await expect(page.locator("#calculator-faq details")).toHaveCount(3); await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com" + path); expect(await (await request.get("/sitemap.xml")).text()).toContain(path); } finally { await context.close(); }
});
