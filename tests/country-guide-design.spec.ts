import { test, expect } from "@playwright/test";

const path = "/forex-brokers/sri-lanka";
test("section navigation stays beneath the header, updates its location and lands on visible headings", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto(path);
  const nav = page.getByRole("navigation", { name: "Guide sections", exact: true });
  await expect(nav.getByRole("link", { name: "Which brokers are in the research?", exact: true })).toHaveAttribute("aria-current", "location");
  await nav.getByRole("link", { name: "What do the investment rules say?", exact: true }).click();
  await expect(page).toHaveURL(/#investment-rules-2026$/);
  await expect(nav.getByRole("link", { name: "What do the investment rules say?", exact: true })).toHaveAttribute("aria-current", "location");
  const header = await page.locator("body>header").boundingBox(); const rail = await nav.boundingBox(); const heading = await page.locator("#investment-rules-2026 h2").boundingBox();
  expect(Math.abs(rail!.y - (header!.y + header!.height))).toBeLessThan(3);
  expect(heading!.y).toBeGreaterThanOrEqual(rail!.y + rail!.height);
  const sources = nav.getByRole("link", { name: "Sources & corrections", exact: true }); await sources.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#country-sources$/); await expect(sources).toHaveAttribute("aria-current", "location");
  await page.locator(".cg-broker-toplist a").nth(3).click(); await expect(page).toHaveURL(/#research-pepperstone$/);
  await expect(page.locator("#research-pepperstone")).toContainText("Resident eligibility");
  const shortlist = page.getByRole("region", { name: "Brokers in this research" });
  const brokerTab = shortlist.getByRole("tab", { name: "Brokers", exact: true });
  await brokerTab.focus(); await page.keyboard.press("ArrowRight");
  await expect(shortlist.getByRole("tab", { name: "Key checks", exact: true })).toHaveAttribute("aria-selected", "true");
  await shortlist.getByRole("link", { name: "Are trading and funding lawful for this resident?" }).click();
  await expect(page).toHaveURL(/#country-check-4$/);
  await expect(page.locator("#country-check-4")).toContainText("trading and funding lawful");
  await shortlist.getByRole("tab", { name: "Brokers", exact: true }).click();
  const article = await page.locator(".cg-article").boundingBox(); const sidebar = await page.locator(".cg-sidebar").boundingBox();
  expect(sidebar!.x).toBeGreaterThanOrEqual(article!.x + article!.width);
  await page.evaluate(() => scrollTo(0, 0)); await expect(nav.getByRole("link", { name: "Which brokers are in the research?", exact: true })).toHaveAttribute("aria-current", "location"); await nav.locator(".cg-section-links").evaluate(node => node.scrollTo(0, 0)); await expect.poll(() => nav.locator(".cg-section-links").evaluate(node => node.scrollLeft)).toBe(0); await page.screenshot({ path: "test-results/country-guide-reference-desktop.png" });
  await page.locator(".cg-overview").screenshot({ path: "test-results/country-guide-reference-brokers.png", style: "body>header,.cg-section-nav{visibility:hidden}" });
  expect(errors).toEqual([]);
});

test("phone section controls scroll, support keyboard selection and preserve the legal-first overview", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.setViewportSize({ width: 390, height: 1000 }); await page.goto(path);
  const nav = page.getByRole("navigation", { name: "Guide sections", exact: true }); const links = nav.locator(".cg-section-links");
  const right = nav.getByRole("button", { name: "Scroll section links right" }); await expect(right).toBeEnabled();
  await right.focus(); await page.keyboard.press("Enter"); await expect.poll(() => links.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  const left = nav.getByRole("button", { name: "Scroll section links left" }); await expect(left).toBeEnabled(); await left.click();
  await expect.poll(() => links.evaluate(node => node.scrollLeft)).toBe(0);
  const faqs = nav.getByRole("link", { name: "Frequently asked questions", exact: true }); await faqs.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#country-faq$/); await expect(faqs).toHaveAttribute("aria-current", "location");
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  await expect(page.locator(".cg-list-note")).toContainText("No brokers are recommended");
  await expect(page.locator(".cg-broker-toplist li")).toHaveCount(4);
  await expect(page.locator(".cg-candidate-detail")).toHaveCount(4);
  await expect(page.locator(".cg-overview")).toContainText("not ranked recommendations");
  await expect(page.locator(".cg-broker-toplist")).not.toContainText(/FX score|tested with real money|best overall/);
  expect(await page.locator(".cg-article").evaluate(node => getComputedStyle(node).fontFamily)).toContain("Manrope");
  await expect(page.locator('main a[rel~="sponsored"]')).toHaveCount(0);
  await expect(page.locator("h1")).not.toContainText("Japan");
  await expect(page.locator(".cg-byline")).toContainText("Reported research date");
  await expect(page.locator(".cg-byline")).toContainText("Legal review: not yet recorded");
  await page.evaluate(() => scrollTo(0, 0)); await expect(nav.getByRole("link", { name: "Which brokers are in the research?", exact: true })).toHaveAttribute("aria-current", "location"); await nav.locator(".cg-section-links").evaluate(node => node.scrollTo(0, 0)); await expect.poll(() => nav.locator(".cg-section-links").evaluate(node => node.scrollLeft)).toBe(0); await page.screenshot({ path: "test-results/country-guide-reference-mobile.png" });
});


test("reference template broker identities work without JavaScript and do not expose the private dossier", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage(); await page.goto(path);
    const directory = page.locator(".cg-broker-toplist");
    await expect(directory).toContainText("Exness"); await expect(directory).toContainText("XM");
    await expect(directory).toContainText("IC Markets"); await expect(directory).toContainText("Pepperstone");
    await directory.getByRole("link").first().click(); await expect(page).toHaveURL(/#research-exness$/);
    await expect(page.locator("#research-exness")).toContainText("Not established");
    await expect(page.locator('main a[rel~="sponsored"]')).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText("USD 100,000");
  } finally { await context.close(); }
});
