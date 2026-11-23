import countryNames from "./countries.json";
import { countryResearch, regionalOffers } from "./markets";
import { selectedReviewBrokers, isSelectedReviewSlug } from "../reviews/selection";

export const countryOptions = Object.entries(countryNames);
export function countryCode(value: string | null | undefined): string | null {
  const code = value?.trim().toUpperCase();
  return code && Object.hasOwn(countryNames, code) ? code : null;
}
export function detectedCountry(headers: Pick<Headers, "get">, onVercel: boolean) {
  return onVercel ? countryCode(headers.get("x-vercel-ip-country")) : null;
}
export type BrokerSuggestion = { slug: string; name: string; reviewUrl: string; focus: string; mark: string; offer: { url: string; action: string; sourceUrl: string; checkedAt: string } | null };
export type BrokerRecommendationsData = {
  country: string | null; countryName: string | null; source: "automatic" | "selected" | "unavailable";
  mode: "regional" | "research" | "guidance" | "neutral"; guide: string | null; brokers: BrokerSuggestion[];
};
const excludedFromPromotion = new Set(["aafx-trading", "z-forex"]);
const focus: Record<string, string> = { exness: "Account types & costs", xm: "Accounts & fees", "ic-markets": "Standard & Raw accounts", pepperstone: "Platforms & pricing", ig: "Markets & platforms", oanda: "Pricing & account terms", plus500: "CFD platform & costs", avatrade: "Platforms & fees", "fusion-markets": "Classic & Zero accounts", "hantec-markets": "Account terms & costs", etoro: "Investing & copy trading", "interactive-brokers": "Multi-asset account terms", "trading-com": "Forex account terms" };
const marks: Record<string, string> = { exness: "ex", xm: "XM", "ic-markets": "IC", pepperstone: "P", ig: "IG", oanda: "O", plus500: "+", avatrade: "A", "fusion-markets": "FM", "hantec-markets": "H", etoro: "e", "interactive-brokers": "IB", "trading-com": "T" };
const defaultSubjects = ["exness", "ic-markets", "pepperstone"];

export function brokerRecommendations(code: string | null, source: BrokerRecommendationsData["source"] = "unavailable", asOf = new Date().toISOString().slice(0, 10)): BrokerRecommendationsData {
  const country = countryCode(code);
  const profile = country ? countryResearch[country] : undefined;
  const today = Date.parse(asOf);
  const offers = country ? (regionalOffers[country] ?? []).filter(offer => {
    const age = today - Date.parse(offer.checkedAt);
    return Number.isFinite(age) && age >= 0 && age <= 90 * 86400000 && new URL(offer.url).protocol === "https:";
  }) : [];
  const subjects = profile?.guidanceOnly ? [] : profile?.brokers ?? defaultSubjects;
  const brokers = subjects.filter((slug, index) => subjects.indexOf(slug) === index && isSelectedReviewSlug(slug) && !excludedFromPromotion.has(slug)).slice(0, 3).flatMap(slug => {
    const broker = selectedReviewBrokers.find(broker => broker.slug === slug);
    return broker ? [{ ...broker, reviewUrl: `/reviews/${slug}`, focus: focus[slug] ?? "Account terms & fees", mark: marks[slug] ?? broker.name.slice(0, 2), offer: offers.find(offer => offer.slug === slug) ?? null }] : [];
  });
  return { country, countryName: country ? countryNames[country as keyof typeof countryNames] : null, source: country ? source : "unavailable",
    mode: profile?.guidanceOnly ? "guidance" : offers.length && brokers.some(broker => broker.offer) ? "regional" : profile ? "research" : "neutral", guide: profile?.guide ?? null, brokers };
}
