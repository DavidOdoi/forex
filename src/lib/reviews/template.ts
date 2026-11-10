import type {
  BrokerReview,
  ReviewChapter,
  ReviewField,
  ReviewSectionId,
} from "./types";
function field(label: string): ReviewField {
  return {
    id: label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-$/, ""),
    label,
    value: null,
    status: "not-researched",
    sourceIds: [],
    legalEntity: null,
    jurisdiction: null,
    checkedAt: null,
  };
}
function panel(title: string, guidance: string, labels: string[]) {
  return { title, guidance, fields: labels.map(field) };
}
const definitions: {
  id: ReviewSectionId;
  title: string;
  panels: ReturnType<typeof panel>[];
}[] = [
  {
    id: "fees",
    title: "Fees",
    panels: [
      panel(
        "Trading fees",
        "Record the account type, instrument, trade size and currency behind each cost. Separate advertised minimums from observed costs.",
        [
          "Forex spread and commission",
          "Index CFD costs",
          "Stock and ETF commission",
          "Overnight financing",
        ],
      ),
      panel(
        "Non-trading fees",
        "Verify the current fee schedule for the relevant legal entity and account currency.",
        [
          "Withdrawal fee",
          "Currency conversion fee",
          "Inactivity fee",
          "Deposit and account charges",
        ],
      ),
    ],
  },
  {
    id: "safety",
    title: "Safety",
    panels: [
      panel(
        "Regulation and legal entities",
        "Match the exact company and licence to an official register. A brand-level licence does not establish protections for every client.",
        [
          "Contracting legal entity",
          "Regulator and register entry",
          "Licence number",
          "Eligible countries and client category",
        ],
      ),
      panel(
        "How clients are protected",
        "State the scope and exclusions of each protection. Do not infer safety from a licence alone.",
        [
          "Client-money arrangements",
          "Compensation scheme and limits",
          "Negative balance protection",
          "Company background and ownership",
        ],
      ),
    ],
  },
  {
    id: "deposit-and-withdrawal",
    title: "Deposit and withdrawal",
    panels: [
      panel(
        "Funding your account",
        "Check country, currency, provider fees and payment restrictions. Published processing times are not hands-on test results.",
        [
          "Account base currencies",
          "Deposit methods and charges",
          "Withdrawal methods and charges",
          "Published processing times",
        ],
      ),
      panel(
        "Withdrawal process",
        "Document the rules, verification steps and minimums before describing the process.",
        [
          "Withdrawal requirements",
          "Minimum withdrawal",
          "Currency conversion conditions",
        ],
      ),
    ],
  },
  {
    id: "account-opening",
    title: "Account opening",
    panels: [
      panel(
        "Eligibility and account types",
        "Keep regional eligibility and account-specific minimums explicit.",
        [
          "Country availability",
          "Minimum deposit by account",
          "Retail and professional accounts",
          "Demo account",
        ],
      ),
      panel(
        "Opening an account",
        "Distinguish documented steps from a process that has actually been tested.",
        [
          "Identity and address requirements",
          "Published onboarding steps",
          "Published verification time",
        ],
      ),
    ],
  },
  {
    id: "mobile-app",
    title: "Mobile app",
    panels: [
      panel(
        "Mobile trading experience",
        "Describe supported features from evidence. Assess usability as hands-on experience only when testing records exist.",
        [
          "Supported mobile platforms",
          "Login and security",
          "Search and watchlists",
          "Orders and risk controls",
          "Alerts and notifications",
        ],
      ),
    ],
  },
  {
    id: "web-platform",
    title: "Web trading platform",
    panels: [
      panel(
        "Browser-based trading",
        "Identify the platform version and distinguish documentation from observed behaviour.",
        [
          "Platform and availability",
          "Login and security",
          "Search and navigation",
          "Order types and controls",
          "Portfolio and fee reports",
          "Alerts and notifications",
        ],
      ),
    ],
  },
  {
    id: "product-selection",
    title: "Product selection",
    panels: [
      panel(
        "Markets and instruments",
        "Separate real assets from derivatives. Availability and leverage must be tied to the applicable entity and jurisdiction.",
        [
          "Forex pairs",
          "CFDs and underlying markets",
          "Real stocks and ETFs",
          "Other supported products",
          "Leverage by product and region",
          "Product restrictions",
        ],
      ),
    ],
  },
];
export function createReviewTemplate(
  name = "Example Broker",
  slug = "example-broker",
): BrokerReview {
  const chapters: ReviewChapter[] = definitions.map((c) => ({
    ...c,
    introduction: null,
    score: null,
    strengths: [],
    limitations: [],
    panels: c.panels.map((p) => ({
      ...p,
      fields: p.fields.map((f) => ({ ...f, sourceIds: [] })),
    })),
  }));
  return {
    schemaVersion: 1,
    status: "template",
    broker: { name, slug, website: null },
    jurisdiction: null,
    accountOpening: {
      url: null,
      status: "not-configured",
      sourceIds: [],
      legalEntity: null,
      jurisdiction: null,
      checkedAt: null,
      isAffiliate: true,
    },
    author: null,
    factChecker: null,
    verifiedAt: null,
    overallScore: null,
    verdict: null,
    strengths: [],
    limitations: [],
    keyData: [
      "Minimum deposit",
      "Account currencies",
      "Forex trading costs",
      "Withdrawal fee",
      "Account-opening time",
      "Regulation and entity",
    ].map(field),
    benchmarks: [
      "EUR/USD spread",
      "Forex commission per lot",
      "Index CFD cost",
      "Stock commission",
      "Conversion fee",
      "Withdrawal fee",
    ].map(field),
    chapters,
    faqs: [
      "Who is this broker suitable for?",
      "Which legal entity would hold my account?",
      "What does trading here cost?",
      "What is the minimum deposit?",
      "How do deposits and withdrawals work?",
      "Which protections apply in my country?",
      "Which platforms are available?",
      "How was this review researched?",
    ].map((question) => ({ question, answer: null, sourceIds: [] })),
    sources: [],
  };
}
export const reviewTemplate = createReviewTemplate();
export function validDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function isValidSource(
  source: BrokerReview["sources"][number],
): boolean {
  try {
    const url = new URL(source.url);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      Boolean(source.publisher.trim()) &&
      Boolean(source.title.trim()) &&
      validDate(source.checkedAt) &&
      Boolean(source.legalEntity.trim()) &&
      Boolean(source.jurisdiction.trim())
    );
  } catch {
    return false;
  }
}
export function verifiedSources(ids: string[], review: BrokerReview): boolean {
  return (
    ids.length > 0 &&
    ids.every((id) => {
      const source = review.sources.find((s) => s.id === id);
      return source ? isValidSource(source) : false;
    })
  );
}
export function fieldValue(field: ReviewField, review: BrokerReview): string {
  const proven =
    field.status === "verified" &&
    field.value?.trim() &&
    field.legalEntity?.trim() &&
    field.jurisdiction?.trim() &&
    field.checkedAt &&
    validDate(field.checkedAt) &&
    verifiedSources(field.sourceIds, review) &&
    field.sourceIds.every((id) => {
      const s = review.sources.find((source) => source.id === id)!;
      return (
        s.legalEntity === field.legalEntity &&
        s.jurisdiction === field.jurisdiction &&
        s.checkedAt === field.checkedAt
      );
    });
  return proven
    ? field.value!
    : field.status === "not-researched"
      ? "Not researched"
      : "Needs verification";
}
export function scoreValue(
  score: BrokerReview["overallScore"],
  review: BrokerReview,
): string | null {
  if (
    !score ||
    !Number.isFinite(score.value) ||
    score.value < 0 ||
    score.value > 5 ||
    score.outOf !== 5 ||
    !verifiedSources(score.sourceIds, review)
  )
    return null;
  try {
    const url = new URL(score.methodologyUrl);
    if (url.protocol !== "https:" || url.username || url.password) return null;
  } catch {
    return null;
  }
  return `${score.value.toFixed(1)}/5`;
}

export function accountOpeningHref(review: BrokerReview): string | null {
  const link = review.accountOpening;
  if (
    review.status === "template" ||
    (review.status !== "published" && link.isAffiliate) ||
    link.status !== "verified" ||
    !review.jurisdiction ||
    review.jurisdiction !== link.jurisdiction ||
    !link.url
  )
    return null;
  try {
    const url = new URL(link.url);
    if (url.protocol !== "https:" || url.username || url.password) return null;
  } catch {
    return null;
  }
  const display = fieldValue(
    {
      id: "account-opening-link",
      label: "Account opening link",
      value: link.url,
      status: "verified",
      sourceIds: link.sourceIds,
      legalEntity: link.legalEntity,
      jurisdiction: link.jurisdiction,
      checkedAt: link.checkedAt,
    },
    review,
  );
  return display === link.url ? link.url : null;
}

export function verifiedVerdictSentences(review: BrokerReview): string[] | undefined {
  const summary = review.verdictEvidence;
  if (!summary || summary.jurisdiction !== review.jurisdiction) return undefined;
  const value = summary.sentences.join(" ");
  return fieldValue({ id: "review-summary", label: "Review summary", value, status: "verified", sourceIds: summary.sourceIds, legalEntity: summary.legalEntity, jurisdiction: summary.jurisdiction, checkedAt: summary.checkedAt }, review) === value ? summary.sentences : undefined;
}
