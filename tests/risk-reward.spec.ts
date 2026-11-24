import { test, expect } from "@playwright/test";
import { riskDefinition } from "../src/lib/calculators/risk-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
import { siteOrigin } from "../src/lib/site";
const path = "/calculators/forex-risk-reward-calculator";
test("risk/reward content, default example, schema, anchors and canonical render without JavaScript", async ({ browser, request }) => {
  expect(calculatorArticleWords(riskDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(riskDefinition)).toBeLessThanOrEqual(1800);
  const ctx = await browser.newContext({ javaScriptEnabled: false }); const page = await ctx.newPage();
  try { await page.goto(`http://127.0.0.1:3100${path}`); await expect(page.locator("h1")).toHaveText(riskDefinition.heading); await expect(page.locator("[data-result]")).toHaveText("1 : 2"); await expect(page.locator("#calculator-faq details")).toHaveCount(3); await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href",siteOrigin+path); expect(await (await request.get("/sitemap.xml")).text()).toContain(siteOrigin+path); } finally { await ctx.close(); }
});
test("risk/reward shows costs, assumed expectancy, no-positive-target and invalid order states", async ({ page }) => {
  await page.goto(path); await page.getByLabel("Additional round-trip costs (USD)", { exact: true }).fill("10");
  await expect(page.locator("[data-result]")).toHaveText("1 : 1.8571"); await expect(page.locator("#calculation-result")).toContainText("35%");
  await page.getByLabel("Assumed win rate (%) · optional", { exact: true }).fill("40"); await expect(page.locator("#calculation-result")).toContainText("USD 30.00");
  await page.getByText("Compare two alternative targets", { exact: true }).click(); await page.getByLabel("Alternative target 2 · optional", { exact: true }).fill("1.106"); await expect(page.locator("#calculation-result")).toContainText("USD 590.00");
  await page.getByLabel("Additional round-trip costs (USD)", { exact: true }).fill("400"); await expect(page.locator("[data-result]")).toHaveText("No positive net target");
  await page.getByLabel("Stop-loss price", { exact: true }).fill("1.101"); await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.locator("#calculation-result")).toContainText("stop must be below");
});
test("risk/reward layout fits mobile and shared scenarios restore costs", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator,"clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied=text; } } }); });
  await page.goto(path); await page.getByLabel("Additional round-trip costs (USD)", { exact: true }).fill("10"); await page.getByRole("button", { name:"Copy scenario link",exact:true }).click();
  await page.goto(await page.evaluate(() => (window as Window & { copied?: string }).copied!)); await expect(page.locator("[data-result]")).toHaveText("1 : 1.8571");
  for (const width of [320,390,1440]) { await page.setViewportSize({ width,height:1000 }); await page.goto(path); expect(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth)).toBe(true); await page.locator("[data-trade-workbench]").scrollIntoViewIfNeeded(); await page.screenshot({ path:`test-results/risk-reward-${width}.png` }); }
});
