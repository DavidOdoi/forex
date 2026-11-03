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
  countryCandidates: string[];
  sources: CollectedSource[];
  notes: { sourceId: string; excerpt: string; fieldIds: string[] }[];
  collectionStatuses: string[];
}
export interface ReviewDirectoryEntry {
  slug: string;
  name: string;
  country: string | null;
  sourceCount: number;
  findingCount: number;
  summary: string;
}
