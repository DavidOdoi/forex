import { createReviewTemplate } from "./template";
import type { BrokerReview, ReviewField } from "./types";

// Checked against the actual CMA register and the explicit Kenyan pages on this
// date. These are source-based drafts, not trading tests or publication approval.
const checkedAt = "2026-11-03";
const register = "https://licensees.cma.or.ke/licenses/5/";
export const kenyaEntities: Record<string, { entity: string; licence: string }> = {
  fxpesa: { entity: "EGM Securities Limited", licence: "107" },
  "scope-markets": { entity: "SCFM Limited", licence: "123" },
  pepperstone: { entity: "Pepperstone Markets Kenya Limited", licence: "128" },
  "hf-markets": { entity: "HFM Investments Limited", licence: "155" },
  "windsor-brokers": { entity: "Windsor Markets Kenya Limited", licence: "156" },
  exness: { entity: "Exness (KE) Limited", licence: "162" },
  "ingot-brokers": { entity: "Ingot Ke Limited", licence: "173" },
  admirals: { entity: "Admirals KE Limited", licence: "178" },
  "fp-markets": { entity: "FP Markets Limited", licence: "193" },
  "ic-markets": { entity: "IC Markets (KE) Limited", licence: "199" },
  "anzo-capital": { entity: "ANZO CAPITAL LIMITED", licence: "219" },
  xm: { entity: "TPXMGLOBAL Kenya Limited", licence: "233" },
  avatrade: { entity: "Ava Trade Kenya Limited", licence: "262" },
};

export function reviewedFields(review: BrokerReview): ReviewField[] {
  return [...review.keyData, ...review.benchmarks, ...review.chapters.flatMap(c => c.panels.flatMap(p => p.fields))];
}

export function curatedReview(name: string, slug: string): BrokerReview {
  const review = createReviewTemplate(name, slug);
  review.status = "draft";
  const entity = kenyaEntities[slug];
  if (!entity) return review;
  review.jurisdiction = "Kenya";
  const source = (id: string, title: string, url: string, publisher = name) => {
    review.sources.push({ id, title, url, publisher, checkedAt, legalEntity: entity.entity, jurisdiction: "Kenya" });
  };
  const set = (id: string, value: string, sourceIds: string[], chapterId?: string) => {
    const fields = chapterId
      ? review.chapters.find(c => c.id === chapterId)!.panels.flatMap(p => p.fields)
      : reviewedFields(review);
    for (const field of fields.filter(f => f.id === id)) {
      Object.assign(field, { value, status: "verified", sourceIds: [...sourceIds], legalEntity: entity.entity, jurisdiction: "Kenya", checkedAt });
    }
  };
  const intro = (id: string, text: string) => { review.chapters.find(c => c.id === id)!.introduction = text; };
  const faq = (index: number, answer: string, sourceIds: string[]) => { Object.assign(review.faqs[index], { answer, sourceIds }); };

  source("cma", "CMA Kenya — non-dealing online foreign exchange broker register", register, "Capital Markets Authority, Kenya");
  set("regulation-and-entity", `${entity.entity} is listed in the Kenyan CMA register under licence ${entity.licence}. This confirms the listed local entity; it does not establish terms for other group companies.`, ["cma"]);
  set("regulator-and-register-entry", "Capital Markets Authority of Kenya; listed in the non-dealing online foreign exchange broker register.", ["cma"]);
  set("licence-number", entity.licence, ["cma"]);
  intro("safety", `The CMA register lists ${entity.entity} under licence ${entity.licence}. A register entry establishes the named entity’s authorisation, not a guarantee against trading losses. Account eligibility and protections must be checked separately.`);
  review.verdict = `The Kenyan CMA register lists ${entity.entity}, associated with ${name}, under licence ${entity.licence}. This is a partial review focused on the local regulatory entry. Regional fees, customer agreements and platform conditions still require further checks before a complete assessment can be published.`;
  review.strengths.push({ title: "Traceable Kenyan regulator entry", explanation: `The official CMA register identifies ${entity.entity} and licence ${entity.licence}.`, sourceIds: ["cma"] });
  faq(5, "The CMA register confirms the named Kenyan licence holder. This check does not establish a compensation entitlement, negative balance protection or the protections of an overseas group entity.", ["cma"]);

  if (slug === "fxpesa") {
    review.broker.website = "https://www.fxpesa.com/ke-en/";
    source("accounts", "FXPesa Kenya — Standard and Premier account comparison", "https://www.fxpesa.com/ke-en/accounts/");
    source("payments", "FXPesa Kenya — deposits and withdrawals", "https://www.fxpesa.com/ke-en/deposits-withdrawals/");
    source("legal", "FXPesa Kenya — legal documentation and company disclosure", "https://www.fxpesa.com/ke-en/legal/");
    source("demo", "FXPesa Kenya — demo account conditions", "https://www.fxpesa.com/ke-en/accounts/demo-account/");
    source("mt4", "FXPesa Kenya — MetaTrader 4 and MQ WebTrader", "https://www.fxpesa.com/ke-en/platforms/metatrader-4/");
    source("mt5", "FXPesa Kenya — MetaTrader 5 and MQ WebTrader", "https://www.fxpesa.com/ke-en/platforms/metatrader-5/");
    source("app", "FXPesa Kenya — Equiti Trader mobile app", "https://www.fxpesa.com/ke-en/platforms/equiti-trader-app/");
    source("financing", "FXPesa Kenya — published financing and rollover calculations", "https://www.fxpesa.com/ke-en/financing-fees/");
    source("etfs", "FXPesa Kenya — ETF CFD specifications", "https://www.fxpesa.com/ke-en/products/etfs/");
    review.verdict = "FXPesa’s Kenyan offering combines KES and USD accounts, local mobile-money payments and a choice of MetaTrader or Equiti Trader. Its Standard account has no published minimum deposit; Premier starts at US$100 and adds a US$3.50 per-lot, per-side commission to its advertised spreads. The local operator, EGM Securities Limited, appears in the CMA register under licence 107. Payment costs vary by method, and trading shares or ETFs here means CFDs rather than owning the underlying investments. This source-based draft has not been independently fact checked or tested with a funded account.";
    set("minimum-deposit", "Standard: no minimum deposit stated. Premier: deposits from US$100. Payment-provider limits can still apply.", ["accounts"]);
    set("minimum-deposit-by-account", "Standard: no minimum deposit. Premier: US$100 advertised minimum.", ["accounts"]);
    set("account-currencies", "USD and KES, as listed for both live account types.", ["accounts"]);
    set("account-base-currencies", "USD and KES.", ["accounts"]);
    const costs = "Standard: published average spread 1.4 pips and US$0 commission. Premier: advertised spreads from 0.0 pips plus US$3.50 per lot, per side. These are the provider’s account-level figures, not measured EUR/USD costs; product-specific terms apply.";
    set("forex-trading-costs", costs, ["accounts"]);
    set("forex-spread-and-commission", costs, ["accounts"]);
    set("forex-commission-per-lot", "Premier: US$3.50 per lot per side, or US$7 for opening and closing one lot. Standard advertises US$0 commission, subject to product terms.", ["accounts"]);
    set("overnight-financing", "The provider publishes instrument-specific overnight financing calculations. Positions held at 23:59 server time may incur rollover; multi-day charges depend on settlement and holidays. Consult current product rates rather than assuming swap-free trading.", ["financing"]);
    const withdrawals = "Published broker charges: Kenyan mobile money US$0; Skrill/Neteller 1%, capped at US$30; domestic bank wire US$0; international bank wire US$15. Card rows show US$0. External provider and conversion costs may apply.";
    set("withdrawal-fee", withdrawals, ["payments"]);
    set("withdrawal-methods-and-charges", withdrawals, ["payments"]);
    set("deposit-and-account-charges", "The broker lists no sign-up charge and US$0 deposit fees for the payment methods shown. A bank or other payment provider may charge separately.", ["accounts", "payments"]);
    set("currency-conversion-fee", "The funding page warns that a payment provider may apply its own exchange rate when payment currency differs. It does not establish a single universal conversion charge.", ["payments"]);
    set("contracting-legal-entity", "The Kenyan website identifies its operator as EGM Securities Limited, the owner of the FXPesa trademark. Confirm that name in your final customer agreement before funding; the linked agreement could not be retrieved in this check.", ["legal"]);
    set("company-background-and-ownership", "The website identifies EGM Securities Limited as a Kenyan company, registration PVT-AAAAFF7, and owner of the FXPesa trademark. Registered address: The RiverFront, 2nd Floor, Prof David Wasawo Drive, Westlands.", ["legal"]);
    set("client-money-arrangements", "FXPesa states on its Kenyan funding page that client funds are kept in separate trust accounts. This is a provider disclosure; no bank statement or account-level audit was examined.", ["payments"]);
    set("eligible-countries-and-client-category", "This review covers the Kenyan offering. The website excludes residents of the United States, Belgium, Canada and Singapore, and jurisdictions where use would be unlawful. This exclusion list does not prove eligibility everywhere else.", ["legal"]);
    set("country-availability", "Kenyan offering reviewed. The website excludes US, Belgian, Canadian and Singaporean residents; other locations require their own eligibility checks.", ["legal"]);
    set("deposit-methods-and-charges", "Published options include Kenyan M-Pesa, EAZZYPAY and Airtel Money in KES, cards, bank wires, Skrill and Neteller. The listed broker deposit fee is US$0; provider charges and eligibility may differ.", ["payments"]);
    set("published-processing-times", "Kenyan mobile money is advertised as instant, with a warning that first withdrawals may take longer and some providers need up to 3 hours. E-wallet withdrawals: 1–2 working days. Cards can take up to 15 working days to arrive. These are published estimates, not tested timings.", ["payments"]);
    set("withdrawal-requirements", "Withdrawals return to the original deposit source. Where both cards and bank transfers funded an account, card sources receive priority. Contact support if the original card is unavailable.", ["payments"]);
    set("currency-conversion-conditions", "A payment provider may apply its own exchange rate if the payment currency differs from the original currency. Account currency cannot be changed after creation; the account page permits up to three accounts under one portal.", ["payments", "accounts"]);
    set("retail-and-professional-accounts", "The Kenyan website advertises Standard and Premier live accounts. These product names should not be treated as regulatory professional-client classifications.", ["accounts"]);
    set("demo-account", "A free demo is available without a deposit. The dedicated demo page lists US$10,000 virtual funds and expiry after 90 days of inactivity. Another account-page FAQ mentions up to US$50,000, so the exact initial balance should be confirmed during sign-up.", ["demo", "accounts"]);
    set("identity-and-address-requirements", "The provider requests personal/contact details, trading experience and valid identity/address evidence. Account approval includes appropriateness checks.", ["demo", "accounts"]);
    set("published-onboarding-steps", "Submit personal/contact details and verification evidence; complete the provider’s checks; receive portal access; choose a funding method. No account-opening or verification time was independently measured.", ["accounts", "demo"]);
    set("supported-mobile-platforms", "MetaTrader 4, MetaTrader 5 and Equiti Trader are advertised. The Equiti Trader page lists iOS 12+ and Android 7.1+; confirm current app-store requirements before installing.", ["accounts", "app"]);
    set("search-and-watchlists", "Equiti Trader documents asset-class grouping and interactive TradingView charts. A particular search or watchlist workflow was not tested.", ["app"], "mobile-app");
    set("alerts-and-notifications", "The Equiti Trader documentation lists notifications, an activity log and an economic calendar. Delivery speed and reliability were not tested.", ["app"], "mobile-app");
    set("platform-and-availability", "MQ WebTrader is advertised for MT4/MT5 in a browser without installing the desktop application. The account page lists it for Standard and Premier accounts.", ["accounts", "mt4", "mt5"]);
    set("search-and-navigation", "MT4/MT5 documentation lists Market Watch and charting tools. Browser navigation and accessibility have not been assessed hands-on.", ["mt4", "mt5"], "web-platform");
    set("order-types-and-controls", "MT5 documentation describes market, pending and stop orders, trailing functionality, and hedging/netting. Confirm each feature in your chosen platform; orders and execution were not tested.", ["mt5"]);
    set("portfolio-and-fee-reports", "MT4/MT5 pages list data and table reports. The completeness of trade, portfolio or fee reporting has not been checked in a live account.", ["mt4", "mt5"]);
    set("alerts-and-notifications", "MT4/MT5 pages advertise news and notifications. No notification-delivery test was performed.", ["mt4", "mt5"], "web-platform");
    set("cfds-and-underlying-markets", "The regional pages advertise leveraged exposure to forex, indices, commodities, shares and ETFs. The MT5 page also lists futures CFDs; availability depends on platform and instrument.", ["accounts", "mt5"]);
    set("real-stocks-and-etfs", "The reviewed offering describes shares and ETFs as CFDs; it does not establish ownership of the underlying shares or ETF units. The financing page states that no physical delivery takes place.", ["mt5", "financing"]);
    set("leverage-by-product-and-region", "The Kenyan live-account comparison advertises leverage up to 1:400. The ETF page lists leverage up to 1:20 for ETF CFDs. These are product-dependent limits, not a single leverage setting for every trade.", ["accounts", "etfs"]);
    set("product-restrictions", "The ETF specifications label listed ETF CFDs as MT5 only. Check the exact instrument and platform before opening an account.", ["etfs"]);
    intro("fees", "The two advertised live accounts use different cost structures. Standard incorporates its quoted trading cost in the spread, while Premier adds a per-side commission to raw-style spreads. Overnight financing and payment-method costs need separate attention. The published figures below are not spread measurements from a live account.");
    intro("deposit-and-withdrawal", "Kenyan mobile-money support is a practical feature of the documented offering, especially for KES funding. E-wallets, cards and bank wires have different fees and settlement estimates. A US$0 broker fee does not eliminate payment-provider or conversion costs.");
    intro("account-opening", "FXPesa publishes Standard and Premier live accounts and a separate practice account. The documented workflow includes identity/address evidence and appropriateness checks. We did not open an account, submit identity documents or test verification times.");
    intro("mobile-app", "The Kenyan platform pages list MetaTrader mobile access and the Equiti Trader app. The latter documents funding, charting and account activity in one app. These are documented features; usability, app security and execution quality have not been tested.");
    intro("web-platform", "MQ WebTrader gives the documented MT4/MT5 offering a browser option. It may suit someone who prefers not to install the desktop terminal, but this review does not rate its usability or claim that every desktop feature carries over to the browser.");
    intro("product-selection", "The reviewed products are leveraged trading contracts. Shares and ETF labels should not be confused with buying the underlying investments. Platform restrictions and instrument-specific leverage matter, particularly for the MT5-only ETF list.");
    review.strengths.push(
      { title: "KES accounts and local funding", explanation: "The published account and funding pages list KES accounts and Kenyan mobile-money methods, including M-Pesa.", sourceIds: ["accounts", "payments"] },
      { title: "Two documented pricing structures", explanation: "Standard advertises no minimum deposit and zero commission; Premier lists a US$100 entry point with separate spread and commission pricing.", sourceIds: ["accounts"] },
      { title: "Browser and mobile options", explanation: "The provider documents MT4, MT5, MQ WebTrader and Equiti Trader, with product availability varying by platform.", sourceIds: ["accounts", "mt4", "mt5", "app"] },
    );
    review.limitations.push(
      { title: "Withdrawal costs depend on the method", explanation: "The funding table lists e-wallet percentage charges and an international bank-wire fee, even though Kenyan mobile-money rows show no broker charge.", sourceIds: ["payments"] },
      { title: "Advertised minimum spreads are not typical costs", explanation: "Premier’s 0.0-pip starting spread is accompanied by a per-side commission. The account page makes costs dependent on product and account type.", sourceIds: ["accounts"] },
      { title: "Demo balance wording differs between pages", explanation: "The dedicated demo page lists US$10,000 virtual funds; an account-page FAQ refers to up to US$50,000. Confirm the actual demo settings when registering.", sourceIds: ["demo", "accounts"] },
    );
    faq(0, "The documented KES accounts and Kenyan mobile-money funding may be relevant to someone comparing local leveraged-trading services. That is a feature comparison, not a finding of personal suitability. A demo can help explore the platform without funding a live account.", ["accounts", "payments", "demo"]);
    faq(1, "The Kenyan website names EGM Securities Limited as its operator and FXPesa trademark owner, and CMA lists that company under licence 107. Confirm EGM Securities Limited in the final customer agreement; the agreement itself was not retrieved in this check.", ["legal", "cma"]);
    faq(2, costs, ["accounts"]);
    faq(3, "The Kenyan account page lists no minimum for Standard and US$100 for Premier. Funding-method minimums and provider limits are a separate consideration.", ["accounts", "payments"]);
    faq(4, "Published methods include Kenyan mobile money, cards, bank wires, Skrill and Neteller. Withdrawals normally return to the deposit source. Fees and arrival estimates vary by method; no deposit or withdrawal was tested.", ["payments"]);
    faq(6, "The regional pages advertise MetaTrader 4, MetaTrader 5, MQ WebTrader and Equiti Trader. The ETF specifications label ETF CFDs as MT5 only, so check the instruments you want on the exact platform.", ["accounts", "etfs"]);
    faq(7, "We read the linked Kenyan account, payment, demo and platform pages and compared the local licence details with the CMA register on 3 November 2026. Provider claims are attributed as such. No account was opened or funded; no withdrawal, execution or app-security test was performed. Independent editorial fact checking is still outstanding.", ["accounts", "payments", "cma"]);
  }

  if (slug === "exness") {
    review.broker.website = "https://www.exness.ke/";
    source("local", "Exness Kenya — company and country disclosure", "https://www.exness.ke/contact/");
    source("standard", "Exness Kenya — Standard account specifications", "https://www.exness.ke/standard-accounts/");
    source("pro", "Exness Kenya — Pro, Zero and Raw Spread specifications", "https://www.exness.ke/pro-accounts/");
    source("payments", "Exness Kenya — deposits and withdrawals", "https://www.exness.ke/deposits-and-withdrawals/");
    source("fees", "Exness Kenya — charges and exclusions", "https://www.exness.ke/fees/");
    source("platforms", "Exness Kenya — platform comparison", "https://www.exness.ke/trading-platforms/");
    review.verdict = "Exness’s Kenyan website explicitly limits this entity’s offering to Kenyan residents and companies incorporated in Kenya. The CMA register lists the local licence holder under licence 162. Published account choices include Standard, Pro, Zero and Raw Spread, with different spread/commission structures and leverage up to 1:400. Withdrawal approval is described as automated, but receipt still depends on the payment method. Minimum-deposit values were not readable in the retrieved account tables, so this draft does not substitute figures from Exness’s international business.";
    set("contracting-legal-entity", "The regional website identifies Exness (KE) Limited as its operator, registration PVT-LRUDJJB. The CMA register spells the licence-holder name Exness KE Limited. Confirm the final account agreement before funding.", ["local", "cma"]);
    set("eligible-countries-and-client-category", "The Kenyan website explicitly states that this entity serves Kenyan residents and legal entities incorporated in Kenya only.", ["local"]);
    set("country-availability", "Kenyan residents and legal entities incorporated in Kenya only, according to the local site. This review does not cover the international entities.", ["local"]);
    const costs = "Standard advertises spreads from 0.2 pips with no commission; Pro from 0.1 pips with no commission; Zero from 0 pips with commission from US$0.05 per lot per side; Raw Spread from 0 pips with commission up to US$3.50 per lot per side. These are provider minima, not tested average spreads.";
    set("forex-trading-costs", costs, ["standard", "pro"]);
    set("forex-spread-and-commission", costs, ["standard", "pro"]);
    set("forex-commission-per-lot", "Standard/Pro: no commission advertised. Zero: from US$0.05 per side per lot. Raw Spread: up to US$3.50 per side per lot. Confirm the exact instrument’s charge.", ["standard", "pro"]);
    set("deposit-and-account-charges", "The fee page states that opening an account and account management carry no charge. Funding-page footnotes warn that particular payment methods can carry deposit fees.", ["fees", "payments"]);
    set("withdrawal-fee", "The provider advertises withdrawal-fee coverage, but the fee-page footnote says third-party charges may apply depending on the method. Check the payment method in the Personal Area before transacting.", ["fees"]);
    set("published-processing-times", "The payment page defines instant as automatic processing, not guaranteed arrival. Non-instant requests are described as processed within 24 hours; the receiving bank/provider may take longer.", ["payments"]);
    set("withdrawal-requirements", "Payments must use the customer’s own personal accounts; third-party deposits and withdrawals are not accepted. Contact support if the original funding method is unavailable.", ["payments"]);
    set("client-money-arrangements", "The Kenyan payment page states that client funds are segregated in multiple tier-one banks. This is the provider’s disclosure; bank arrangements were not independently audited here.", ["payments"]);
    set("published-onboarding-steps", "The funding page lists registration and verification, selection of an available payment method, then submission of a deposit request. Verification speed was not tested.", ["payments"]);
    set("retail-and-professional-accounts", "The local pages advertise Standard, Pro, Zero and Raw Spread. Product branding such as Pro does not by itself establish regulatory professional-client status.", ["standard", "pro"]);
    set("cfds-and-underlying-markets", "The account tables list forex, metals, energies, stocks and indices. The site’s risk disclosure identifies the offering as leveraged online forex/CFD trading.", ["standard", "local"]);
    set("leverage-by-product-and-region", "The Kenyan Standard, Pro, Zero and Raw Spread tables list maximum leverage of 1:400. Instrument and margin conditions still apply.", ["standard", "pro"]);
    intro("fees", "Account choice changes both the advertised spread floor and the commission. The Kenyan tables are used here; international maximum leverage and deposit claims have not been carried across. Spreads may widen with market conditions.");
    intro("deposit-and-withdrawal", "Automatic approval and money arriving in a receiving account are different stages. The local payment documentation explicitly makes arrival time dependent on the selected method and requires the customer to use their own payment account.");
    intro("account-opening", "The country restriction is unusually explicit: the local entity serves Kenyan residents and Kenyan-incorporated companies. Some account-table minimum-deposit cells were empty in the retrieved page, so the missing amounts remain unconfirmed.");
    review.strengths.push({ title: "Explicit local eligibility scope", explanation: "The Kenyan site states which residents and companies its local entity serves.", sourceIds: ["local"] });
    review.limitations.push({ title: "Instant approval does not guarantee instant receipt", explanation: "The funding documentation separates automatic processing from payment-provider arrival time and includes possible fee exceptions.", sourceIds: ["payments", "fees"] });
    faq(1, "The local website identifies Exness (KE) Limited. CMA lists Exness KE Limited under licence 162. The local offering is restricted to Kenyan residents and Kenyan-incorporated legal entities; confirm the name in your actual agreement.", ["local", "cma"]);
    faq(2, costs, ["standard", "pro"]);
    faq(4, "Use your own payment account. The provider says some requests are automatically approved, but arrival times, payment limits and any exceptions are shown by method in the Personal Area. We did not test a payment.", ["payments"]);
  }

  if (slug === "pepperstone") {
    review.broker.website = "https://pepperstone.com/en-af/";
    source("local", "Pepperstone Kenya — regional website and entity disclosure", "https://pepperstone.com/en-af/");
    source("accounts", "Pepperstone Kenya — Standard and Razor accounts", "https://pepperstone.com/en-af/ways-to-trade/trading-accounts/");
    source("pricing", "Pepperstone Kenya — pricing and fee footnotes", "https://pepperstone.com/en-af/ways-to-trade/pricing/");
    source("legal", "Pepperstone Kenya — applicable legal documents", "https://pepperstone.com/en-af/legal-documents/");
    source("platforms", "Pepperstone Kenya — platform comparison", "https://pepperstone.com/en-af/platforms/");
    review.verdict = "Pepperstone’s Kenyan pages identify Pepperstone Markets Kenya Limited, CMA licence 128, and describe Standard and Razor CFD accounts. Standard uses a spread markup, while Razor adds commission to advertised raw spreads. The platform range is broad, but support varies by account and instrument. This draft also flags conflicting withdrawal-fee wording and differences between leverage tables on the provider’s own pages; those items should be resolved in the applicable Kenyan documents before relying on a cost or leverage figure.";
    set("contracting-legal-entity", "The Kenyan legal-documents page identifies terms governing the relationship with Pepperstone Markets Kenya Limited, its CMA-regulated entity. Confirm the document presented in your application.", ["legal"]);
    set("minimum-deposit", "The regional account page advertises US$10 or local equivalent as the minimum funding amount, with no obligation to fund. The pricing page separately says bank-wire transfers have no minimum; method-specific terms matter.", ["accounts", "pricing"]);
    set("minimum-deposit-by-account", "Standard/Razor account page: minimum funding US$10 or local equivalent. Pricing-page bank-wire footnote: no minimum. Confirm the selected funding method.", ["accounts", "pricing"]);
    const costs = "Standard: a 1-pip markup on margin FX with no separate FX commission. Razor: FX spreads advertised from 0.0 plus commission from US$3.50 per lot per side. Actual charges vary with platform, account currency, instrument and trade size.";
    set("forex-trading-costs", costs, ["accounts", "pricing"]);
    set("forex-spread-and-commission", costs, ["accounts", "pricing"]);
    set("forex-commission-per-lot", "Razor MT4/MT5 commissions depend on account currency and lot size; the page advertises rates from US$3.50 per lot per side. cTrader/TradingView pricing is presented separately. Standard margin FX has no separate commission.", ["pricing"]);
    set("overnight-financing", "The regional pricing page applies rollover adjustments to eligible positions held past 5pm New York time. Calculation and settlement timing depend on the instrument; current rates are available in the platform.", ["pricing"]);
    set("inactivity-fee", "The regional pricing page states no account-keeping or inactivity fee. It says accounts with less than ten currency units and no trades for at least three months may be archived and later reactivated.", ["pricing"]);
    set("withdrawal-fee", "Unresolved wording: the pricing page advertises no deposit/withdrawal fee, but its FAQ lists an international bank-wire deduction of US$25 or £15, and warns about external bank fees. Confirm the exact Kenyan method before relying on a zero-fee claim.", ["pricing"]);
    set("deposit-and-account-charges", "The pricing page advertises no account opening/closing fee. Payment methods can have minimums and external bank charges; the international-wire withdrawal exception needs confirmation.", ["pricing"]);
    set("negative-balance-protection", "The regional pricing FAQ says negative balance protection applies to retail traders and excludes Pepperstone Pro accounts. The applicable client classification and full legal terms must be confirmed.", ["pricing"]);
    set("retail-and-professional-accounts", "Standard and Razor are the two advertised CFD pricing accounts. These names are distinct from retail/professional regulatory classifications.", ["accounts"]);
    set("published-onboarding-steps", "The local pages outline registration, suitability questions, verification and funding. Their suggestion that an application takes minutes is not an independently tested verification time.", ["accounts"]);
    set("supported-mobile-platforms", "The regional pages advertise Pepperstone’s own app and third-party MetaTrader/cTrader choices. Platform and account compatibility must be checked separately.", ["platforms", "accounts"]);
    set("platform-and-availability", "Pepperstone advertises its own web platform and integrations including MT4, MT5, cTrader and TradingView. The account comparison excludes TradingView from Standard accounts and gives differing MT4 detail, so confirm the chosen account/platform pairing.", ["accounts", "platforms"]);
    set("order-types-and-controls", "The account page documents stop-loss, trailing-stop, take-profit and alert tools. It warns that gaps and fast markets can cause execution away from the requested price.", ["accounts"]);
    set("cfds-and-underlying-markets", "The Kenyan offering advertises CFDs linked to forex, indices, shares, commodities and ETFs. Instrument counts on the account page are dated 12 March 2025 and are not treated as a current verified count.", ["accounts"]);
    set("real-stocks-and-etfs", "The local risk disclosure says customers do not own or have rights in the underlying assets. The shares and ETF offering described here is CFD exposure.", ["local"]);
    set("leverage-by-product-and-region", "The local home and pricing pages both advertise up to 1:400 for major FX pairs, but give differing limits for some other asset classes. Confirm instrument-specific leverage and the Kenyan tiered-margin document before trading.", ["local", "pricing", "legal"]);
    intro("fees", "Standard and Razor differ mainly in how FX trading costs are split between spread and commission. Read payment-fee exceptions as well as headline pricing: the same regional fee page contains an international-wire charge in its FAQ.");
    intro("deposit-and-withdrawal", "This draft does not treat a global payment-method list as proof that each option is available to Kenyan clients. The regional fee page contains both a zero-fee headline and an international-wire exception, which needs account-specific confirmation.");
    intro("account-opening", "The Kenyan legal-documents page explains that the applicable agreement depends on the actual entity used for registration. Standard and Razor are pricing products; client classification and suitability are separate checks.");
    intro("mobile-app", "The advertised platform range includes Pepperstone’s own app and third-party mobile software. No app was installed, no account linked and no mobile trade placed for this review.");
    intro("web-platform", "Browser access and integrations are documented, but the regional account page gives account-dependent compatibility. This is not a hands-on assessment of charting, order placement or execution.");
    intro("product-selection", "The regional site describes leveraged CFD exposure rather than ownership of shares or ETF units. Some leverage limits differ between the provider’s home and pricing pages; exact product specifications take priority over a generic maximum.");
    review.strengths.push({ title: "Choice of pricing and platforms", explanation: "The local pages document Standard/Razor pricing and several platform integrations, subject to account compatibility.", sourceIds: ["accounts", "platforms"] });
    review.limitations.push(
      { title: "Withdrawal-fee wording needs clarification", explanation: "The regional pricing page’s no-fee headline is qualified by external-bank warnings and an international-wire charge in its FAQ.", sourceIds: ["pricing"] },
      { title: "Some leverage limits conflict", explanation: "The home and pricing tables show different limits for certain non-FX asset classes. Confirm the specific Kenyan instrument schedule.", sourceIds: ["local", "pricing"] },
    );
    faq(1, "The Kenyan legal page identifies Pepperstone Markets Kenya Limited. CMA lists that company under licence 128. Read the terms presented in the actual application because other Pepperstone entities use different documents.", ["legal", "cma"]);
    faq(2, costs, ["accounts", "pricing"]);
    faq(3, "The account page advertises US$10 or local equivalent when funding. The pricing page has a no-minimum exception for bank wires, so check the method-specific requirement.", ["accounts", "pricing"]);
    faq(6, "The local pages advertise Pepperstone’s platform, MT4, MT5, cTrader and TradingView. Availability differs by account type and instrument; the account page says TradingView is not available on Standard CFD accounts.", ["accounts", "platforms"]);
  }

  if (slug === "xm") {
    review.broker.website = "https://www.xm.ke/";
    source("local", "XM Kenya — company and regional restrictions", "https://www.xm.ke/");
    source("accounts", "XM Kenya — published account types", "https://www.xm.ke/account-types");
    source("regulation", "XM Kenya — local regulatory disclosure", "https://www.xm.ke/regulation");
    source("mt4", "XM Kenya — MT4 documentation", "https://www.xm.ke/mt4");
    source("mt5", "XM Kenya — MT5 documentation", "https://www.xm.ke/mt5");
    review.verdict = "XM’s Kenyan website identifies TPXMGLOBAL Kenya Limited, and the CMA register lists that entity under licence 233. The local account page advertises Standard and Ultra Low accounts with US$5 minimum deposits, a demo and negative balance protection. This draft uses the Kenyan pages rather than the separate Cyprus/EEA website. Detailed instrument-level costs, payment charges and the full customer-protection terms remain to be checked before the review can be completed.";
    set("contracting-legal-entity", "The Kenyan website identifies TPXMGLOBAL Kenya Limited, registration PVT-BEUX5EZV. Its regulatory page links the local offering to CMA licence 233. Confirm that company in the final customer agreement.", ["local", "regulation", "cma"]);
    set("minimum-deposit", "The Kenyan account page advertises US$5 for both Standard and Ultra Low. If funding in another currency, the page describes the amount as the USD equivalent.", ["accounts"]);
    set("minimum-deposit-by-account", "Standard: US$5. Ultra Low: US$5. These are published regional account minimums, not tested payment-provider minimums.", ["accounts"]);
    set("retail-and-professional-accounts", "Standard and Ultra Low are advertised on the local account page. They are product names; no professional-client classification is inferred.", ["accounts"]);
    set("demo-account", "The Kenyan account page offers a practice account with virtual funds. A live deposit or withdrawal is not possible with virtual demo money.", ["accounts"]);
    set("negative-balance-protection", "The Kenyan account page advertises negative balance protection for all listed accounts. This is a provider statement; exclusions and implementation need confirmation in the applicable agreement.", ["accounts"]);
    set("country-availability", "The reviewed site is the Kenyan offering. Its footer excludes citizens of the USA, Canada, Israel and Iran, plus other sanctioned countries. A restriction list does not establish acceptance in every other country.", ["local"]);
    set("eligible-countries-and-client-category", "Kenyan entity reviewed. The local site lists exclusions for US, Canadian, Israeli and Iranian citizens and other sanctioned countries; eligibility still depends on the account application.", ["local"]);
    set("company-background-and-ownership", "The local site gives TPXMGLOBAL Kenya Limited’s registration as PVT-BEUX5EZV and its office as Delta Corner, Tower 2, Oracle Wing, Chiromo Road, Westlands, Nairobi. Ultimate ownership was not established in this check.", ["local"]);
    set("supported-mobile-platforms", "The Kenyan platform pages advertise MT4 for tablet/mobile and MT5 for tablet/mobile. App behaviour and security were not tested.", ["mt4", "mt5"]);
    set("platform-and-availability", "The Kenyan MT5 page links WebTrader and lists desktop options for PC and Mac. No browser session was tested.", ["mt5"]);
    intro("mobile-app", "The regional pages document MetaTrader access for tablets and phones. This review does not assess installation, login, order entry or app reliability from hands-on experience.");
    intro("web-platform", "The Kenyan MT5 page links a browser WebTrader alongside desktop downloads. The presence of a link does not establish performance, feature parity or execution quality.");
    intro("fees", "The retrieved local account page establishes account names and minimum deposits but does not provide a complete instrument-level fee schedule in the readable account cards. We have not replaced missing Kenyan costs with global XM or Cyprus/EEA figures.");
    intro("account-opening", "The local account comparison lists Standard and Ultra Low with the same advertised US$5 minimum. A demo is available, and an Islamic option is advertised. Detailed identity requirements and verification timing have not been tested.");
    review.strengths.push({ title: "Low advertised account minimum", explanation: "Both locally listed account types advertise a US$5 minimum or funding-currency equivalent.", sourceIds: ["accounts"] });
    review.limitations.push({ title: "Protection wording needs the full terms", explanation: "Negative balance protection is advertised on the account page, but the scope and exclusions require the applicable customer agreement.", sourceIds: ["accounts"] });
    faq(1, "The Kenyan site names TPXMGLOBAL Kenya Limited. Its CMA licence is 233, matching the named entity in the official register. Do not assume that the Cyprus/EEA XM entity holds a Kenyan account.", ["local", "regulation", "cma"]);
    faq(3, "The Kenyan account page lists US$5 for Standard and Ultra Low and describes non-USD funding as the equivalent amount. Payment-provider limits still need confirmation.", ["accounts"]);
  }
  return review;
}
