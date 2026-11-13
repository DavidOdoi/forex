export type LegalStatus = "permitted" | "restricted" | "unclear" | "pending_review";
export type Verification = "unverified" | "desk_verified" | "broker_stated" | "regulator_confirmed" | "firsthand_tested";
export type Scope = { countrySlug: string | null; entityId: string | null };
export type GuideSource = {
  id: string; title: string; publisher: string; url: string;
  kind: "regulator" | "broker" | "editorial" | "affiliate" | "firsthand";
  scope: Scope; publishedAt: string | null; publicationDateStatus: "supplied" | "verified" | "unknown";
  checkedAt: string | null; verification: "unverified" | "checked";
  access: "blocked" | "not_attempted" | "retrieved"; note: string;
  dateNote?: string;
  reportedUpdatedAt?: string;
  reportedAccess?: { date: string; outcome: "accessed" | "not_accessed" | "not_established"; dossierId: string };
};
export type Claim<T = string> = {
  value: T | null; sourceIds: string[]; checkedAt: string | null;
  verification: Verification; scope: Scope; note: string;
  reportedQuote?: { text: string; sourceId: string; locator: string };
};
export type SuppliedCountryResearch = {
  id: string; countrySlug: string; title: string; reportedResearchDate: string;
  independentRecheck: "pending"; archivePath: string; originalSha256: string;
  reportedSources: GuideSource[];
  reportedFindings: { id: string; claim: string; scope: string; quote: string; sourceIds: string[]; sourceDescription: string; evidenceType: "regulator_document" | "official_register" | "broker_statement"; limitations: string }[];
  brokerResearch: { brokerSlug: string; name: string; residentEligibility: "not_established"; servingEntity: "not_established"; localAuthorization: "not_established"; reportedFields: { field: string; value: string; sourceIds: string[] }[]; unresolvedNotes: string[]; advertisedAccounts?: { account: string; minimum: string; spreadFloor: string; commission: string; sourceIds: string[] }[] }[];
  accessFailures: { subject: string; url: string | null; consequence: string }[];
  legalReviewQuestions: string[]; ownerEvidenceNeeded: string[];
};
export type GuidePerson = { id: string; name: string; profileUrl: string; roles: ("author" | "editor" | "legal_reviewer")[] };
export type HumanApproval = {
  id: string; countrySlug: string; kind: "legal" | "editorial" | "comparison";
  status: "approved" | "revoked"; approvedBy: string; approvedAt: string; reference: string;
  sourceIds: string[]; legalStatus?: LegalStatus; approvedEntityIds?: string[]; commercialLinksAllowed?: boolean;
};
export type BrokerEntity = {
  id: string; brokerSlug: string; legalName: string; jurisdiction: string;
  regulator: string; licence: string; evidence: Claim<"matched">;
};
export type CountryBrokerMapping = {
  brokerSlug: string; entityId: string;
  residentEligibility: Claim<"accepted" | "not_accepted">;
  localAuthorization: Claim<"authorized" | "not_authorized">;
  tradingPermission: Claim<"permitted" | "restricted">;
  fundingPermission: Claim<"permitted" | "restricted">;
  platforms: Claim; fees: Claim; paymentMethods: Claim;
  strengths: Claim[]; limitations: Claim[]; suitability: Claim;
  geoApprovalReference: string | null;
};
export type CountrySection = {
  id: string; title: string; eyebrow: string;
  paragraphs: Claim[]; points?: string[];
  table?: { headers: string[]; rows: string[][]; caption: string };
};
export type ResearchFact = { text: string; sourceId?: string; href?: string; anchor?: string };
export type CountryResearchPresentation = {
  scope: Scope; dossierId: string;
  description: string; caption: string;
  headers: string[]; columnWidths: number[];
  rows: { slug: string; cells: ResearchFact[]; signupUrl?: string }[];
  footnote?: string; signupNote?: string;
  traderFit?: { title: string; table: NonNullable<CountrySection["table"]> };
};
export type CountryGuide = {
  suppliedResearch?: SuppliedCountryResearch;
  researchPresentation?: CountryResearchPresentation;
  name: string; slug: string; locale: string; currency: Claim;
  title: string; description: string; audience: string; directAnswer: string;
  intro?: Claim; seoTitle?: Claim;
  legalStatus: LegalStatus; legalSummary: Claim; legalSources: string[];
  legalReviewedAt: string | null; legalReviewReference: string | null;
  humanApprovalReference: string | null; publishedAt: string | null; updatedAt: string | null;
  publicationStatus: "draft" | "review" | "approved";
  commercialLinksAllowed: boolean;
  comparison: { mode: "none" | "educational"; purpose: string | null; approvalReference: string | null };
  authorReference: string | null; reviewerReference: string | null;
  questions: { question: string; answer: Claim; status: "unknown" | "pending_review" | "verified" }[];
  sections: CountrySection[]; faqs: { question: string; answer: Claim }[];
  brokerEntityMappings: CountryBrokerMapping[]; sourceIds: string[];
};
export type GuideRegistry = { sources: GuideSource[]; entities: BrokerEntity[]; people: GuidePerson[]; approvals: HumanApproval[] };
export type AffiliateAgreement = {
  id: string; brokerSlug: string; entityId: string; status: "active" | "inactive" | "unknown";
  startsAt: string; expiresAt: string; trackingUrl: string; approvedHosts: string[];
  sourceIds: string[]; checkedAt: string;
};
export type AffiliateGeoApproval = {
  id: string; agreementId: string; brokerSlug: string; entityId: string; countrySlug: string;
  status: "approved" | "revoked" | "unknown"; approvedAt: string; approvalReference: string;
  sourceIds: string[]; checkedAt: string;
};
export type AffiliateRegistry = { agreements: AffiliateAgreement[]; geoApprovals: AffiliateGeoApproval[] };
