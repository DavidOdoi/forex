import { test, expect } from "@playwright/test";
import { drawdownDefinition } from "../src/lib/calculators/drawdown-content";
import { calculatorArticleWords } from "../src/lib/calculators/editorial";
const path = "/calculators/forex-drawdown-calculator";
test("drawdown distinguishes current and maximum declines, zero recovery and invalid date order", async ({ page }) => {
  await page.goto(path); await expect(page.locator("[data-result]")).toHaveText("25%"); await expect(page.locator("#calculation-result")).toContainText("Current drawdown");
  await page.getByLabel("Drawdown analysis", { exact: true }).selectOption("snapshot"); await expect(page.locator("[data-result]")).toHaveText("20%"); await expect(page.locator("#calculation-result")).toContainText("25%");
  await page.getByLabel("Current account value", { exact: true }).fill("0"); await expect(page.locator("[data-result]")).toHaveText("100%"); await expect(page.locator("#calculation-result")).toContainText("No conventional finite percentage");
  await page.getByLabel("Drawdown analysis", { exact: true }).selectOption("history"); await page.getByLabel("Ordered history · value or date,value,flow", { exact: true }).fill("2026-01-02,10000\n2026-01-01,8000"); await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.locator("#calculation-result")).toContainText("strictly increasing");
});
test("withdrawals require an explicit method and adjusted indices do not claim raw losses", async ({ page }) => {
  await page.goto(path); await page.getByLabel("Ordered history · value or date,value,flow", { exact: true }).fill("date,equity,flow\n2026-01-01,10000,0\n2026-01-02,6000,-4000"); await expect(page.locator("[data-result]")).toHaveCount(0);
  await page.getByLabel("External cash-flow method", { exact: true }).selectOption("end-flow"); await expect(page.locator("[data-result]")).toHaveText("0%"); await expect(page.locator("#calculation-result")).toContainText("40%"); await expect(page.locator("#calculation-result")).toContainText("index points"); await expect(page.getByRole("img", { name: "Performance index and running peak", exact: true })).toBeVisible();
});
test("local CSV retains only relevant columns, picks balance labels and resets its file control", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } }); });
  await page.goto(path); await page.getByLabel("Read account-value CSV locally (optional)", { exact: true }).setInputFiles({ name: "account.csv", mimeType: "text/csv", buffer: Buffer.from("date,balance,flow,account\n2026-01-01,20000,0,PRIVATE-ACCOUNT\n2026-01-02,14000,0,PRIVATE-ACCOUNT") });
  await expect(page.locator("[data-result]")).toHaveText("30%"); await expect(page.getByLabel("Account-value definition", { exact: true })).toHaveValue("balance"); await expect(page.getByLabel("Ordered history · value or date,value,flow", { exact: true })).not.toHaveValue(/PRIVATE/);
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click(); const shared = await page.evaluate(() => (window as Window & { copied?: string }).copied!); expect(new URL(shared).searchParams.has("history")).toBe(false); expect(shared).not.toContain("14000"); await page.goto(shared); await expect(page.locator("[data-result]")).toHaveCount(0); await expect(page.locator("#calculation-result")).toContainText("without private financial data");
  await page.getByRole("button", { name: "Reset", exact: true }).click(); await expect(page.locator("[data-result]")).toHaveText("25%"); expect(await page.locator("#cost-csvFile").evaluate(node => (node as HTMLInputElement).files?.length)).toBe(0);
});
test("drawdown curve fits mobile and supporting content renders without JavaScript", async ({ page, browser, request }) => {
  await page.goto(path); for (const width of [320, 390, 1440]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); }
  expect(calculatorArticleWords(drawdownDefinition)).toBeGreaterThanOrEqual(1600); expect(calculatorArticleWords(drawdownDefinition)).toBeLessThanOrEqual(1800);
  const context = await browser.newContext({ javaScriptEnabled: false }); const staticPage = await context.newPage(); try { await staticPage.goto("http://127.0.0.1:3100" + path); await expect(staticPage.locator("h1")).toHaveCount(1); await expect(staticPage.locator("[data-result]")).toHaveText("25%"); await expect(staticPage.locator("#calculator-faq details")).toHaveCount(3); await expect(staticPage.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com" + path); expect(await (await request.get("/sitemap.xml")).text()).toContain(path); } finally { await context.close(); }
});
test("large local histories are analyzed but omitted from settings links", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } }); });
  await page.goto(path);
  await page.getByLabel("Ordered history · value or date,value,flow", { exact: true }).fill(Array.from({ length: 1000 }, () => "10000.123456789012345").join("\n"));
  await expect(page.locator("[data-result]")).toHaveText("0%"); await expect(page.locator("#calculation-result")).toContainText("1000 observations");
  await page.getByRole("button", { name: "Copy scenario link", exact: true }).click(); const shared = await page.evaluate(() => (window as Window & { copied?: string }).copied!); expect(new URL(shared).searchParams.has("history")).toBe(false); expect(shared.length).toBeLessThan(2000); await expect(page.locator("#calculation-result")).toContainText("Private financial data was not included");
});
