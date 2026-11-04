import { createReviewTemplate } from "./template";
import type { BrokerReview, ReviewField } from "./types";
import { internationalEntities } from "./international";
import { davidOdoi } from "../authors";

// Global is an editorial overview, not a licensing jurisdiction or an allowlist
// of residents. Entity permissions remain separately identified below.
export const GLOBAL_SCOPE = "Global";
export function globalReview(name: string, slug: string): BrokerReview {
  const review = createReviewTemplate(name, slug);
  review.status = "draft";
  review.jurisdiction = GLOBAL_SCOPE;
  const checkedAt = "2026-11-03";
  const entityScope = `${name} group disclosures; account entity must be confirmed`;
  const source = (id: string, title: string, url: string, sourceCheckedAt = checkedAt) => {
    review.sources.push({ id, title, url, publisher: name, checkedAt: sourceCheckedAt, legalEntity: entityScope, jurisdiction: GLOBAL_SCOPE });
  };
  const fields = (): ReviewField[] => [...review.keyData, ...review.benchmarks, ...review.chapters.flatMap(c => c.panels.flatMap(p => p.fields))];
  const set = (id: string, value: string, sourceIds: string[], fieldCheckedAt = checkedAt) => {
    fields().filter(f => f.id === id).forEach(f => Object.assign(f, { value, status: "verified", sourceIds, legalEntity: entityScope, jurisdiction: GLOBAL_SCOPE, checkedAt: fieldCheckedAt }));
  };
  const profiles = internationalEntities.filter(p => p.slug === slug);
  const urlIds = new Map<string, string>();
  review.entities = profiles.map(profile => {
    let id = urlIds.get(profile.url);
    if (!id) { id = `global-disclosure-${urlIds.size + 1}`; urlIds.set(profile.url, id); source(id, `${name} legal and regulatory disclosures`, profile.url); }
    return { name: profile.entity, country: profile.country, regulator: profile.regulator, licence: profile.licence, sourceId: id };
  });
  if (profiles.length) {
    const ids = [...urlIds.values()];
    set("regulation-and-entity", "The group disclosures identify the entities listed below. Permissions are entity-specific and provider-reported here; they are not a worldwide client-protection guarantee.", ids);
    set("contracting-legal-entity", "The company assigned to an account depends on the applicable location and terms. Confirm its exact name and permissions in the agreement presented during registration.", ids);
    review.broker.website = new URL(profiles[0].url).origin;
  }
  const customerUrl = new URL("https://www.trustpilot.com/search");
  customerUrl.searchParams.set("query", review.broker.website ? new URL(review.broker.website).hostname.replace(/^www\./, "") : name);
  review.customerReviews = { publisher: "Trustpilot", url: customerUrl.href, rating: null, reviewCount: null, checkedAt: null };
  if (slug !== "exness") return review;

  review.broker.website = "https://www.exness.com/";
  review.author = { ...davidOdoi };
  review.publication = { publishedAt: null, updatedAt: "2026-11-04", approvedAt: null, approvedBy: null };
  source("global-standard", "Exness Standard account specifications", "https://www.exness.com/standard-accounts/");
  source("global-pro", "Exness Pro, Zero and Raw Spread account specifications", "https://www.exness.com/pro-accounts/");
  source("global-payments", "Exness deposit and withdrawal conditions", "https://www.exness.com/deposits-and-withdrawals/");
  source("global-fees", "Exness trading and payment fees", "https://www.exness.com/fees/");
  source("global-regulation", "Exness regulatory permissions and retail restrictions", "https://www.exness.com/regulation/");
  source("global-platforms", "Exness trading platform comparison", "https://www.exness.com/trading-platforms/");
  source("global-minimum-deposit", "Exness minimum first-deposit requirements", "https://get.exness.help/hc/en-us/articles/360011554840-What-is-the-minimum-amount-needed-to-start-trading", "2026-11-04");
  source("global-account-types", "Exness account types and platform support", "https://get.exness.help/hc/en-us/articles/360013782240-Trading-account-types", "2026-11-04");
  source("global-swap-free", "Exness swap-free eligibility and exclusions", "https://get.exness.help/hc/en-us/articles/4402341895570-Swap-free-status", "2026-11-04");
  source("global-inactivity", "Exness inactive accounts and reactivation fees", "https://get.exness.help/hc/en-us/articles/17537782906396-Archived-trading-accounts", "2026-11-04");
  source("global-payment-fees", "Exness payment-processing fees", "https://get.exness.help/hc/en-us/articles/360012604359-Are-any-payment-processing-fees-charged-by-Exness", "2026-11-04");
  source("global-payment-methods", "Exness regional payment-method availability", "https://get.exness.help/hc/en-us/articles/11865031701532-Available-payment-methods", "2026-11-04");
  set("overnight-financing", "Swap-free covers specified instruments, subject to trading-activity eligibility. Other instruments incur swap; status can be withdrawn. Check the current instrument rate and your Personal Area status.", ["global-swap-free"], "2026-11-04");
  set("inactivity-fee", "Exness states no inactivity or reactivation fee. Inactive real accounts may be archived and need reactivation before trading.", ["global-inactivity"], "2026-11-04");
  set("deposit-methods-and-charges", "Methods depend on registered region, verification and provider availability. Your Personal Area shows fees, transaction limits and processing estimates; no universal country/method comparison was established.", ["global-payment-methods"], "2026-11-04");
  set("withdrawal-methods-and-charges", "Exness states no deposit/withdrawal processing fee. Banks and payment providers may charge; confirm the selected method and any currency-conversion cost separately.", ["global-payment-fees"], "2026-11-04");
  set("minimum-deposit", "Standard: payment-method and regional minimums apply. Pro, Zero and Raw Spread: first deposits start at US$200, depending on region. Confirm the amount in your Personal Area; payment-method limits also apply.", ["global-minimum-deposit"], "2026-11-04");
  const pricing = "Standard advertises spreads from 0.2 pips with no commission; Pro from 0.1 pips with no commission. Zero starts at 0 pips with commission from US$0.05 per lot per side; Raw Spread starts at 0 pips with commission up to US$3.50 per lot per side. These are advertised floors, not measured average costs; account and instrument terms apply.";
  set("forex-trading-costs", pricing, ["global-standard", "global-pro"]);
  set("forex-spread-and-commission", pricing, ["global-standard", "global-pro"]);
  set("forex-commission-per-lot", "Standard/Pro: no commission advertised. Zero: from US$0.05 per lot per side. Raw Spread: up to US$3.50 per lot per side. Confirm the instrument-specific rate.", ["global-standard", "global-pro"]);
  set("retail-and-professional-accounts", "The international account pages list Standard, Pro, Zero and Raw Spread. The professional product range name is separate from a regulatory professional-client classification.", ["global-standard", "global-pro"]);
  set("leverage-by-product-and-region", "The international account pages advertise leverage up to 1:Unlimited. This is not a universal entitlement: confirm eligibility, instrument and account restrictions with the actual contracting entity. Higher leverage amplifies losses.", ["global-standard", "global-pro"]);
  set("demo-account", "The international account pages link a free demo. Demo balances are virtual; no platform or execution test was performed for this review.", ["global-standard", "global-pro"]);
  set("withdrawal-fee", "Withdrawal-fee coverage is advertised, but the fee-page footnote allows third-party charges depending on the chosen payment method. Check the method-specific terms in the Personal Area.", ["global-fees"]);
  set("published-processing-times", "The provider lists 24/7 deposit and withdrawal requests, including weekends. Instant means automatic processing, not guaranteed receipt. Non-instant requests are described as processed within 24 hours; the receiving bank or payment provider may take longer.", ["global-payments"]);
  set("withdrawal-requirements", "Use your own payment accounts. Third-party payments are not accepted; contact support if the original method is unavailable.", ["global-payments"]);
  set("deposit-and-account-charges", "The provider states that account opening and management carry no charge. Particular deposit methods may carry fees, according to the funding-page footnote.", ["global-fees", "global-payments"]);
  set("client-money-arrangements", "Exness reports segregated client funds at multiple tier-one banks. This is the provider’s statement; the arrangements were not independently audited here.", ["global-payments"]);
  set("country-availability", "The regulatory page excludes residents of several jurisdictions, including the USA. A global website does not establish eligibility in every country; confirm availability and the contracting entity during registration.", ["global-regulation"]);
  set("eligible-countries-and-client-category", "Eligibility is country- and entity-dependent. The regulatory page states that Exness (UK) Ltd and Exness (Cy) Ltd do not serve retail clients; group licences must not be assumed to protect another entity’s customers.", ["global-regulation"]);
  set("supported-mobile-platforms", "The international platform page lists Exness Trade and MT5 mobile. Supported devices and features vary; usability, security and execution were not tested.", ["global-platforms"]);
  set("platform-and-availability", "The provider documents Exness Terminal in a browser and MT5 mobile access, with real and demo MT5 accounts. Product and feature availability depends on the selected platform and account.", ["global-platforms"]);
  set("cfds-and-underlying-markets", "Forex, metals, crypto, energies, stock and index derivatives are listed. Availability varies; this does not establish ownership of underlying assets.", ["global-standard", "global-pro"]);
  set("regulation-and-entity", "Exness publishes several legal entities and permissions, listed below. These are provider disclosures, not independently checked register entries in this global overview. UK and Cyprus entities are explicitly described as not serving retail clients.", ["global-regulation"]);
  review.entities?.push(
    { name: "Exness (UK) Ltd", country: "United Kingdom", regulator: "FCA", licence: "730729", sourceId: "global-regulation", note: "Does not offer services to retail clients" },
    { name: "Exness (Cy) Ltd", country: "Cyprus", regulator: "CySEC", licence: "178/12", sourceId: "global-regulation", note: "Does not offer services to retail clients" },
  );
  // The regulator page independently identifies the company and dealer type.
  // It does not display SD025, so the licence number remains provider-reported.
  review.sources.push({ id: "fsa-identity", title: "Seychelles FSA: Exness (SC) Ltd identity entry", url: "https://fsaseychelles.sc/search-business/exness-sc-ltd", publisher: "Seychelles FSA", checkedAt: "2026-11-04", legalEntity: "Exness (SC) Ltd", jurisdiction: "Seychelles" });
  const seychelles = review.entities?.find(entity => entity.name === "Exness (SC) Ltd");
  if (seychelles) seychelles.identitySourceId = "fsa-identity";
  set("platform-and-availability", "Standard, Pro, Zero and Raw Spread guides document MT4/MT5. Confirm region-specific instrument availability.", ["global-account-types"], "2026-11-04");
  review.strengths = [
    { title: "Four pricing choices", explanation: "Standard/Pro: no commission. Zero/Raw Spread: per-side commission.", sourceIds: ["global-standard", "global-pro"] },
    { title: "24/7 payment requests", explanation: "Bank settlement follows broker processing; timing varies.", sourceIds: ["global-payments"] },
    { title: "Browser and mobile", explanation: "Documented platforms; compatibility varies by account.", sourceIds: ["global-platforms"] },
    { title: "Virtual-money demo", explanation: "Practice before funding; demo execution was not tested.", sourceIds: ["global-standard"] },
    { title: "No management fee advertised", explanation: "Opening/management are free; third-party payment charges may apply.", sourceIds: ["global-fees"] },
  ];
  review.limitations = [
    { title: "Spread floors are not typical costs", explanation: "Zero-spread headlines can include commission; actual spreads vary with liquidity.", sourceIds: ["global-standard", "global-pro"] },
    { title: "Bank settlement can take longer", explanation: "Automatic processing does not guarantee immediate receipt; payment-provider delays can apply.", sourceIds: ["global-payments"] },
    { title: "Group licences are not universal protection", explanation: "UK/Cyprus entities do not serve retail clients; check your contracting company.", sourceIds: ["global-regulation"] },
    { title: "Higher initial funding for professional accounts", explanation: "Pro, Zero and Raw Spread start at US$200, depending on region. Payment-method minimums also apply.", sourceIds: ["global-minimum-deposit"] },
    { title: "High leverage increases loss exposure", explanation: "Eligibility and instrument/account limits apply; higher leverage amplifies losses.", sourceIds: ["global-standard", "global-pro"] },
  ];
  review.faqs[1] = { question: "Which Exness company would hold my account?", answer: "Your registration agreement names the company. Location and account terms determine allocation; UK/Cyprus entities do not serve retail clients.", sourceIds: ["global-regulation"] };
  review.faqs[5] = { question: "Is Exness available in every country?", answer: "No. Restrictions include the USA. Confirm your location’s eligibility and assigned company during registration.", sourceIds: ["global-regulation"] };
  review.faqs[6] = { question: "Can I withdraw money from Exness on weekends?", answer: "Requests are available 24/7. Automatic processing does not guarantee receipt; non-instant requests are described as processed within 24 hours, with receiving-provider time additional.", sourceIds: ["global-payments"] };
  review.accountOpening = {
    url: "https://my.exness.com/accounts/sign-up?lng=en", status: "verified", sourceIds: ["global-standard"], legalEntity: entityScope,
    jurisdiction: GLOBAL_SCOPE, checkedAt, isAffiliate: false,
  };
  return review;
}
