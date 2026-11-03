import { createReviewTemplate } from "./template";
import type { BrokerReview } from "./types";
import { reviewedFields } from "./curated";

interface EntityProfile {
  slug: string;
  country: string;
  entity: string;
  url: string;
  regulator: string | null;
  licence: string | null;
  scope?: string;
  background?: string;
}

// Each entry is a paraphrase of a retrieved primary-source disclosure. Provider
// disclosures are explicitly attributed; they are not regulator-register checks.
export const internationalEntities: EntityProfile[] = [
  { slug: "etoro", country: "United Kingdom", entity: "eToro (UK) Ltd", regulator: "Financial Conduct Authority (FCA)", licence: "583263", url: "https://www.etoro.com/customer-service/regulation-license/", background: "The provider lists English company number 07973792 and an office at One Canada Square, London. Its separate e-money company is not the same entity as the investment firm." },
  { slug: "etoro", country: "Cyprus", entity: "eToro (Europe) Ltd", regulator: "Cyprus Securities and Exchange Commission (CySEC)", licence: "109/10", url: "https://www.etoro.com/customer-service/regulation-license/", background: "The provider lists Cyprus registration HE 200585 and a Limassol office. Investment-service and crypto-asset permissions are described separately." },
  { slug: "etoro", country: "Australia", entity: "eToro AUS Capital Limited", regulator: "Australian Securities and Investments Commission (ASIC)", licence: "491139", url: "https://www.etoro.com/customer-service/regulation-license/", background: "The disclosure names eToro AUS Capital Limited and separately describes eToro Asset Management Limited’s scheme role. Do not treat these companies as interchangeable." },
  { slug: "etoro", country: "United Arab Emirates", entity: "eToro (ME) Limited", regulator: "Abu Dhabi Global Market Financial Services Regulatory Authority (FSRA)", licence: "220073", url: "https://www.etoro.com/customer-service/regulation-license/", background: "The provider describes matched-principal dealing, arranging, custody and asset-management permissions in ADGM. This is not a statement of unrestricted authorisation throughout every UAE jurisdiction." },
  { slug: "etoro", country: "Seychelles", entity: "eToro (Seychelles) Ltd", regulator: "Financial Services Authority Seychelles", licence: "SD076", url: "https://www.etoro.com/customer-service/regulation-license/" },
  { slug: "etoro", country: "Singapore", entity: "eToro Singapore Pte. Ltd.", regulator: "Monetary Authority of Singapore (MAS)", licence: "CMS101824", url: "https://www.etoro.com/customer-service/regulation-license/", background: "The provider lists UEN 202111044C and a Capital Markets Services licence covering the specified securities, collective-investment, OTC-derivative, leveraged-FX and custody activities. Actual product access still requires confirmation." },
  { slug: "exness", country: "Seychelles", entity: "Exness (SC) Ltd", regulator: "Financial Services Authority Seychelles", licence: "SD025", url: "https://www.exness.com/legal-documents/", background: "The disclosure lists Seychelles registration 8423606-1 and a Providence, Mahé office. It separately reports an OTC-derivatives-provider authorisation from South Africa’s FSCA; a Seychelles registration does not establish South African headquarters." },
  { slug: "exness", country: "Curaçao", entity: "Exness B.V.", regulator: "Central Bank of Curaçao and Sint Maarten (CBCS)", licence: "0003LSI", url: "https://www.exness.com/legal-documents/", background: "The provider lists registration 148698(0) and an office in Curaçao. Its legal page lists a client agreement for this entity separately from other group companies." },
  { slug: "exness", country: "British Virgin Islands", entity: "Exness (VG) Ltd", regulator: "Financial Services Commission, British Virgin Islands", licence: "SIBA/L/20/1133", url: "https://www.exness.com/legal-documents/", background: "The disclosure lists registration 2032226 and a Road Town, Tortola office. The global legal page lists a separate client agreement for this entity." },
  { slug: "exness", country: "Belize", entity: "Forexite Ltd.", regulator: "Financial Services Commission, Belize", licence: "9110312", url: "https://www.exness.com/legal-documents/", background: "The provider’s legal disclosure lists registration 000022129 and a Belize City office under the Exness group’s authorised entities. The legal company name differs from the brand." },
  { slug: "exness", country: "Mauritius", entity: "Exness (MU) Ltd", regulator: "Financial Services Commission, Mauritius", licence: "GB20025294", url: "https://www.exness.com/legal-documents/", background: "The disclosure lists registration 176967, an Ebène office and an Investment Dealer (Full Service Dealer, Excluding Underwriting) permission. This is a provider disclosure, not a client-allocation determination." },
  { slug: "pepperstone", country: "Australia", entity: "Pepperstone Group Limited", regulator: "Australian Securities and Investments Commission (ASIC)", licence: "414530", url: "https://pepperstone.com/en-au/about-us/policies/legal", background: "The Australian legal page lists ACN 147 055 703 and a Melbourne office. It provides separate retail PDS/TMD documents and a wholesale-client statement.", scope: "The Australian legal-document set is reviewed. Retail and wholesale terms differ. A country or entity selection does not establish that a particular applicant will be accepted." },
  { slug: "ic-markets", country: "Seychelles", entity: "Raw Trading Ltd", regulator: "Financial Services Authority Seychelles", licence: "SD018", url: "https://www.ic.com/en/", background: "The site identifies IC and IC Markets Global as trading names of Raw Trading Ltd and lists Seychelles registration 8419879-1. This is distinct from IC Markets (KE) Limited in the Kenyan register." },
  { slug: "xm", country: "Cyprus", entity: "Trading Point of Financial Instruments Limited", regulator: null, licence: null, url: "https://www.xm.com/", background: "The retrieved website names registration HE251334 and an address in Limassol, Cyprus. It states that this entity provides investment and ancillary services to EEA residents. The retrieved homepage alone does not establish a regulator licence number.", scope: "The source states service to residents of the European Economic Area. This is a Cyprus entity profile, not a complete account review for every EEA country." },
  { slug: "atc-brokers", country: "United Kingdom", entity: "ATC Brokers Limited (United Kingdom)", regulator: "Financial Conduct Authority (FCA)", licence: "591361", url: "https://atcbrokers.com/en/terms-conditions/", background: "The provider’s disclosure lists an office at Waverley House, Noel Street, London. Its Cayman and Seychelles companies are separately named." },
  { slug: "atc-brokers", country: "Cayman Islands", entity: "ATC Brokers Limited (Cayman Islands)", regulator: "Cayman Islands Monetary Authority (CIMA)", licence: "1448274", url: "https://atcbrokers.com/en/terms-conditions/", background: "The provider lists an office on Elgin Avenue, George Town, Grand Cayman. This is a separate disclosure from the group’s FCA-regulated company." },
  { slug: "atc-brokers", country: "Seychelles", entity: "ATC Brokers LTD (Seychelles)", regulator: "Financial Services Authority Seychelles", licence: "SD078", url: "https://atcbrokers.com/en/terms-conditions/", background: "The provider lists an office in Mont Fleuri, Mahé. The website’s group-level product claims do not by themselves establish this entity’s exact account conditions." },
  { slug: "afterprime", country: "Seychelles", entity: "Afterprime Ltd", regulator: "Financial Services Authority Seychelles", licence: "SD057", url: "https://afterprime.com/legal-documents", background: "The legal page lists a Providence, Mahé address and links a client service agreement, risk disclosure and complaints policy. Claims about group licences in Australia do not make the Seychelles company ASIC-regulated." },
  { slug: "adss", country: "United Arab Emirates", entity: "ADS Securities L.L.C – S.P.C", regulator: "Capital Market Authority, United Arab Emirates", licence: "Category 1: 305027; Category 5: 20200000217", url: "https://www.adss.com/", background: "The provider’s footer lists UAE commercial licence 1190047 and an Abu Dhabi office. The disclosed UAE Capital Market Authority must not be confused with Kenya’s similarly abbreviated CMA.", scope: "The source describes a UAE offering and says its information is not directed at residents of a particular country outside the UAE. It does not establish a worldwide client allowlist." },
];

export function internationalReview(name: string, profile: EntityProfile): BrokerReview {
  const review = createReviewTemplate(name, profile.slug);
  review.status = "draft";
  review.jurisdiction = profile.country;
  review.broker.website = profile.url;
  const source = { id: "entity-disclosure", title: `${name} — official ${profile.country} entity disclosure`, url: profile.url,
    publisher: name, legalEntity: profile.entity, jurisdiction: profile.country, checkedAt: "2026-11-03" };
  review.sources.push(source);
  const set = (id: string, value: string) => {
    for (const field of reviewedFields(review).filter(f => f.id === id))
      Object.assign(field, { value, status: "verified", sourceIds: [source.id], legalEntity: profile.entity, jurisdiction: profile.country, checkedAt: source.checkedAt });
  };
  set("regulation-and-entity", `${profile.entity} — ${profile.country}. ${profile.regulator ? `The provider reports ${profile.regulator} authorisation${profile.licence ? `, reference ${profile.licence}` : ""}. An independent register check remains outstanding.` : "The retrieved source identifies the company and location; its regulatory permission is not established by this check."}`);
  set("contracting-legal-entity", `The official disclosure names ${profile.entity}. Confirm the actual company in the agreement presented to you; a group entity list does not establish which company will hold your account.`);
  if (profile.regulator) set("regulator-and-register-entry", `Provider-reported: ${profile.regulator}. The regulator register itself has not been independently checked for this profile.`);
  if (profile.licence) set("licence-number", `Provider-reported reference: ${profile.licence}. Independent register confirmation pending.`);
  if (profile.background) set("company-background-and-ownership", profile.background);
  if (profile.scope) {
    set("country-availability", profile.scope);
    set("eligible-countries-and-client-category", profile.scope);
  }
  review.verdict = `${name} identifies ${profile.entity} in ${profile.country} in the linked primary-source disclosure. ${profile.regulator ? `The provider reports authorisation from ${profile.regulator}${profile.licence ? ` under reference ${profile.licence}` : ""}; this profile has not independently confirmed the register entry.` : "The company’s regulatory permissions remain to be checked."} This country profile covers the named entity. Account costs, resident eligibility and customer protections are not borrowed from the broker’s other countries. Full product-document and editorial checks are outstanding.`;
  review.chapters.find(c => c.id === "safety")!.introduction = `The linked disclosure identifies ${profile.entity}. Provider-reported permissions are distinguished from independently checked register entries. A local office or licence alone does not establish client eligibility, compensation rights or protection from trading losses.`;
  review.faqs[1].answer = `The source names ${profile.entity} in ${profile.country}. The entity actually assigned to your account must be confirmed in your application and client agreement. Do not substitute another group company’s terms.`;
  review.faqs[1].sourceIds = [source.id];
  review.faqs[7].answer = "This is a source-based country/entity draft checked against the linked official disclosure on 3 November 2026. The source’s licensing statements are attributed to the provider. No funded-account test, withdrawal test or independent editorial fact check has been completed.";
  review.faqs[7].sourceIds = [source.id];
  return review;
}
