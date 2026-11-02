import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { Icon } from "@/components/icon";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Our evaluation methodology",
  "The proposed framework for future Devin Forex evaluations: identity, costs, platforms, execution, funding, and transparency.",
  "/methodology",
);
const criteria = [
  [
    "Identity & availability",
    "Identify the legal entity, applicable locations, and the exact service being considered. Check any authorisation claim against the relevant authority’s own register; do not rely solely on provider marketing.",
    "Which entity would actually hold your account?",
  ],
  [
    "Costs & conditions",
    "Look at spreads, commissions, financing, conversion costs, inactivity charges, and withdrawal conditions together. Clarify the account type and assumptions behind any example.",
    "What does the complete fee picture look like?",
  ],
  [
    "Platform & usability",
    "Consider navigation, order controls, accessibility, available documentation, and how clearly risk and account information are presented. Distinguish observed behaviour from advertised features.",
    "Can someone understand and control their exposure?",
  ],
  [
    "Products & execution",
    "Explain the product’s structure, order types, execution policies, and stated limitations. Avoid treating a short test or demo experience as proof of all future execution quality.",
    "What happens when conditions become difficult?",
  ],
  [
    "Funding & support",
    "Document published deposit and withdrawal rules, contact channels, and relevant restrictions. Label the evidence behind any claims about processing times or support experience.",
    "Are the practical account conditions clear?",
  ],
  [
    "Evidence & limitations",
    "Record sources, dates, account context, and the limits of any testing. Explain uncertainty, separate observations from opinion, and disclose commercial relationships.",
    "What can the evidence actually support?",
  ],
];
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="OUR METHODOLOGY"
        title="Better questions."
        accent="A fuller picture."
        description="A framework for future coverage that puts evidence, context, and limitations ahead of headline claims."
      />
      <section className="container section">
        <div className="methodology-intro">
          <p className="review-notice">
            <strong>A framework in development.</strong> We have not published
            broker reviews, tested services, assigned ratings, or made broker
            recommendations. The criteria below describe our intended approach;
            detailed procedures will accompany future coverage.
          </p>
          <p>
            One score can hide a lot of context. Our intended evaluations will
            explain the factors behind an assessment and make clear where
            reliable information ends.
          </p>
        </div>
        <div className="criteria-grid">
          {criteria.map(([title, text, question], i) => (
            <article className="criteria-card" key={title}>
              <div className="criteria-number">
                0{i + 1}
                <Icon name="compass" size={23} />
              </div>
              <h2>{title}</h2>
              <p>{text}</p>
              <div className="criteria-question">
                <span>THE QUESTION TO ASK</span>
                {question}
              </div>
            </article>
          ))}
        </div>
        <div className="editorial-banner">
          <div>
            <p className="eyebrow">THE PRINCIPLES BEHIND THE PROCESS</p>
            <h2>Trust needs more than a checklist.</h2>
            <p>
              Explore how we intend to handle sources, corrections, and
              commercial relationships.
            </p>
          </div>
          <Link href="/editorial-standards" className="button primary">
            Editorial standards <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
