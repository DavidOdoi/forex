import { test, expect } from "@playwright/test";

test("Fusion review provides scoped facts, sources and five working signup links without JavaScript", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:3100/reviews/fusion-markets");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Fusion Markets Review 2026/);
    await expect(page.locator(".br-verdict-box")).toContainText("US$2.25");
    await expect(page.locator(".br-quick-grid > div")).toHaveCount(9);
    await expect(page.locator(".br-quick-grid")).not.toContainText("Not verified");
    await expect(page.locator(".br-account-table tbody tr")).toHaveCount(2);
    await expect(page.locator("#fees")).toContainText("EUR2.25/side");
    await expect(page.locator("#fees")).toContainText("not measured averages");
    await expect(page.locator("#safety")).toContainText("Indonesia");
    await expect(page.locator("#safety")).toContainText("385620");
    await expect(page.locator("#deposit-and-withdrawal")).toContainText("3–5");
    await expect(page.locator("#deposit-and-withdrawal")).toContainText("own-name");
    await expect(page.locator("#review-faq details")).toHaveCount(3);
    const signup = page.getByRole("link", { name: "Open an account with Fusion Markets", exact: true });
    await expect(signup).toHaveCount(5);
    for (const link of await signup.all()) {
      await expect(link).toHaveAttribute("href", "https://hub.fusionmarkets.com/auth/sign-up");
      await expect(link).not.toHaveAttribute("rel", /sponsored/);
    }
    await expect(page.locator(".br-opening-image img")).toHaveAttribute("alt", /Fusion Markets review/);
    await expect(page.locator(".br-opening-image figcaption")).toContainText("not our live-account test");
    await expect(page.locator(".br-accountability")).toContainText("13 Nov 2026");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.devinforex.com/reviews/fusion-markets");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
    expect(schema["@graph"].find((item: { "@type": string }) => item["@type"] === "FAQPage").mainEntity).toHaveLength(3);
    expect(JSON.stringify(schema)).not.toMatch(/ratingValue|AggregateRating/);
    const mainText = (await page.locator("main").innerHTML()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").trim();
    expect(mainText.split(/\s+/).length).toBeLessThanOrEqual(1800);
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/reviews/fusion-markets");
    expect((await request.get("/reviews/aafx-trading")).status()).toBe(410);
  } finally { await context.close(); }
});

test("Fusion review stays readable on phones and its illustrative trading-cost tool calculates both commission sides", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/reviews/fusion-markets");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await expect(page.locator("[data-roundtrip-result]")).toContainText("US$5.5");
  await page.getByLabel("Standard lots", { exact: true }).fill("2");
  await expect(page.locator("[data-roundtrip-result]")).toContainText("US$11");
  await page.getByLabel("Spread (pips)", { exact: true }).fill("0");
  await expect(page.locator("[data-roundtrip-result]")).toContainText("US$9");
  await expect(page.locator(".br-related").getByRole("link", { name: "FP Markets", exact: true })).toHaveAttribute("href", "/reviews/fp-markets");
  expect(errors).toEqual([]);
});
