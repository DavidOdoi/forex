import type { BrokerReview, ReviewField } from "./types";

type Source = { id: string; title: string; url: string; publisher?: string; evidenceOrigin?: "user-supplied-dossier" };

// Populate the existing template; presentation and evidence guards stay shared.
export function prepareResearchedRecord(review: BrokerReview, legalEntity: string, checkedAt: string, sources: Source[]) {
  const common = { legalEntity, jurisdiction: "Global", checkedAt };
  review.status = "draft";
  review.overallScore = null;
  review.regulatoryNotices = [];
  review.sources = sources.map(source => ({ ...source, ...common, publisher: source.publisher ?? review.broker.name }));
  const fields = (): ReviewField[] => [...review.keyData, ...review.benchmarks, ...review.chapters.flatMap(chapter => chapter.panels.flatMap(panel => panel.fields))];
  fields().forEach(field => Object.assign(field, { value: null, status: "not-researched", sourceIds: [], legalEntity: null, jurisdiction: null, checkedAt: null }));
  const set = (id: string, value: string, sourceIds: string[]) => {
    let matches = fields().filter(field => field.id === id);
    if (!matches.length) {
      const field: ReviewField = { id, label: id.replaceAll("-", " "), value: null, status: "not-researched", sourceIds: [], legalEntity: null, jurisdiction: null, checkedAt: null };
      review.keyData.push(field); matches = [field];
    }
    matches.forEach(field => Object.assign(field, { ...common, value, status: "verified", sourceIds }));
  };
  review.publication = { publishedAt: null, updatedAt: checkedAt, approvedAt: null, approvedBy: null };
  const setSupplied = (id: string, value: string, sourceIds: string[]) => {
    set(id, value, sourceIds);
    fields().filter(field => field.id === id).forEach(field => { field.status = "supplied-research"; });
  };
  return { common, set, setSupplied };
}
