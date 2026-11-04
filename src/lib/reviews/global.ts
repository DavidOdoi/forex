import { createReviewTemplate } from "./template";
import type { BrokerReview, ReviewField } from "./types";
import { internationalEntities } from "./international";

// Global is an editorial overview, not a licensing jurisdiction or an allowlist
// of residents. Entity permissions remain separately identified below.
export const GLOBAL_SCOPE = "Global";
export function globalReview(name: string, slug: string): BrokerReview {
  const review = createReviewTemplate(name, slug);
  review.status = "draft";
  review.jurisdiction = GLOBAL_SCOPE;
  const checkedAt = "2026-11-03";
  const entityScope = `${name} group disclosures; account entity must be confirmed`;
  const source = (id: string, title: string, url: string) => {
    review.sources.push({ id, title, url, publisher: name, checkedAt, legalEntity: entityScope, jurisdiction: GLOBAL_SCOPE });
  };
  const fields = (): ReviewField[] => [...review.keyData, ...review.benchmarks, ...review.chapters.flatMap(c => c.panels.flatMap(p => p.fields))];
  const set = (id: string, value: string, sourceIds: string[]) => {
    fields().filter(f => f.id === id).forEach(f => Object.assign(f, { value, status: "verified", sourceIds, legalEntity: entityScope, jurisdiction: GLOBAL_SCOPE, checkedAt }));
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
  source("global-standard", "Exness Standard account specifications", "https://www.exness.com/standard-accounts/");
  source("global-pro", "Exness Pro, Zero and Raw Spread account specifications", "https://www.exness.com/pro-accounts/");
  source("global-payments", "Exness deposit and withdrawal conditions", "https://www.exness.com/deposits-and-withdrawals/");
  source("global-fees", "Exness trading and payment fees", "https://www.exness.com/fees/");
  source("global-regulation", "Exness regulatory permissions and retail restrictions", "https://www.exness.com/regulation/");
  source("global-platforms", "Exness trading platform comparison", "https://www.exness.com/trading-platforms/");
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
  set("cfds-and-underlying-markets", "The account pages list forex, metals, cryptocurrencies, energies, stocks and indices as leveraged trading instruments. This does not establish ownership of underlying shares or assets.", ["global-standard", "global-pro"]);
  set("regulation-and-entity", "Exness publishes several legal entities and permissions, listed below. These are provider disclosures, not independently checked register entries in this global overview. UK and Cyprus entities are explicitly described as not serving retail clients.", ["global-regulation"]);
  review.entities?.push(
    { name: "Exness (UK) Ltd", country: "United Kingdom", regulator: "FCA", licence: "730729", sourceId: "global-regulation", note: "Does not offer services to retail clients" },
    { name: "Exness (Cy) Ltd", country: "Cyprus", regulator: "CySEC", licence: "178/12", sourceId: "global-regulation", note: "Does not offer services to retail clients" },
  );
  review.strengths = [
    { title: "Four account pricing choices", explanation: "Standard/Pro advertise no separate commission; Zero/Raw Spread combine a spread with per-side commission.", sourceIds: ["global-standard", "global-pro"] },
    { title: "Payment requests around the clock", explanation: "The provider lists 24/7 requests, including weekends; bank receipt remains payment-method dependent.", sourceIds: ["global-payments"] },
    { title: "Browser and mobile access", explanation: "Exness Terminal, Exness Trade and MT5 mobile are documented; account and platform compatibility still matter.", sourceIds: ["global-platforms"] },
    { title: "Demo access before live funding", explanation: "The international account pages link a free demo with virtual funds for practice.", sourceIds: ["global-standard"] },
    { title: "No advertised account-management fee", explanation: "The fee FAQ describes free account opening and management; payment-method charges are a separate question.", sourceIds: ["global-fees"] },
  ];
  review.limitations = [
    { title: "Spread floors are not typical costs", explanation: "Zero-spread headlines can sit alongside commission, and spreads may widen during volatility or low liquidity.", sourceIds: ["global-standard", "global-pro"] },
    { title: "Bank settlement can take longer", explanation: "Automatic approval does not guarantee immediate receipt; the provider’s published processing exceptions still apply.", sourceIds: ["global-payments"] },
    { title: "Group licences are not universal protection", explanation: "The UK and Cyprus companies explicitly do not serve retail clients; confirm the entity on your agreement.", sourceIds: ["global-regulation"] },
    { title: "Funding minimums need confirmation", explanation: "Minimum-deposit amounts were not readable in the retrieved tables. Check your selected account and payment method.", sourceIds: ["global-standard", "global-pro"] },
    { title: "High leverage increases loss exposure", explanation: "The advertised maximum is not an entitlement for every account, instrument or entity. Confirm applicable restrictions.", sourceIds: ["global-standard", "global-pro"] },
  ];
  review.faqs[1] = { question: "Which Exness company would hold my account?", answer: "The contracting company depends on the applicable location and account terms. Confirm the exact entity in the agreement shown during registration. The published UK and Cyprus permissions do not mean those entities serve international retail clients.", sourceIds: ["global-regulation"] };
  review.faqs[5] = { question: "Is Exness available in every country?", answer: "No. The provider lists restricted jurisdictions, including the USA. A global website does not establish eligibility everywhere; confirm your location and contracting entity before applying.", sourceIds: ["global-regulation"] };
  review.faqs[6] = { question: "Can I withdraw money from Exness on weekends?", answer: "The provider lists 24/7 requests. Automatic processing does not guarantee instant receipt, and non-instant requests are described as processed within 24 hours. Bank or payment-provider arrival can take longer.", sourceIds: ["global-payments"] };
  review.accountOpening = {
    url: "https://my.exness.com/accounts/sign-up?lng=en", status: "verified", sourceIds: ["global-standard"], legalEntity: entityScope,
    jurisdiction: GLOBAL_SCOPE, checkedAt, isAffiliate: false,
  };
  return review;
}
