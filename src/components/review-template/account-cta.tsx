import { ArrowUpRight, BadgeInfo, ExternalLink } from "lucide-react";
import type { BrokerReview } from "@/lib/reviews/types";
import { accountOpeningHref } from "@/lib/reviews/template";

export type AccountCtaPlacement =
  | "hero"
  | "overview"
  | "after-safety"
  | "after-account-opening"
  | "verdict";
const messages: Record<
  AccountCtaPlacement,
  { label: string; title: string; description: string }
> = {
  hero: {
    label: "ACCOUNT OPTIONS",
    title: "Explore the account options.",
    description:
      "Check eligibility and terms directly with the broker before applying.",
  },
  overview: {
    label: "TAKE A CLOSER LOOK",
    title: "Your account. Your informed decision.",
    description:
      "Review account types, current charges and the terms for your country on the broker’s website.",
  },
  "after-safety": {
    label: "KNOW WHO YOU’RE DEALING WITH",
    title: "Understand the entity before you apply.",
    description:
      "Confirm which company would hold your account and which protections apply to you.",
  },
  "after-account-opening": {
    label: "THE NEXT STEP IS YOURS",
    title: "Explore the application process.",
    description:
      "Read the broker’s requirements and risk disclosures before opening or funding an account.",
  },
  verdict: {
    label: "A CONSIDERED NEXT STEP",
    title: "Make your next move an informed one.",
    description:
      "Check the latest account terms directly with the broker. This review is general information, not a recommendation.",
  },
};
export function AccountOpeningCta({
  review,
  placement,
  compact: readerCompact = false,
}: {
  review: BrokerReview;
  placement: AccountCtaPlacement;
  compact?: boolean;
}) {
  const href = accountOpeningHref(review);
  const message = messages[placement];
  const compact = placement === "hero";
  if (readerCompact) return <section className={`br-account ${placement === "after-safety" ? "br-account-dark" : ""} ${placement === "hero" ? "br-account-hero" : ""}`} id={`open-account-${placement}`} data-account-cta={placement} aria-label={`Account opening: ${placement.replaceAll("-", " ")}`}>
    {placement !== "hero" && <div><p className="br-account-title">{placement === "after-safety" ? "Check your entity’s terms" : placement === "after-account-opening" ? "Review the application" : placement === "verdict" ? "Ready to look closer?" : "Compare the account options"}</p></div>}
    {href ? <a className="br-account-button" href={href} target="_blank" rel={review.accountOpening.isAffiliate ? "sponsored nofollow noopener noreferrer" : "noopener noreferrer"} aria-label={`Open an account with ${review.broker.name}`}>Open an account<ArrowUpRight size={17} /></a> : <button className="br-account-button" disabled type="button" aria-label={`Open an account with ${review.broker.name}`} aria-describedby={`reader-account-status-${placement}`}>Open an account<ArrowUpRight size={17} /></button>}
    <small id={`reader-account-status-${placement}`}>{href && review.accountOpening.isAffiliate ? "Affiliate link: we may receive compensation. " : !href ? "Link not configured. " : "Official broker link. "}Capital at risk.</small>
  </section>;
  return (
    <section
      id={`open-account-${placement}`}
      className={`review-account-cta ${compact ? "is-compact" : ""} ${placement === "after-safety" ? "is-dark" : ""}`}
      data-account-cta={placement}
      aria-label={`Account opening: ${placement.replaceAll("-", " ")}`}
    >
      <div className="review-account-copy">
        <span className="review-account-eyebrow">{message.label}</span>
        <h3>{message.title}</h3>
        {!compact && <p>{message.description}</p>}
      </div>
      <div className="review-account-action">
        {href ? (
          <a
            className="review-account-button"
            href={href}
            target="_blank"
            rel={
              review.accountOpening.isAffiliate
                ? "sponsored nofollow noopener noreferrer"
                : "noopener noreferrer"
            }
            aria-label={`Open an account with ${review.broker.name}`}
          >
            Open an account
            <ArrowUpRight size={18} />
          </a>
        ) : (
          <button
            className="review-account-button"
            type="button"
            disabled
            aria-label={`Open an account with ${review.broker.name}`}
            aria-describedby={`account-link-status-${placement}`}
          >
            Open an account
            <ArrowUpRight size={18} />
          </button>
        )}
        <span className="review-account-broker">
          <ExternalLink size={12} />
          {review.broker.name}
        </span>
      </div>
      <div className="review-account-notice">
        <BadgeInfo size={14} />
        <p>
          {href ? (
            review.accountOpening.isAffiliate ? (
              "Affiliate disclosure: Devin Forex may receive compensation if you use this link."
            ) : (
              "External broker link. Check the applicable account terms."
            )
          ) : (
            <span id={`account-link-status-${placement}`}>
              {review.status === "template" ? "Preview only. " : "Research draft. "}The account-opening link is not configured.
            </span>
          )}
          <span>
            {" "}
            Forex and CFD trading involve substantial risk. You may lose some or
            all of your capital.
          </span>
        </p>
      </div>
    </section>
  );
}
