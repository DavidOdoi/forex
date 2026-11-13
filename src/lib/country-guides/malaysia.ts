import data from "@/data/country-guides/malaysia-dossier-2026-11-13.json";
import type { Claim, CountryGuide, GuideRegistry, GuideSource, SuppliedCountryResearch } from "./types";

export const malaysiaDossier = data as SuppliedCountryResearch;
const scope = { countrySlug: "malaysia", entityId: null };
const date = "2026-11-13";
const guidelines = "my-sc-cfd-current", faq = "my-sc-cfd-faq-current", register = "my-sc-register", fep = "my-bnm-fep";
const note = "Source-text check, not legal/editorial approval, broker allocation, funded-account testing or affiliate permission.";
const editorial = (value: string, sourceIds: string[] = []): Claim => ({ value, sourceIds, checkedAt: null, verification: "unverified", scope, note });
const checked = (value: string, sourceIds: string[]): Claim => ({ value, sourceIds, checkedAt: date, verification: "desk_verified", scope, note });
const checkedSource = (id: string, title: string, publisher: string, url: string, publishedAt: string | null = null): GuideSource => ({ id, title, publisher, url, kind: "regulator", scope, publishedAt, publicationDateStatus: publishedAt ? "verified" : "unknown", checkedAt: date, verification: "checked", access: "retrieved", note });

export function registerMalaysiaSources(registry: GuideRegistry) {
  const sources: GuideSource[] = [
    ...structuredClone(malaysiaDossier.reportedSources),
    checkedSource(guidelines, "SC CFD Guidelines — revised 14 June 2024", "Securities Commission Malaysia", "https://www.sc.com.my/api/documentms/download.ashx?id=df2998ba-ba87-4864-a449-b23ae25cb108", "2024-06-14"),
    checkedSource(faq, "SC CFD FAQs — revised 14 October 2024", "Securities Commission Malaysia", "https://www.sc.com.my/api/documentms/download.ashx?id=7bf6ca56-24a1-4af9-9fe7-ddfa430214cc", "2024-10-14"),
    checkedSource("my-sc-cfd-index", "SC current CFD documents and superseded archive", "Securities Commission Malaysia", "https://www.sc.com.my/regulation/guidelines/contracts-for-difference"),
    checkedSource(register, "SC licensed and registered persons", "Securities Commission Malaysia", "https://www.sc.com.my/regulation/licensing/licensed-and-registered-persons"),
    checkedSource(fep, "Bank Negara Malaysia foreign-exchange policy", "Bank Negara Malaysia", "https://www.bnm.gov.my/fep"),
    { id: "my-ic-eu-background", title: "IC Markets EU register — foreign-entity background", publisher: "CySEC", url: "https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/80418/", kind: "regulator", scope, publishedAt: null, publicationDateStatus: "unknown", checkedAt: null, verification: "unverified", access: "not_attempted", note: "The earlier EU research is not a Malaysian resident-acceptance or authorization check." },
  ];
  for (const source of sources) {
    if (source.id === "my-supplied-10") source.title = "Exness regulation disclosures — contributor reference";
    if (source.id === "my-supplied-7") source.title = "XM legal documents — contributor reference";
    if (!registry.sources.some(existing => existing.id === source.id)) registry.sources.push(source);
  }
}

export const malaysiaGuide: CountryGuide = {
  name: "Malaysia", slug: "malaysia", locale: "en-MY",
  currency: { ...editorial("", [fep]), value: null, note: "No live MYR conversion quote or broker base-currency entitlement is displayed." },
  title: "Forex Brokers in Malaysia: Rules, Eligibility & Checks",
  seoTitle: editorial("Forex Brokers in Malaysia: Rules & Eligibility"),
  description: "Forex brokers in Malaysia: check SC CFD eligibility, broker evidence, local permissions and funding rules before choosing an overseas trading account.",
  audience: "Malaysian residents researching leveraged forex/CFD accounts, with ordinary retail and sophisticated-investor categories kept separate.",
  intro: editorial("Forex brokers in Malaysia need to be assessed by client eligibility, product permission and the company behind the account. This guide covers leveraged forex/CFD accounts, rather than currency exchange for travel or business. Compare the evidence for four brokers, then check the SC and Bank Negara Malaysia rules before considering funding."),
  directAnswer: "The SC’s CFD framework limits offers to sophisticated investors. Exness, XM, IC Markets and Pepperstone are researched below, but none is established here as a locally authorised Malaysian retail forex/CFD option.",
  legalStatus: "pending_review", publicationStatus: "draft", commercialLinksAllowed: false,
  legalReviewedAt: null, legalReviewReference: null, humanApprovalReference: null,
  publishedAt: null, updatedAt: null, authorReference: "david-odoi", reviewerReference: null,
  legalSummary: checked("SC paragraph 4.02 limits CFD offers to sophisticated investors. This source check does not establish a permitted offshore retail forex route, an eligible broker or lawful funding for a particular resident.", [guidelines, faq]),
  legalSources: [guidelines, faq, fep],
  brokerEntityMappings: [], comparison: { mode: "none", purpose: null, approvalReference: null },
  suppliedResearch: malaysiaDossier,
  sourceIds: [guidelines, faq, "my-sc-cfd-index", register, fep, "my-supplied-10", "my-supplied-7", "my-ic-eu-background"],
  researchPresentation: {
    scope, dossierId: malaysiaDossier.id,
    description: "These entries compare evidence, not Malaysian account offers. No eligible retail shortlist or Malaysian serving company is established. The global reviews provide background, not proof of local permission.",
    caption: "Malaysia eligibility research · supplied dossier and source checks, 13 November 2026",
    headers: ["Broker", "What the sources establish", "Malaysia-specific gap", "Deciding check"],
    columnWidths: [19, 29, 27, 25],
    rows: [
      { slug: "exness", cells: [
        { text: "The group discloses several foreign companies.", sourceId: "my-supplied-10", anchor: "Exness company disclosures" },
        { text: "No Malaysian retail contracting company or product permission established." },
        { text: "Check the exact company and SC product permissions; a portal or Labuan presence is insufficient.", sourceId: register, anchor: "SC register" },
      ] },
      { slug: "xm", cells: [
        { text: "Foreign legal documents are available.", sourceId: "my-supplied-7", anchor: "XM legal documents" },
        { text: "No Malaysian serving entity or explicit retail eligibility established." },
        { text: "Obtain the Malaysian client agreement; localisation is not an entity allocation." },
      ] },
      { slug: "ic-markets", cells: [
        { text: "Prior research identifies a separately regulated Cyprus company.", sourceId: "my-ic-eu-background", anchor: "IC Markets EU register" },
        { text: "Cyprus licensing does not establish Malaysian onboarding or local permission." },
        { text: "Confirm the resident category, proposed company and product." },
      ] },
      { slug: "pepperstone", cells: [
        { text: "A global review is available; Malaysia-specific terms were not retrieved in the supplied research." },
        { text: "No Malaysian retail entity allocation or permission established." },
        { text: "Request explicit resident eligibility and the full legal pack." },
      ] },
    ],
    footnote: "No broker is ranked or recommended for Malaysian retail clients. Fees, leverage and payment options from another country are not Malaysian account terms. The comparison therefore focuses on eligibility evidence.",
    traderFit: { title: "Start with your investor category", table: {
      caption: "Eligibility comes before account features", headers: ["Your situation", "First question", "Next check"], rows: [
        ["Ordinary retail", "Can this product be offered to you?", "SC CFD offers are restricted to sophisticated investors."],
        ["Potentially sophisticated", "Do you meet the current categories?", "Get the applicable criteria and suitability assessment."],
        ["Offshore account", "Which company and rules apply?", "Check the contract, product and funding separately."],
        ["Swap-free priority", "Is the underlying offer permitted?", "Then examine eligibility and replacement holding fees."],
        ["New learner", "What can you understand before committing funds?", "Learn margin risk and read any demo terms."],
      ],
    } },
  },
  questions: [
    { question: "Will a broker accept a registration?", answer: editorial("Explicit Malaysian retail acceptance is not established for these four brokers."), status: "unknown" },
    { question: "Which company would serve the resident?", answer: editorial("Identify the company named in the proposed client agreement."), status: "unknown" },
    { question: "Is that company authorised for the product?", answer: checked("SC CFD providers require the relevant derivatives licence; a group or foreign licence is insufficient evidence.", [guidelines]), status: "unknown" },
    { question: "Are trading and funding permitted for this resident?", answer: editorial("Obtain advice covering the resident category, product and applicable BNM notices.", [fep, guidelines]), status: "pending_review" },
    { question: "What protections and complaint route apply?", answer: editorial("Check the exact company’s client-money, loss and complaint terms; compensation does not insure trading losses."), status: "unknown" },
  ],
  sections: [
    { id: "costs-and-accounts", eyebrow: "Eligibility first, cost second", title: "Compare account costs only after eligibility is clear", paragraphs: [
      editorial("No Malaysian account prices are established here. Once permission and the serving company are clear, compare the same instrument, trade size and holding period."),
    ], table: { caption: "The cost checklist", headers: ["Cost", "What to establish"], rows: [
      ["Spread", "Instrument-specific average and measurement period; a floor is not an average."],
      ["Commission", "Account currency, lot/notional basis and both trade sides."],
      ["Overnight", "Swaps or replacement holding charges and grace periods."],
      ["Conversion", "MYR/account-currency rate, markup and provider charges."],
      ["Payments", "Method minimums, intermediary charges and withdrawal fees."],
    ] } },
    { id: "platforms-and-accounts", eyebrow: "Software is a separate check", title: "Platforms and account features do not establish permission", paragraphs: [],
      table: { caption: "What a feature can—and cannot—show", headers: ["Feature", "Useful for", "Still needs confirmation"], rows: [
        ["MT4 / MT5", "Understanding software compatibility", "Serving company and resident eligibility"],
        ["Demo", "Learning simulated order handling", "Demo terms and live-account eligibility"],
        ["Swap-free", "Examining overnight-charge conditions", "Product permission and all other fees"],
      ] } },
    { id: "funding", eyebrow: "The payment is its own question", title: "MYR funding, payments and withdrawals", paragraphs: [
      checked("SC’s FAQ says BNM approval may be relevant to a CFD provider depending on the investor type and denomination. Refer to the applicable foreign-exchange notices; a general foreign-investment allowance is not retail CFD permission.", [faq, fep]),
      editorial("No Malaysian payment method is verified for these brokers. An app’s payment logo or an overseas transfer facility does not establish permission for the proposed transaction."),
    ], table: { caption: "Before a proposed payment", headers: ["Check", "Ask about"], rows: [
      ["Resident circumstances", "Applicable resident category, borrowing and funding-source rules"],
      ["Bank / card", "Permitted purpose, beneficiary, documents and charges"],
      ["Wallet / crypto", "Provider terms and local rules; no presumed workaround"],
      ["Withdrawal", "Own-name/KYC conditions, conversion and processing terms"],
    ] } },
    { id: "local-rules", eyebrow: "Use the current SC documents", title: "What Malaysia’s CFD framework actually says", paragraphs: [
      checked("The SC’s current CFD page links guidelines revised on 14 June 2024 and FAQs revised on 14 October 2024. Paragraph 4.02 states: “CFD can only be offered exclusively to sophisticated investors.” Eligibility is determined under the SC’s categories, not an assumed deposit size.", [guidelines, faq, "my-sc-cfd-index"]),
      checked("The June guidelines allow qualifying shares, REIT/ETF units, listed commodity derivatives and indices, subject to their criteria. Currency pairs are not listed in paragraph 3.01. This is not a statement that every currency exchange or investment abroad is prohibited.", [guidelines]),
      checked("A CFD provider needs the relevant SC derivatives licence. A Labuan or foreign group licence should not be presented as proof of Malaysian retail CFD permission.", [guidelines]),
    ] },
    { id: "checking-claims", eyebrow: "Pause before committing funds", title: "Warning signs in broker claims", paragraphs: [], points: [
      "Guaranteed profits, pressure to deposit or unclear withdrawal conditions.",
      "A translated page or client-portal hostname presented as local authorisation.",
      "One group company’s licence or protection assigned to a different company.",
    ] },
  ],
  faqs: [
    { question: "Can ordinary Malaysian retail investors trade CFDs under the SC framework?", answer: checked("SC paragraph 4.02 restricts CFD offers to sophisticated investors. The framework does not establish an ordinary retail forex/CFD route through the four brokers listed here.", [guidelines, faq]) },
    { question: "Which forex brokers accept Malaysian residents?", answer: editorial("The supplied research does not establish explicit retail acceptance and the serving company for Exness, XM, IC Markets or Pepperstone. A foreign licence, portal or translated page is insufficient.") },
    { question: "Does a Labuan licence or an available payment method establish permission?", answer: editorial("No such conclusion follows here. Verify the exact licence, product, investor category and funding rules separately before acting.", [guidelines, fep]) },
  ],
};
