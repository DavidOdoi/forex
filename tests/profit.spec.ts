import { test, expect } from "@playwright/test";
import { profitDefinition } from "../src/lib/calculators/profit-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
import { siteOrigin } from "../src/lib/site";
const path = "/calculators/forex-profit-calculator";
test("profit supporting copy and schema render without JS, with one canonical migration", async ({ browser, request }) => {
  expect(calculatorArticleWords(profitDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(profitDefinition)).toBeLessThanOrEqual(1800);
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    await page.goto(`http://127.0.0.1:3100${path}`); await expect(page.locator("h1")).toHaveText("Forex Profit Calculator");
    await expect(page.locator("[data-result]")).toHaveText("USD 100.00"); await expect(page.locator("#calculator-faq details")).toHaveCount(3);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + path);
    const old = await request.get("/tools/forex-profit-calculator", { maxRedirects: 0 }); expect(old.status()).toBe(308); expect(old.headers().location).toBe(path);
    expect(await (await request.get("/sitemap.xml")).text()).toContain(siteOrigin + path);
  } finally { await context.close(); }
});
test("net P&L updates direction, costs, equity, mid-spread and per-lot fees", async ({ page }) => {
  await page.goto(path); await page.getByLabel("Commission (USD)", { exact: true }).fill("7");
  await page.getByLabel("Reference account equity (USD) · optional", { exact: true }).fill("10000");
  await expect(page.locator("[data-result]")).toHaveText("USD 93.00"); await expect(page.locator("#calculation-result")).toContainText("0.93%");
  await page.getByLabel("Trade direction", { exact: true }).selectOption("sell"); await expect(page.locator("[data-result]")).toHaveText("USD -107.00");
  await expect(page.locator("#calculation-result h3")).toContainText("net loss");
  await page.getByLabel("Trade direction", { exact: true }).selectOption("buy");
  await page.getByLabel("Entry and exit price convention", { exact: true }).selectOption("mid");
  await page.getByLabel("Total extra spread allowance (pips)", { exact: true }).fill("2"); await expect(page.locator("[data-result]")).toHaveText("USD 89.00");
  await page.getByLabel("Entry and exit price convention", { exact: true }).selectOption("fills"); await expect(page.locator("[data-result]")).toHaveText("USD 93.00");
  await page.getByLabel("Commission charging basis", { exact: true }).selectOption("lot-side"); await page.getByLabel("Commission (USD)", { exact: true }).fill("3.5");
  await expect(page.locator("[data-result]")).toHaveText("USD 98.60");
});
test("JPY conversion, optional exits and input errors are explicit", async ({ page }) => {
  await page.goto(path); await page.getByLabel("Currency pair", { exact: true }).selectOption("USD/JPY");
  await expect(page.getByLabel("Entry price", { exact: true })).toHaveValue("");
  await page.getByLabel("Entry price", { exact: true }).fill("160"); await page.getByLabel("Exit price", { exact: true }).fill("159.5");
  await page.getByLabel("Trade direction", { exact: true }).selectOption("sell"); await page.getByLabel("Trade size (lots)", { exact: true }).fill("1");
  await page.getByLabel("USD/JPY conversion rate", { exact: true }).fill("159.5"); await expect(page.locator("[data-result]")).toHaveText("USD 313.48");
  await page.getByText("Optional stop and target exit scenarios", { exact: true }).click();
  await page.getByLabel("Stop-scenario exit price · optional", { exact: true }).fill("161");
  await expect(page.locator("#calculation-result")).toContainText("Stop-price scenario");
  await page.getByLabel("Commission (USD)", { exact: true }).fill("-1"); await expect(page.locator("[data-result]")).toHaveCount(0);
});
test("profit scenario links restore input state and connect entered volume to margin", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copiedScenario?: string }).copiedScenario = text; } } }); });
  await page.goto(path); await page.getByLabel("Commission (USD)", { exact: true }).fill("7");
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click();
  await page.goto(await page.evaluate(() => (window as Window & { copiedScenario?: string }).copiedScenario!));
  await expect(page.locator("[data-result]")).toHaveText("USD 93.00");
  await page.getByRole("link", { name: "Check margin for this position", exact: false }).click(); await expect(page.locator("[data-result]")).toHaveText("USD 440.00");
});
test("profit workspace fits phone and desktop", async ({ page }) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 }); await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator("[data-trade-workbench]").scrollIntoViewIfNeeded(); await page.screenshot({ path: `test-results/profit-calculator-${width}.png` });
  }
});
