import { CreditCard, Coins, Monitor, ShieldCheck, ChevronRight } from "lucide-react";
import { BrokerMark, type ResearchBroker } from "./broker-mark";

export function ResearchStatusTable({ brokers, countryName }: { brokers: ResearchBroker[]; countryName: string }) {
  return <section className="cg-section cg-research-snapshot" id="candidate-research" aria-labelledby="candidate-research-title">
    <p className="cg-eyebrow">Research at a glance</p>
    <h2 id="candidate-research-title">What is verified for {countryName}?</h2>
    <p>These are research candidates, listed in dossier order. Country eligibility and local authorization remain unresolved; global account terms are not treated as local entitlements.</p>
    <p className="cg-table-hint">Scroll across the table to see every field.</p>
    <div className="cg-research-table" role="region" aria-label={`${countryName} research candidate status`} tabIndex={0}>
      <table>
        <caption>Research only · no broker scores, awards or signup links</caption>
        <thead><tr><th scope="col">Broker</th><th scope="col">Resident eligibility</th><th scope="col">Serving entity & local authorization</th><th scope="col">Platforms</th><th scope="col">Deposit & costs</th><th scope="col">Suitability</th></tr></thead>
        <tbody>{brokers.map(broker => <tr key={broker.slug} id={`research-${broker.slug}`}><th scope="row"><span className="cg-table-broker"><BrokerMark broker={broker} /><span>{broker.name}</span></span></th><td>Not established</td><td>Not established</td><td>Not verified</td><td>Not verified</td><td>Not assessed</td></tr>)}</tbody>
      </table>
    </div>
    <a className="cg-jump-link" href="#five-checks">What evidence is still needed? <ChevronRight size={16} aria-hidden="true" /></a>
  </section>;
}

const checks = [
  { title: "Regulation", icon: ShieldCheck, text: "Identify the company named in the client agreement. Check its registration with the relevant regulator and whether it may serve your resident category. A foreign licence alone does not establish local permission.", target: "country-check-3", link: "Check authorization" },
  { title: "Payments", icon: CreditCard, text: "Confirm that both the transaction and the payment method are lawful. A broker’s deposit options do not override local rules. Do not treat a different payment channel as a workaround for a restriction.", target: "country-check-4", link: "Check trading and funding" },
  { title: "Trading costs", icon: Coins, text: "Ask for the terms of the exact account and entity: spreads, commissions, swaps and other charges. Global advertised prices may not apply to residents of your country.", target: "candidate-research", link: "See cost status" },
  { title: "Platform support", icon: Monitor, text: "Check which platforms the actual serving entity offers for the account concerned. A group-wide MT4, MT5 or cTrader advertisement does not establish access for a particular resident.", target: "candidate-research", link: "See platform status" },
];

export function ReaderChecks({ questionIds }: { questionIds: string[] }) {
  return <section className="cg-section cg-reader-checks" id="check-first" aria-labelledby="check-first-title"><h2 id="check-first-title">What to check first</h2><div className="cg-reader-grid">{checks.map(check => {
    const target = check.target.startsWith("country-check-") && !questionIds.includes(check.target) ? "five-checks" : check.target;
    return <section key={check.title}><check.icon size={23} aria-hidden="true" /><h3>{check.title}</h3><p>{check.text}</p><a href={`#${target}`}>{check.link}<ChevronRight size={15} aria-hidden="true" /></a></section>;
  })}</div></section>;
}
