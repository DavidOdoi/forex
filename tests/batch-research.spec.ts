import { test, expect } from "@playwright/test";
import { getReview } from "../src/lib/reviews/catalog";
import { checkedField, reviewAccounts, reviewQuickFacts, reviewedRegulatoryNotices, verdictSentences } from "../src/lib/reviews/flow";
import { reviewedFields } from "../src/lib/reviews/curated";
import { fieldValue } from "../src/lib/reviews/template";
import { readFileSync } from "node:fs";

const ledger = JSON.parse(readFileSync("docs/research-handoffs/batch-01a-source-checks.json", "utf8")) as { sources: { url: string; httpStatus: number; sha256: string }[] };

test("partial batch findings keep account figures, ratings and funding unverified", () => {
  for (const slug of ["4xc", "aaafx", "aafx-trading"]) {
    const { review } = getReview(slug)!;
    expect(review.status).toBe("draft");
    expect(review.overallScore).toBeNull();
    expect(review.customerReviews?.rating).toBeNull();
    expect(review.accountOpening.url).toBeNull();
    expect(reviewAccounts(review)).toEqual([]);
    for (const id of ["minimum-deposit", "forex-spread-and-commission", "published-processing-times", "client-money-arrangements", "negative-balance-protection"]) expect(checkedField(review, id)).toBeUndefined();
    for (const field of reviewedFields(review).filter(field => field.status === "verified")) expect(fieldValue(field, review)).toBe(field.value);
    expect(review.sources.every(source => source.checkedAt === "2026-11-08")).toBe(true);
    for (const source of review.sources) {
      const check = ledger.sources.find(check => check.url === source.url);
      expect(check?.httpStatus).toBe(200);
      expect(check?.sha256).toMatch(/^[a-f0-9]{64}$/);
    }
  }
  const xc = getReview("4xc")!.review;
  expect(checkedField(xc, "regulation-and-entity")?.value).toContain("money-changing business");
  expect(checkedField(xc, "regulation-and-entity")?.value).toContain("not displayed");
  expect(xc.entities?.find(entity => entity.country === "Seychelles")?.identitySourceId).toBe("batch-4xc-fsa-register");
  const aaa = getReview("aaafx")!.review;
  expect(checkedField(aaa, "regulation-and-entity")?.value).toContain("BFX2025097");
  expect(aaa.entities).toHaveLength(1);
  expect(aaa.entities?.[0].country).toBe("Comoros");
  for (const review of [xc, aaa]) expect(reviewQuickFacts(review).find(fact => fact.label === "Accepts US residents")?.value).toBe("No");
  const aaf = getReview("aafx-trading")!.review;
  expect(reviewQuickFacts(aaf).find(fact => fact.label === "Accepts US residents")?.value).toBe("Not verified");
  expect(reviewedRegulatoryNotices(aaf)).toHaveLength(2);
  expect(JSON.stringify(aaf.regulatoryNotices)).toContain("29 March 2017");
  expect(JSON.stringify(aaf.regulatoryNotices)).toContain("19 September 2022");
  expect(JSON.stringify(aaf.regulatoryNotices)).not.toContain("2024-07-05");
  expect(verdictSentences(aaf)[0]).toContain("regulator notices");
  aaf.sources = [];
  expect(reviewedRegulatoryNotices(aaf)).toEqual([]);
  expect(verdictSentences(aaf)[0]).not.toContain("official regulator notices");
});


test("the archived partial batch is no longer publicly served", async ({ request }) => {
  for (const slug of ["4xc", "aaafx", "aafx-trading"]) {
    expect(getReview(slug)!.review.status).toBe("draft");
    for (const suffix of ["", "/data"]) {
      const response = await request.get(`/reviews/${slug}${suffix}`);
      expect(response.status()).toBe(410);
      expect(response.headers()["x-robots-tag"]).toContain("noindex");
    }
  }
});
