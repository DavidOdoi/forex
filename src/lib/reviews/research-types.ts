export type ProviderType = "retail" | "institutional" | "interbank" | "introducing" | "other";
export const providerLabels: Record<ProviderType, string> = {
  retail: "Retail forex / CFDs", institutional: "Institutional / professional FX", interbank: "Interbank FX", introducing: "Introducing / relationship", other: "Other provider",
};
export interface CollectedSource {
  id: string;
  title: string;
  url: string;
  checkedAt: string;
  sha256: string;
}
export interface ResearchEntry {
  slug: string;
  name: string;
  providerType: ProviderType;
  websiteCandidate: string | null;
  sourceCandidates: string[];
  countryCandidates: string[];
  sources: CollectedSource[];
  notes: { sourceId: string; excerpt: string; fieldIds: string[] }[];
  collectionStatuses: string[];
}
export interface ReviewDirectoryEntry {
  href?: string;
  published?: boolean;
  slug: string;
  name: string;
  providerType: ProviderType;
  country: string | null;
  sourceCount: number;
  findingCount: number;
  summary: string;
}
