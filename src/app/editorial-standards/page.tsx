import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { Icon } from "@/components/icon";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Editorial standards",
  "The principles behind Devin Forex: clarity, sourcing, risk context, commercial transparency, and correcting errors.",
  "/editorial-standards",
);
const principles = [
  [
    "Make it understandable.",
    "Use plain language, explain technical terms, and present information with enough context to be useful. Educational content should help readers ask better questions, without implying that reading it guarantees readiness to trade.",
  ],
  [
    "Let evidence set the limits.",
    "Prefer primary documents for product terms and factual service claims. Identify the context and date of time-sensitive observations in future service coverage. State uncertainty rather than filling gaps with assumptions.",
  ],
  [
    "Keep risk visible.",
    "Discuss limitations and potential losses alongside product mechanics. Avoid guaranteed-return language, invented performance records, urgency tactics, or claims that trading suits everyone.",
  ],
  [
    "Be clear about relationships.",
    "Disclose any future affiliate or commercial arrangement near the content it affects. Explain the nature of compensation and any influence on coverage or placement. Currently, this site contains no active affiliate links.",
  ],
  [
    "Separate fact from judgement.",
    "Distinguish a provider’s stated terms, direct observations, and editorial interpretation. Do not present advertised capabilities as independently verified findings or imply tests that have not taken place.",
  ],
  [
    "Correct what needs correcting.",
    "Review reported inaccuracies and make meaningful corrections clear when published content changes. A verified reporting channel is still being prepared; the contact form currently validates entries locally only.",
  ],
];
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="EDITORIAL STANDARDS"
        title="Clarity is a choice."
        accent="So is transparency."
        description="These are the principles we intend to apply as Devin Forex grows. No invented expertise. No borrowed credibility. Just a clearer standard for the work."
      />
      <div className="container section reading-layout">
        <aside className="contents-nav">
          <p className="eyebrow">OUR EDITORIAL COMPASS</p>
          <p>Useful information starts with honest boundaries.</p>
          <Link href="/affiliate-disclosure" className="text-link">
            Commercial disclosures <Icon name="arrow" size={15} />
          </Link>
          <Link href="/methodology" className="text-link">
            Evaluation framework <Icon name="arrow" size={15} />
          </Link>
        </aside>
        <div className="standards-list">
          {principles.map(([title, text], i) => (
            <section key={title}>
              <span className="eyebrow">PRINCIPLE 0{i + 1}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
          <div className="document-disclaimer">
            These standards describe our editorial commitments. They do not
            assert qualifications, regulatory status, external accreditation, or
            an established testing history.
          </div>
        </div>
      </div>
    </>
  );
}
