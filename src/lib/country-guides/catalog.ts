import { davidOdoi } from "../authors";
import type { Claim, CountryGuide, GuideRegistry, GuideSource } from "./types";
import { applySriLankaDossier } from "./sri-lanka-dossier";
import { malaysiaGuide, registerMalaysiaSources } from "./malaysia";
import { ugandaGuide, registerUgandaSources } from "./uganda";
export { malaysiaGuide } from "./malaysia";

const countrySlug = "sri-lanka";
const noticeId = "cbsl-2019-notice";
const lead = (value: string, sourceIds = [noticeId]): Claim => ({ value, sourceIds, checkedAt: null, verification: "unverified", scope: { countrySlug, entityId: null }, note: "Supplied reference; current legal position and exact document wording require review." });
const source = (id: string, title: string, publisher: string, url: string, kind: GuideSource["kind"] = "regulator"): GuideSource => ({ id, title, publisher, url, kind, scope: { countrySlug, entityId: null }, publishedAt: null, publicationDateStatus: "unknown", checkedAt: null, verification: "unverified", access: "blocked", note: "This reference could not be accessed during preparation and has not been independently checked." });

export const countryRegistry: GuideRegistry = {
  people: [{ id: "david-odoi", name: davidOdoi.name, profileUrl: davidOdoi.profileUrl, roles: ["author"] }],
  entities: [], approvals: [],
  sources: [
    { ...source(noticeId, "Notice on unauthorized foreign exchange trading — supplied reference", "Central Bank of Sri Lanka", "https://www.cbsl.gov.lk/sites/default/files/cbslweb_documents/press/notices/notice_20191021_unauthorized_foreign_exchange_trading_e.pdf"), publishedAt: "2019-10-21", publicationDateStatus: "supplied", note: "The date and description were supplied with this reference. The PDF could not be accessed during preparation; its exact wording and subsequent changes remain unchecked." },
    source("cbsl-current-notices", "CBSL notices — current-guidance review lead", "Central Bank of Sri Lanka", "https://www.cbsl.gov.lk/en/press/notices"),
    source("dfe-guidance", "Department of Foreign Exchange — guidance review lead", "Department of Foreign Exchange, Sri Lanka", "https://www.dfe.lk/"),
    source("google-helpful-content", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", "editorial"),
    source("google-reviews", "Write high-quality reviews", "Google Search Central", "https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews", "editorial"),
  ],
};
export const sriLankaGuide: CountryGuide = {
  name: "Sri Lanka", slug: countrySlug, locale: "en-LK",
  currency: { ...lead("", []), value: null, note: "Not researched or displayed; this guide makes no currency conversion or funding claim." },
  title: "Forex Brokers in Sri Lanka: Rules, Risks and What to Check",
  description: "Forex brokers in Sri Lanka: understand the identified CBSL warning, unresolved legal and funding questions, and why offshore registration is not local authorization.",
  audience: "For Sri Lankan residents researching forex brokers and the permissions that matter before acting.",
  directAnswer: "We are not recommending a ‘best’ forex broker for Sri Lankan residents. Current trading and funding permissions have not been verified, so recommendations and commercial broker links remain on hold.",
  legalStatus: "pending_review", legalReviewedAt: null, legalReviewReference: null,
  legalSummary: lead("The supplied brief identifies a CBSL notice dated 21 October 2019 as warning about residents undertaking forex trading transactions and remitting funds for them. We could not retrieve that notice or verify subsequent official changes. Its current scope and application remain unresolved here."),
  legalSources: [noticeId, "cbsl-current-notices", "dfe-guidance"],
  humanApprovalReference: null, publicationStatus: "draft", publishedAt: null, updatedAt: null,
  commercialLinksAllowed: false,
  comparison: { mode: "none", purpose: null, approvalReference: null },
  authorReference: "david-odoi", reviewerReference: null,
  questions: [
    { question: "Will a broker accept a registration?", answer: lead("No Sri Lankan resident-acceptance record has been verified. A registration screen would establish neither local authorization nor lawful funding.", []), status: "unknown" },
    { question: "Which company would serve the resident?", answer: lead("No country-specific contracting-entity mapping is verified. A familiar brand or group licence is not an account agreement.", []), status: "unknown" },
    { question: "Is that exact entity locally authorized?", answer: lead("No Sri Lanka authorization claim is verified here. Check the named entity, permitted activities and current official record separately.", ["cbsl-current-notices", "dfe-guidance"]), status: "unknown" },
    { question: "Are trading and funding lawful for this resident?", answer: lead("The identified warning requires current legal review, including the person, product, transaction and any subsequent official changes.", [noticeId, "cbsl-current-notices", "dfe-guidance"]), status: "pending_review" },
    { question: "May Devin Forex target this country commercially?", answer: lead("No country-targeting affiliate approval is recorded. An entered referral URL would not unlock links or recommendations.", []), status: "unknown" },
  ],
  sections: [
    { id: "local-rules", eyebrow: "Start with the official position", title: "What the identified warning does—and does not—establish here", paragraphs: [
      lead("The 2019 notice is a source requiring legal review, not a substitute for a current determination. The brief describes a warning concerning resident forex transactions and remittances; we have not checked the PDF's exact wording, definitions, exceptions or subsequent amendments."),
      lead("Current CBSL and Department of Foreign Exchange guidance must be checked before making a country-specific recommendation. We have not established that an offshore account, a particular product or a resident's proposed transaction is permitted.", ["cbsl-current-notices", "dfe-guidance"]),
    ], points: ["Do not infer permission from a broker's registration form.", "Do not infer local authorization from a foreign group licence.", "Seek current authoritative clarification for the specific resident, product and transaction."] },
    { id: "availability", eyebrow: "Five checks, five different answers", title: "Broker availability is not local permission", paragraphs: [
      lead("For Sri Lanka, technical acceptance, the contracting company, local authorization, trading/funding permission and affiliate targeting approval remain separate checks. This guide has not resolved them into an approved route to trade.", [noticeId, "dfe-guidance"]),
    ], points: ["A broker's statement is evidence of what it says, not a regulator's decision.", "A licence belongs to a specified company and permissions; it is not shared automatically by every company in a group.", "Written clarification should address your actual circumstances rather than a generic ‘international clients welcome’ message."] },
    { id: "funding", eyebrow: "A separate legal question", title: "Funding permission needs its own review", paragraphs: [
      lead("The supplied description of the CBSL notice includes remittances for forex trading. A broker's available payment screen would not resolve whether a Sri Lankan resident may make the transaction. Current restrictions, scope and subsequent official changes remain unchecked."),
    ], points: ["This page provides no account-opening or funding instructions.", "Ask the relevant authority for authoritative clarification rather than treating marketing or an intermediary's assurance as permission."] },
    { id: "protection", eyebrow: "Read the entity, not just the logo", title: "Offshore protection must not be assumed", paragraphs: [
      lead("No Sri Lanka-specific broker entity, licence, client-money protection or complaint jurisdiction has been verified for this guide. We therefore display no broker scores, minimum deposits, spreads, payment methods or withdrawal-performance claims.", []),
    ], points: ["Keep technical resident acceptance separate from local authorization.", "Check any protection claim against the exact company and applicable terms.", "Ask which authority can address a complaint involving that company; do not assume a group company's regulator can do so."] },
    { id: "checking-claims", eyebrow: "Pause before trusting a promise", title: "How to check marketing claims and warning signs", paragraphs: [
      lead("Use the identified official references as starting points for clarification, while noting that we could not retrieve them. No particular broker or intermediary is endorsed by this guide.", ["cbsl-current-notices", "dfe-guidance"]),
    ], points: ["Treat urgency, fixed-return promises and pressure to act before checking as reasons to pause.", "Request the exact legal company name and a primary-source reference for an authorization claim.", "Do not take an affiliate link, testimonial or copied licence image as independent proof.", "Keep a record of the claim and source date when requesting a correction or authoritative clarification."] },
  ],
  faqs: [
    { question: "Which forex broker is best for Sri Lankan residents?", answer: lead("We do not have sufficient verified country-specific evidence or completed legal review to recommend one. A ranked list would conceal the unresolved questions, so no brokers are ranked or linked commercially.", []) },
    { question: "Is forex trading legal for Sri Lankan residents?", answer: lead("This guide has not verified the current legal position. The supplied brief identifies a 2019 CBSL warning concerning resident forex transactions and remittances. Its current scope and later official changes require legal review; seek current authoritative clarification.") },
    { question: "Does an offshore broker accepting me establish permission?", answer: lead("No such conclusion is established here. Registration acceptance, the serving entity, local authorization, trading/funding permission and affiliate targeting are separate questions. Do not use an acceptance screen as proof of lawful activity.", [noticeId, "dfe-guidance"]) },
    { question: "Does a foreign group licence mean local authorization?", answer: lead("A foreign group licence alone does not establish Sri Lanka authorization for your contracting company. This guide has no verified country-specific entity or local-authorization record. Check exact company details and official permissions separately.", ["cbsl-current-notices", "dfe-guidance"]) },
    { question: "What has Devin Forex actually tested?", answer: lead("No accounts, deposits, withdrawals or execution performance were tested for this guide. Official-source retrieval attempts were blocked. No current-law verification, firsthand test, broker ranking or affiliate targeting approval is claimed.", []) },
    { question: "Where should I look for authoritative clarification?", answer: lead("Start with current CBSL and Department of Foreign Exchange guidance and obtain clarification relevant to your circumstances. The references below are review leads, not sources successfully checked by us.", ["cbsl-current-notices", "dfe-guidance"]) },
  ],
  brokerEntityMappings: [],
  sourceIds: [noticeId, "cbsl-current-notices", "dfe-guidance", "google-helpful-content", "google-reviews"],
};
// Add only individually researched guides, never name-swapped placeholders.
applySriLankaDossier(sriLankaGuide, countryRegistry);
registerMalaysiaSources(countryRegistry);
registerUgandaSources(countryRegistry);
export const countryGuides: CountryGuide[] = [sriLankaGuide, malaysiaGuide, ugandaGuide];
export function getCountryGuide(slug: string) { return countryGuides.find(country => country.slug === slug); }
