import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Clock3, Globe2, ShieldCheck, Star, X } from "lucide-react";
import type { BrokerReview, ReviewField } from "@/lib/reviews/types";
import { providerLabels, type ResearchEntry } from "@/lib/reviews/research-types";
import { reviewDigest } from "@/lib/reviews/digest";
import { checkedField, reviewAccounts, reviewQuickFacts, verdictSentences, flowFaqs } from "@/lib/reviews/flow";
import { accountOpeningHref, scoreValue } from "@/lib/reviews/template";
import { isReviewPublished } from "@/lib/reviews/publication";
import { CostIllustration, EditorialAccountability, ResearchComparisons, RelatedResearch } from "./editorial-extras";
import { reviewHeading } from "@/lib/reviews/seo";
import { reviewPlatformImage } from "@/lib/reviews/media";
import { Finding } from "./finding";
import { AccountOpeningCta } from "./account-cta";
import { ReaderContents, ReaderDisclosure, ReaderMarket } from "./reader-controls";
import { RoundTripCost } from "./round-trip-cost";
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

function DirectoryLeads({ entry }: { entry: ResearchEntry }) {
  const leads = [...new Set([...entry.sourceCandidates, ...(entry.websiteCandidate ? [entry.websiteCandidate] : [])])].slice(0, 3);
  return leads.length ? <aside className="br-directory-leads"><h3>Directory research leads</h3><p>These URLs came from the CSV; their contents and provider identity have not been verified.</p><ul>{leads.map((url, index) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{entry.name}: directory source {index + 1}</a></li>)}</ul></aside> : null;
}

export function EditorialReviewPage({ review, research, countries = [], demo = false }: { review: BrokerReview; research?: ResearchEntry; countries?: string[]; demo?: boolean }) {
  const retail = !review.providerType || review.providerType === "retail";
  const digest = reviewDigest(review, research);
  const accounts = reviewAccounts(review);
  const facts = reviewQuickFacts(review);
  const verdict = verdictSentences(review);
  const faqs = flowFaqs(review);
  const score = scoreValue(review.overallScore, review);
  const section = (id: string) => digest.sections.find(s => s.id === id)!;
  const fees = section("fees"), safety = section("safety"), funding = section("deposit-and-withdrawal"), opening = section("account-opening");
  const platformFields = [...section("mobile-app").fields, ...section("web-platform").fields];
  const markets = checkedField(review, "cfds-and-underlying-markets");
  const detailedExness = review.broker.slug === "exness" && review.jurisdiction === "Global" && accounts.length > 0;
  const platformImage = detailedExness ? reviewPlatformImage(review) : undefined;
  const hasPlatforms = accounts.some(account => account.platforms);
  const safetyFields = safety.fields.filter(field => !detailedExness || field.id !== "contracting-legal-entity");
  const feeFields = fees.fields.filter(field => !detailedExness || field.id !== "forex-spread-and-commission");
  const fundingFields = funding.fields.filter(field => !detailedExness || field.id !== "published-processing-times");
  const paymentRules = detailedExness && checkedField(review, "withdrawal-requirements");
  if (paymentRules && !fundingFields.some(field => field.id === paymentRules.id)) fundingFields.push(paymentRules);
  const dates = (digest.sources.length ? digest.sources.map(s => s.checkedAt) : research?.sources.map(s => s.checkedAt) ?? []).sort();
  const checked = dates.at(-1);
  const dateLabel = checked ? new Date(`${checked}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "Sources pending";
  const links = [{ id: "overview", label: retail ? "Pros & cons" : "Research status" }, { id: "account-opening", label: retail ? "Account types" : "Access requirements" }, { id: "fees", label: retail ? "Trading costs" : "Service pricing" }, { id: "deposit-and-withdrawal", label: retail ? "Withdrawals" : "Funding & settlement" }, { id: "safety", label: "Safety & regulation" }, { id: "platforms", label: markets ? "Platforms & markets" : "Platform access" }, ...(detailedExness ? [{ id: "alternatives", label: "Compare entities" }] : []), ...(review.customerReviews ? [{ id: "customer-reviews", label: "Customer reviews" }] : []), ...(faqs.length ? [{ id: "review-faq", label: "FAQs" }] : []), { id: "sources", label: "Sources & method" }];
  const dataUrl = `/reviews/${review.broker.slug}/data${review.jurisdiction ? `?country=${encodeURIComponent(review.jurisdiction)}` : ""}`;
  const feeSource = digest.sources.find(s => s.id === (detailedExness ? "global-fees" : fees.fields[0]?.sourceIds[0]));
  const payments = review.broker.slug === "exness" && checkedField(review, "published-processing-times");
  const openingActions = <div className="br-verdict-action"><ReaderMarket current={review.jurisdiction} countries={countries} slug={review.broker.slug} />{retail && <AccountOpeningCta review={review} placement="hero" compact />}</div>;
  return <main className="br-review" id="review-main">
    <header className="br-hero" id="key-data">
      <div className="br-container">
        {demo && <p className="br-demo-banner">Template demonstration · <Link href="/reviews/exness">View the Exness research article</Link></p>}
        <div className="br-topline"><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/reviews">Broker reviews</Link><span>/</span><span>{review.broker.name}</span></nav><ReaderDisclosure affiliate={Boolean(accountOpeningHref(review)) && review.accountOpening.isAffiliate} officialLink={Boolean(accountOpeningHref(review)) && !review.accountOpening.isAffiliate} /></div>
        <p className="br-eyebrow">{retail ? "Global broker research" : "Global provider research"}</p>
        <h1>{reviewHeading(review)}</h1>{!retail && <p className="br-provider-note">Directory classification: {providerLabels[review.providerType!]}. Verification is pending; retail account access is not assumed.</p>}
        {detailedExness && <div className="br-intro">
          <p>This Exness review examines whether the broker’s forex and CFD accounts fit your needs. Your decision depends on <a href="#fees">total trading costs</a>, your country’s <a href="#safety">contracting entity</a> and how you deposit or withdraw.</p>
          <p>Compare <a href="#account-opening">five account types</a>, minimum-deposit rules and platforms, then use the cost calculator to understand spread and commission. Findings come from linked public documents; live execution and withdrawals have not been tested.</p>
        </div>}
        <div className={platformImage ? "br-opening-grid" : undefined}>
        <aside className="br-verdict-box" aria-label="Review verdict">
          <div className="br-verdict-copy"><div className="br-verdict-label">{detailedExness ? <h2>Quick answer</h2> : <strong>{retail ? "Our verdict" : "Research summary"}</strong>}{retail && <div className="br-rating">{(!detailedExness || score) && <span aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Star size={20} key={i} fill={score && review.overallScore && i < Math.round(review.overallScore.value) ? "currentColor" : "none"} />)}</span>}<strong>{score ?? "Not rated"}</strong></div>}</div>
            <p>{detailedExness ? <><strong>{verdict[0]}</strong>{" "}{verdict.slice(1).join(" ")}</> : verdict.join(" ")}</p>
            {detailedExness && <dl className="br-fit"><div><dt>Safety</dt><dd>Protections depend on your account’s legal entity.</dd></div><div><dt>Withdrawals</dt><dd>24/7 requests; bank receipt can take longer.</dd></div></dl>}
            {!detailedExness && <p className="br-verdict-scope">{review.jurisdiction === "Global" ? "Global overview · Country and entity terms vary" : digest.sources[0]?.legalEntity ?? "Entity not yet verified"} · {digest.sources.length || research?.sources.length ? "Source-based research." : "Directory research; sources pending."}</p>}
          </div>
          {!platformImage && openingActions}
        </aside>
        {platformImage && <figure className="br-platform-image br-opening-image">
          <a href={platformImage.src} target="_blank" rel="noopener noreferrer" aria-label="View the Exness Terminal preview at full size"><Image src={platformImage.src} width={platformImage.width} height={platformImage.height} alt={platformImage.alt} loading="eager" fetchPriority="high" decoding="async" unoptimized /></a>
          <figcaption>Exness Terminal preview. <a href={platformImage.sourceUrl} target="_blank" rel="noopener noreferrer">Image: Exness</a>. Product illustration, not our live-account test. <a href={platformImage.src} target="_blank" rel="noopener noreferrer">View full size</a>.</figcaption>
        </figure>}
        {platformImage && openingActions}
        </div>
        <div className="br-meta"><span><Globe2 size={18} />{review.jurisdiction === "Global" ? "Global overview" : review.jurisdiction ?? "Country not verified"}</span><span><Clock3 size={18} />{checked ? `Latest source check ${dateLabel}` : "Source checks pending"}</span><span className="br-status">{!isReviewPublished(review) ? "Draft · editorial check pending" : "Published review"}</span></div>
        {review.author && <EditorialAccountability review={review} />}
        <section className="br-quick-section" aria-label="Broker quick facts"><h2>{review.broker.name} at a glance</h2><dl className="br-quick-grid">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.state === "yes" ? <Check className="br-yes" size={22} aria-label="Yes" /> : fact.state === "no" ? <X className="br-no" size={22} aria-label="No" /> : fact.state === "unknown" ? <CircleHelp size={19} aria-label="Unverified" /> : null}<span>{fact.value}</span>{fact.sourceIds.length > 0 && <Citations ids={fact.sourceIds} review={review} />}</dd></div>)}</dl></section>
      </div>
    </header>
    <div className="br-container br-layout">
      <aside className="br-sidebar" aria-label="Broker research summary"><div className="br-sticky"><ReaderContents links={links} /><div className="br-editor-note"><ShieldCheck size={22} /><h2>Check the entity.</h2><p>Terms vary by entity and location.</p><Link href="/about#research-methodology">Research method<ArrowUpRight size={17} /></Link></div></div></aside>
      <article className="br-article" aria-label={`${review.broker.name} review article`}>
        <section className="br-section" id="overview"><h2>{detailedExness ? "Exness review: pros and cons" : retail ? `${review.broker.name} pros and cons` : "Research findings and open questions"}</h2><div className="br-tradeoffs"><div><h3><Check className="br-yes" size={22} />{retail ? "Pros" : "Documented findings"}</h3><ul>{digest.positives.length ? digest.positives.map(p => <li key={p.title}><a href={review.sources.find(s => s.id === p.sourceIds[0])?.url} target="_blank" rel="noopener noreferrer">{p.title}</a><p>{p.explanation}</p></li>) : <li>Assessment in progress</li>}</ul></div><div><h3><X className="br-no" size={22} />{retail ? "Cons & checks" : "Open questions"}</h3><ul>{digest.cautions.length ? digest.cautions.map(p => <li key={p.title}><a href={review.sources.find(s => s.id === p.sourceIds[0])?.url} target="_blank" rel="noopener noreferrer">{p.title}</a><p>{p.explanation}</p></li>) : <li>Full regional account terms still need checking</li>}</ul></div></div>{retail && <AccountOpeningCta review={review} placement="overview" compact />}</section>

        <section className="br-section" id="account-opening"><h2>{retail ? `${review.broker.name} account types` : "Provider access requirements"}</h2>
          {detailedExness && <p className="br-answer">Compare Standard/Pro spread-only pricing against Zero/Raw Spread’s <a href="#fees">total trading costs</a>. Include both commission sides.</p>}
          {accounts.length ? <><div className="br-table-scroll" role="region" aria-label="Account comparison" tabIndex={0}><table className={`br-comparison br-account-table ${hasPlatforms ? "has-platforms" : ""}`}><caption>{review.jurisdiction === "Global" ? "Advertised account comparison" : `Published ${review.jurisdiction} account comparison`}</caption><thead><tr><th scope="col">Account</th><th scope="col">Spread</th><th scope="col">Commission / round trip</th>{hasPlatforms && <th scope="col">Platforms</th>}<th scope="col">{review.jurisdiction === "Global" ? "Minimum first deposit" : "Minimum deposit"}</th></tr></thead><tbody>{accounts.map(account => <tr key={account.name}><th scope="row"><a href={review.sources.find(s => s.id === account.sourceIds[0])?.url} target="_blank" rel="noopener noreferrer">{account.name} account</a><span>{account.category}</span></th><td data-label="Spread">{account.spread}</td><td data-label="Commission / round trip">{account.commission}{account.roundTripCommission && <span className="br-round-trip">Round trip: {account.roundTripCommission}</span>}</td>{hasPlatforms && <td data-label="Platforms">{account.platforms && <a href={review.sources.find(source => source.id === account.platformSourceIds?.[0])?.url} target="_blank" rel="noopener noreferrer">{account.platforms}</a>}</td>}<td data-label="Minimum first deposit">{account.minimumSourceIds?.length ? <a href={review.sources.find(s => s.id === account.minimumSourceIds?.[0])?.url} target="_blank" rel="noopener noreferrer" aria-label={`${account.name} minimum first-deposit requirements`}>{account.minimum}</a> : account.minimum}</td></tr>)}</tbody></table></div><p className="br-table-note">Advertised floors; actual spreads vary. Round-trip commissions assume equal opening/closing rates. Deposit limits vary.</p>
            {review.broker.slug === "exness" && <p className="br-table-note">¹ “Professional” names the product range, not a regulatory client classification.</p>}
            {detailedExness && <p className="br-table-note">² <a href={review.sources.find(source => source.id === "global-cent")?.url} target="_blank" rel="noopener noreferrer">Standard Cent uses cent lots</a>: 1 cent lot = 0.01 standard lot. A US$5 deposit displays as 500 USC; this is not extra money.</p>}
            {review.broker.slug === "fxpesa" && <p className="br-table-note">² Account-level average, not a measured EUR/USD spread. ³ Product-specific commission conditions apply.</p>}
            {review.broker.slug === "pepperstone" && <p className="br-table-note">⁴ A bank-wire no-minimum exception is listed. ⁵ Charges vary by platform, account currency and instrument.</p>}
          </> : <p className="br-empty">{retail ? "Account tiers and their regional costs have not yet been verified." : "Client classification, onboarding, minimum commitment and access terms require verification."}</p>}
          {!detailedExness && opening.fields.length > 0 && <details className="br-opening-details"><summary>Opening requirements & demo conditions<ChevronDown size={18} /></summary><FactTable fields={opening.fields} review={review} caption="Before applying" /></details>}
        </section>
        {retail && <AccountOpeningCta review={review} placement="after-account-opening" compact />}

        <section className="br-section" id="fees"><h2>{retail ? "Trading fees, spreads and commissions" : "Service pricing and charges"}</h2><p className="br-answer">{fees.fields.length ? "Add opening/closing commission to spread costs, then applicable swaps and external charges." : retail ? "A complete fee schedule for this country and entity has not yet been verified. Do not substitute costs from another group company." : "Commercial pricing and service charges have not been verified. Retail spreads and commissions are not assigned to this provider profile."}</p>{feeFields.length > 0 && <FactTable fields={feeFields} review={review} caption="Trading costs and exceptions" />}{retail && (detailedExness ? <RoundTripCost /> : <CostIllustration brokerName={review.broker.name} />)}{feeSource && <a className="br-text-link" href={feeSource.url} target="_blank" rel="noopener noreferrer">Check the published fee schedule<ArrowUpRight size={17} /></a>}</section>

        <section className="br-section" id="deposit-and-withdrawal"><h2>{retail ? "Deposit and withdrawal methods" : "Funding and settlement arrangements"}</h2>{payments && <aside className="br-callout" aria-label="Withdrawal timing note"><Clock3 size={23} /><div><h3>Automatic processing ≠ instant arrival</h3><ol className="br-payment-stages"><li><strong>Request:</strong> available 24/7.</li><li><strong>Broker:</strong> automatic, or non-instant processing described as within 24 hours.</li><li><strong>Receipt:</strong> receiving-provider settlement can take longer.</li></ol><a href={review.sources.find(source => source.id === payments.sourceIds[0])?.url} target="_blank" rel="noopener noreferrer">Exness withdrawal processing conditions</a></div></aside>}{fundingFields.length ? <FactTable fields={fundingFields} review={review} caption="Funding methods, fees and conditions" /> : <p className="br-empty">{retail ? "Regional payment methods, charges and settlement times still need verification." : "Funding channels, counterparty arrangements and settlement timelines require verification."}</p>}{detailedExness && <div className="br-withdrawal-check"><h3>Before your first withdrawal</h3><ul><li>Complete the verification requested in your Personal Area.</li><li>Check method limits, currency and receiving-provider fees.</li><li>Use an account in your name; save the transaction reference.</li></ul></div>}</section>

        <section className="br-section" id="safety"><h2>Is {review.broker.name} safe? Regulation and security</h2><p className="br-answer">Match your agreement’s company to its register entry. Regulation does not protect against trading losses.</p>{safetyFields.length ? <FactTable fields={safetyFields} review={review} caption="Legal entity and documented protections" /> : <p className="br-empty">The legal entity and regulatory permissions are not yet verified.</p>}{review.entities && review.entities.length > 0 && <details className="br-entity-details"><summary>Selected group entities and restrictions<ChevronDown size={18} /></summary><div className="br-table-scroll" role="region" aria-label="Group legal entities" tabIndex={0}><table className="br-comparison"><thead><tr><th scope="col">Entity / location</th><th scope="col">Provider-reported permission</th></tr></thead><tbody>{review.entities.map(entity => <tr key={`${entity.name}-${entity.country}`}><th scope="row">{entity.name}<br />{entity.country}</th><td><a href={review.sources.find(s => s.id === entity.sourceId)?.url} target="_blank" rel="noopener noreferrer">{entity.regulator ?? "Permission not established"}{entity.licence ? ` · ${entity.licence}` : ""}</a>{entity.note && <p>{entity.note}</p>}{entity.identitySourceId && <p className="br-register-check"><a href={review.sources.find(source => source.id === entity.identitySourceId)?.url} target="_blank" rel="noopener noreferrer">FSA identity/type matched</a>; licence number not displayed in this entry.</p>}</td></tr>)}</tbody></table></div></details>}<aside className="br-callout" aria-label="Trading risk"><ShieldCheck size={23} /><p>{retail ? "Leveraged forex and CFDs can exhaust your deposit. Advertised leverage is conditional; check margin limits and entity-specific protections before funding." : "Confirm the contracting company, client category, counterparty obligations and dispute arrangements before using a service."}</p></aside></section>
        {retail && <AccountOpeningCta review={review} placement="after-safety" compact />}

        <section className="br-section" id="platforms"><h2>{markets ? "Platforms and trading markets" : "Platform access and compatibility"}</h2>
          {platformFields.length ? <FactTable fields={[...platformFields, ...(markets ? [markets] : [])]} review={review} caption="Documented platform access" /> : <p className="br-empty">Platform compatibility, service interfaces and available markets require source verification.</p>}{detailedExness && <p className="br-platform-guide">Try <Link href="/insights/best-platforms-for-day-trading">desktop, browser and mobile workflows</Link> on a demo. Support response speed remains untested.</p>}</section>
        {detailedExness && <ResearchComparisons />}
        <section className="br-conclusion" id="verdict"><h2>{`Should you consider ${review.broker.name}?`}</h2><p>{detailedExness ? "Check your entity, costs and funding. Try a demo, limit risk and test a small withdrawal before adding capital." : digest.conclusion}</p><Link href={retail ? "/best-brokers" : "/reviews#all-providers"}>{retail ? "Compare broker research" : "Explore provider research"}<ArrowRight size={18} /></Link></section>
        {retail && <AccountOpeningCta review={review} placement="verdict" compact />}
        {review.customerReviews && <section className="br-section br-customer-reviews" id="customer-reviews"><h2>Customer reviews on Trustpilot</h2><p>Match the profile to the broker’s website. Experiences do not establish safety.</p><a href={review.customerReviews.url} target="_blank" rel="noopener noreferrer">Find {review.broker.name} customer reviews on Trustpilot<ArrowUpRight size={18} /></a><p className="br-table-note">Trustpilot blocks automated retrieval; no rating or count was collected.</p></section>}
        {faqs.length > 0 && <section className="br-section br-faq" id="review-faq"><h2>Frequently asked questions</h2>{faqs.map(faq => <details key={faq.question}><summary><h3>{faq.question}<ChevronDown size={20} /></h3></summary><p>{faq.answer}</p></details>)}</section>}
        <footer className="br-section br-sources" id="sources"><h2>Sources and review methodology</h2><p className="br-source-intro">{digest.sources.length ? detailedExness ? "Provider-reported terms; register checks cover identity/type only." : "Provider disclosures are attributed; independent register verification is pending. Dates are source checks, not editorial approval." : "Collected sources are research leads; their statements are not approved account facts."}</p>
          {detailedExness && <div className="br-table-scroll" role="region" aria-label="Evidence and testing status" tabIndex={0}><table className="br-comparison br-evidence-table"><caption>How we checked this Exness review</caption><thead><tr><th scope="col">Evidence</th><th scope="col">What it establishes</th></tr></thead><tbody><tr><th scope="row">Primary documents</th><td>Published terms; no independently measured spreads.</td></tr><tr><th scope="row">Seychelles FSA entry</th><td>Company identity/type only; not the licence number.</td></tr><tr><th scope="row">Live execution, withdrawals, support</th><td>Not tested. No performance score assigned.</td></tr></tbody></table></div>}{digest.sources.length > 0 ? <ol className="review-source-list" data-review-sources>{digest.sources.map((source, index) => <li key={source.id} id={`source-${source.id}`}><span>{index + 1}</span><div><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={17} /></a><small>{!detailedExness && <>{source.publisher} · </>}{source.checkedAt}</small></div></li>)}</ol> : <div id="collected-research" className="br-research-notes">{digest.notes.map((note, i) => { const source = research?.sources.find(s => s.id === note.sourceId); return source ? <figure key={i}><blockquote>“{note.excerpt}”</blockquote><figcaption>Unverified · <a href={source.url} target="_blank" rel="noopener noreferrer">View source<ArrowUpRight size={17} /></a></figcaption></figure> : null; })}{!research?.sources.length && <p>No usable sources added yet.</p>}{research?.sources.length ? <ul>{research.sources.map(s => <li key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}<ArrowUpRight size={17} /></a></li>)}</ul> : null}</div>}
          {!digest.sources.length && !research?.sources.length && research && <DirectoryLeads entry={research} />}
          <div className="br-method" id="methodology"><CircleHelp size={22} /><p>{research?.sources.length || digest.sources.length ? "Automated collection and AI-assisted drafting; no live tests." : "Directory-based starting profile; source collection and editorial checks are pending."} Editorial approval is separate. {accountOpeningHref(review) && review.accountOpening.isAffiliate ? "Affiliate links may earn compensation." : "No affiliate tracking is configured."} <Link href="/about#research-methodology">How we research</Link>.</p></div><a className="br-data-download" href={dataUrl} download><ArrowDown size={17} />Download the complete research record</a>
          {review.broker.slug === "exness" && review.jurisdiction === "Global" && <a className="br-data-download" href="/templates/exness-review.html" download><ArrowDown size={17} />Download the standalone HTML example</a>}
        </footer>
        <RelatedResearch review={review} />
        <p className="br-risk">{retail ? "General information, not investment advice. Your capital is at risk." : "Research information only. Access conditions and counterparty terms remain unverified."}</p>
      </article>
    </div>
  </main>;
}
