import { test, expect } from "@playwright/test";
import { marginCallDefinition } from "../src/lib/calculators/margin-call-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path = "/calculators/forex-margin-call-calculator";
test("margin-call calculator separates warning conditions, zero margin and negative-equity arithmetic", async ({ page }) => {
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("200%");
  await page.getByLabel("Current account equity", { exact: true }).fill("900"); await expect(page.locator("[data-result]")).toHaveText("90%"); await expect(page.locator("#calculation-result")).toContainText("At entered margin-call condition");
  await page.getByLabel("Current used margin", { exact: true }).fill("0"); await expect(page.locator("[data-result]")).toHaveText("No margin currently used"); await expect(page.locator("#calculation-result")).not.toContainText("Infinity");
  await page.getByLabel("Current used margin", { exact: true }).fill("1000"); await page.getByLabel("Stop-out threshold (%)", { exact: true }).fill("0"); await page.getByLabel("Current account equity", { exact: true }).fill("-1");
  await expect(page.locator("[data-result]")).toHaveText("-0.1%"); await expect(page.locator("#calculation-result")).toContainText("At entered stop-out condition");
});
test("margin-call scenario changes are distinct from the original account snapshot", async ({ page }) => {
  await page.goto(path); await page.getByText("Advanced assumptions and specification", { exact: true }).click(); await page.getByLabel("Scenario additional P&L", { exact: true }).fill("-500"); await page.getByLabel("Scenario used margin (optional)", { exact: true }).fill("1500");
  await expect(page.locator("[data-result]")).toHaveText("200%"); await expect(page.locator("#calculation-result")).toContainText("100%");
  await page.getByLabel("Current equity input", { exact: true }).selectOption("balance-pnl"); await page.getByLabel("Account balance", { exact: true }).fill("5000"); await page.getByLabel("Current floating P&L", { exact: true }).fill("-1000");
  await expect(page.locator("[data-result]")).toHaveText("400%");
});
test("referenced rule profiles fail closed and preserve full public source URLs when shared", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } }); });
  await page.goto(path); await page.getByLabel("Rule-source basis", { exact: true }).selectOption("user-source"); await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.getByLabel("Public broker name", { exact: true }).fill("Example only"); await page.getByLabel("Contracting legal entity", { exact: true }).fill("Example company"); await page.getByLabel("Account type / product", { exact: true }).fill("Illustrative product");
  const source = "https://example.com/documentation/public-account-rules/long-source-path-for-a-specific-product";
  await page.getByLabel("Public account-rule source URL", { exact: true }).fill(source); await page.getByLabel("Rule-checked date · UTC", { exact: true }).fill("2026-11-23");
  await page.getByLabel("I checked the entered rule settings for this company/account", { exact: true }).selectOption("yes"); await expect(page.locator("[data-result]")).toHaveText("200%");
  await expect(page.locator("#calculation-result")).toContainText("not independently verified"); await page.getByRole("button", { name: "Copy scenario link", exact: true }).click(); await page.goto(await page.evaluate(() => (window as Window & { copied?: string }).copied!));
  await expect(page.getByLabel("Public account-rule source URL", { exact: true })).toHaveValue(source); await expect(page.locator("#calculation-result a[href^='https://example.com/']")).toHaveAttribute("href", source);
});
test("margin-call SSR guide, metadata and mobile layout stay consistent with three FAQs", async ({ browser, page, request }) => {
  expect(calculatorArticleWords(marginCallDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(marginCallDefinition)).toBeLessThanOrEqual(1800);
  await page.goto(path); for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
  const context = await browser.newContext({ javaScriptEnabled: false }); const staticPage = await context.newPage(); try { await staticPage.goto("http://127.0.0.1:3100" + path); await expect(staticPage.locator("h1")).toHaveCount(1); await expect(staticPage.locator("[data-result]")).toHaveText("200%"); await expect(staticPage.locator("#calculator-faq details")).toHaveCount(3); await expect(staticPage.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com" + path); expect(await (await request.get("/sitemap.xml")).text()).toContain(path); } finally { await context.close(); }
});
