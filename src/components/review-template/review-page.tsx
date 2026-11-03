import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeInfo,
  BookOpen,
  ChevronDown,
  CircleDashed,
  CircleHelp,
  ClipboardList,
  Clock3,
  Compass,
  Database,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe2,
  Landmark,
  Layers3,
  Minus,
  MonitorSmartphone,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type {
  BrokerReview,
  ReviewChapter,
  ReviewPoint,
} from "@/lib/reviews/types";
import {
  fieldValue,
  isValidSource,
  scoreValue,
  verifiedSources,
  validDate,
  accountOpeningHref,
} from "@/lib/reviews/template";
import {
  ComparisonPreview,
  CountryScope,
  DisclosureButton,
  KeyData,
  ReviewNavigation,
} from "./interactions";
import { AccountOpeningCta } from "./account-cta";
import { Fragment } from "react";
import "./review-template.css";

function EvidenceList({
  title,
  points,
  review,
  negative = false,
}: {
  title: string;
  points: ReviewPoint[];
  review: BrokerReview;
  negative?: boolean;
}) {
  const supported = points.filter((point) =>
    verifiedSources(point.sourceIds, review),
  );
  return (
    <div className={`review-evidence-list ${negative ? "is-caution" : ""}`}>
      <h3>
        {negative ? <Minus size={18} /> : <Plus size={18} />} {title}
      </h3>
      {supported.length ? (
        <ul>
          {supported.map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong>
              <p>{p.explanation}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          {negative
            ? "Source-backed drawbacks and limitations will appear here."
            : "Source-backed strengths will appear here."}
          <span className="review-pending-label">Awaiting research</span>
        </p>
      )}
    </div>
  );
}
function ProsCons({
  review,
  positives = review.strengths,
  negatives = review.limitations,
}: {
  review: BrokerReview;
  positives?: ReviewPoint[];
  negatives?: ReviewPoint[];
}) {
  return (
    <div className="review-pros-cons">
      <EvidenceList title="Pros" points={positives} review={review} />
      <EvidenceList title="Cons" points={negatives} review={review} negative />
    </div>
  );
}
function Chapter({
  chapter,
  review,
  index,
}: {
  chapter: ReviewChapter;
  review: BrokerReview;
  index: number;
}) {
  const score = scoreValue(chapter.score, review);
  return (
    <section id={chapter.id} className="review-chapter-section">
      <details className="review-chapter" open>
        <summary>
          <div>
            <span className="review-overline">
              0{index + 1} / DETAILED REVIEW
            </span>
            <h2>{chapter.title}</h2>
            <span className="review-chapter-score">
              Section score <strong>{score ?? "Not rated"}</strong>
            </span>
          </div>
          <span className="review-expand" aria-hidden="true">
            <ChevronDown size={20} />
          </span>
        </summary>
        <div className="review-chapter-content">
          <p className="review-section-intro">
            {chapter.introduction ??
              `This chapter is ready for verified ${chapter.title.toLowerCase()} findings. Research has not been completed.`}
          </p>
          <ProsCons
            review={review}
            positives={chapter.strengths}
            negatives={chapter.limitations}
          />
          {chapter.panels.map((panel) => (
            <div className="review-panel" key={panel.title}>
              <h3>{panel.title}</h3>
              <p>{panel.guidance}</p>
              <div className="review-table-wrap">
                <table className="review-data-table">
                  <thead>
                    <tr>
                      <th scope="col">What we assess</th>
                      <th scope="col">Verified finding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {panel.fields.map((f) => (
                      <tr key={f.id}>
                        <th scope="row">{f.label}</th>
                        <td>{fieldValue(f, review)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {["mobile-app", "web-platform"].includes(chapter.id) && (
            <div className="review-platform-placeholder">
              <MonitorSmartphone size={35} />
              <strong>Platform evidence belongs here</strong>
              <p>
                Add your own screenshots and dated test notes when available. No
                hands-on testing is implied by this placeholder.
              </p>
            </div>
          )}
          <details className="review-research-notes">
            <summary>
              Research notes and limitations
              <ChevronDown size={16} />
            </summary>
            <p>
              Record the exact account, legal entity, market, source URL and
              check date. Identify information supplied by the provider,
              distinguish it from independent confirmation, and describe any
              missing or conflicting evidence.
            </p>
          </details>
        </div>
      </details>
    </section>
  );
}
function Sidebar({ review }: { review: BrokerReview }) {
  const score = scoreValue(review.overallScore, review);
  return (
    <aside className="review-sidebar" aria-label="Broker research summary">
      <div className="review-sidebar-sticky">
        <div className="review-broker-card">
          <div className="review-sidebar-identity">
            <div className="review-logo small" aria-hidden="true">
              {review.broker.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <h2>{review.broker.name}</h2>
              <span className="review-neutral-badge">Research not started</span>
            </div>
          </div>
          <div className="review-sidebar-score">
            <span>Overall score</span>
            <strong>{score ?? "Not rated"}</strong>
            <p>A score needs a documented method and supporting evidence.</p>
          </div>
          <dl className="review-sidebar-facts">
            <div>
              <dt>Review type</dt>
              <dd>Source-based</dd>
            </div>
            <div>
              <dt>Hands-on testing</dt>
              <dd>Not performed</dd>
            </div>
            <div>
              <dt>Country coverage</dt>
              <dd>Not verified</dd>
            </div>
            <div>
              <dt>Last verified</dt>
              <dd>
                {review.verifiedAt && validDate(review.verifiedAt)
                  ? review.verifiedAt
                  : "Not yet verified"}
              </dd>
            </div>
          </dl>
          <div className="review-sidebar-account-note">
            <CircleHelp size={16} />
            <p>
              {accountOpeningHref(review)
                ? "Account options are available through the links in this review."
                : "Account links are inactive in this preview. Check account availability and terms before applying."}
            </p>
          </div>
          <a className="review-inline-link" href="#methodology">
            How we research
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="review-sidebar-note">
          <ClipboardList size={24} />
          <h3>Evidence before opinion.</h3>
          <p>
            Sources, legal entities and regional terms stay attached to the
            facts they support.
          </p>
          <a href="#sources">
            Explore the source checklist
            <ArrowRight size={15} />
          </a>
        </div>
        <div className="review-sidebar-risk">
          <ShieldCheck size={20} />
          <p>
            Forex and CFDs involve substantial risk. This preview is not a
            recommendation or financial advice.
          </p>
        </div>
      </div>
    </aside>
  );
}
export function BrokerReviewPage({ review }: { review: BrokerReview }) {
  const score = scoreValue(review.overallScore, review);
  const sources = review.sources.filter(isValidSource);
  return (
    <main className="review-template" id="review-main">
      <div className="review-preview-bar">
        <div className="review-container">
          <span>
            <FileText size={16} />
            <strong>REVIEW TEMPLATE</strong>
            <span className="review-preview-detail">
              Layout preview · no broker findings published
            </span>
          </span>
          <a
            href="/reviews/template/data"
            download="broker-review-template.json"
          >
            Download data template
            <ArrowDown size={15} />
          </a>
        </div>
      </div>
      <header className="review-hero">
        <div className="review-container">
          <div className="review-breadcrumb-row">
            <nav className="review-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/reviews">Broker reviews</Link>
              <span>/</span>
              <span>Template</span>
            </nav>
            <DisclosureButton
              hasAffiliateLink={
                Boolean(accountOpeningHref(review)) &&
                review.accountOpening.isAffiliate
              }
            />
          </div>
          <div className="review-hero-grid">
            <div>
              <div className="review-identity">
                <div className="review-logo" aria-hidden="true">
                  {review.broker.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="review-title-label">
                    DEVIN FOREX / BROKER RESEARCH
                  </div>
                  <h1>{review.broker.name} review</h1>
                  <p>A reusable format. A consistent standard of evidence.</p>
                </div>
              </div>
              <div className="review-byline">
                <div>
                  <span className="review-avatar">
                    <UserRound size={19} />
                  </span>
                  <div>
                    <span>Written by</span>
                    <strong>{review.author?.name ?? "Not assigned"}</strong>
                  </div>
                </div>
                <div>
                  <span className="review-avatar">
                    <FileCheck2 size={19} />
                  </span>
                  <div>
                    <span>Fact checked by</span>
                    <strong>
                      {review.factChecker?.name ?? "Not assigned"}
                    </strong>
                  </div>
                </div>
                <div>
                  <span className="review-avatar">
                    <Clock3 size={19} />
                  </span>
                  <div>
                    <span>Last verified</span>
                    <strong>
                      {review.verifiedAt && validDate(review.verifiedAt)
                        ? review.verifiedAt
                        : "Not yet verified"}
                    </strong>
                  </div>
                </div>
              </div>
              <AccountOpeningCta review={review} placement="hero" />
            </div>
            <CountryScope />
          </div>
        </div>
      </header>
      <ReviewNavigation />
      <div className="review-container review-layout">
        <article className="review-main-column">
          <section id="key-data" className="review-overview">
            <div className="review-overline">
              <BookOpen size={15} />
              THE SHORT VERSION
            </div>
            <h2>
              {review.broker.name} <span>in a nutshell</span>
            </h2>
            <div className="review-summary-badges">
              <span className="review-neutral-badge">
                Overall score: {score ?? "Not rated"}
              </span>
              <span className="review-neutral-badge">
                Source-based research
              </span>
              <span className="review-draft-badge">Template preview</span>
            </div>
            <p className="review-lead">
              {review.verdict ??
                "This is the review structure we’ll use to turn verified broker research into a clear, useful assessment. It contains no completed review findings."}
            </p>
            <div className="review-highlights">
              {[
                {
                  icon: Landmark,
                  title: "Regulation & entity",
                  text: "Verify the company behind the brand and the protections that apply.",
                },
                {
                  icon: Layers3,
                  title: "Costs & conditions",
                  text: "Put spreads, commissions and non-trading fees into context.",
                },
                {
                  icon: MonitorSmartphone,
                  title: "Platforms & experience",
                  text: "Separate documented features from actual testing observations.",
                },
                {
                  icon: Globe2,
                  title: "Your country matters",
                  text: "Tie availability, leverage and account terms to the right market.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <span className="review-feature-icon">
                    <item.icon size={19} />
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="review-suitability">
              <Compass size={23} />
              <div>
                <h3>Who is this broker for?</h3>
                <p>
                  Suitability conclusions will be added after the relevant
                  costs, restrictions and risks have been researched. No
                  recommendation is published in this preview.
                </p>
              </div>
            </div>
            <ProsCons review={review} />
            <h3 className="review-block-title">
              The essential details, at a glance.
            </h3>
            <KeyData review={review} />
            <AccountOpeningCta review={review} placement="overview" />
            <div className="review-feedback-preview">
              <BadgeInfo size={22} />
              <div>
                <h3>What do traders say?</h3>
                <p>
                  No user-feedback analysis is published here. Any future
                  summary needs identified sources, a date range and a
                  transparent selection method. It must distinguish reported
                  experiences from verified facts.
                </p>
              </div>
            </div>
          </section>
          <ComparisonPreview />
          {review.chapters.map((chapter, i) => (
            <Fragment key={chapter.id}>
              <Chapter chapter={chapter} review={review} index={i} />
              {chapter.id === "safety" && (
                <AccountOpeningCta review={review} placement="after-safety" />
              )}
              {chapter.id === "account-opening" && (
                <AccountOpeningCta
                  review={review}
                  placement="after-account-opening"
                />
              )}
            </Fragment>
          ))}
          <section className="review-verdict">
            <span className="review-overline">
              BRINGING THE EVIDENCE TOGETHER
            </span>
            <h2>Our final verdict</h2>
            <span className="review-neutral-badge">Not yet published</span>
            <p>
              A useful conclusion explains the broker’s specific trade-offs, who
              might find the service relevant, and where important uncertainties
              remain. It will be written after source verification and editorial
              review.
            </p>
          </section>
          <AccountOpeningCta review={review} placement="verdict" />
          <section id="review-faq" className="review-faq">
            <div className="review-overline">THE QUESTIONS THAT MATTER</div>
            <h2>Frequently asked questions</h2>
            <p>
              Answers will be tailored to each broker and the reader’s country.
            </p>
            {review.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <Plus size={18} />
                </summary>
                <p>
                  {faq.answer && verifiedSources(faq.sourceIds, review)
                    ? faq.answer
                    : "Answer awaiting verified research. This template does not assume an account is available, a protection applies, or a service is suitable."}
                </p>
              </details>
            ))}
          </section>
          <section id="methodology" className="review-methodology">
            <div className="review-overline">
              <FileCheck2 size={15} />
              OUR RESEARCH APPROACH
            </div>
            <h2>How this review will be built</h2>
            <p>
              Research comes first. The template keeps the evidence visible.
            </p>
            <ol>
              {[
                [
                  "Identify the right entity",
                  "Confirm the official website, contracting company and target country.",
                ],
                [
                  "Collect and cross-check sources",
                  "Use current product documents, fee schedules and official regulator registers.",
                ],
                [
                  "Explain the findings",
                  "Separate documented facts, editorial interpretation and any genuine test observations.",
                ],
                [
                  "Review before publication",
                  "Check source dates, regional scope, commercial disclosures and unresolved contradictions.",
                ],
              ].map(([title, text], i) => (
                <li key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="review-method-note">
              <CircleHelp size={20} />
              <p>
                No testing claims, author credentials, review scores,
                testimonials or awards are inherited from the reference page. A
                scoring method and supporting evidence are required before a
                rating can be displayed.
              </p>
            </div>
          </section>
          <section id="sources" className="review-sources">
            <div className="review-overline">
              <Database size={15} />
              TRACEABLE, NOT ASSUMED
            </div>
            <h2>Sources & verification</h2>
            <p>
              Every factual field has a place for its source, legal entity,
              country and check date.
            </p>
            {sources.length ? (
              <ol className="review-source-list">
                {sources.map((source) => (
                  <li key={source.id}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title}
                      <ExternalLink size={15} />
                    </a>
                    <p>
                      {source.publisher} · {source.legalEntity} ·{" "}
                      {source.jurisdiction} · Checked {source.checkedAt}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="review-source-empty">
                <FileText size={30} />
                <strong>No sources added yet</strong>
                <span>
                  Research records will appear here when they have been
                  collected and checked.
                </span>
              </div>
            )}
            <div className="review-source-checklist">
              {[
                "Official source URL",
                "Publisher and document title",
                "Exact legal entity",
                "Applicable country",
                "Date checked",
              ].map((label) => (
                <span key={label}>
                  <CircleDashed size={15} />
                  {label}
                </span>
              ))}
            </div>
            <a
              className="review-inline-link"
              href="/reviews/template/data"
              download="broker-review-template.json"
            >
              Download the structured review data
              <ArrowDown size={15} />
            </a>
          </section>
          <div className="review-bottom-risk">
            <ShieldCheck size={23} />
            <p>
              This website provides general information only and does not
              provide financial or investment advice. Forex and CFD trading
              involve substantial risk, and you may lose some or all of your
              invested capital.
            </p>
          </div>
          <nav className="review-next-links" aria-label="Continue exploring">
            <Link href="/reviews">
              <ArrowLeft size={17} />
              All broker research
            </Link>
            <Link href="/tools">
              Explore trading tools
              <ArrowUpRight size={17} />
            </Link>
          </nav>
        </article>
        <Sidebar review={review} />
      </div>
    </main>
  );
}
