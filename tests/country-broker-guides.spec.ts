import { test, expect } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { countryGuides, sriLankaGuide, countryRegistry } from "../src/lib/country-guides/catalog";
import { countryAffiliates } from "../src/lib/country-guides/affiliate-agreements";
import { countryBrokerMaster } from "../src/lib/country-guides/broker-master";
import { resolveCountryAffiliateLink } from "../src/lib/country-guides/affiliate";
import { comparisonMappings, guideApproved } from "../src/lib/country-guides/publication";
import { approvalRecord, checkedSource, claimVerified, validDate } from "../src/lib/country-guides/evidence";
import { countryGuideMetadata, countryGuideSitemapEntries, countryGuideStructuredData } from "../src/lib/country-guides/seo";
import { CountryBrokerComparison } from "../src/components/country-guides/broker-comparison";
import { CountryGuideContent } from "../src/components/country-guides/country-guide";
import { siteOrigin } from "../src/lib/site";
import { approvedCountryFixture, testAsOf } from "./fixtures/country-guide";

const path = "/forex-brokers/sri-lanka";
test("individually researched country drafts keep Sri Lanka's original source scope and evidence status intact", () => {
  expect(countryGuides.map(country => country.slug)).toEqual(["sri-lanka", "malaysia", "uganda", "united-kingdom", "netherlands", "singapore", "south-africa", "vietnam", "india"]);
  expect(sriLankaGuide).toMatchObject({ legalStatus: "pending_review", publicationStatus: "draft", commercialLinksAllowed: false, legalReviewedAt: null, legalReviewReference: null, humanApprovalReference: null, publishedAt: null, updatedAt: null, reviewerReference: null });
  expect(sriLankaGuide.brokerEntityMappings).toEqual([]); expect(countryAffiliates).toEqual({ agreements: [], geoApprovals: [] });
  expect(countryRegistry.approvals).toEqual([]); expect(countryRegistry.entities).toEqual([]);
  const sriLankaSources = countryRegistry.sources.filter(source => source.scope.countrySlug === "sri-lanka");
  expect(sriLankaSources).toHaveLength(29);
  expect(new Set(countryRegistry.sources.map(source => source.id)).size).toBe(countryRegistry.sources.length);
  expect(sriLankaSources.every(source => source.checkedAt === null && ["blocked", "not_attempted"].includes(source.access) && source.verification === "unverified")).toBe(true);
  expect(countryRegistry.sources[0]).toMatchObject({ publishedAt: null, publicationDateStatus: "unknown" });
  expect(guideApproved(sriLankaGuide, countryRegistry, testAsOf)).toBe(false); expect(comparisonMappings(sriLankaGuide, countryRegistry, testAsOf)).toEqual([]);
  expect(countryGuideSitemapEntries(testAsOf)).toEqual([]);
  expect(countryBrokerMaster("ic-markets")!.name).toBe("IC Markets"); expect(countryBrokerMaster("not-a-broker")).toBeNull();
});

test("a fully evidenced test approval resolves the exact paid link and separates offshore status from explicit trading permission", () => {
  const { country, registry, affiliates, mapping } = approvedCountryFixture();
  expect(guideApproved(country, registry, testAsOf)).toBe(true);
  expect(comparisonMappings(country, registry, testAsOf)).toHaveLength(1);
  expect(resolveCountryAffiliateLink(country, mapping, registry, affiliates, testAsOf)).toEqual({ href: affiliates.agreements[0].trackingUrl, target: "_blank", rel: "sponsored nofollow noopener noreferrer" });
  mapping.localAuthorization.value = "not_authorized";
  expect(resolveCountryAffiliateLink(country, mapping, registry, affiliates, testAsOf)).not.toBeNull();
  registry.approvals[0].approvedEntityIds = [];
  expect(resolveCountryAffiliateLink(country, mapping, registry, affiliates, testAsOf)).toBeNull();
});

test("commercial links fail closed for missing, unknown, scoped incorrectly or invalid legal/affiliate records", () => {
  type Fixture = ReturnType<typeof approvedCountryFixture>;
  const mutations: { reason: string; apply: (fixture: Fixture) => void }[] = [
    ...(["restricted", "unclear", "pending_review"] as const).map(status => ({ reason: `legal ${status}`, apply: (f: Fixture) => { f.country.legalStatus = status; } })),
    { reason: "country links disabled", apply: f => { f.country.commercialLinksAllowed = false; } },
    { reason: "draft", apply: f => { f.country.publicationStatus = "draft"; } },
    { reason: "no editorial approval", apply: f => { f.country.humanApprovalReference = null; } },
    { reason: "editorial review excludes commercial use", apply: f => { f.registry.approvals[1].commercialLinksAllowed = false; } },
    { reason: "editorial commercial scope unknown", apply: f => { delete f.registry.approvals[1].commercialLinksAllowed; } },
    { reason: "no legal approval", apply: f => { f.country.legalReviewReference = null; } },
    { reason: "mismatched legal date", apply: f => { f.country.legalReviewedAt = "2026-11-02"; } },
    { reason: "future publication", apply: f => { f.country.publishedAt = "2099-01-01"; } },
    { reason: "revoked human approval", apply: f => { f.registry.approvals[0].status = "revoked"; } },
    { reason: "wrong human country", apply: f => { f.registry.approvals[0].countrySlug = "elsewhere"; } },
    { reason: "missing approval record reference", apply: f => { f.registry.approvals[0].reference = ""; } },
    { reason: "unqualified role", apply: f => { f.registry.people[2].roles = ["author"]; } },
    { reason: "unread legal source", apply: f => { f.registry.sources[0].access = "blocked"; } },
    { reason: "unverified summary", apply: f => { f.country.legalSummary.verification = "unverified"; } },
    { reason: "missing legal source", apply: f => { f.registry.sources.shift(); } },
    { reason: "stale claim scope", apply: f => { f.country.legalSummary.scope.countrySlug = "another-country"; } },
    { reason: "future check date", apply: f => { f.registry.sources[0].checkedAt = "2099-01-01"; } },
    { reason: "wrong entity broker", apply: f => { f.registry.entities[0].brokerSlug = "xm"; } },
    { reason: "missing entity licence", apply: f => { f.registry.entities[0].licence = ""; } },
    { reason: "broker claim is not register confirmation", apply: f => { f.registry.entities[0].evidence.verification = "broker_stated"; } },
    { reason: "unmatched entity source", apply: f => { f.registry.sources[1].scope.entityId = "other-entity"; } },
    { reason: "unknown eligibility", apply: f => { f.mapping.residentEligibility.value = null; } },
    { reason: "declined eligibility", apply: f => { f.mapping.residentEligibility.value = "not_accepted"; } },
    { reason: "wrong eligibility country", apply: f => { f.mapping.residentEligibility.scope.countrySlug = "other-country"; } },
    { reason: "unknown local status", apply: f => { f.mapping.localAuthorization.value = null; } },
    { reason: "unverified local status", apply: f => { f.mapping.localAuthorization.verification = "unverified"; } },
    { reason: "trading restricted", apply: f => { f.mapping.tradingPermission.value = "restricted"; } },
    { reason: "funding unknown", apply: f => { f.mapping.fundingPermission.value = null; } },
    { reason: "unregistered mapping", apply: f => { f.country.brokerEntityMappings = []; } },
    { reason: "no geo approval", apply: f => { f.mapping.geoApprovalReference = null; } },
    { reason: "revoked geo approval", apply: f => { f.affiliates.geoApprovals[0].status = "revoked"; } },
    { reason: "unknown geo approval", apply: f => { f.affiliates.geoApprovals[0].status = "unknown"; } },
    { reason: "wrong geo country", apply: f => { f.affiliates.geoApprovals[0].countrySlug = "another-country"; } },
    { reason: "wrong geo entity", apply: f => { f.affiliates.geoApprovals[0].entityId = "wrong-entity"; } },
    { reason: "unsigned geo approval", apply: f => { f.affiliates.geoApprovals[0].approvalReference = ""; } },
    { reason: "future geo approval", apply: f => { f.affiliates.geoApprovals[0].approvedAt = "2099-01-01"; } },
    { reason: "wrong agreement id", apply: f => { f.affiliates.geoApprovals[0].agreementId = "missing"; } },
    { reason: "inactive agreement", apply: f => { f.affiliates.agreements[0].status = "inactive"; } },
    { reason: "unknown agreement", apply: f => { f.affiliates.agreements[0].status = "unknown"; } },
    { reason: "expired agreement", apply: f => { f.affiliates.agreements[0].expiresAt = "2026-11-01"; } },
    { reason: "agreement not started", apply: f => { f.affiliates.agreements[0].startsAt = "2027-11-01"; } },
    { reason: "disguised broker", apply: f => { f.affiliates.agreements[0].brokerSlug = "ic-markets"; } },
    { reason: "wrong agreement entity", apply: f => { f.affiliates.agreements[0].entityId = "another-entity"; } },
    { reason: "missing private agreement evidence", apply: f => { f.affiliates.agreements[0].sourceIds = []; } },
    { reason: "wrong evidence type", apply: f => { f.registry.sources.at(-1)!.kind = "broker"; } },
    { reason: "http tracking URL", apply: f => { f.affiliates.agreements[0].trackingUrl = "http://tracking.example.test/"; } },
    { reason: "unapproved host", apply: f => { f.affiliates.agreements[0].trackingUrl = "https://elsewhere.example.test/"; } },
    { reason: "URL credentials", apply: f => { f.affiliates.agreements[0].trackingUrl = "https://user:password@tracking.example.test/"; } },
  ];
  for (const mutation of mutations) {
    const fixture = approvedCountryFixture(); mutation.apply(fixture);
    expect(resolveCountryAffiliateLink(fixture.country, fixture.mapping, fixture.registry, fixture.affiliates, testAsOf), mutation.reason).toBeNull();
  }
  console.log(`Country affiliate gate: ${mutations.length} independent failure conditions checked.`);
});

test("an inserted affiliate URL and publication booleans cannot promote the Sri Lanka draft", () => {
  const { mapping, registry, affiliates } = approvedCountryFixture(); const country = structuredClone(sriLankaGuide);
  country.brokerEntityMappings = [mapping]; country.legalStatus = "permitted"; country.commercialLinksAllowed = true; country.publicationStatus = "approved";
  expect(resolveCountryAffiliateLink(country, mapping, registry, affiliates, testAsOf)).toBeNull();
  expect(guideApproved(country, registry, testAsOf)).toBe(false);
  expect(comparisonMappings(country, registry, testAsOf)).toEqual([]);
});

test("unknown evidence stays unknown and firsthand claims require actual checked firsthand records", () => {
  const { mapping, registry, country } = approvedCountryFixture();
  mapping.fees.value = "Invented tight spreads";
  expect(claimVerified(mapping.fees, country.slug, mapping.entityId, registry, testAsOf)).toBe(false);
  mapping.fees.verification = "firsthand_tested"; mapping.fees.checkedAt = "2026-11-01";
  expect(claimVerified(mapping.fees, country.slug, mapping.entityId, registry, testAsOf)).toBe(false);
  expect(checkedSource(countryRegistry.sources[0], testAsOf)).toBe(false);
  expect(validDate("2026-02-31")).toBe(false); expect(validDate("2026-11-10")).toBe(true);
  registry.approvals[0].approvedAt = "2099-01-01";
  expect(approvalRecord("legal-approval", "legal", country.slug, registry, testAsOf)).toBeNull();
});

test("verified prices from another country or entity cannot leak through reusable comparison fields", () => {
  const fixture = approvedCountryFixture();
  const source = structuredClone(fixture.registry.sources.find(source => source.id === "eligibility")!);
  source.id = "foreign-prices"; source.scope.countrySlug = "another-country";
  fixture.registry.sources.push(source);
  fixture.mapping.fees = { ...fixture.mapping.residentEligibility, value: "Foreign-country price must not appear", scope: { ...source.scope }, sourceIds: [source.id] };
  expect(claimVerified(fixture.mapping.fees, "another-country", fixture.mapping.entityId, fixture.registry, testAsOf)).toBe(true);
  expect(claimVerified(fixture.mapping.fees, fixture.country.slug, fixture.mapping.entityId, fixture.registry, testAsOf)).toBe(false);
  const html = renderToStaticMarkup(createElement(CountryBrokerComparison, { ...fixture, asOf: testAsOf }));
  expect(html).not.toContain("Foreign-country price must not appear");
  expect(html).toContain("Unknown — not verified");
  source.scope.countrySlug = fixture.country.slug; source.scope.entityId = "another-entity";
  fixture.mapping.fees.scope = { ...source.scope };
  const wrongEntity = renderToStaticMarkup(createElement(CountryBrokerComparison, { ...fixture, asOf: testAsOf }));
  expect(wrongEntity).not.toContain("Foreign-country price must not appear");
});

test("a scoped firsthand finding needs its checked record and is never inferred from a broker page", () => {
  const fixture = approvedCountryFixture();
  const record = structuredClone(fixture.registry.sources.find(source => source.id === "eligibility")!);
  record.id = "firsthand-test"; record.kind = "firsthand";
  fixture.registry.sources.push(record); fixture.country.sourceIds.push(record.id);
  fixture.mapping.strengths = [{ ...fixture.mapping.platforms, value: "Synthetic firsthand observation — fixture only", sourceIds: [record.id], verification: "firsthand_tested", checkedAt: "2026-11-01" }];
  const props = { ...fixture, asOf: testAsOf };
  const withRecord = renderToStaticMarkup(createElement(CountryGuideContent, props));
  expect(withRecord).toContain("1 scoped record");
  expect(withRecord).toContain("Synthetic firsthand observation");
  record.verification = "unverified";
  const withoutRecord = renderToStaticMarkup(createElement(CountryGuideContent, props));
  expect(withoutRecord).not.toContain("Synthetic firsthand observation");
  expect(withoutRecord).toContain("No live-account, deposit, withdrawal or execution tests were performed");
});

test("approved informational guides can be indexable without commercial links, with truthful publication metadata", () => {
  const { country, registry } = approvedCountryFixture();
  country.commercialLinksAllowed = false; country.comparison.mode = "none";
  country.legalStatus = "restricted"; registry.approvals[0].legalStatus = "restricted";
  expect(guideApproved(country, registry, testAsOf)).toBe(true);
  expect(countryGuideMetadata(country, registry, testAsOf).robots).toMatchObject({ index: true });
  expect(countryGuideSitemapEntries(testAsOf, [country], registry).map(entry => entry.url)).toContain(siteOrigin + "/forex-brokers/example-country");
  const graph = countryGuideStructuredData(country, registry, testAsOf)["@graph"];
  expect(graph[0]).toMatchObject({ "@type": "Article", datePublished: "2026-11-02", dateModified: "2026-11-02" });
  expect(JSON.stringify(graph)).not.toMatch(/AggregateRating|Review|ratingValue|award/);
  const draftGraph = countryGuideStructuredData(sriLankaGuide, countryRegistry, testAsOf)["@graph"];
  expect(draftGraph[0]["@type"]).toBe("WebPage");
  expect(JSON.stringify(draftGraph)).not.toMatch(/datePublished|dateModified|reviewedBy|ratingValue/);
});

test("country components reuse different data without Sri Lanka prose or unverified claims; restricted guides omit paid URLs entirely", () => {
  const fixture = approvedCountryFixture();
  fixture.mapping.fees.value = "Never display this unsupported price";
  const props = { ...fixture, asOf: testAsOf };
  const comparison = renderToStaticMarkup(createElement(CountryBrokerComparison, props));
  expect(comparison).toContain("Unknown — not verified"); expect(comparison).not.toContain("Never display");
  expect(comparison).toContain('rel="sponsored nofollow noopener noreferrer"'); expect(comparison).toContain('target="_blank"');
  expect(comparison).toContain(fixture.affiliates.agreements[0].trackingUrl.replaceAll("&", "&amp;"));
  fixture.country.legalStatus = "restricted"; fixture.registry.approvals[0].legalStatus = "restricted";
  const restricted = renderToStaticMarkup(createElement(CountryGuideContent, props));
  expect(restricted).toContain("Synthetic Fixture Entity"); expect(restricted).not.toContain("Sri Lanka");
  expect(JSON.stringify(countryGuideMetadata(fixture.country, fixture.registry, testAsOf).title)).not.toContain("Sri Lanka");
  expect(restricted).not.toContain("tracking.example.test"); expect(restricted).not.toContain('rel="sponsored');
  fixture.country.legalReviewedAt = "2026-11-10"; fixture.country.legalReviewReference = null;
  const unreviewed = renderToStaticMarkup(createElement(CountryGuideContent, props));
  expect(unreviewed).toContain("Legal review: not yet recorded");
  expect(unreviewed).not.toContain("Test legal reviewer");
});

test("Sri Lanka renders legal-first content, sources and honest schema without JavaScript; unpaid sign-up destinations do not imply approval or affiliate status", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  try {
    const response = await page.goto(path); expect(response!.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1); await expect(page.locator("h1")).toHaveText(sriLankaGuide.title);
    await expect(page.locator("h1")).not.toContainText("Best");
    await expect(page.locator("#local-rules")).toContainText("21 October 2019");
    await expect(page.locator(".cg-legal-summary")).toContainText("current application to retail forex/CFDs remains unresolved");
    await expect(page.locator("#local-rules")).toContainText("PDF body is undated");
    await expect(page.locator(".cg-status-card")).toContainText("No paid affiliate links are active");
    await expect(page.locator(".cg-checks>li")).toHaveCount(5);
    await expect(page.locator("#broker-comparison")).toHaveCount(0);
    await expect(page.locator(".cg-broker-card")).toHaveCount(0);
    await expect(page.locator("body>header").getByRole("link", { name: "Find my broker", exact: true, includeHidden: true })).toHaveCount(0);
    await expect(page.locator('main a[rel~="sponsored"]')).toHaveCount(0);
    await expect(page.locator(".cg-faq details")).toHaveCount(3);
    await expect(page.locator(".cg-sources li")).toHaveCount(10);
    await expect(page.locator("#methodology")).toContainText("Legal review: not yet recorded");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", siteOrigin + path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    expect(schema).toEqual(countryGuideStructuredData(sriLankaGuide, countryRegistry, testAsOf));
    const external = await page.locator('main a[href^="https:"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!));
    for (const href of external) expect(["www.cbsl.gov.lk", "www.dfe.lk", "fsaseychelles.sc", "documents.gov.lk", "developers.google.com", "www.exness.com", "get.exness.help", "my.exness.com", "www.xm.com", "www.icmarkets.com", "secure.ic.com", "pepperstone.com", "secure.pepperstone.com", "scb.gov.bs", "commons.wikimedia.org", "creativecommons.org"]).toContain(new URL(href).hostname);
    const html = await response!.text(); expect(html).not.toMatch(/tracking\.example\.test|aff_id=/);
    const xml = await (await request.get("/sitemap.xml")).text(); expect(xml).not.toContain(siteOrigin + "/forex-brokers");
    const hrefs = await page.locator('main a[href^="/"]').evaluateAll(nodes => [...new Set(nodes.map(node => node.getAttribute("href")!))]);
    for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
    const anchors = await page.locator('main a[href^="#"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!.slice(1)));
    for (const anchor of anchors) expect(await page.locator(`[id="${anchor}"]`).count(), anchor).toBe(1);
    expect((await request.get("/forex-brokers/unresearched-country")).status()).toBe(404);
    const hub = await request.get("/forex-brokers"); expect(hub.status()).toBe(200); expect(await hub.text()).toContain(path);
  } finally { await context.close(); }
});

test("country guide is keyboard-accessible and readable on phone, tablet and desktop without browser errors", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto(path);
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px`).toBe(true);
  }
  const faq = page.locator(".cg-faq summary").first(); await faq.focus(); await page.keyboard.press("Enter");
  await expect(page.locator(".cg-faq details").first()).toHaveAttribute("open", "");
  expect(await faq.evaluate(node => getComputedStyle(node).outlineStyle)).toBe("solid");
  expect(await faq.evaluate(node => getComputedStyle(node).animationName)).toBe("none");
  await page.locator(".cg-hero").screenshot({ path: "test-results/sri-lanka-hero-desktop.png", style: "body>header,.cg-section-nav{visibility:hidden}" });
  await page.setViewportSize({ width: 390, height: 1000 });
  const localRules = page.getByRole("navigation", { name: "Guide sections", exact: true }).getByRole("link", { name: "Local rules", exact: true });
  await localRules.focus(); await page.keyboard.press("Enter");
  expect(new URL(page.url()).hash).toBe("#legal-status");
  await page.locator(".cg-legal-summary").screenshot({ path: "test-results/sri-lanka-legal-mobile.png", style: "body>header,.cg-section-nav{visibility:hidden}" });
  await page.locator(".cg-check-disclosure>summary").click();
  await page.locator(".cg-checks").screenshot({ path: "test-results/sri-lanka-checks-mobile.png", style: "body>header,.cg-section-nav{visibility:hidden}" });
  expect(errors).toEqual([]);
});

test("reusable approved comparison keeps its table accessible, unknowns honest and overflow inside the scroll region", async ({ page }) => {
  const fixture = approvedCountryFixture(); const html = renderToStaticMarkup(createElement(CountryBrokerComparison, { ...fixture, asOf: testAsOf }));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setContent(`<main class="cg-page"><div class="cg-container">${html}</div></main>`);
  await page.addStyleTag({ path: "src/app/forex-brokers/country-guides.css" });
  const region = page.getByRole("region", { name: "Example Country unranked broker evidence comparison" });
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), String(width)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  await region.focus(); await page.keyboard.press("ArrowRight");
  await expect.poll(() => region.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  await expect(page.getByRole("table")).toContainText("Unknown — not verified");
  await expect(page.locator("th[scope=col]")).toHaveCount(8);
  const paid = page.getByRole("link", { name: "Visit Pepperstone — paid link" });
  await expect(paid).toHaveAttribute("rel", "sponsored nofollow noopener noreferrer");
  await expect(paid).toHaveAttribute("target", "_blank");
});
