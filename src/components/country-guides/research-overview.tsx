import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrokerMark, type ResearchBroker } from "./broker-mark";
import { countryBrokerMaster } from "@/lib/country-guides/broker-master";
import type { GuideRegistry } from "@/lib/country-guides/types";
import type { ResearchComparisonRow, ResearchFact } from "@/lib/country-guides/research-comparison";
import { httpsUrl } from "@/lib/country-guides/evidence";

function Fact({ fact, registry }: { fact: ResearchFact; registry: GuideRegistry }) {
  const source = registry.sources.find(source => source.id === fact.sourceId);
  const href = source?.url ?? fact.href;
  const safe = href?.startsWith("/reviews/") || httpsUrl(href ?? "");
  return <p>{href && safe ? <a className="cg-fact-source" href={href} title={fact.anchor} {...(href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{fact.text}<ArrowUpRight size={13} aria-hidden="true" /></a> : fact.text}</p>;
}

export function ResearchStatusTable({ brokers, countryName, comparison = [], registry }: { brokers: ResearchBroker[]; countryName: string; comparison?: ResearchComparisonRow[]; registry: GuideRegistry }) {
  const columns = ["Research entity / regulation", "Platforms", "Advertised FX pricing", "Account minimum (USD)", "Swap-free terms", `${countryName} funding`, "Research focus"];
  return <section className="cg-section cg-research-snapshot" id="candidate-research" aria-labelledby="candidate-research-title">
    <div className="cg-comparison-heading"><div><p className="cg-eyebrow">The side-by-side view</p><h2 id="candidate-research-title">Forex brokers in {countryName}: comparison table</h2></div><span className="cg-comparison-count">{brokers.length} brokers · unranked</span></div>
    <p>These are international account examples, not confirmed {countryName} offers. A foreign licence does not establish local authorization or the company that would serve you.</p>
    <div className={`cg-research-table ${comparison.length ? "cg-feature-comparison" : ""}`} role="region" aria-label={`${countryName} broker feature comparison`} tabIndex={0}>
      <table><caption>Broker-advertised terms · research snapshots from 4–10 November 2026</caption>
        <colgroup>{(comparison.length ? [16, 13, 12, 16, 13, 11, 9, 10] : [25, 45, 30]).map((width, i) => <col key={i} style={{width: `${width}%`}} />)}</colgroup><thead><tr><th scope="col">Broker</th>{(comparison.length ? columns : ["Review focus", `${countryName} eligibility`]).map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
        <tbody>{brokers.map(broker => {
          const record = countryBrokerMaster(broker.slug);
          const row = comparison.find(row => row.slug === broker.slug);
          return <tr key={broker.slug} id={`research-${broker.slug}`}>
            <th scope="row"><span className="cg-table-broker"><BrokerMark broker={broker} /><strong>{broker.name}</strong></span>{record?.reviewPath && <Link className="cg-review-link" href={record.reviewPath} aria-label={`Read ${broker.name} review`}>Read review<ArrowUpRight size={15} aria-hidden="true" /></Link>}{row && httpsUrl(row.signupUrl) && <a className="cg-signup-link" href={row.signupUrl} target="_blank" rel="nofollow noopener noreferrer" aria-label={`Official ${broker.name} sign-up`}>Sign up<ArrowUpRight size={15} aria-hidden="true" /></a>}</th>
            {row ? [row.regulation, row.platforms, row.pricing, row.minimum, row.swapFree, row.funding, row.focus].map((fact, i) => <td key={columns[i]} data-label={columns[i]}><Fact fact={fact} registry={registry} /></td>) : <><td data-label="Review focus">{record?.readingFocus}</td><td data-label={`${countryName} eligibility`}>Not established</td></>}
          </tr>;
        })}</tbody>
      </table>
    </div>
    <p className="cg-comparison-footnote"><strong>Reading the prices:</strong> “From” is an advertised floor, not a typical EUR/USD cost. Spreads vary. $3.50/lot/side costs $7 to open and close one lot, before spread and other fees.</p>
    {comparison.length > 0 && <p className="cg-cta-note"><strong>Before using a sign-up link:</strong> these are unpaid official destinations, not proof of Sri Lankan eligibility or lawful trading/funding. Confirm local requirements first. Leveraged forex/CFDs can produce substantial losses.</p>}
  </section>;
}

export function TraderFitTable() {
  const rows = [
    ["Beginner", "XM / Exness Standard", "Compare demo access, order controls and learning support."],
    ["Cost-conscious", "IC Markets Raw / Pepperstone Razor", "Add commission to spread; include overnight and conversion costs."],
    ["Mobile-first", "Exness / XM / Pepperstone apps", "Check device compatibility and account/platform restrictions."],
    ["Swap-free", "Exness / XM / IC Markets terms", "Check eligibility, covered symbols and replacement holding fees."],
    ["MT4/MT5 or EAs", "XM / IC Markets / Pepperstone", "Confirm supported account, EA rules and connectivity requirements."],
  ];
  return <section className="cg-section" id="trader-fit"><p className="cg-eyebrow">Start with your needs</p><h2>Which broker features matter to you?</h2><div className="cg-decision-table" role="region" aria-label="Broker research by trader priority" tabIndex={0}><table><caption>Research starting points, subject to local eligibility and permission</caption><thead><tr><th scope="col">Priority</th><th scope="col">Compare</th><th scope="col">Deciding check</th></tr></thead><tbody>{rows.map(([priority, brokers, check]) => <tr key={priority}><th scope="row">{priority}</th><td data-label="Compare">{brokers}</td><td data-label="Deciding check">{check}</td></tr>)}</tbody></table></div></section>;
}
