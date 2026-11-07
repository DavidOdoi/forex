import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getInsight, articleWordCount, forexCountryGuides, relatedInsights, type InsightArticle } from "../src/lib/insights/catalog";
import { siteOrigin } from "../src/lib/site";

const manifest = JSON.parse(readFileSync(join(process.cwd(), "docs/content/country-guides-status.json"), "utf8")) as {
  countries: { country: string; slug: string; status: string; sourceIds: string[]; missingEvidence: string[]; publishable: boolean; offshoreFundingPermission: string }[];
};
const sourceLedger = JSON.parse(readFileSync(join(process.cwd(), "docs/content/country-guide-source-checks-2026-11-07.json"), "utf8")) as {
  sources: { id: string }[];
};
test("all nine guides have complete copy and preserve the limits of the country research", () => {
  expect(manifest.countries.map(c => c.country)).toEqual(["Kenya", "Nigeria", "Uganda", "Ghana", "Zambia", "Zimbabwe", "Botswana", "Australia", "India"]);
  for (const country of manifest.countries) {
    for (const id of country.sourceIds) expect(sourceLedger.sources.some(source => source.id === id), `${country.country}: ${id}`).toBe(true);
    const draft = JSON.parse(readFileSync(join(process.cwd(), `content-drafts/country-guides/${country.slug}.json`), "utf8")) as { article: InsightArticle };
    expect(articleWordCount(draft.article), country.country).toBeLessThanOrEqual(1800);
    expect(draft.article.blocks[0].type).toBe("paragraph");
    const answer = draft.article.blocks[1];
    expect(answer.type).toBe("quick-answer");
    if (answer.type === "quick-answer") { expect(answer.ordered).toBe(true); expect(answer.points).toHaveLength(7); expect(answer.table?.rows.length).toBeGreaterThanOrEqual(2); }
    expect(draft.article.faqs).toHaveLength(3);
    expect(draft.article.authorBio).toBe(getInsight("how-to-start-forex-trading-in-south-africa")!.authorBio);
    expect(country.publishable).toBe(true); expect(getInsight(country.slug)).toBeDefined();
    if (country.status === "source-cleared") { expect(country.missingEvidence).toEqual([]); expect(country.sourceIds.length).toBeGreaterThanOrEqual(3); }
    else {
      const scope = draft.article.blocks[2]; expect(scope.type).toBe("callout");
      if (scope.type === "callout") expect(scope.title).toBe(country.country === "India" ? "Overseas margin is not LRS-eligible" : "Offshore funding permission is not verified");
      expect(country.offshoreFundingPermission).toBe(country.country === "India" ? "LRS-overseas-margin-prohibited" : "not-established");
    }
  }
  expect(forexCountryGuides.map(a => a.slug)).toEqual(expect.arrayContaining(["how-to-start-forex-trading-in-south-africa", "how-to-start-forex-trading-in-kenya", "how-to-start-forex-trading-in-australia"]));
  for (const guide of forexCountryGuides) {
    const related = relatedInsights(guide);
    expect(related).toHaveLength(3);
    expect(new Set(related.map(article => article.slug)).size).toBe(3);
    for (const article of related) {
      expect(article.slug).not.toBe(guide.slug);
      expect(forexCountryGuides).toContain(article);
    }
  }
});
test("all country guides reuse the seven-step template, canonical routes, disclosures and live navigation", async ({ page, request }) => {
  for (const country of manifest.countries) {
    const alias = await request.get(`/${country.slug}`, { maxRedirects: 0 });
    expect(alias.status()).toBe(308); expect(alias.headers().location).toBe(`/insights/${country.slug}`);
    await page.goto(`/insights/${country.slug}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${siteOrigin}/insights/${country.slug}`);
    await expect(page.locator("[data-quick-answer] ol > li")).toHaveCount(7);
    await expect(page.locator(".insight-content")).not.toContainText(/publication held|this draft|guaranteed profit|\[VERIFY/i);
    await expect(page.locator(".insight-disclaimer")).toContainText("No affiliate links are used");
    if (country.status === "education-only") await expect(page.locator(".insight-content")).toContainText("Offshore funding permission is not verified");
    if (country.country === "India") {
      await expect(page.locator(".insight-content")).toContainText("Overseas margin is not LRS-eligible");
      await expect(page.locator('.insight-content a[href="/reviews"]')).toHaveCount(0);
    }
    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!)["@graph"];
    expect(schema.find((item: { "@type": string }) => item["@type"] === "FAQPage").mainEntity).toHaveLength(3);
  }
  await page.goto("/insights");
  const nav = page.getByRole("navigation", { name: "Forex guides by country" });
  await expect(nav.getByRole("link", { name: "Kenya", exact: true })).toHaveAttribute("href", "/insights/how-to-start-forex-trading-in-kenya");
  await expect(nav.getByRole("link", { name: "Australia", exact: true })).toHaveAttribute("href", "/insights/how-to-start-forex-trading-in-australia");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const country of manifest.countries) {
    expect(sitemap).toContain(`/insights/${country.slug}`);
    await expect(nav.getByRole("link", { name: country.country, exact: true })).toHaveAttribute("href", `/insights/${country.slug}`);
  }
});
