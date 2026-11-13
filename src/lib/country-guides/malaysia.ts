import data from "@/data/country-guides/malaysia-five-brokers-dossier-2026-11-13.json";
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
    ...[
      ["my-ic-accounts", "IC Markets Global account specifications", "IC Markets", "https://www.icmarkets.com/global/en/trading-accounts/overview", "2026-11-10"],
      ["my-xm-accounts", "XM Global account specifications", "XM", "https://www.xm.com/account-types", "2026-11-10"],
      ["my-oanda-accounts", "OANDA Global Markets account comparison", "OANDA", "https://www.oanda.com/bvi-en/cfds/account-comparison/", date],
      ["my-oanda-charges", "OANDA Global Markets charges", "OANDA", "https://www.oanda.com/bvi-en/cfds/our-charges/", date],
      ["my-fbs-home", "FBS advertised deposit and platform range", "FBS", "https://fbs.com/", date],
      ["my-fbs-conditions", "FBS trading conditions", "FBS", "https://fbs.com/trading/conditions", date],
      ["my-tickmill-accounts", "Tickmill account comparison", "Tickmill", "https://www.tickmill.com/trading/accounts-overview", date],
    ].map(([id, title, publisher, url, checkedAt]): GuideSource => ({ ...checkedSource(id, title, publisher, url), kind: "broker", checkedAt, note: "International broker-advertised specifications. Source check does not establish the Malaysian serving entity, local authorization or lawful funding." })),
  ];
  for (const source of sources) {
    if (!registry.sources.some(existing => existing.id === source.id)) registry.sources.push(source);
  }
}

export const malaysiaGuide: CountryGuide = {
  name: "Malaysia", slug: "malaysia", locale: "en-MY",
  currency: { ...editorial("", [fep]), value: null, note: "No live MYR conversion quote or broker base-currency entitlement is displayed." },
  title: "Forex Brokers in Malaysia: Fees, Platforms & Key Checks",
  seoTitle: editorial("Forex Brokers in Malaysia: Fees & Rules"),
  description: "Compare forex brokers in Malaysia: IC Markets, OANDA, XM, FBS and Tickmill. Review published offshore fees, platforms, minimums and local permission checks.",
  audience: "Malaysian residents researching leveraged forex/CFD accounts, with ordinary retail and sophisticated-investor categories kept separate.",
  intro: editorial("Compare five forex brokers in Malaysia: IC Markets, OANDA, XM, FBS and Tickmill. Review their published international costs, platforms and deposit requirements. Confirm the proposed company, your investor category and local rules before treating an advertised account as a Malaysian option."),
  directAnswer: "Compare IC Markets and Tickmill for raw pricing, XM and FBS for lower advertised deposits, and OANDA for platform choice. These are offshore terms. The SC’s domestic CFD framework is limited to sophisticated investors; confirm eligibility and lawful funding before acting.",
  legalStatus: "pending_review", publicationStatus: "draft", commercialLinksAllowed: false,
  legalReviewedAt: null, legalReviewReference: null, humanApprovalReference: null,
  publishedAt: null, updatedAt: null, authorReference: "david-odoi", reviewerReference: null,
  legalSummary: checked("SC paragraph 4.02 limits CFD offers to sophisticated investors. Offshore retail eligibility and lawful funding are separate questions; neither is established by this source check.", [guidelines, faq]),
  legalSources: [guidelines, faq, fep],
  brokerEntityMappings: [], comparison: { mode: "none", purpose: null, approvalReference: null },
  suppliedResearch: malaysiaDossier,
  sourceIds: [guidelines, faq, register, fep, "my-ic-accounts", "my-xm-accounts", "my-oanda-accounts", "my-oanda-charges", "my-fbs-home", "my-fbs-conditions", "my-tickmill-accounts"],
  researchPresentation: {
    scope, dossierId: malaysiaDossier.id,
    description: "Compare international terms. Confirm the company serving you and local permission; foreign disclosures are not SC retail authorisation.",
    caption: "Broker-advertised international terms · source snapshots 10–13 November 2026",
    headers: ["Broker", "Offshore company / scope", "Platforms", "Advertised FX pricing", "Deposit requirements", "Overnight / swap-free", "Before funding", "Research focus"],
    columnWidths: [16, 13, 12, 16, 13, 11, 9, 10],
    rows: [
      { slug: "ic-markets", officialUrl: "https://www.icmarkets.com/global/en/", cells: [
        { text: "Raw Trading Ltd · Seychelles; confirm allocation", sourceId: "my-ic-accounts" },
        { text: "MT4, MT5, cTrader, TradingView", sourceId: "my-ic-accounts" },
        { text: "Standard from 0.8 pips, $0 FX commission; Raw MT from 0.0 + $3.50/lot/side", sourceId: "my-ic-accounts" },
        { text: "No account minimum advertised; method limits apply", sourceId: "my-ic-accounts" },
        { text: "Swap-free holding fees can apply", href: "https://www.icmarkets.com/global/en/trading-accounts/swap-free-account" },
        { text: "Check MY eligibility" },
        { text: "Standard vs Raw" },
      ] },
      { slug: "oanda", officialUrl: "https://www.oanda.com/bvi-en/", cells: [
        { text: "OANDA Global Markets Ltd · BVI", sourceId: "my-oanda-accounts" },
        { text: "OANDA Mobile, MT5, TradingView", sourceId: "my-oanda-accounts" },
        { text: "Standard spread-only pricing; $0 commission", sourceId: "my-oanda-accounts" },
        { text: "Confirm the current payment-method minimum", sourceId: "my-oanda-accounts" },
        { text: "Financing applies; confirm any swap-free terms", sourceId: "my-oanda-charges" },
        { text: "Check MY eligibility" },
        { text: "Platform and tier choice" },
      ] },
      { slug: "xm", officialUrl: "https://www.xm.com/", cells: [
        { text: "XM Global Limited · Belize; confirm allocation", sourceId: "my-xm-accounts" },
        { text: "MT4, MT5, XM App", sourceId: "my-xm-accounts" },
        { text: "EUR/USD: Standard from 1.6 pips; Ultra Low 0.8; $0 separate commission", sourceId: "my-xm-accounts" },
        { text: "$5 Standard/Ultra Low; $10,000 Shares", sourceId: "my-xm-accounts" },
        { text: "Selected instruments and eligibility conditions", href: "https://www.xm.com/help-center/trading-accounts" },
        { text: "Check MY eligibility" },
        { text: "Lower entry minimum" },
      ] },
      { slug: "fbs", officialUrl: "https://fbs.com/", cells: [
        { text: "FBS Markets Inc. reported; confirm the contract", href: "https://fbs.com/legal-documents" },
        { text: "MT4, MT5, FBS app", sourceId: "my-fbs-home" },
        { text: "From 0.7 pips; no trading commission advertised", sourceId: "my-fbs-conditions" },
        { text: "Deposits advertised from $5; method terms apply", sourceId: "my-fbs-home" },
        { text: "Swap-free option advertised; check conditions", sourceId: "my-fbs-conditions" },
        { text: "Check MY eligibility" },
        { text: "Entry deposit and app" },
      ] },
      { slug: "tickmill", officialUrl: "https://www.tickmill.com/", cells: [
        { text: "Tickmill group disclosure; Seychelles allocation needs confirmation", sourceId: "my-tickmill-accounts" },
        { text: "MT4, MT5, TradingView, Tickmill Trader", sourceId: "my-tickmill-accounts" },
        { text: "Classic from 1.6 pips, $0 commission; Raw from 0.0 + $3/lot/side", sourceId: "my-tickmill-accounts" },
        { text: "$100 starting deposit", sourceId: "my-tickmill-accounts" },
        { text: "Islamic account advertised; conditions apply", sourceId: "my-tickmill-accounts" },
        { text: "Check MY eligibility" },
        { text: "Raw fees" },
      ] },
    ],
    footnote: "“From” means a floor, not a measured average. $3.50/lot/side is $7 round trip before spread and other charges. Account-opening and payment minimums differ. Published offshore terms do not establish a Malaysian offer.",
    websiteNote: "Official-site buttons are unpaid links. Confirm your contracting company, investor category and local trading/funding requirements before registering or depositing. Leverage magnifies losses.",
    traderFit: { title: "Choose the features that match your needs", table: {
      caption: "Research starting points, subject to eligibility", headers: ["Priority", "Compare", "Key question"], rows: [
        ["Raw pricing", "IC Markets / Tickmill", "What is the total spread plus both commission sides?"],
        ["Lower entry deposit", "XM / FBS", "Does the selected payment method have a higher minimum?"],
        ["Charting choice", "IC Markets / OANDA", "Does your account support the desired platform?"],
        ["Swap-free", "XM / FBS / IC Markets", "Which instruments, holding fees and conditions apply?"],
        ["New to trading", "Compare demo and learning terms", "Understand margin risk before considering a live account."],
      ],
    } },
  },
  questions: [
    { question: "Will a broker accept a registration?", answer: editorial("The dossier reports technical acceptance; exact current country/entity evidence still needs confirmation."), status: "unknown" },
    { question: "Which company would serve the resident?", answer: editorial("Identify the company named in the proposed client agreement."), status: "unknown" },
    { question: "Is that company authorised for the product?", answer: checked("SC CFD providers require the relevant derivatives licence; a group or foreign licence is insufficient evidence.", [guidelines]), status: "unknown" },
    { question: "Are trading and funding permitted for this resident?", answer: editorial("Obtain advice covering the resident category, product and applicable BNM notices.", [fep, guidelines]), status: "pending_review" },
    { question: "What protections and complaint route apply?", answer: editorial("Check company-specific client-money, loss and complaint terms. Compensation does not insure trading losses."), status: "unknown" },
  ],
  sections: [
    { id: "costs-and-accounts", eyebrow: "Eligibility first, cost second", title: "Compare account costs only after eligibility is clear", paragraphs: [
      editorial("The table uses international published terms. Compare the same instrument, trade size and holding period; the cheapest advertised floor may not mean the lowest total cost."),
    ], table: { caption: "The cost checklist", headers: ["Cost", "What to establish"], rows: [
      ["Spread", "Instrument-specific average and measurement period; a floor is not an average."],
      ["Commission", "Account currency, lot/notional basis and both trade sides."],
      ["Overnight", "Swaps or replacement holding charges and grace periods."],
      ["Conversion", "MYR/account-currency rate, markup and provider charges."],
      ["Payments", "Method minimums, intermediary charges and withdrawal fees."],
    ] } },
    { id: "platforms-and-accounts", eyebrow: "Compare both sides", title: "Broker strengths and trade-offs", paragraphs: [],
      table: { caption: "Published features, not tested performance awards", headers: ["Broker", "Useful feature", "Trade-off to check"], rows: [
        ["IC Markets", "Standard and Raw pricing", "Raw commission and swap-free holding fees"],
        ["OANDA", "App, MT5 and TradingView", "Tier conditions, financing and withdrawal charges"],
        ["XM", "$5 advertised entry minimum", "Account-specific instruments and overnight terms"],
        ["FBS", "Low advertised deposit and app", "The exact contract and swap-free conditions"],
        ["Tickmill", "Raw commission from $3/lot/side", "TradingView Raw uses $3.50/lot/side"],
      ] } },
    { id: "funding", eyebrow: "The payment is its own question", title: "MYR funding, payments and withdrawals", paragraphs: [
      checked("SC’s FAQ says BNM approval may depend on investor type and denomination. General foreign-investment allowances do not establish retail CFD permission.", [faq, fep]),
      editorial("Malaysian payment availability and lawful funding remain unconfirmed. An app’s payment logo is not permission."),
    ], table: { caption: "Before a proposed payment", headers: ["Check", "Ask about"], rows: [
      ["Resident circumstances", "Applicable resident category, borrowing and funding-source rules"],
      ["Bank / card", "Permitted purpose, beneficiary, documents and charges"],
      ["Wallet / crypto", "Provider terms and local rules; no presumed workaround"],
      ["Withdrawal", "Own-name/KYC conditions, conversion and processing terms"],
    ] } },
    { id: "local-rules", eyebrow: "Use the current SC documents", title: "What Malaysia’s CFD framework actually says", paragraphs: [
      checked("Use SC guidelines revised 14 June 2024 and FAQs revised 14 October 2024. Paragraph 4.02 restricts CFD offers to sophisticated investors, as defined by SC categories.", [guidelines, faq]),
      checked("Paragraph 3.01 covers qualifying shares, REIT/ETF units, listed commodity derivatives and indices, not currency pairs. This is not a statement that every currency exchange or overseas investment is prohibited.", [guidelines]),
      checked("Relevant SC derivatives licensing is required. A foreign or Labuan licence does not establish Malaysian retail CFD permission.", [guidelines]),
    ] },
    { id: "checking-claims", eyebrow: "Pause before committing funds", title: "Warning signs in broker claims", paragraphs: [], points: [
      "Guaranteed profits, pressure to deposit or unclear withdrawal conditions.",
      "A translated page or client-portal hostname presented as local authorisation.",
      "One group company’s licence or protection assigned to a different company.",
    ] },
  ],
  faqs: [
    { question: "Can ordinary Malaysian retail investors trade CFDs under the SC framework?", answer: checked("SC paragraph 4.02 restricts CFD offers to sophisticated investors. The framework does not establish an ordinary retail forex/CFD route through the five brokers listed here.", [guidelines, faq]) },
    { question: "Which forex brokers are compared for Malaysia?", answer: editorial("IC Markets, OANDA, XM, FBS and Tickmill. The dossier reports offshore access; confirm the company, current eligibility and local trading/funding rules before acting.") },
    { question: "Does a Labuan licence or an available payment method establish permission?", answer: editorial("No such conclusion follows here. Verify the exact licence, product, investor category and funding rules separately before acting.", [guidelines, fep]) },
  ],
};
