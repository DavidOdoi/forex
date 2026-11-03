import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, CircleHelp, Clock3, FileCheck2, Globe2, Landmark, Minus, ShieldCheck } from "lucide-react";
import type { BrokerReview, ReviewField } from "@/lib/reviews/types";
import type { ResearchEntry } from "@/lib/reviews/research-types";
import { reviewDigest } from "@/lib/reviews/digest";
import { accountOpeningHref } from "@/lib/reviews/template";
import { Finding } from "./finding";
import { AccountOpeningCta } from "./account-cta";
import { ReaderContents, ReaderDisclosure, ReaderMarket } from "./reader-controls";
import "./editorial-review.css";

const labels: Record<string, string> = {
  "forex-spread-and-commission": "Spreads & commission", "overnight-financing": "Overnight charges", "inactivity-fee": "Inactivity",
  "regulation-and-entity": "Entity & permission", "contracting-legal-entity": "Your agreement", "negative-balance-protection": "Balance protection", "client-money-arrangements": "Client funds",
  "deposit-methods-and-charges": "Funding options", "withdrawal-methods-and-charges": "Withdrawal charges", "withdrawal-fee": "Withdrawal charges", "published-processing-times": "Published timings", "withdrawal-requirements": "Payment rules",
  "identity-and-address-requirements": "Verification", "demo-account": "Practice account", "retail-and-professional-accounts": "Account choices",
  "supported-mobile-platforms": "Mobile options", "platform-and-availability": "Browser access", "real-stocks-and-etfs": "Asset ownership", "leverage-by-product-and-region": "Leverage", "product-restrictions": "Restrictions", "cfds-and-underlying-markets": "Available markets",
};
const navLabels: Record<string, string> = { fees: "Trading costs", safety: "Regulation & entity", "deposit-and-withdrawal": "Payments", "account-opening": "Account opening", "mobile-app": "Mobile trading", "web-platform": "Web platform", "product-selection": "Markets" };

function FactRows({ fields, review }: { fields: ReviewField[]; review: BrokerReview }) {
  return <dl className="br-facts">{fields.map(field => <div key={field.id}><dt>{labels[field.id] ?? field.label}</dt><dd><Finding field={field} review={review} /></dd></div>)}</dl>;
}

export function EditorialReviewPage({ review, research, countries = [] }: { review: BrokerReview; research?: ResearchEntry; countries?: string[] }) {
  const digest = reviewDigest(review, research);
  const sections = digest.sections.filter(s => s.fields.length || ["fees", "safety", "account-opening"].includes(s.id));
  const dates = [...digest.sources.map(s => s.checkedAt), ...(research?.sources.map(s => s.checkedAt) ?? [])].sort();
  const checked = dates.at(-1);
  const dateLabel = checked ? new Date(`${checked}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "Sources pending";
  const entity = digest.sources[0]?.legalEntity;
  const links = [{ id: "overview", label: "The short version" }, ...sections.map(s => ({ id: s.id, label: navLabels[s.id] })), ...(digest.faqs.length ? [{ id: "review-faq", label: "Common questions" }] : []), { id: "sources", label: "Sources & method" }];
  const dataUrl = `/reviews/${review.broker.slug}/data${review.jurisdiction ? `?country=${encodeURIComponent(review.jurisdiction)}` : ""}`;
  const feeSourceId = sections.find(s => s.id === "fees")?.fields[0]?.sourceIds[0];
  const feeSource = digest.sources.find(s => s.id === feeSourceId);
  const titleInitials = review.broker.name.split(" ").map(w => w[0]).slice(0, 2).join("");
  return <main className="br-review" id="review-main">
    <section className="br-hero" id="key-data">
      <div className="br-container">
        <div className="br-topline"><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/reviews">Broker reviews</Link><span>/</span><span>{review.broker.name}</span></nav><ReaderDisclosure affiliate={Boolean(accountOpeningHref(review)) && review.accountOpening.isAffiliate} /></div>
        <div className="br-hero-grid">
          <div>
            <p className="br-eyebrow"><span />DEVIN FOREX / BROKER RESEARCH</p>
            <h1>{review.broker.name} <em>review</em></h1>
            <p className="br-standfirst">{digest.lead}</p>
            <div className="br-meta"><span><Globe2 size={15} />{review.jurisdiction ?? "Country in research"}</span><span><Clock3 size={15} />{dateLabel}</span><span className="br-status">{review.status === "draft" ? "Draft · editorial check pending" : "Published review"}</span></div>
            {review.author && <p className="br-byline">By {review.author.name}{review.factChecker ? ` · Fact checked by ${review.factChecker.name}` : ""}</p>}
            <AccountOpeningCta review={review} placement="hero" compact />
          </div>
          <aside className="br-snapshot" aria-label="Broker at a glance">
            <div className="br-snapshot-heading"><span className="br-monogram" aria-hidden="true">{titleInitials}</span><div><span className="br-eyebrow">AT A GLANCE</span><strong>{review.broker.name}</strong></div><Landmark size={24} /></div>
            <dl><div><dt>Legal entity</dt><dd>{entity ?? "Not yet verified"}</dd></div><div><dt>Minimum deposit</dt><dd>{digest.minimum ? <Finding field={digest.minimum} review={review} /> : "Not yet verified"}</dd></div>{digest.currencies && <div><dt>Account currencies</dt><dd><Finding field={digest.currencies} review={review} /></dd></div>}<div><dt>Review basis</dt><dd>Documents · no live-account testing</dd></div></dl>
            <ReaderMarket current={review.jurisdiction} countries={countries} slug={review.broker.slug} />
          </aside>
        </div>
      </div>
    </section>
    <div className="br-container br-layout">
      <aside className="br-sidebar" aria-label="Broker research summary"><div className="br-sticky"><ReaderContents links={links} /><div className="br-editor-note"><ShieldCheck size={22} /><h2>Evidence, in context.</h2><p>Country-specific facts. Linked sources. Clear limitations.</p><Link href="/about#research-methodology">How we research<ArrowUpRight size={15} /></Link></div></div></aside>
      <article className="br-article" aria-label={`${review.broker.name} review article`}>
        <section className="br-section br-overview" id="overview"><p className="br-eyebrow">THE SHORT VERSION</p><h2>The details that matter.</h2>
          {digest.positives.length || digest.cautions.length ? <div className="br-tradeoffs">
            <div><h3><Check size={17} />What stands out</h3><ul>{digest.positives.length ? digest.positives.map(p => <li key={p.title}>{p.title}</li>) : <li>Assessment still in progress</li>}</ul></div>
            <div><h3><Minus size={17} />Keep in mind</h3><ul>{digest.cautions.length ? digest.cautions.map(p => <li key={p.title}>{p.title}</li>) : <li>Complete account terms still need checking</li>}</ul></div>
          </div> : <div className="br-pending"><FileCheck2 size={22} /><p>{digest.sources.length ? "The named entity is documented. Fees, eligibility and protections still need account-specific checks." : "Usable account evidence is not yet verified. Read the collected notes and limitations below."}</p></div>}
          <p className="br-inline-note">Not rated. <Link href="/about#research-methodology">Read our research standard</Link>.</p>
          <AccountOpeningCta review={review} placement="overview" compact />
        </section>
        {sections.map(section => <div key={section.id}>
          <section className="br-section" id={section.id}><p className="br-eyebrow">{section.kicker}</p><h2>{section.title}</h2>
            {section.fields.length ? <FactRows fields={section.fields} review={review} /> : <p className="br-empty">{section.id === "fees" ? "A complete regional fee schedule has not yet been verified." : section.id === "safety" ? "The legal entity and regulator entry still need confirmation." : "Confirm eligibility, identity requirements and the applicable agreement before applying."}</p>}
            {section.id === "fees" && feeSource && <a className="br-text-link" href={feeSource.url} target="_blank" rel="noopener noreferrer">Read the provider’s pricing<ArrowUpRight size={16} /></a>}
            {section.id === "safety" && <p className="br-inline-note"><ShieldCheck size={15} />A licence does not guarantee returns or protection against trading losses.</p>}
          </section>
          {section.id === "safety" && <AccountOpeningCta review={review} placement="after-safety" compact />}
          {section.id === "account-opening" && <AccountOpeningCta review={review} placement="after-account-opening" compact />}
        </div>)}
        <section className="br-conclusion" id="verdict"><p className="br-eyebrow">OUR TAKE</p><h2>Make the details work for you.</h2><p>{digest.conclusion}</p><Link href="/best-brokers">Compare broker research<ArrowRight size={17} /></Link></section>
        <AccountOpeningCta review={review} placement="verdict" compact />
        {digest.faqs.length > 0 && <section className="br-section br-faq" id="review-faq"><p className="br-eyebrow">A FEW USEFUL ANSWERS</p><h2>Your questions, answered.</h2>{digest.faqs.map(faq => <details key={faq.question}><summary>{faq.question}<ChevronDown size={18} /></summary><p>{faq.answer}</p></details>)}</section>}
        <section className="br-section br-sources" id="sources"><p className="br-eyebrow">FOLLOW THE EVIDENCE</p><h2>Sources & research notes.</h2><p className="br-source-intro">{digest.sources.length ? "Provider documents describe advertised terms. Register checks confirm only the named licence holder. Current terms can change." : "Collected documents are research leads; their statements are not approved account facts."}</p>
          {digest.sources.length > 0 ? <ol className="review-source-list" data-review-sources>{digest.sources.map((source, index) => <li key={source.id} id={`source-${source.id}`}><span>{String(index + 1).padStart(2, "0")}</span><div><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={15} /></a><small>{source.publisher} · {source.checkedAt}</small></div></li>)}</ol> : <div id="collected-research" className="br-research-notes">
            {digest.notes.map((note, i) => { const source = research?.sources.find(s => s.id === note.sourceId); return source ? <figure key={i}><blockquote>“{note.excerpt}”</blockquote><figcaption>Unverified excerpt · <a href={source.url} target="_blank" rel="noopener noreferrer">View source<ArrowUpRight size={14} /></a></figcaption></figure> : null; })}
            {!research?.sources.length && <p>No usable sources added yet.</p>}
            {research?.sources.length ? <ul>{research.sources.map(s => <li key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}<ArrowUpRight size={14} /></a></li>)}</ul> : null}
          </div>}
          <div className="br-method" id="methodology"><CircleHelp size={20} /><p>No funded-account, execution or withdrawal test was performed. Editorial review is pending. <Link href="/about#research-methodology">How we check information</Link>.</p></div>
          <a className="br-data-download" href={dataUrl} download><ArrowDown size={15} />Download the complete research record</a>
        </section>
        <section className="br-related" aria-label="Continue your research"><div><BookOpen size={21} /><h2>A little more clarity.</h2></div><Link href="/reviews"><span>Explore other brokers</span><ArrowUpRight size={19} /></Link><Link href="/tools"><span>Estimate your trading costs</span><ArrowUpRight size={19} /></Link><Link href="/about#research-methodology"><span>Understand our review process</span><ArrowUpRight size={19} /></Link></section>
        <p className="br-risk">General information, not investment advice. Leveraged forex and CFDs carry substantial risk; you may lose your capital.</p>
      </article>
    </div>
  </main>;
}
