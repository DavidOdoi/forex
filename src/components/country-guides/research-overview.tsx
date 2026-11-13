import Link from "next/link";
import { CreditCard, Coins, Monitor, ShieldCheck, ArrowUpRight } from "lucide-react";
import { BrokerMark, type ResearchBroker } from "./broker-mark";
import { countryBrokerMaster } from "@/lib/country-guides/broker-master";

export function ResearchStatusTable({ brokers, countryName }: { brokers: ResearchBroker[]; countryName: string }) {
  return <section className="cg-section cg-research-snapshot" id="candidate-research" aria-labelledby="candidate-research-title">
    <p className="cg-eyebrow">Compare the research</p><h2 id="candidate-research-title">{brokers.length} brokers to research, not a ranked shortlist</h2>
    <p>Read the global reviews for account details. They do not confirm {countryName} resident eligibility, the serving entity or local authorization.</p>
    <div className="cg-research-table" role="region" aria-label={`${countryName} research candidate status`} tabIndex={0}>
      <table><caption>Research candidates · no local eligibility or signup recommendation implied</caption>
        <thead><tr><th scope="col">Broker</th><th scope="col">What to compare in the global review</th><th scope="col">{countryName} eligibility</th></tr></thead>
        <tbody>{brokers.map(broker => { const record = countryBrokerMaster(broker.slug); return <tr key={broker.slug} id={`research-${broker.slug}`}><th scope="row"><span className="cg-table-broker"><BrokerMark broker={broker} /><span>{broker.name}</span></span></th><td data-label="Review focus"><p>{record?.readingFocus}</p>{record?.reviewPath && <Link className="cg-review-link" href={record.reviewPath}>Read {broker.name} review<ArrowUpRight size={15} aria-hidden="true" /></Link>}</td><td data-label={`${countryName} eligibility`}><span className="cg-status-pill">Not established</span><span className="cg-table-detail">Country-specific checks remain open.</span></td></tr>; })}</tbody>
      </table>
    </div>
  </section>;
}

export function ReaderChecks({ questionIds, costsId, platformId, fundingId }: { questionIds: string[]; costsId?: string; platformId?: string; fundingId?: string }) {
  const checks = [
    { title: "Permission first", icon: ShieldCheck, text: "Check the resident category, exact company and local permissions separately.", target: questionIds.includes("country-check-3") ? "country-check-3" : "five-checks", link: "Check authorization" },
    { title: "Total cost", icon: Coins, text: "Compare spread, both commission sides, swaps, conversion and withdrawal charges.", target: costsId ?? "candidate-research", link: "Compare cost components" },
    { title: "Platform & account", icon: Monitor, text: "Confirm MT4/MT5 access and the precise swap-free account conditions.", target: platformId ?? "candidate-research", link: "Check account fit" },
    { title: "Local funding", icon: CreditCard, text: "Payment availability is separate from permission to make the transaction.", target: fundingId ?? "five-checks", link: "Read the payment context" },
  ];
  return <section className="cg-section cg-reader-checks" id="check-first" aria-labelledby="check-first-title"><h2 id="check-first-title">Start with these four checks</h2><div className="cg-reader-grid">{checks.map(check => <section key={check.title}><check.icon size={23} aria-hidden="true" /><h3>{check.title}</h3><p>{check.text}</p><a href={`#${check.target}`}>{check.link}</a></section>)}</div></section>;
}
