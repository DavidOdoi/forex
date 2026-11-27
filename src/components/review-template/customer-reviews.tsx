import { ArrowUpRight } from "lucide-react";
import type { BrokerReview } from "@/lib/reviews/types";

function checkedDate(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function CustomerReviews({ review }: { review: BrokerReview }) {
  const snapshot = review.customerReviews;
  if (!snapshot) return null;
  const score = snapshot.rating !== null && snapshot.rating >= 1 && snapshot.rating <= 5 ? snapshot.rating : null;
  return <section className="br-section br-customer-reviews" id="customer-reviews">
    <h2>Customer reviews on Trustpilot</h2>
    <div className="br-trustpilot-card">
      <div className="br-trustpilot-score">
        <span>Trustpilot TrustScore</span>
        <strong data-trustpilot-score>{score === null ? "Rating unavailable" : <>{score.toFixed(1)}<span> / 5</span></>}</strong>
        {score !== null && <span className="br-trustpilot-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => {
          const id = `trustpilot-${review.broker.slug}-${index}`, width = (Math.max(0, Math.min(1, score - index)) * 24).toFixed(4);
          return <svg key={id} viewBox="0 0 24 24" width="26" height="26"><defs><clipPath id={id}><rect width={width} height="24" /></clipPath></defs><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1Z" fill="#d8d8d8" /><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1Z" fill="#000" clipPath={`url(#${id})`} /></svg>;
        })}</span>}
      </div>
      <div className="br-trustpilot-details">
        {snapshot.reviewCount !== null && <p><strong data-trustpilot-count>{snapshot.reviewCount.toLocaleString("en-US")}</strong> reviews on this profile</p>}
        {snapshot.profileDomain && <p>Profile: <strong>{snapshot.profileDomain}</strong></p>}
        {snapshot.checkedAt && <p className="br-trustpilot-date">Checked <time dateTime={snapshot.checkedAt}>{checkedDate(snapshot.checkedAt)}</time> · snapshot</p>}
        <a href={snapshot.url} target="_blank" rel="noopener noreferrer">Find {review.broker.name} customer reviews on Trustpilot<ArrowUpRight size={18} aria-hidden="true" /></a>
      </div>
    </div>
    {snapshot.notice && <p className="br-trustpilot-notice">{snapshot.notice}</p>}
    {snapshot.regionalProfiles?.map(profile => <p className="br-table-note" key={profile.url}><a href={profile.url} target="_blank" rel="noopener noreferrer">{profile.label}</a>: {profile.rating === null ? "rating unavailable" : `${profile.rating.toFixed(1)}/5`} from {profile.reviewCount.toLocaleString("en-US")} reviews, checked {checkedDate(profile.checkedAt)}. This separate profile is not the group score.</p>)}
    <p className="br-table-note">{snapshot.researchNote ?? "No dated Trustpilot score has been collected for this profile."}</p>
  </section>;
}
