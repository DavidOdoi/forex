import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, CircleHelp, Clock3, Globe2, ShieldCheck, Star, X } from "lucide-react";
import type { BrokerReview, ReviewField } from "@/lib/reviews/types";
import type { ResearchEntry } from "@/lib/reviews/research-types";
import { reviewDigest } from "@/lib/reviews/digest";
import { checkedField, reviewAccounts, reviewQuickFacts, verdictSentences, flowFaqs } from "@/lib/reviews/flow";
import { accountOpeningHref, scoreValue } from "@/lib/reviews/template";
import { reviewHeading } from "@/lib/reviews/seo";
import { Finding } from "./finding";
import { AccountOpeningCta } from "./account-cta";
import { ReaderContents, ReaderDisclosure, ReaderMarket } from "./reader-controls";
import "./editorial-review.css";

const labels: Record<string, string> = {
  "forex-spread-and-commission": "Spreads & commission", "overnight-financing": "Overnight charges", "inactivity-fee": "Inactivity",
  "regulation-and-entity": "Entity & permission", "contracting-legal-entity": "Customer agreement", "negative-balance-protection": "Balance protection", "client-money-arrangements": "Client funds",
  "deposit-methods-and-charges": "Deposit methods", "withdrawal-methods-and-charges": "Withdrawal charges", "withdrawal-fee": "Withdrawal charges", "published-processing-times": "Published timings", "withdrawal-requirements": "Payment rules",
  "identity-and-address-requirements": "Verification", "demo-account": "Demo account", "retail-and-professional-accounts": "Account choices",
  "supported-mobile-platforms": "Mobile trading", "platform-and-availability": "Web platform", "real-stocks-and-etfs": "Asset ownership", "leverage-by-product-and-region": "Leverage", "product-restrictions": "Restrictions", "cfds-and-underlying-markets": "Available markets",
};

function Citations({ ids, review }: { ids: string[]; review: BrokerReview }) {
  return <sup className="review-citations">{ids.map(id => <a key={id} href={`#source-${id}`} aria-label={`Source: ${review.sources.find(s => s.id === id)?.title}`}>[{review.sources.findIndex(s => s.id === id) + 1}]</a>)}</sup>;
}
function FactTable({ fields, review, caption }: { fields: ReviewField[]; review: BrokerReview; caption: string }) {
  return <div className="br-table-scroll" role="region" aria-label={caption} tabIndex={0}><table className="br-comparison"><caption>{caption}</caption><thead><tr><th scope="col">What to check</th><th scope="col">Documented finding</th></tr></thead><tbody>{fields.map(field => { const source = review.sources.find(s => s.id === field.sourceIds[0]); return <tr key={field.id}><th scope="row">{source ? <a href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`${review.broker.name}: ${labels[field.id] ?? field.label}`}>{labels[field.id] ?? field.label}</a> : labels[field.id] ?? field.label}</th><td><Finding field={field} review={review} /></td></tr>; })}</tbody></table></div>;
}

export function EditorialReviewPage({ review, research, countries = [] }: { review: BrokerReview; research?: ResearchEntry; countries?: string[] }) {
  const digest = reviewDigest(review, research);
  const accounts = reviewAccounts(review);
  const facts = reviewQuickFacts(review);
  const verdict = verdictSentences(review);
  const faqs = flowFaqs(review);
  const score = scoreValue(review.overallScore, review);
  const section = (id: string) => digest.sections.find(s => s.id === id)!;
  const fees = section("fees"), safety = section("safety"), funding = section("deposit-and-withdrawal"), opening = section("account-opening");
  const platformFields = [...section("mobile-app").fields, ...section("web-platform").fields];
  const productFields = section("product-selection").fields;
  const dates = [...digest.sources.map(s => s.checkedAt), ...(research?.sources.map(s => s.checkedAt) ?? [])].sort();
  const checked = dates.at(-1);
  const dateLabel = checked ? new Date(`${checked}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "Sources pending";
  const links = [{ id: "overview", label: "Pros & cons" }, { id: "account-opening", label: "Account types" }, { id: "fees", label: "Trading costs" }, { id: "deposit-and-withdrawal", label: "Withdrawals" }, { id: "safety", label: "Safety & regulation" }, ...(platformFields.length ? [{ id: "platforms", label: "Platforms & markets" }] : []), ...(review.customerReviews ? [{ id: "customer-reviews", label: "Customer reviews" }] : []), ...(faqs.length ? [{ id: "review-faq", label: "FAQs" }] : []), { id: "sources", label: "Sources & method" }];
  const dataUrl = `/reviews/${review.broker.slug}/data${review.jurisdiction ? `?country=${encodeURIComponent(review.jurisdiction)}` : ""}`;
  const feeSource = digest.sources.find(s => s.id === fees.fields[0]?.sourceIds[0]);
  const payments = review.broker.slug === "exness" && checkedField(review, "published-processing-times");
  return <main className="br-review" id="review-main">
    <header className="br-hero" id="key-data">
      <div className="br-container">
        <div className="br-topline"><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/reviews">Broker reviews</Link><span>/</span><span>{review.broker.name}</span></nav><ReaderDisclosure affiliate={Boolean(accountOpeningHref(review)) && review.accountOpening.isAffiliate} officialLink={Boolean(accountOpeningHref(review)) && !review.accountOpening.isAffiliate} /></div>
        <p className="br-eyebrow">Devin Forex · Global broker research</p>
        <h1>{reviewHeading(review).split(":")[0]}</h1>
        <aside className="br-verdict-box" aria-label="Review verdict">
          <div className="br-verdict-copy"><div className="br-verdict-label"><strong>Our verdict</strong><div className="br-rating"><span aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Star size={20} key={i} fill={score && review.overallScore && i < Math.round(review.overallScore.value) ? "currentColor" : "none"} />)}</span><strong>{score ?? "Not rated"}</strong></div></div>
            <p>{verdict.join(" ")}</p>
            <p className="br-verdict-scope">{review.jurisdiction === "Global" ? "Global overview · Country and entity terms vary" : digest.sources[0]?.legalEntity ?? "Entity not yet verified"} · Source-based research.</p>
          </div>
          <div className="br-verdict-action"><ReaderMarket current={review.jurisdiction} countries={countries} slug={review.broker.slug} /><AccountOpeningCta review={review} placement="hero" compact /></div>
        </aside>
        <div className="br-meta"><span><Globe2 size={18} />{review.jurisdiction === "Global" ? "Global overview" : review.jurisdiction ?? "Country not verified"}</span><span><Clock3 size={18} />Latest source check {dateLabel}</span><span className="br-status">{review.status === "draft" ? "Draft · editorial check pending" : "Published review"}</span>{review.author && <span>Written by {review.author.name}</span>}</div>
        <section className="br-quick-section" aria-label="Broker quick facts"><h2>{review.broker.name} at a glance</h2><dl className="br-quick-grid">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.state === "yes" ? <Check className="br-yes" size={22} aria-label="Yes" /> : fact.state === "no" ? <X className="br-no" size={22} aria-label="No" /> : fact.state === "unknown" ? <CircleHelp size={19} aria-label="Unverified" /> : null}<span>{fact.value}</span>{fact.sourceIds.length > 0 && <Citations ids={fact.sourceIds} review={review} />}</dd></div>)}</dl></section>
      </div>
    </header>
    <div className="br-container br-layout">
      <aside className="br-sidebar" aria-label="Broker research summary"><div className="br-sticky"><ReaderContents links={links} /><div className="br-editor-note"><ShieldCheck size={22} /><h2>Check the entity.</h2><p>Country, account and payment terms can change.</p><Link href="/about#research-methodology">Research method<ArrowUpRight size={17} /></Link></div></div></aside>
      <article className="br-article" aria-label={`${review.broker.name} review article`}>
        <section className="br-section" id="overview"><h2>{review.broker.name} pros and cons</h2><div className="br-tradeoffs"><div><h3><Check className="br-yes" size={22} />Pros</h3><ul>{digest.positives.length ? digest.positives.map(p => <li key={p.title}><a href={review.sources.find(s => s.id === p.sourceIds[0])?.url} target="_blank" rel="noopener noreferrer">{p.title}</a><p>{p.explanation}</p></li>) : <li>Assessment in progress</li>}</ul></div><div><h3><X className="br-no" size={22} />Cons & checks</h3><ul>{digest.cautions.length ? digest.cautions.map(p => <li key={p.title}><a href={review.sources.find(s => s.id === p.sourceIds[0])?.url} target="_blank" rel="noopener noreferrer">{p.title}</a><p>{p.explanation}</p></li>) : <li>Full regional account terms still need checking</li>}</ul></div></div><AccountOpeningCta review={review} placement="overview" compact /></section>

        <section className="br-section" id="account-opening"><h2>{review.broker.name} account types</h2>
          {accounts.length ? <><div className="br-table-scroll" role="region" aria-label="Account comparison" tabIndex={0}><table className="br-comparison br-account-table"><caption>{review.jurisdiction === "Global" ? "Advertised international account comparison" : `Published ${review.jurisdiction} account comparison`}</caption><thead><tr><th scope="col">Account</th><th scope="col">Spread</th><th scope="col">Commission</th><th scope="col">{review.jurisdiction === "Global" ? "Minimum first deposit" : "Minimum deposit"}</th></tr></thead><tbody>{accounts.map(account => <tr key={account.name}><th scope="row"><a href={review.sources.find(s => s.id === account.sourceIds[0])?.url} target="_blank" rel="noopener noreferrer">{account.name} account</a><span>{account.category}</span></th><td>{account.spread}</td><td>{account.commission}</td><td>{account.minimumSourceIds?.length ? <a href={review.sources.find(s => s.id === account.minimumSourceIds?.[0])?.url} target="_blank" rel="noopener noreferrer" aria-label={`${account.name} minimum first-deposit requirements`}>{account.minimum}</a> : account.minimum}</td></tr>)}</tbody></table></div><p className="br-table-note">Advertised terms, not measured spreads. Commissions are per side where stated; opening and closing a trade can each incur a charge. First deposits must also meet payment-method limits; confirm your region’s amount in the Personal Area.</p>
            {review.broker.slug === "exness" && <p className="br-table-note">¹ “Professional” is the product range name, not a confirmed regulatory client classification.</p>}
            {review.broker.slug === "fxpesa" && <p className="br-table-note">² Account-level average, not a measured EUR/USD spread. ³ Product-specific commission conditions apply.</p>}
            {review.broker.slug === "pepperstone" && <p className="br-table-note">⁴ A bank-wire no-minimum exception is listed. ⁵ Charges vary by platform, account currency and instrument.</p>}
          </> : <p className="br-empty">Account tiers and their regional costs have not yet been verified.</p>}
          {opening.fields.length > 0 && <details className="br-opening-details"><summary>Opening requirements & demo conditions<ChevronDown size={18} /></summary><FactTable fields={opening.fields} review={review} caption="Before applying" /></details>}
        </section>
        <AccountOpeningCta review={review} placement="after-account-opening" compact />

        <section className="br-section" id="fees"><h2>Trading fees, spreads and commissions</h2><p className="br-answer">{fees.fields.length ? "Compare spread and commission together, then allow for overnight financing and payment charges. Advertised minimum spreads are not typical or guaranteed execution costs." : "A complete fee schedule for this country and entity has not yet been verified. Do not substitute costs from another group company."}</p>{fees.fields.length > 0 && <FactTable fields={fees.fields} review={review} caption="Trading costs and exceptions" />}{feeSource && <a className="br-text-link" href={feeSource.url} target="_blank" rel="noopener noreferrer">Check the published fee schedule<ArrowUpRight size={17} /></a>}</section>

        <section className="br-section" id="deposit-and-withdrawal"><h2>Deposit and withdrawal methods</h2>{payments && <aside className="br-callout" aria-label="Withdrawal timing note"><Clock3 size={23} /><div><h3>Automatic processing ≠ instant arrival</h3><p>The provider lists 24/7 requests, including weekends. Bank and payment-provider settlement can take longer; non-instant requests are described as processed within 24 hours. Check the <a href={review.sources.find(s => s.id === payments.sourceIds[0])?.url} target="_blank" rel="noopener noreferrer">Exness withdrawal processing conditions</a>.</p></div></aside>}{funding.fields.length ? <FactTable fields={funding.fields} review={review} caption="Funding, fees and published timings" /> : <p className="br-empty">Regional payment methods, charges and settlement times still need verification.</p>}</section>

        <section className="br-section" id="safety"><h2>Is {review.broker.name} safe? Regulation and security</h2><p className="br-answer">A licence applies to its named legal entity. It does not guarantee returns, account eligibility or protection against trading losses.</p>{safety.fields.length ? <FactTable fields={safety.fields} review={review} caption="Legal entity and documented protections" /> : <p className="br-empty">The legal entity and regulatory permissions are not yet verified.</p>}{review.entities && review.entities.length > 0 && <details className="br-entity-details"><summary>View the group’s disclosed legal entities<ChevronDown size={18} /></summary><div className="br-table-scroll" role="region" aria-label="Group legal entities" tabIndex={0}><table className="br-comparison"><thead><tr><th scope="col">Entity / location</th><th scope="col">Provider-reported permission</th></tr></thead><tbody>{review.entities.map(entity => <tr key={`${entity.name}-${entity.country}`}><th scope="row">{entity.name}<br />{entity.country}</th><td><a href={review.sources.find(s => s.id === entity.sourceId)?.url} target="_blank" rel="noopener noreferrer">{entity.regulator ?? "Permission not established"}{entity.licence ? ` · ${entity.licence}` : ""}</a>{entity.note && <p>{entity.note}</p>}</td></tr>)}</tbody></table></div></details>}<aside className="br-callout" aria-label="Trading risk"><ShieldCheck size={23} /><p>Leveraged forex and CFDs can cause substantial losses. Confirm your contracting company and protection terms before funding an account.</p></aside></section>
        <AccountOpeningCta review={review} placement="after-safety" compact />

        {platformFields.length > 0 && <section className="br-section" id="platforms"><h2>Platforms and available markets</h2><FactTable fields={[...platformFields, ...productFields.slice(0, 1)]} review={review} caption="Documented platform access" /></section>}
        <section className="br-conclusion" id="verdict"><h2>Should you consider {review.broker.name}?</h2><p>{digest.conclusion}</p><Link href="/best-brokers">Compare broker research<ArrowRight size={18} /></Link></section>
        <AccountOpeningCta review={review} placement="verdict" compact />
        {review.customerReviews && <section className="br-section br-customer-reviews" id="customer-reviews"><h2>Customer reviews on Trustpilot</h2><p>Read current customer feedback and check the company profile’s website matches the broker. These are individual experiences, not verified trading results or proof of safety.</p><a href={review.customerReviews.url} target="_blank" rel="noopener noreferrer">Find {review.broker.name} customer reviews on Trustpilot<ArrowUpRight size={18} /></a><p className="br-table-note">Trustpilot ratings and review counts have not been independently retrieved for this page.</p></section>}
        {faqs.length > 0 && <section className="br-section br-faq" id="review-faq"><h2>Frequently asked questions</h2>{faqs.map(faq => <details key={faq.question}><summary><h3>{faq.question}<ChevronDown size={20} /></h3></summary><p>{faq.answer}</p></details>)}</section>}
        <footer className="br-section br-sources" id="sources"><h2>Sources and review methodology</h2><p className="br-source-intro">{digest.sources.length ? "Provider documents describe advertised terms. Register checks confirm only the named licence holder. Terms can change." : "Collected sources are research leads; their statements are not approved account facts."}</p>
          {digest.sources.length > 0 ? <ol className="review-source-list" data-review-sources>{digest.sources.map((source, index) => <li key={source.id} id={`source-${source.id}`}><span>{index + 1}</span><div><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={17} /></a><small>{source.publisher} · {source.checkedAt}</small></div></li>)}</ol> : <div id="collected-research" className="br-research-notes">{digest.notes.map((note, i) => { const source = research?.sources.find(s => s.id === note.sourceId); return source ? <figure key={i}><blockquote>“{note.excerpt}”</blockquote><figcaption>Unverified · <a href={source.url} target="_blank" rel="noopener noreferrer">View source<ArrowUpRight size={17} /></a></figcaption></figure> : null; })}{!research?.sources.length && <p>No usable sources added yet.</p>}{research?.sources.length ? <ul>{research.sources.map(s => <li key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}<ArrowUpRight size={17} /></a></li>)}</ul> : null}</div>}
          <div className="br-method" id="methodology"><CircleHelp size={22} /><p>No live-account, execution or withdrawal test was performed. Editorial review is pending. <Link href="/about#research-methodology">How we research</Link>.</p></div><a className="br-data-download" href={dataUrl} download><ArrowDown size={17} />Download the complete research record</a>
          {review.broker.slug === "exness" && review.jurisdiction === "Global" && <a className="br-data-download" href="/templates/exness-review.html" download><ArrowDown size={17} />Download the standalone HTML example</a>}
        </footer>
        <section className="br-related" aria-label="Continue your research"><div><BookOpen size={22} /><h2>Continue your research</h2></div><Link href="/reviews"><span>Explore other broker reviews</span><ArrowUpRight size={19} /></Link><Link href="/tools"><span>Estimate your trading costs</span><ArrowUpRight size={19} /></Link></section>
        <p className="br-risk">General information, not investment advice. Your capital is at risk.</p>
      </article>
    </div>
  </main>;
}
