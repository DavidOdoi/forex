import { test, expect } from "@playwright/test";
import { countryRegistry, sriLankaGuide } from "../src/lib/country-guides/catalog";
import { checkedSource, claimVerified } from "../src/lib/country-guides/evidence";
import { guideApproved } from "../src/lib/country-guides/publication";

test("read Sri Lankan documents establish their provisions without inventing resident CFD permission or legal approval", () => {
  for (const id of ["gazette-2493-36", "gazette-2493-38"]) {
    const source = countryRegistry.sources.find(source => source.id === id)!;
    expect(checkedSource(source, "2026-11-23")).toBe(true);
    expect(source.publishedAt).toBe("2026-06-18");
  }
  const section = sriLankaGuide.sections.find(section => section.id === "investment-rules-2026")!;
  for (const claim of section.paragraphs) expect(claimVerified(claim, "sri-lanka", null, countryRegistry, "2026-11-23")).toBe(true);
  expect(section.paragraphs[1].value).toContain("six-month validity");
  expect(guideApproved(sriLankaGuide, countryRegistry, "2026-11-23")).toBe(false);
  expect(sriLankaGuide.legalReviewedAt).toBeNull();
  expect(sriLankaGuide.commercialLinksAllowed).toBe(false);
});

test("homepage keeps legality and market-price limits and discloses active affiliate links", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#faq")).toContainText("Rules depend on your country of residence");
  await expect(page.locator("#faq")).toContainText("Some broker links are affiliate links");
  await expect(page.locator("main")).not.toContainText("68,210.00");
  await expect(page.locator("main")).not.toContainText("2,384.10");
  await expect(page.locator('main a[href="/gold-price"]').first()).toBeVisible();
  await expect(page.locator('main a[href="/forex-brokers"]')).toBeVisible();
});

test("the broker checklist returns relevant reading steps rather than an unverified ranked winner", async ({ page }) => {
  await page.goto("/find-my-broker");
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your research checklist", exact: true })).toBeVisible();
  await expect(page.locator('main a[href="/insights#beginner-guides"]')).toBeVisible();
  await expect(page.locator('main a[href="/insights/best-platforms-for-day-trading"]')).toBeVisible();
  await expect(page.locator("main article")).toHaveCount(4);
});
