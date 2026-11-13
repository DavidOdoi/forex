import Link from "next/link";
import { ArrowDown, ArrowUpRight, FileText, Info, ShieldAlert } from "lucide-react";
import type { AffiliateRegistry, CountryGuide, GuideRegistry } from "@/lib/country-guides/types";
import { approvalRecord, checkedSource, claimVerified, dateLabel, httpsUrl } from "@/lib/country-guides/evidence";
import { guideApproved, comparisonMappings } from "@/lib/country-guides/publication";
import { resolveCountryAffiliateLink } from "@/lib/country-guides/affiliate";
import { EvidenceClaim } from "./evidence";
import { CountryBrokerComparison } from "./broker-comparison";
import { CountrySectionNav } from "./section-nav";
import { ResearchShortlist } from "./research-shortlist";
import { ResearchStatusTable, TraderFitTable } from "./research-overview";
import { countryResearchComparison } from "@/lib/country-guides/research-comparison";
import { countryBrokerMaster } from "@/lib/country-guides/broker-master";
import { countrySuppliedResearch } from "@/lib/country-guides/supplied-research";

export const legalStatusLabels = { pending_review: "Pending legal review", restricted: "Restricted", unclear: "Legal position unclear", permitted: "Permitted within reviewed scope" };
export function CountryGuideContent({ country, registry, affiliates, asOf }: { country: CountryGuide; registry: GuideRegistry; affiliates: AffiliateRegistry; asOf: string }) {
  const approved = guideApproved(country, registry, asOf);
  const dossier = countrySuppliedResearch(country, asOf);
  const comparisons = comparisonMappings(country, registry, asOf);
  const firsthandSources = new Set(comparisons.flatMap(mapping => [mapping.platforms, mapping.fees, mapping.paymentMethods, mapping.suitability, ...mapping.strengths, ...mapping.limitations].filter(claim => claim.verification === "firsthand_tested" && claimVerified(claim, country.slug, mapping.entityId, registry, asOf)).flatMap(claim => claim.sourceIds)));
  const commercialCount = comparisons.filter(mapping => resolveCountryAffiliateLink(country, mapping, registry, affiliates, asOf)).length;
  const researchComparison = countryResearchComparison(country, asOf);
  const sources = country.sourceIds.map(id => registry.sources.find(source => source.id === id)).filter(source => source && source.kind !== "affiliate" && httpsUrl(source.url));
  const primaryChecks = sources.filter(source => source?.kind === "regulator" && checkedSource(source, asOf)).length;
  const author = registry.people.find(person => person.id === country.authorReference && person.roles.includes("author"));
  const legalReview = approvalRecord(country.legalReviewReference, "legal", country.slug, registry, asOf);
  const reviewed = legalReview && legalReview.legalStatus === country.legalStatus && legalReview.approvedAt === country.legalReviewedAt;
  const reviewer = reviewed ? registry.people.find(person => person.id === country.reviewerReference && person.id === legalReview.approvedBy) : null;
  const notice = registry.sources.find(source => source.id === country.legalSources[0]);
  const researchBrokers = (approved ? [] : dossier?.brokerResearch ?? []).flatMap(record => {
    const broker = countryBrokerMaster(record.brokerSlug);
    return broker ? [{ slug: broker.slug, name: broker.name }] : [];
  });
  const hasSection = (id: string) => country.sections.some(section => section.id === id);
  const sectionLinks = [
    ...(researchBrokers.length ? [{ id: "research-overview", label: "Compare brokers" }] : []),
    ...(researchComparison.length ? [{ id: "trader-fit", label: "Your trading needs" }] : []),
    ...(hasSection("costs-and-accounts") ? [{ id: "costs-and-accounts", label: "Costs & accounts" }] : []),
    ...(hasSection("platforms-and-accounts") ? [{ id: "platforms-and-accounts", label: "Platforms" }] : []),
    { id: "legal-status", label: "Local rules" },
    ...(hasSection("investment-rules-2026") ? [{ id: "investment-rules-2026", label: "2026 rules" }] : []),
    { id: "country-faq", label: "FAQs" }, { id: "country-sources", label: "Sources" },
  ];
  const questionStatus = (question: CountryGuide["questions"][number]) => question.status === "verified" && claimVerified(question.answer, country.slug, null, registry, asOf) ? "Evidence recorded" : question.status === "pending_review" ? "Pending review" : "Unknown";
  const initials = author?.name.split(/\s+/).map(word => word[0]).slice(0, 2).join("") ?? "DF";
  const intro = country.intro?.scope.countrySlug === country.slug && country.intro.scope.entityId === null ? country.intro.value : null;
  const evidence = (claim: CountryGuide["legalSummary"]) => <EvidenceClaim claim={claim} registry={registry} asOf={asOf} countrySlug={country.slug} entityId={null} narrative compact />;
  return <main className="cg-page cg-guide cg-compact" id="country-guide" data-country={country.slug} data-legal-status={country.legalStatus} data-publication={approved ? "approved" : "draft"}>
    <div className="cg-heading-band"><div className="cg-container">
      <div className="cg-heading-top"><nav className="cg-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">›</span><Link href="/forex-brokers">Forex Brokers by Country</Link><span aria-hidden="true">›</span><span aria-current="page">{country.name}</span></nav><a href="#methodology" className="cg-disclosure"><Info size={16} aria-hidden="true" />Disclosure</a></div>
      <header className="cg-hero"><p className="cg-eyebrow">Country guide · {country.name}</p><h1>{country.title}</h1>{intro && <p className="cg-standfirst">{intro}</p>}
        <section className="cg-answer" aria-labelledby="country-quick-answer"><div className="cg-answer-heading"><h2 id="country-quick-answer">Quick answer</h2><span className="cg-status-pill">{legalStatusLabels[country.legalStatus]}</span></div><p className="cg-direct-answer">{country.directAnswer}</p>{researchBrokers.length > 0 && <ul className="cg-answer-brokers" aria-label="Brokers covered in this comparison">{researchBrokers.map(broker => <li key={broker.slug}><a href={`#research-${broker.slug}`}>{broker.name}<ArrowDown size={15} aria-hidden="true" /></a></li>)}</ul>}</section>
        <div className="cg-byline">{author && <div className="cg-byline-person"><span className="cg-author-initials" aria-hidden="true">{initials}</span><Link href={author.profileUrl}>{author.name}</Link></div>}<span>{dossier ? `Reported research: ${dateLabel(dossier.reportedResearchDate)}` : `${primaryChecks} independent source checks`}</span><span>{approved ? "Approved informational guide" : "Research draft"}</span></div>
        <div className="cg-hero-actions"><a className="cg-primary-action" href={researchBrokers.length ? "#candidate-research" : "#legal-status"}>{researchBrokers.length ? "Compare the brokers" : "Read the local context"}<ArrowDown size={17} aria-hidden="true" /></a>{hasSection("costs-and-accounts") && <a className="cg-secondary-action" href="#costs-and-accounts">Compare total costs</a>}<a className="cg-list-note" href="#methodology">Research & affiliate disclosure</a></div>
      </header>
    </div></div>
    <CountrySectionNav items={sectionLinks} />
    <div className="cg-container">
      {researchBrokers.length > 0 && !approved && <div className="cg-overview" id="research-overview"><ResearchStatusTable brokers={researchBrokers} countryName={country.name} comparison={researchComparison} registry={registry} /></div>}
      <div className="cg-reading-layout">
      <article className="cg-article" aria-label={`${country.name} broker research`}>
        {researchComparison.length > 0 && <TraderFitTable />}
        <aside className="cg-legal-summary" id="legal-status" aria-labelledby="country-legal-title"><ShieldAlert size={23} aria-hidden="true" /><div><h2 id="country-legal-title">Local permission comes before account choice</h2>{evidence(country.legalSummary)}{notice && httpsUrl(notice.url) && <a className="cg-official-link" href={notice.url} target="_blank" rel="noopener noreferrer"><FileText size={17} aria-hidden="true" />Read the official reference<ArrowUpRight size={16} aria-hidden="true" /></a>}</div></aside>
        {country.sections.map(section => <section className="cg-section" key={section.id} id={section.id}><p className="cg-eyebrow">{section.eyebrow}</p><h2>{section.title}</h2>{section.paragraphs.map((claim, i) => <div key={i}>{evidence(claim)}</div>)}
          {section.table && <div className="cg-decision-table" role="region" aria-label={section.table.caption} tabIndex={0}><table><caption>{section.table.caption}</caption><thead><tr>{section.table.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td key={j} data-label={section.table!.headers[j]}>{cell}</td>)}</tr>)}</tbody></table></div>}
          {section.id === "costs-and-accounts" && <p className="cg-inline-resource">Use our <Link href="/tools/forex-calculator">forex calculator</Link> and <Link href="/tools/forex-position-size-calculator">position size calculator</Link> to understand the numbers.</p>}
          {section.id === "platforms-and-accounts" && <p className="cg-inline-resource">Explore <Link href="/insights/best-platforms-for-day-trading">desktop, browser and mobile platform choices</Link>.</p>}
          {section.points && <ul className="cg-bullets">{section.points.map(point => <li key={point}>{point}</li>)}</ul>}
        </section>)}
        <section className="cg-section" id="five-checks"><h2>Keep these five checks separate</h2><details className="cg-check-disclosure"><summary>See the eligibility and permission checklist <span aria-hidden="true">+</span></summary><ol className="cg-checks">{country.questions.map((question, i) => <li key={question.question} id={`country-check-${i + 1}`}><span className="cg-step-number" aria-hidden="true">0{i + 1}</span><div><h3>{question.question}</h3>{evidence(question.answer)}</div><span className="cg-status-pill">{questionStatus(question)}</span></li>)}</ol></details></section>
        <CountryBrokerComparison country={country} registry={registry} affiliates={affiliates} asOf={asOf} />
        <section className="cg-section" id="methodology"><p className="cg-eyebrow">How this guide was prepared</p><h2>Research method and transparency</h2><div className="cg-method-grid"><div><h3>Evidence</h3><p>{primaryChecks ? `${primaryChecks} regulator reference(s) have recorded checks; country and entity scope remain separate.` : "Reported sources; current-law review remains outstanding."}</p></div><div><h3>Testing & funding</h3><p>{firsthandSources.size ? `${firsthandSources.size} scoped record${firsthandSources.size === 1 ? "" : "s"}; firsthand statements apply only to those records.` : "No live-account, deposit, withdrawal or execution tests were performed."} {commercialCount ? "Paid links are identified beside each destination." : "The official sign-up links are unpaid; no affiliate links are active."}</p></div></div>
          {dossier && <aside className="cg-dossier-note" id="supplied-research-status" aria-label="Supplied research status"><p>Supplied research: {dateLabel(dossier.reportedResearchDate)}. Contributor access is not independent verification.</p></aside>}
          <p className="cg-accountability">{reviewed ? `Legal review recorded ${dateLabel(country.legalReviewedAt)}.${reviewer ? ` Reviewer: ${reviewer.name}.` : ""}` : "Legal review: not yet recorded."} Read our <Link href="/about#research-methodology">research approach</Link> and <Link href="/about#commercial-policy">commercial policy</Link>.</p>
        </section>
        <section className="cg-section cg-faq" id="country-faq"><p className="cg-eyebrow">Three quick answers</p><h2>Common questions about {country.name}</h2>{country.faqs.map(faq => <details key={faq.question}><summary><h3>{faq.question}</h3><span aria-hidden="true">+</span></summary>{evidence(faq.answer)}</details>)}</section>
        <section className="cg-section cg-sources" id="country-sources"><h2>Sources and verification</h2><p>Contributor access is reported below; independent checks remain pending. Broker documents are linked directly in the comparison.</p><details className="cg-source-disclosure"><summary>View {sources.length} official source records <span aria-hidden="true">+</span></summary><ol>{sources.map(source => source && <li key={source.id} id={`source-${source.id}`}><h3><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ArrowUpRight size={16} aria-hidden="true" /></a></h3><p>Published: {source.publishedAt ? `${dateLabel(source.publishedAt)}${source.publicationDateStatus === "supplied" ? " (reported)" : ""}` : "Not established"}. Contributor: {source.reportedAccess?.outcome === "accessed" ? "access reported" : source.reportedAccess?.outcome === "not_accessed" ? "Not accessed" : "Not established"}.</p>{source.dateNote && <p>{source.dateNote}</p>}</li>)}</ol></details><p className="cg-corrections">Send a dated primary source through our <Link href="/about#corrections">corrections process</Link>.</p></section>
      </article>
      <aside className="cg-sidebar">
        {researchBrokers.length > 0 && <ResearchShortlist brokers={researchBrokers} checks={country.questions.map((question, i) => ({ id: `country-check-${i + 1}`, title: question.question }))} />}
        <aside className="cg-status-card" aria-label="Country research decision"><ShieldAlert size={25} aria-hidden="true" /><h2>{legalStatusLabels[country.legalStatus]}</h2><p>{commercialCount ? "Paid links require individual approval." : "No paid affiliate links are active."}</p><a href="#legal-status">Read the local context <ArrowDown size={16} aria-hidden="true" /></a></aside>
      </aside>
    </div><footer className="cg-footer"><Link href="/forex-brokers">← Country research library</Link><p>General information, not individual legal or investment advice.</p></footer></div>
  </main>;
}
