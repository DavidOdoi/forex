import Link from "next/link";
import type { BrokerReview } from "@/lib/reviews/types";
import { isReviewPublished } from "@/lib/reviews/publication";
import { internationalEntities } from "@/lib/reviews/international";
import { isPublishedReviewHref, isVisibleReviewHref } from "@/lib/reviews/visibility";
import { isSelectedReviewSlug, reviewAvailabilityDate, reviewAvailabilityDates } from "@/lib/reviews/selection";

export function EditorialAccountability({ review }: { review: BrokerReview }) {
  const date = (value: string | null | undefined) => value ? new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "Not published";
  return <aside className="br-accountability" aria-label="Editorial accountability">
    <p>{review.author ? <>By {review.author.profileUrl ? <Link href={review.author.profileUrl}>{review.author.name}</Link> : review.author.name}</> : "Author not assigned"} · {review.factChecker ? `Reviewed by ${review.factChecker.name}` : "Reviewer not assigned"}</p>
    <p>{isReviewPublished(review) ? `Published: ${date(review.publication?.publishedAt)}` : isSelectedReviewSlug(review.broker.slug) ? `Available on site: ${date(reviewAvailabilityDates[review.broker.slug] ?? reviewAvailabilityDate)}` : "Not published"}{review.publication?.updatedAt && <> · Substantive update: <time dateTime={review.publication.updatedAt}>{date(review.publication.updatedAt)}</time></>}</p>
    {!isReviewPublished(review) && <details><summary>Verification status</summary><p>Source-based research. Independent editorial verification remains outstanding; unverified terms are identified in the review.</p></details>}
  </aside>;
}

export function RelatedResearch({ review }: { review: BrokerReview }) {
  return <section className="br-related" aria-label="Related provider research"><div><h2>Related research</h2></div>{review.relatedResearch?.filter(entry => isVisibleReviewHref(entry.href)).map(entry => <Link key={entry.slug} href={entry.href}><span>{entry.name}{entry.href.includes("?country=") ? ` · ${review.jurisdiction}` : ""}</span><span aria-hidden="true">↗</span></Link>)}<Link href="/reviews#all-providers">Broker review library ↗</Link>{(!review.providerType || review.providerType === "retail") && <Link href="/tools">Trading calculators ↗</Link>}</section>;
}

export function ResearchComparisons() {
  const alternatives = internationalEntities.filter(profile => ((profile.slug === "pepperstone" && profile.country === "Australia") || (profile.slug === "ic-markets" && profile.country === "Seychelles")) && isPublishedReviewHref(`/reviews/${profile.slug}?country=${encodeURIComponent(profile.country)}`));
  if (!alternatives.length) return <section className="br-section" id="alternatives"><h2>Compare other broker entities</h2><p>Completed entity comparisons will appear after publication checks.</p><Link className="br-text-link" href="/reviews">View review publication progress</Link></section>;
  return <section className="br-section" id="alternatives"><h2>Compare other broker entities</h2><p>Compare documented legal entities, not price rankings. Confirm which company serves your location.</p><div className="br-table-scroll" role="region" aria-label="Alternative entity research" tabIndex={0}><table className="br-comparison"><caption>Provider-reported alternatives to research</caption><thead><tr><th scope="col">Profile</th><th scope="col">Documented entity / reference</th></tr></thead><tbody>{alternatives.map(profile => <tr key={profile.slug}><th scope="row"><Link href={`/reviews/${profile.slug}?country=${encodeURIComponent(profile.country)}`}>{profile.slug === "pepperstone" ? "Pepperstone" : "IC Markets"} {profile.country} review</Link></th><td>{profile.entity} · {profile.licence}. Independent register check pending.</td></tr>)}</tbody></table></div><Link className="br-text-link" href="/best-brokers#comparison">Explore the broker comparison overview</Link></section>;
}
