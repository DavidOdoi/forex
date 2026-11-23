import { test, expect } from "@playwright/test";
import { countryGuides } from "../src/lib/country-guides/catalog";
import { countryFeaturedImage } from "../src/lib/country-guides/media";
import { siteOrigin } from "../src/lib/site";

test("every country guide renders its own credited photograph without JavaScript and stays within the word limit", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const sources = new Set<string>();
  try {
    for (const country of countryGuides) {
      const image = countryFeaturedImage(country);
      expect(image, country.slug).not.toBeNull();
      if (!image) continue;
      expect(sources.has(image.src), country.slug).toBe(false);
      sources.add(image.src);
      expect((await request.get(image.src)).status(), image.src).toBe(200);
      await page.goto(`/forex-brokers/${country.slug}`);
      await expect(page.locator(".cg-featured-image img")).toHaveAttribute("alt", image.alt);
      await expect(page.locator(".cg-featured-image img")).toHaveAttribute("width", String(image.width));
      await expect(page.locator(".cg-featured-image img")).toHaveAttribute("height", String(image.height));
      await expect(page.locator(".cg-featured-image figcaption")).toContainText(image.creator);
      await expect(page.locator(".cg-featured-image figcaption a").first()).toHaveAttribute("href", image.sourceUrl);
      await expect(page.locator("meta[property='og:image']")).toHaveAttribute("content", siteOrigin + image.src);
      await expect(page.locator(".cg-faq details")).toHaveCount(3);
      const text = await page.locator("main").textContent();
      expect(text!.trim().split(/\s+/u).length, country.slug).toBeLessThanOrEqual(1700);
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${country.slug}: ${width}`).toBe(true);
      }
    }
  } finally {
    await context.close();
  }
});

test("country photographs load responsively in both article layouts", async ({ page }) => {
  for (const slug of ["malaysia", "netherlands", "united-arab-emirates"]) {
    await page.goto(`/forex-brokers/${slug}`);
    const image = page.locator(".cg-featured-image img");
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0)).toBe(true);
      await page.locator(".cg-featured-image").screenshot({ path: `test-results/country-photo-${slug}-${width}.png`, style: "body>header,.cg-section-nav{visibility:hidden}" });
    }
  }
  expect(await page.locator(".cg-featured-image img").evaluate(node => getComputedStyle(node).objectFit)).toBe("contain");
});
