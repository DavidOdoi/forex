import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AccountOpeningCta } from "../src/components/review-template/account-cta";
import { test, expect } from "@playwright/test";
import {
  createReviewTemplate,
  fieldValue,
  scoreValue,
  accountOpeningHref,
} from "../src/lib/reviews/template";

test("review template is linked, clearly labelled and excluded from indexing", async ({
  page,
  request,
}) => {
  await page.goto("/reviews");
  await page.getByRole("link", { name: "Preview review template" }).click();
  await expect(page).toHaveURL(/\/reviews\/template\?blank=1$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Example Broker review",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.getByRole("main")).toContainText("Layout preview");
  await expect(page.getByRole("main")).toContainText("No sources added yet");
  await expect(
    page.getByRole("button", {
      name: "Open an account with Example Broker",
      exact: true,
    }),
  ).toHaveCount(5);
  for (const button of await page
    .getByRole("button", {
      name: "Open an account with Example Broker",
      exact: true,
    })
    .all())
    await expect(button).toBeDisabled();
  expect(await page.locator('script[type="application/ld+json"]').count()).toBe(
    0,
  );
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).not.toContain("/reviews/template");
  for (const id of [
    "key-data",
    "fees",
    "safety",
    "deposit-and-withdrawal",
    "account-opening",
    "mobile-app",
    "web-platform",
    "product-selection",
    "review-faq",
    "sources",
    "methodology",
  ]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test("data tabs, market selector and advertiser disclosure work with the keyboard", async ({
  page,
}) => {
  await page.goto("/reviews/template?blank=1");
  const tabs = page.getByRole("tablist", { name: "Broker data" });
  await tabs.getByRole("tab", { name: "Key data", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Benchmark fees" })).toBeFocused();
  await expect(
    tabs.getByRole("tab", { name: "Benchmark fees" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("EUR/USD spread");
  await page.keyboard.press("Home");
  await expect(page.getByRole("tabpanel")).toContainText("Minimum deposit");
  await page.getByLabel("Review market").selectOption("Germany");
  await expect(
    page.locator(".review-country").getByRole("status"),
  ).toContainText(
    "Germany: eligibility, legal entity and protections still need verification",
  );
  const disclosure = page.getByRole("button", {
    name: "Advertiser disclosure",
    exact: true,
  });
  await disclosure.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "No affiliate link or paid placement is active",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(disclosure).toBeFocused();
});

test("navigation, collapsible chapters, comparisons and FAQs are functional", async ({
  page,
}) => {
  await page.goto("/reviews/template?blank=1");
  const fees = page.locator("#fees .review-chapter");
  await fees.locator(":scope > summary").click();
  await expect(fees).not.toHaveAttribute("open", "");
  await expect(fees.locator(".review-chapter-content")).not.toBeVisible();
  await fees.locator(":scope > summary").focus();
  await page.keyboard.press("Enter");
  await expect(fees).toHaveAttribute("open", "");
  await page
    .getByRole("navigation", { name: "Review sections" })
    .getByRole("link", { name: "Safety", exact: true })
    .click();
  await expect(page).toHaveURL(/#safety$/);
  await expect(page.locator("#safety")).toBeInViewport();
  await page.getByLabel("Compare by").selectOption("Withdrawal fee");
  await expect(
    page.locator(".review-comparison").getByRole("status"),
  ).toContainText("Withdrawal fee: no verified comparison yet");
  const faq = page.locator("#review-faq details").first();
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
  await expect(faq.locator("p")).toContainText(
    "Answer awaiting verified research",
  );
});

test("review template fits desktop, tablet and mobile layouts", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/reviews/template?blank=1");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `${width}px overflow`,
    ).toBe(true);
    await expect(page.locator("[data-account-cta]")).toHaveCount(5);
    for (const cta of await page.locator("[data-account-cta]").all())
      await expect(cta).toBeVisible();
    expect(
      await page
        .locator("[data-account-cta]")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute("data-account-cta")),
        ),
    ).toEqual([
      "hero",
      "overview",
      "after-safety",
      "after-account-opening",
      "verdict",
    ]);
    const sidebar = page.getByRole("complementary", {
      name: "Broker research summary",
    });
    if (width >= 1024) await expect(sidebar).toBeVisible();
    else await expect(sidebar).not.toBeVisible();
    if (width === 390 || width === 1440) {
      await page.screenshot({
        path: `test-results/review-template-${width}.png`,
        fullPage: true,
      });
      await page.screenshot({
        path: `test-results/review-template-${width}-top.png`,
      });
    }
  }
});

test("JSON download is a blank, complete and reusable broker record", async ({
  request,
}) => {
  const response = await request.get("/reviews/template/data");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-disposition"]).toContain(
    "broker-review-template.json",
  );
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  const record = await response.json();
  expect(record.status).toBe("template");
  expect(record.chapters).toHaveLength(7);
  expect(record.overallScore).toBeNull();
  expect(record.accountOpening.url).toBeNull();
  expect(record.accountOpening.status).toBe("not-configured");
  expect(record.author).toBeNull();
  expect(record.factChecker).toBeNull();
  expect(record.sources).toEqual([]);
  for (const chapter of record.chapters)
    for (const panel of chapter.panels)
      for (const field of panel.fields) {
        expect(field.value).toBeNull();
        expect(field.sourceIds).toEqual([]);
        expect(field.status).toBe("not-researched");
      }
  const second = createReviewTemplate("Second Broker", "second-broker");
  second.chapters[0].panels[0].fields[0].sourceIds.push("second-source");
  expect(
    createReviewTemplate().chapters[0].panels[0].fields[0].sourceIds,
  ).toEqual([]);
});

test("unsupported values and scores are withheld until supporting evidence is present", () => {
  const review = createReviewTemplate();
  const field = review.keyData[0];
  field.value = "$123";
  field.status = "verified";
  expect(fieldValue(field, review)).toBe("Needs verification");
  const score = {
    value: 4.9,
    outOf: 5 as const,
    methodologyUrl: "https://devinforex.example/methodology",
    sourceIds: ["source"],
  };
  expect(scoreValue(score, review)).toBeNull();
  review.sources.push({
    id: "source",
    title: "Official terms",
    url: "https://broker.example/terms",
    publisher: "Broker legal entity",
    checkedAt: "2026-11-03",
    legalEntity: "Broker legal entity",
    jurisdiction: "Kenya",
  });
  Object.assign(field, {
    sourceIds: ["source"],
    legalEntity: "Broker legal entity",
    jurisdiction: "Kenya",
    checkedAt: "2026-11-03",
  });
  expect(fieldValue(field, review)).toBe("$123");
  field.jurisdiction = "United Kingdom";
  expect(fieldValue(field, review)).toBe("Needs verification");
  expect(scoreValue(score, review)).toBe("4.9/5");
  score.value = 6;
  expect(scoreValue(score, review)).toBeNull();
  review.sources[0].url = "javascript:alert(1)";
  expect(fieldValue(field, review)).toBe("Needs verification");
});

test("account-opening links require a published review and matching verified destination records", () => {
  const review = createReviewTemplate();
  expect(accountOpeningHref(review)).toBeNull();
  review.accountOpening.url = "https://broker.example/open?partner=devin";
  review.accountOpening.status = "verified";
  review.accountOpening.sourceIds = ["account-terms"];
  review.accountOpening.legalEntity = "Broker legal entity";
  review.accountOpening.jurisdiction = "Kenya";
  review.accountOpening.checkedAt = "2026-11-03";
  review.sources.push({
    id: "account-terms",
    title: "Official account terms",
    url: "https://broker.example/terms",
    publisher: "Broker legal entity",
    checkedAt: "2026-11-03",
    legalEntity: "Broker legal entity",
    jurisdiction: "Kenya",
  });
  expect(accountOpeningHref(review)).toBeNull();
  review.status = "published";
  expect(accountOpeningHref(review)).toBeNull();
  review.jurisdiction = "Kenya";
  expect(accountOpeningHref(review)).toBe(
    "https://broker.example/open?partner=devin",
  );
  review.accountOpening.url = "javascript:alert(1)";
  expect(accountOpeningHref(review)).toBeNull();
  review.accountOpening.url = "https://user:password@broker.example/open";
  expect(accountOpeningHref(review)).toBeNull();
  review.accountOpening.url = "https://broker.example/open";
  review.accountOpening.jurisdiction = "United Kingdom";
  expect(accountOpeningHref(review)).toBeNull();
  review.accountOpening.jurisdiction = "Kenya";
  review.accountOpening.status = "needs-verification";
  expect(accountOpeningHref(review)).toBeNull();
});

test("configured account CTA preserves the partner URL and discloses the commercial relationship", async ({
  page,
}) => {
  const review = createReviewTemplate("Sample Broker", "sample-broker");
  review.status = "published";
  review.jurisdiction = "Kenya";
  review.accountOpening = {
    url: "https://broker.example/open?partner=devin&campaign=review",
    status: "verified",
    sourceIds: ["terms"],
    legalEntity: "Sample legal entity",
    jurisdiction: "Kenya",
    checkedAt: "2026-11-03",
    isAffiliate: true,
  };
  review.sources.push({
    id: "terms",
    title: "Account terms",
    url: "https://broker.example/terms",
    publisher: "Sample legal entity",
    legalEntity: "Sample legal entity",
    jurisdiction: "Kenya",
    checkedAt: "2026-11-03",
  });
  await page.setContent(
    renderToStaticMarkup(
      createElement(AccountOpeningCta, { review, placement: "overview" }),
    ),
  );
  const link = page.getByRole("link", {
    name: "Open an account with Sample Broker",
    exact: true,
  });
  await expect(link).toHaveAttribute("href", review.accountOpening.url!);
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /sponsored/);
  await expect(link).toHaveAttribute("rel", /noopener/);
  await expect(
    page.getByText(/Devin Forex may receive compensation/),
  ).toBeVisible();
});
