export type EvidenceStatus =
  | "not-researched"
  | "needs-verification"
  | "verified";
export type ReviewSectionId =
  | "fees"
  | "safety"
  | "deposit-and-withdrawal"
  | "account-opening"
  | "mobile-app"
  | "web-platform"
  | "product-selection";
export interface ReviewSource {
  id: string;
  title: string;
  url: string;
  publisher: string;
  checkedAt: string;
  legalEntity: string;
  jurisdiction: string;
}
export interface ReviewField {
  id: string;
  label: string;
  value: string | null;
  status: EvidenceStatus;
  sourceIds: string[];
  legalEntity: string | null;
  jurisdiction: string | null;
  checkedAt: string | null;
}
export interface ReviewScore {
  value: number;
  outOf: 5;
  methodologyUrl: string;
  sourceIds: string[];
}
export interface ReviewPoint {
  title: string;
  explanation: string;
  sourceIds: string[];
}
export interface ReviewPanel {
  title: string;
  guidance: string;
  fields: ReviewField[];
}
export interface ReviewChapter {
  id: ReviewSectionId;
  title: string;
  introduction: string | null;
  score: ReviewScore | null;
  strengths: ReviewPoint[];
  limitations: ReviewPoint[];
  panels: ReviewPanel[];
}
export interface AccountOpeningLink {
  url: string | null;
  status: "not-configured" | "needs-verification" | "verified";
  sourceIds: string[];
  legalEntity: string | null;
  jurisdiction: string | null;
  checkedAt: string | null;
  isAffiliate: boolean;
}
export interface BrokerReview {
  schemaVersion: 1;
  status: "template" | "draft" | "published";
  broker: { name: string; slug: string; website: string | null };
  jurisdiction: string | null;
  accountOpening: AccountOpeningLink;
  author: { name: string; role: string; profileUrl?: string; bio?: string } | null;
  factChecker: { name: string; role: string; profileUrl?: string } | null;
  publication?: { publishedAt: string | null; updatedAt: string | null; approvedAt: string | null; approvedBy: string | null };
  verifiedAt: string | null;
  overallScore: ReviewScore | null;
  verdict: string | null;
  strengths: ReviewPoint[];
  limitations: ReviewPoint[];
  keyData: ReviewField[];
  benchmarks: ReviewField[];
  chapters: ReviewChapter[];
  faqs: { question: string; answer: string | null; sourceIds: string[] }[];
  sources: ReviewSource[];
  entities?: { country: string; name: string; regulator: string | null; licence: string | null; sourceId: string; note?: string; identitySourceId?: string }[];
  customerReviews?: { publisher: "Trustpilot"; url: string; rating: number | null; reviewCount: number | null; checkedAt: string | null };
}
