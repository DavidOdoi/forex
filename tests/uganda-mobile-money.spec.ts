import { test, expect } from "@playwright/test";
import { getInsight, articleWordCount } from "../src/lib/insights/catalog";
import { siteOrigin } from "../src/lib/site";

const path = "/insights/best-forex-brokers-accepting-mobile-money-in-uganda";
const signups = [
  ["Deriv", "https://home.deriv.com/dashboard/signup"],
  ["Exness", "https://my.exness.com/accounts/sign-up?lng=en"],
  ["HFM", "https://register.hfm.com/int/en/new-live-account"],
  ["FXCM Markets", "https://www.fxcm.com/markets/open-account/"],
] as const;

test("mobile-money comparison gives qualified answers and working official signup targets without JavaScript", async ({ browser, request }) => {
  const article = getInsight(path.split("/").at(-1)!)!;
  expect(articleWordCount(article)).toBeLessThanOrEqual(1800);
  expect(article.faqs).toHaveLength(3);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto(`http://127.0.0.1:3100${path}`);
    await expect(page.locator("h1")).toHaveText(article.title);
    await expect(page.locator('[data-quick-answer]')).toContainText("FXCM explicitly confirms MTN deposits in Uganda");
    await expect(page.locator('[data-quick-answer]')).toContainText("excludes mobile-money withdrawals");
    await expect(page.locator('.insight-broker-shortlist a')).toHaveCount(4);
    await expect(page.locator('[data-broker-signup]')).toHaveCount(4);
    for (const [name, href] of signups) {
      const buttons = page.getByRole("link", { name: `Open ${name} account`, exact: false });
      await expect(buttons).toHaveCount(2);
      for (const button of await buttons.all()) {
        await expect(button).toHaveAttribute("href", href);
        await expect(button).toHaveAttribute("target", "_blank");
        await expect(button).toHaveAttribute("rel", "nofollow noopener noreferrer");
      }
    }
    await expect(page.locator('[data-broker-signup="FXCM Markets"]')).toContainText("No mobile-money withdrawals");
    await expect(page.locator(".insight-content")).toContainText("currently contain no affiliate tracking");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + path);
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
    expect(schema.find((v: { "@type": string }) => v["@type"] === "FAQPage").mainEntity).toHaveLength(3);
    expect(await (await request.get("/sitemap.xml")).text()).toContain(siteOrigin + path);
    const countryGuide = await request.get("/forex-brokers/uganda");
    expect(countryGuide.status()).toBe(200);
    expect(await countryGuide.text()).toContain(path);
  } finally { await context.close(); }
});

test("signup buttons and mobile-money images fit desktop and mobile", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('.insight-content .insight-account-button')).toHaveCount(8);
    for (const button of await page.locator('[data-broker-signup] .insight-account-button').all()) {
      const box = (await button.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await expect(button).toHaveCSS("background-color", "rgb(17, 17, 17)");
    }
    await page.locator('figure[data-image-role="featured"]').scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('figure[data-image-role="featured"] img').evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
    await page.screenshot({ path: `test-results/uganda-mobile-money-${width}.png` });
    await page.locator('[data-broker-signup="FXCM Markets"]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/uganda-mobile-money-cta-${width}.png` });
  }
});
