import type { BrokerReview } from "./types";
import { fieldValue, validDate } from "./template";
import { siteOrigin } from "../site";

// A status flag alone never constitutes editorial approval. These checks validate
// the publication record; an editor must actually perform and record the review.
export function publicationBlockers(review: BrokerReview): string[] {
  const issues: string[] = [];
  if (review.suppliedResearch) issues.push("Supplied-dossier findings require primary-source rechecks before publication.");
  if (review.status !== "published") issues.push("Draft: editorial publication is pending.");
  if (!review.author?.name.trim() || !review.author.bio?.trim() || !review.author.profileUrl?.trim())
    issues.push("Author biography and accountability profile need completion.");
  if (review.author?.profileUrl) {
    try {
      const profile = new URL(review.author.profileUrl, siteOrigin);
      if (profile.protocol !== "https:" || profile.username || profile.password) issues.push("Author profile URL needs correction.");
    } catch { issues.push("Author profile URL needs correction."); }
  }
  const publication = review.publication;
  const dated = (value: string | null | undefined): value is string => Boolean(value && validDate(value));
  if (!publication || !dated(publication.publishedAt) || !dated(publication.updatedAt) || publication.updatedAt < publication.publishedAt)
    issues.push("Publication and substantive-update dates are not recorded.");
  if (!publication || !dated(publication.approvedAt) || !dated(publication.updatedAt) || !publication.approvedBy || ![review.author?.name, review.factChecker?.name].includes(publication.approvedBy) || publication.approvedAt < publication.updatedAt)
    issues.push("A responsible editor’s approval is not recorded.");
  const fields = [...review.keyData, ...review.chapters.flatMap(chapter => chapter.panels.flatMap(panel => panel.fields))];
  const requiredFields = review.providerType && review.providerType !== "retail"
    ? ["regulation-and-entity", "contracting-legal-entity", "eligible-countries-and-client-category", "platform-and-availability"]
    : ["minimum-deposit", "forex-spread-and-commission", "regulation-and-entity", "country-availability", "published-processing-times"];
  for (const id of requiredFields) {
    if (!fields.some(field => field.id === id && field.jurisdiction === review.jurisdiction && field.status === "verified" && fieldValue(field, review) === field.value)) {
      issues.push("Core account, eligibility or cost evidence still needs checking.");
      break;
    }
  }
  if (publication?.updatedAt && review.sources.some(source => source.checkedAt > publication.updatedAt!))
    issues.push("New source checks need a substantive editorial update.");
  return issues;
}

export function isReviewPublished(review: BrokerReview): boolean {
  return publicationBlockers(review).length === 0;
}
