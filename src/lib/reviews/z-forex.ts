import type { BrokerReview } from "./types";
import { prepareResearchedRecord } from "./researched-record";

export function applyZForexResearch(review: BrokerReview) {
  if (review.broker.slug !== "z-forex" || review.jurisdiction !== "Global") return;
  review.broker.website = "https://zforex.com/";
  const { common, set } = prepareResearchedRecord(review, "Z Forex Capital Market LLC; advertised terms and disputed licensing context", "2026-11-14", [
    { id: "zf-authority", title: "Comoros central-bank warning about MISA and offshore licensing", url: "https://finances.gouv.km/actualite_post/communique-de-la-banque-centrale-des-comores-sur-lexercice-illegal-dactivites-bancaires-offshores/", publisher: "Comoros Ministry of Finance / Central Bank" },
    { id: "zf-reg", title: "ZForex’s own MISA licence claim", url: "https://zforex.com/about-us/regulation-and-license/" },
    { id: "zf-accounts", title: "Standard, ECN and Swap-Free published specifications", url: "https://zforex.com/account-types/" },
    { id: "zf-payments", title: "Published payment policy and its limitations", url: "https://zforex.com/payment-policy/" },
  ]);
  set("minimum-deposit", "Advertised: Standard/ECN US$10; Swap-Free US$2,500.", ["zf-accounts"]);
  set("forex-commission-per-lot", "ECN/Swap-Free: advertised US$3.50 FX per side; US$7 round trip.", ["zf-accounts"]);
  set("standard-spread", "Standard advertises 1.2 pips with US$0 separate commission.", ["zf-accounts"]);
  set("forex-spread-and-commission", "Standard advertises 1.2 pips without separate commission; ECN starts from 0.0 plus US$3.50 forex commission per side (US$7 round trip). Swap-Free lists 0.7 pips with the same FX commission; metals list US$5/side. These promotional figures are not independently measured spreads or fills.", ["zf-accounts"]);
  set("overnight-financing", "The account table marks Standard and ECN as not swap-free. Swap-Free is a separate account with a US$2,500 advertised minimum and its own charges. Confirm instrument-specific financing and any administration terms; the account label is not a complete fee schedule.", ["zf-accounts"]);
  set("regulation-and-entity", "ZForex advertises MISA brokerage licence T2023321. The Comoros central bank’s general notice identifies MISA among bodies claiming licensing authority it rejects. This challenges reliance on that permission; the notice is not a court ruling about ZForex and does not name every broker using MISA.", ["zf-reg", "zf-authority"]);
  set("contracting-legal-entity", "The brand identifies Z Forex Capital Market LLC. A company registration, LEI or downloadable licence image does not independently establish authorization for your country, investor compensation or effective dispute resolution.", ["zf-reg", "zf-authority"]);
  set("regulation-summary", "MISA licence claimed; Comoros central-bank recognition is disputed.", ["zf-reg", "zf-authority"]);
  set("client-money-arrangements", "No independently confirmed compensation or client-money protection is established by the reviewed licence claim. Verify the competent authority and enforceable account agreement before considering funds at risk.", ["zf-reg", "zf-authority"]);
  set("deposit-methods-and-charges", "The payment policy mentions digital-currency transfers and bank-transfer arrangements. It does not establish a complete independently checked method/currency/fee matrix. A crypto transfer is not proof of regulatory compliance or a reversible payment.", ["zf-payments"]);
  set("withdrawal-methods-and-charges", "No live withdrawal test was conducted. The page’s promotional same-day wording does not establish guaranteed bank/wallet arrival, a current method-specific fee or successful recovery of a disputed balance. Read the full agreement before relying on it.", ["zf-payments"]);
  set("identity-and-address-requirements", "Resolve the licensing concern before considering registration or payment. Do not infer client protection from a low entry amount, a working platform or a successful small withdrawal.", ["zf-reg", "zf-authority", "zf-accounts"]);
  set("demo-account", "A demo route is advertised; it does not test withdrawals or legal protections.", ["zf-accounts"]);
  set("supported-mobile-platforms", "MetaTrader 5 is listed; confirm current device/account compatibility.", ["zf-accounts"]);
  set("platform-and-availability", "The reviewed site lists MetaTrader 5, analysis and copy/managed-account routes. Platform functionality and automated trading do not establish broker authorization. We did not test execution, copying, support or a live account.", ["zf-accounts"]);
  set("platform-summary", "MT5 documented; platform access is not regulatory approval.", ["zf-accounts"]);
  set("cfds-and-underlying-markets", "The site advertises forex, share, index, commodity and metal products. A CFD is price exposure rather than underlying ownership; the instrument menu does not resolve the regulatory-recognition issue.", ["zf-accounts", "zf-reg"]);
  set("leverage-by-product-and-region", "Advertised maximums: Standard/ECN 1:1000; Swap-Free 1:200. Limits are conditional and high leverage magnifies losses.", ["zf-accounts"]);
  const base = { ...common, category: "Broker-advertised; not a recommendation", sourceIds: ["zf-accounts"] };
  set("withdrawal-evidence", "No live test; advertised timing does not guarantee arrival.", ["zf-payments"]);
  review.accountComparisons = [
    { ...base, name: "Standard", spread: "Advertised 1.2 pips", commission: "US$0 separate FX commission", minimum: "US$10", roundTripCommission: "US$0 separate commission" },
    { ...base, name: "ECN", spread: "From 0.0 pips", commission: "FX US$3.50/side; metals US$5/side", minimum: "US$10", roundTripCommission: "FX US$7; metals US$10" },
    { ...base, name: "Swap-Free", spread: "Advertised 0.7 pips", commission: "FX US$3.50/side; metals US$5/side", minimum: "US$2,500", roundTripCommission: "FX US$7; metals US$10" },
  ];
  review.quickFactFields = [
    { label: "Advertised deposits", fieldId: "minimum-deposit", state: "text" },
    { label: "Standard pricing", fieldId: "standard-spread", state: "text" },
    { label: "Commission accounts", fieldId: "forex-commission-per-lot", state: "text" },
    { label: "Advertised leverage", fieldId: "leverage-by-product-and-region", state: "text" },
    { label: "Platform evidence", fieldId: "platform-summary", state: "text" },
    { label: "Demo route", fieldId: "demo-account", state: "text" },
    { label: "Licensing concern", fieldId: "regulation-summary", state: "text" },
    { label: "Customer protection", fieldId: "client-money-arrangements", state: "text" },
    { label: "Withdrawal evidence", fieldId: "withdrawal-evidence", state: "text" },
  ];
  review.regulatoryNotices = [{ title: "Do not treat MISA recognition as settled", summary: "ZForex claims a MISA licence. A general Comoros central-bank notice rejects MISA’s claimed authority. It is not a broker-specific fraud judgment, but it is material to assessing the advertised permission.", sourceIds: ["zf-reg", "zf-authority"] }];
  review.verdictEvidence = { ...common, sentences: ["We do not recommend ZForex on the evidence reviewed.", "Its MISA licence claim must be considered alongside the Comoros central bank’s rejection of that authority’s licensing role.", "Advertised US$10 accounts and high leverage do not establish effective regulation, compensation or reliable withdrawal performance."], sourceIds: ["zf-reg", "zf-authority", "zf-accounts"] };
  review.verdict = review.verdictEvidence.sentences.join(" ");
  review.strengths = [
    { title: "Published account specifications", explanation: "The broker distinguishes Standard, ECN and Swap-Free terms.", sourceIds: ["zf-accounts"] },
    { title: "Low advertised entry amount", explanation: "Standard/ECN list US$10; this is not a safety assessment.", sourceIds: ["zf-accounts"] },
    { title: "MT5 access advertised", explanation: "A familiar platform does not validate the provider’s licence.", sourceIds: ["zf-accounts"] },
  ];
  review.limitations = [
    { title: "Disputed licensing recognition", explanation: "The Comoros central-bank notice challenges MISA’s authority.", sourceIds: ["zf-authority"] },
    { title: "Protection not established", explanation: "The licence claim does not verify compensation or enforceable safeguards.", sourceIds: ["zf-reg", "zf-authority"] },
    { title: "Very high leverage", explanation: "The advertised 1:1000 maximum magnifies losses.", sourceIds: ["zf-accounts"] },
    { title: "Limited payment detail", explanation: "The reviewed policy is not a complete method/fee schedule.", sourceIds: ["zf-payments"] },
    { title: "No withdrawal performance test", explanation: "Promotional timing is not independent evidence of arrival.", sourceIds: ["zf-payments"] },
  ];
  review.entities = [{ name: "Z Forex Capital Market LLC", country: "Offshore entity identified by broker", regulator: "MISA claim; recognition disputed", licence: "T2023321 (claimed)", sourceId: "zf-reg", note: "Read the linked Comoros central-bank notice; this is not an independently validated brokerage authorization." }];
  review.faqs[1] = { question: "Is ZForex regulated?", answer: "ZForex claims MISA licence T2023321. A general Comoros central-bank notice rejects MISA’s claimed licensing authority. Do not treat the broker’s licence image as independently validated protection. The notice is not a broker-specific court finding of fraud.", sourceIds: ["zf-reg", "zf-authority"] };
  review.faqs[5] = { question: "What deposit and commission does ZForex advertise?", answer: "Standard/ECN advertise US$10; Swap-Free US$2,500. The current table lists ECN/Swap-Free forex commission at US$3.50 per side, or US$7 round trip; metals US$5 per side. These broker claims do not resolve the licensing concern or establish actual execution costs.", sourceIds: ["zf-accounts", "zf-authority"] };
  review.faqs[6] = { question: "Can ZForex withdrawals be relied on?", answer: "We have not tested a live withdrawal or verified a complete current fee/method schedule. Promotional same-day wording is not a guarantee of receipt. We do not recommend depositing on the reviewed regulatory evidence; preserve transaction records if you already have a dispute.", sourceIds: ["zf-payments", "zf-authority"] };
  review.customerReviews = { publisher: "Trustpilot", url: "https://www.trustpilot.com/review/zforex.com", rating: null, reviewCount: null, checkedAt: null, researchNote: "No current rating, restriction status or individual complaint was independently confirmed. Customer allegations are not presented as proven facts." };
  review.accountOpening = { ...common, url: null, status: "not-configured", sourceIds: [], isAffiliate: false };
  review.accountOpeningBlockReason = "Licensing recognition is disputed: no account-opening link is offered.";
}
