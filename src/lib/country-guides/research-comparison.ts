import type { CountryGuide } from "./types";
import { countrySuppliedResearch } from "./supplied-research";

export type ResearchFact = { text: string; sourceId?: string; href?: string; anchor?: string };
export type ResearchComparisonRow = {
  slug: string;
  signupUrl: string;
  regulation: ResearchFact;
  platforms: ResearchFact;
  pricing: ResearchFact;
  minimum: ResearchFact;
  swapFree: ResearchFact;
  funding: ResearchFact;
  focus: ResearchFact;
};

// Concise reading summaries, not country-specific account allocations or offers.
// Country dossier facts retain their reported provenance. Supplementary facts
// link to the existing global review's dated primary-source checks.
const rows: ResearchComparisonRow[] = [
  {
    slug: "exness",
    signupUrl: "https://my.exness.com/accounts/sign-up?lng=en",
    regulation: { text: "Exness (SC) Ltd · Seychelles FSA", sourceId: "fsa-exness-sc", anchor: "FSA register" },
    platforms: { text: "Trade, Terminal, MetaTrader offerings", sourceId: "exness-platforms", anchor: "Platform range" },
    pricing: { text: "Standard from 0.2 pips; $0 commission", sourceId: "exness-standard", anchor: "Standard pricing" },
    minimum: { text: "Standard: method/region dependent", href: "https://get.exness.help/hc/en-us/articles/360011554840-What-is-the-minimum-amount-needed-to-start-trading", anchor: "Deposit conditions" },
    swapFree: { text: "Conditional; selected instruments", href: "https://get.exness.help/hc/en-us/articles/4402341895570-Swap-free-status", anchor: "Swap-free terms" },
    funding: { text: "Not verified" },
    focus: { text: "Account pricing choices" },
  },
  {
    slug: "xm",
    signupUrl: "https://www.xm.com/goto/profile/en",
    regulation: { text: "XM Global Ltd · Belize FSC (broker-stated)", sourceId: "xm-regulation", anchor: "Entity disclosure" },
    platforms: { text: "MT4, MT5, XM App", sourceId: "xm-regulation", anchor: "XM platforms" },
    pricing: { text: "EUR/USD: Standard from 1.6 pips; Ultra Low 0.8; $0 commission", href: "https://www.xm.com/account-types", anchor: "Account specifications" },
    minimum: { text: "$5 Standard/Ultra Low; $10,000 Shares", sourceId: "xm-account-types", anchor: "Account minimums" },
    swapFree: { text: "Islamic option; selected Ultra Low instruments", href: "https://www.xm.com/help-center/trading-accounts", anchor: "Account conditions" },
    funding: { text: "Not verified" },
    focus: { text: "Lower entry minimums" },
  },
  {
    slug: "ic-markets",
    signupUrl: "https://secure.ic.com/en/Account/Register",
    regulation: { text: "Raw Trading Ltd · Seychelles FSA", sourceId: "fsa-raw-trading", anchor: "FSA register" },
    platforms: { text: "MT4, MT5, cTrader, TradingView pairing", sourceId: "ic-global-accounts", anchor: "Account/platform range" },
    pricing: { text: "Standard from 0.8 pips, $0 commission; Raw MT from 0.0 + $3.50/lot/side", sourceId: "ic-global-accounts", anchor: "Standard and Raw pricing" },
    minimum: { text: "$0 advertised account minimum; method limits apply", sourceId: "ic-global-accounts", anchor: "Account minimum" },
    swapFree: { text: "Eligibility and holding fees apply", href: "https://www.icmarkets.com/global/en/trading-accounts/swap-free-account", anchor: "Swap-free holding fees" },
    funding: { text: "Not verified" },
    focus: { text: "Standard vs Raw pricing" },
  },
  {
    slug: "pepperstone",
    signupUrl: "https://secure.pepperstone.com/register?locale=en",
    regulation: { text: "Pepperstone Markets Ltd · Bahamas SCB", sourceId: "scb-october-2026", anchor: "SCB firms register" },
    platforms: { text: "Own app, MT4/MT5, cTrader; check TradingView pairing", sourceId: "pepperstone-accounts", anchor: "Account/platform terms" },
    pricing: { text: "Razor from 0.0 pips + commission from $3.50/lot/side", sourceId: "pepperstone-accounts", anchor: "Razor pricing" },
    minimum: { text: "$0 account / $10 funding wording: clarify", sourceId: "pepperstone-accounts", anchor: "Minimum-deposit wording" },
    swapFree: { text: "Entity-specific terms still needed", href: "/reviews/pepperstone", anchor: "Review the open questions" },
    funding: { text: "Not verified" },
    focus: { text: "Platform choice / Razor" },
  },
];

export function countryResearchComparison(country: CountryGuide, asOf: string) {
  const dossier = countrySuppliedResearch(country, asOf);
  if (country.slug !== "sri-lanka" || dossier?.id !== "sri-lanka-dossier-2026-11-10") return [];
  return rows.filter(row => dossier.brokerResearch.some(broker => broker.brokerSlug === row.slug));
}
