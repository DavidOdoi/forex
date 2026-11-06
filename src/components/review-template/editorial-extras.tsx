import Link from "next/link";
import type { BrokerReview } from "@/lib/reviews/types";
import { isReviewPublished } from "@/lib/reviews/publication";
import { internationalEntities } from "@/lib/reviews/international";

export function EditorialAccountability({ review }: { review: BrokerReview }) {
  const date = (value: string | null | undefined) => value ? new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "Not published";
  return <aside className="br-accountability" aria-label="Editorial accountability">
    <p>{review.author ? <>By {review.author.profileUrl ? <Link href={review.author.profileUrl}>{review.author.name}</Link> : review.author.name}</> : "Author not assigned"} · {review.factChecker ? `Reviewed by ${review.factChecker.name}` : "Reviewer not assigned"}</p>
    <p>Published: {isReviewPublished(review) ? date(review.publication?.publishedAt) : "Not published"}{review.publication?.updatedAt && <> · Substantive update: <time dateTime={review.publication.updatedAt}>{date(review.publication.updatedAt)}</time></>}</p>
    {!isReviewPublished(review) && <details><summary>Editorial status</summary><p>Draft; editorial approval pending.</p></details>}
  </aside>;
}

export function CostIllustration({ brokerName = "Exness" }: { brokerName?: string }) {
  return <figure className="br-cost-example" data-illustrative-cost>
    <figcaption><strong>Hypothetical EUR/USD round trip</strong> · Not a measured {brokerName} quote</figcaption>
    <p>Assume 1 standard lot (100,000 EUR), a USD account, US$10/pip, a constant 0.3-pip spread and US$3.50 commission per lot per side.</p>
    <dl><div><dt>Spread cost</dt><dd>0.3 × US$10 = <strong>US$3</strong></dd></div><div><dt>Open + close commission</dt><dd>2 × US$3.50 = <strong>US$7</strong></dd></div><div><dt>Round-trip total</dt><dd><strong>US$10 / 1.0 pip</strong></dd></div></dl>
    <p>Excludes price movement, slippage, swaps and currency conversion. <Link href="/tools#pip-calculator">Calculate pip value</Link> or <Link href="/tools#position-size">estimate position size</Link>.</p>
  </figure>;
}

export function RelatedResearch({ review }: { review: BrokerReview }) {
  return <section className="br-related" aria-label="Related provider research"><div><h2>Related research</h2></div>{review.relatedResearch?.map(entry => <Link key={entry.slug} href={entry.href}><span>{entry.name}{entry.href.includes("?country=") ? ` · ${review.jurisdiction}` : ""}</span><span aria-hidden="true">↗</span></Link>)}<Link href="/reviews#all-providers">Full broker directory ↗</Link>{(!review.providerType || review.providerType === "retail") && <Link href="/tools">Trading calculators ↗</Link>}</section>;
}

export function ResearchComparisons() {
  const alternatives = internationalEntities.filter(profile => (profile.slug === "pepperstone" && profile.country === "Australia") || (profile.slug === "ic-markets" && profile.country === "Seychelles"));
  return <section className="br-section" id="alternatives"><h2>Compare other broker entities</h2><p>Compare documented legal entities, not price rankings. Confirm which company serves your location.</p><div className="br-table-scroll" role="region" aria-label="Alternative entity research" tabIndex={0}><table className="br-comparison"><caption>Provider-reported alternatives to research</caption><thead><tr><th scope="col">Profile</th><th scope="col">Documented entity / reference</th></tr></thead><tbody>{alternatives.map(profile => <tr key={profile.slug}><th scope="row"><Link href={`/reviews/${profile.slug}?country=${encodeURIComponent(profile.country)}`}>{profile.slug === "pepperstone" ? "Pepperstone" : "IC Markets"} {profile.country} review</Link></th><td>{profile.entity} · {profile.licence}. Independent register check pending.</td></tr>)}</tbody></table></div><Link className="br-text-link" href="/best-brokers#comparison">Explore the broker comparison overview</Link></section>;
}
