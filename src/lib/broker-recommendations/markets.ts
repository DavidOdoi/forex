export type RegionalOffer = { slug: string; url: string; sourceUrl: string; checkedAt: string; action: "Open account" | "Visit site" };
export type CountryResearch = { guide: string; brokers: string[]; guidanceOnly?: boolean };

// These are the existing country articles' research subjects, not eligibility
// allowlists. Only individually checked regional offers enable external CTAs.
export const countryResearch: Record<string, CountryResearch> = {
  GB: { guide: "/forex-brokers/united-kingdom", brokers: ["ig", "pepperstone", "oanda"] },
  AU: { guide: "/insights/best-platforms-for-day-trading", brokers: ["ic-markets", "pepperstone", "ig"] },
  KE: { guide: "/insights/how-to-start-forex-trading-in-kenya", brokers: ["exness", "pepperstone"] },
  NL: { guide: "/forex-brokers/netherlands", brokers: ["ig", "plus500", "avatrade"] },
  SG: { guide: "/forex-brokers/singapore", brokers: ["ig", "plus500", "interactive-brokers"] },
  ZA: { guide: "/forex-brokers/south-africa", brokers: ["ig", "plus500", "avatrade"] },
  UG: { guide: "/forex-brokers/uganda", brokers: ["exness", "xm", "ic-markets"] },
  NG: { guide: "/forex-brokers/nigeria", brokers: ["fusion-markets", "pepperstone", "hantec-markets"] },
  GH: { guide: "/forex-brokers/ghana", brokers: ["fusion-markets", "pepperstone", "ic-markets"] },
  AE: { guide: "/forex-brokers/united-arab-emirates", brokers: ["ig", "pepperstone", "etoro"] },
  US: { guide: "/reviews/oanda", brokers: ["oanda", "trading-com"] },
  // Do not turn unresolved funding rules or regulatory alerts into automated
  // offers for offshore leveraged accounts. Direct readers to the local guide.
  IN: { guide: "/forex-brokers/india", brokers: [], guidanceOnly: true },
  PK: { guide: "/forex-brokers/pakistan", brokers: [], guidanceOnly: true },
  LK: { guide: "/forex-brokers/sri-lanka", brokers: [], guidanceOnly: true },
  MY: { guide: "/forex-brokers/malaysia", brokers: [], guidanceOnly: true },
  PH: { guide: "/forex-brokers/philippines", brokers: [], guidanceOnly: true },
  VN: { guide: "/forex-brokers/vietnam", brokers: [], guidanceOnly: true },
  TZ: { guide: "/forex-brokers/tanzania", brokers: [], guidanceOnly: true },
  ET: { guide: "/forex-brokers/ethiopia", brokers: [], guidanceOnly: true },
};

export const regionalOffers: Record<string, RegionalOffer[]> = {
  GB: [
    { slug: "ig", url: "https://www.ig.com/uk/application-form", sourceUrl: "https://www.ig.com/uk", checkedAt: "2026-11-23", action: "Open account" },
    { slug: "pepperstone", url: "https://secure.pepperstone.com/register?legalEntity=individual&locale=en-gb", sourceUrl: "https://pepperstone.com/en-gb/", checkedAt: "2026-11-23", action: "Open account" },
    { slug: "oanda", url: "https://www.oanda.com/uk-en/", sourceUrl: "https://www.oanda.com/uk-en/", checkedAt: "2026-11-23", action: "Visit site" },
  ],
  AU: [
    { slug: "ic-markets", url: "https://www.icmarkets.com.au/en/", sourceUrl: "https://www.icmarkets.com.au/en/", checkedAt: "2026-11-23", action: "Visit site" },
    { slug: "pepperstone", url: "https://secure.pepperstone.com/register?legalEntity=individual&locale=en-au", sourceUrl: "https://pepperstone.com/en-au/", checkedAt: "2026-11-23", action: "Open account" },
    { slug: "ig", url: "https://www.ig.com/au/create-account", sourceUrl: "https://www.ig.com/au", checkedAt: "2026-11-23", action: "Open account" },
  ],
  KE: [
    { slug: "exness", url: "https://my.exness.ke/accounts/sign-up?lng=en", sourceUrl: "https://www.exness.ke/", checkedAt: "2026-11-23", action: "Open account" },
    { slug: "pepperstone", url: "https://secure.pepperstone.com/register?legalEntity=individual&locale=en-af", sourceUrl: "https://pepperstone.com/en-af/", checkedAt: "2026-11-23", action: "Open account" },
  ],
};
