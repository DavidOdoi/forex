import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { sriLankaGuide, countryRegistry } from "../src/lib/country-guides/catalog";
import { countryAffiliates } from "../src/lib/country-guides/affiliate-agreements";
import { checkedSource, claimVerified } from "../src/lib/country-guides/evidence";
import { comparisonMappings, guideApproved } from "../src/lib/country-guides/publication";
import { countrySuppliedResearch } from "../src/lib/country-guides/supplied-research";
import { EvidenceClaim } from "../src/components/country-guides/evidence";
import { CountryGuideContent } from "../src/components/country-guides/country-guide";
import { approvedCountryFixture, testAsOf } from "./fixtures/country-guide";

const dossier = sriLankaGuide.suppliedResearch!;
const path = "/forex-brokers/sri-lanka";
test("supplied dossier is preserved verbatim and its full legal/broker ledger remains separate from approvals", () => {
  const archive = readFileSync(dossier.archivePath); const delimiter = Buffer.from("\n---\n\n"); const index = archive.indexOf(delimiter);
  expect(index).toBeGreaterThan(0);
  expect(createHash("sha256").update(archive.subarray(index + delimiter.length)).digest("hex")).toBe(dossier.originalSha256);
  expect(dossier.reportedFindings.map(finding => finding.id)).toEqual([...Array.from({ length: 12 }, (_, i) => `L${i + 1}`), ...Array.from({ length: 16 }, (_, i) => `B${i + 1}`)]);
  expect(dossier.brokerResearch.map(broker => broker.brokerSlug)).toEqual(["exness", "xm", "ic-markets", "pepperstone"]);
  for (const broker of dossier.brokerResearch) {
    expect(broker.residentEligibility).toBe("not_established"); expect(broker.servingEntity).toBe("not_established"); expect(broker.localAuthorization).toBe("not_established");
    expect(broker.reportedFields.length).toBeGreaterThanOrEqual(9);
    for (const field of broker.reportedFields) for (const id of field.sourceIds) expect(countryRegistry.sources.some(source => source.id === id), id).toBe(true);
  }
  expect(dossier.legalReviewQuestions).toHaveLength(9); expect(dossier.ownerEvidenceNeeded).toHaveLength(9);
  expect(sriLankaGuide.brokerEntityMappings).toEqual([]); expect(countryRegistry.entities).toEqual([]); expect(countryRegistry.approvals).toEqual([]);
  expect(countryAffiliates).toEqual({ agreements: [], geoApprovals: [] });
});

test("reported access dates and publication clues never become independent checks or legal-review dates", () => {
  expect(dossier.reportedResearchDate).toBe("2026-11-10"); expect(dossier.independentRecheck).toBe("pending");
  expect(dossier.reportedSources).toHaveLength(25);
  for (const source of dossier.reportedSources) {
    expect(source.reportedAccess).toMatchObject({ date: "2026-11-10", dossierId: dossier.id });
    expect(source.checkedAt).toBeNull(); expect(source.verification).toBe("unverified"); expect(checkedSource(source, testAsOf)).toBe(false);
  }
  const notice = countryRegistry.sources.find(source => source.id === "cbsl-2019-notice")!;
  expect(notice.publishedAt).toBeNull(); expect(notice.publicationDateStatus).toBe("unknown"); expect(notice.dateNote).toContain("undated PDF body");
  const faq = countryRegistry.sources.find(source => source.id === "dfe-current-transactions")!;
  expect(faq.publishedAt).toBeNull(); expect(faq.reportedUpdatedAt).toBe("2026-10-19");
  expect(countryRegistry.sources.find(source => source.id === "gazette-2493-36")).toMatchObject({ publishedAt: "2026-06-18", publicationDateStatus: "supplied" });
  expect(countryRegistry.sources.find(source => source.id === "gazette-2493-38")!.reportedAccess?.outcome).toBe("not_accessed");
  expect(sriLankaGuide).toMatchObject({ legalReviewedAt: null, legalReviewReference: null, humanApprovalReference: null, publishedAt: null, updatedAt: null, publicationStatus: "draft", commercialLinksAllowed: false, legalStatus: "pending_review" });
  const promoted = structuredClone(sriLankaGuide); promoted.legalSummary.verification = "regulator_confirmed"; promoted.legalSummary.checkedAt = dossier.reportedResearchDate;
  promoted.publicationStatus = "approved"; promoted.legalReviewedAt = dossier.reportedResearchDate;
  expect(claimVerified(promoted.legalSummary, promoted.slug, null, countryRegistry, testAsOf)).toBe(false);
  expect(guideApproved(promoted, countryRegistry, testAsOf)).toBe(false); expect(comparisonMappings(promoted, countryRegistry, testAsOf)).toEqual([]);
});

test("broker conflicts, commission units, incomplete documents and early-access limitations survive in the research record", () => {
  const research = JSON.stringify(dossier.brokerResearch);
  for (const detail of ["Eden Island", "Providence", "8557558", "000261/309", "XM (SC)", "SD018", "SIA-F217", "TradingView", "$10", "early-access", "USD 100,000", "not established"]) expect(research).toContain(detail);
  const ic = dossier.brokerResearch.find(broker => broker.brokerSlug === "ic-markets")!;
  expect(ic.advertisedAccounts).toHaveLength(5);
  expect(ic.advertisedAccounts!.find(account => account.account.includes("cTrader"))!.commission).toContain("USD 100,000");
  expect(dossier.accessFailures.some(item => item.subject.includes("2213/40") && item.url === null)).toBe(true);
  expect(dossier.accessFailures.some(item => item.subject.includes("2493/38"))).toBe(true);
  for (const finding of dossier.reportedFindings) for (const id of finding.sourceIds) expect(countryRegistry.sources.some(source => source.id === id), id).toBe(true);
});

test("dossier provenance and quotations cannot leak to a different country, entity or future date", () => {
  const fixture = approvedCountryFixture();
  expect(countrySuppliedResearch(fixture.country, testAsOf)).toBeNull();
  expect(countrySuppliedResearch(sriLankaGuide, "2026-11-09")).toBeNull();
  const html = renderToStaticMarkup(createElement(CountryGuideContent, { ...fixture, asOf: testAsOf }));
  expect(html).not.toContain("Supplied research dossier"); expect(html).not.toContain("Gazette 2493");
  const quote = sriLankaGuide.sections[0].paragraphs.find(claim => claim.reportedQuote)!;
  const props = { claim: quote, registry: countryRegistry, asOf: testAsOf, countrySlug: "another-country", entityId: null, narrative: true };
  const mismatch = renderToStaticMarkup(createElement(EvidenceClaim, props));
  expect(mismatch).not.toContain(quote.reportedQuote!.text); expect(mismatch).toContain("Unknown — not verified");
  const missingReference = structuredClone(quote); missingReference.sourceIds = [];
  const missing = renderToStaticMarkup(createElement(EvidenceClaim, { ...props, countrySlug: "sri-lanka", claim: missingReference }));
  expect(missing).not.toContain("cg-reported-quote");
});

test("updated draft server-renders legal findings, honest dates, quotes and unaccessed-source limitations without commercial broker pages", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    const response = await page.goto(path); expect(response!.status()).toBe(200);
    await expect(page.getByRole("complementary", { name: "Supplied research status" })).toContainText("10 Nov 2026");
    await expect(page.locator("#investment-rules-2026")).toContainText("18 June 2026"); await expect(page.locator("#investment-rules-2026")).toContainText("20 June 2026");
    await expect(page.locator("#investment-rules-2026")).toContainText("2493/38"); await expect(page.locator("#investment-rules-2026")).toContainText("not accessed");
    await expect(page.locator("#funding")).toContainText("FAQ 30"); await expect(page.locator("#funding")).toContainText("not establish that another channel");
    await expect(page.locator(".cg-reported-quote")).toHaveCount(4);
    await expect(page.locator(".cg-reported-quote").first()).toContainText("wording not independently checked");
    await expect(page.locator("#source-cbsl-2019-notice")).toContainText("Not established");
    await expect(page.locator("#source-cbsl-2019-notice")).toContainText("Independent check");
    await expect(page.locator("#source-cbsl-2019-notice")).not.toContainText("21 Oct 2019 (dossier-reported date)");
    await expect(page.locator("#source-gazette-2493-38")).toContainText("Not accessed");
    await expect(page.locator("#legal-review-questions .cg-bullets li")).toHaveCount(9);
    await expect(page.locator(".cg-byline")).toContainText("Legal review: not yet recorded");
    await expect(page.locator("#availability")).toContainText("Exness, XM, IC Markets and Pepperstone");
    await expect(page.locator('main a[rel~="sponsored"]')).toHaveCount(0);
    await expect(page.locator("#broker-comparison")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    const html = await response!.text();
    for (const marker of ["icmarkets.com/global/en/trading-accounts/funding", "xm.com/account-types", "pepperstone.com/en/trading/trading-accounts/"]) expect(html.includes(marker), marker).toBe(false);
    const sourceAnchors = await page.locator('main a[href^="#source-"]').evaluateAll(links => links.every(link => document.getElementById(link.getAttribute("href")!.slice(1)))); expect(sourceAnchors).toBe(true);
    const xml = await (await request.get("/sitemap.xml")).text(); expect(xml).not.toContain("/forex-brokers/sri-lanka");
  } finally { await context.close(); }
});

test("new provenance, quotations and legal sections remain readable and keyboard-accessible across screen sizes", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto(path);
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
  }
  await page.locator(".cg-dossier-note").screenshot({ path: "test-results/sri-lanka-dossier-status-desktop.png", style: "body>header,.cg-section-nav{visibility:hidden}" });
  await page.locator("#investment-rules-2026").screenshot({ path: "test-results/sri-lanka-2026-regulation-desktop.png", style: "body>header,.cg-section-nav{visibility:hidden}" });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.locator("#funding").screenshot({ path: "test-results/sri-lanka-dossier-funding-mobile.png", style: "body>header,.cg-section-nav{visibility:hidden}" });
  const faq = page.locator(".cg-faq summary").filter({ hasText: "Did the 2026 regulation" }); await faq.focus(); await page.keyboard.press("Enter");
  await expect(faq.locator("..")).toHaveAttribute("open", ""); expect(errors).toEqual([]);
});
