import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrokerMark, type ResearchBroker } from "./broker-mark";
import { countryBrokerMaster } from "@/lib/country-guides/broker-master";
import type { CountryResearchPresentation, GuideRegistry, ResearchFact } from "@/lib/country-guides/types";
import { httpsUrl } from "@/lib/country-guides/evidence";

function Fact({ fact, registry }: { fact: ResearchFact; registry: GuideRegistry }) {
  const source = registry.sources.find(source => source.id === fact.sourceId);
  const href = source?.url ?? fact.href;
  const safe = href?.startsWith("/reviews/") || httpsUrl(href ?? "");
  return <p>{href && safe ? <a className="cg-fact-source" href={href} title={fact.anchor} {...(href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{fact.text}<ArrowUpRight size={13} aria-hidden="true" /></a> : fact.text}</p>;
}

export function ResearchStatusTable({ brokers, countryName, presentation, registry }: { brokers: ResearchBroker[]; countryName: string; presentation: CountryResearchPresentation | null; registry: GuideRegistry }) {
  const headers = presentation?.headers ?? ["Broker", "Review focus", `${countryName} eligibility`];
  return <section className="cg-section cg-research-snapshot" id="candidate-research" aria-labelledby="candidate-research-title">
    <div className="cg-comparison-heading"><div><p className="cg-eyebrow">The side-by-side view</p><h2 id="candidate-research-title">Forex brokers in {countryName}: comparison table</h2></div><span className="cg-comparison-count">{brokers.length} brokers · unranked</span></div>
    <p>{presentation?.description ?? `Global review links do not establish ${countryName} eligibility or local permission.`}</p>
    <div className={`cg-research-table ${presentation ? "cg-feature-comparison" : ""}`} data-columns={headers.length} role="region" aria-label={`${countryName} broker feature comparison`} tabIndex={0}>
      <table><caption>{presentation?.caption ?? "Research scope · country-specific evidence remains open"}</caption>
        <colgroup>{(presentation?.columnWidths ?? [25, 45, 30]).map((width, i) => <col key={i} style={{width: `${width}%`}} />)}</colgroup><thead><tr>{headers.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
        <tbody>{brokers.map(broker => {
          const record = countryBrokerMaster(broker.slug);
          const row = presentation?.rows.find(row => row.slug === broker.slug);
          return <tr key={broker.slug} id={`research-${broker.slug}`}>
            <th scope="row"><span className="cg-table-broker"><BrokerMark broker={broker} /><strong>{broker.name}</strong></span>{record?.reviewPath && <Link className="cg-review-link" href={record.reviewPath} aria-label={`Read ${broker.name} review`}>Read review<ArrowUpRight size={15} aria-hidden="true" /></Link>}{row?.signupUrl && httpsUrl(row.signupUrl) && <a className="cg-signup-link" href={row.signupUrl} target="_blank" rel="nofollow noopener noreferrer" aria-label={`Official ${broker.name} sign-up`}>Sign up<ArrowUpRight size={15} aria-hidden="true" /></a>}</th>
            {row ? row.cells.map((fact, i) => <td key={headers[i + 1]} data-label={headers[i + 1]}><Fact fact={fact} registry={registry} /></td>) : <><td data-label="Review focus">{record?.readingFocus}</td><td data-label={`${countryName} eligibility`}>Not established</td></>}
          </tr>;
        })}</tbody>
      </table>
    </div>
    {presentation?.footnote && <p className="cg-comparison-footnote">{presentation.signupNote && <strong>Reading the prices: </strong>}{presentation.footnote}</p>}
    {presentation?.signupNote && <p className="cg-cta-note"><strong>Before using a sign-up link: </strong>{presentation.signupNote}</p>}
  </section>;
}

export function TraderFitTable({ content }: { content?: CountryResearchPresentation["traderFit"] }) {
  const defaults = [
    ["Beginner", "XM / Exness Standard", "Compare demo access, order controls and learning support."],
    ["Cost-conscious", "IC Markets Raw / Pepperstone Razor", "Add commission to spread; include overnight and conversion costs."],
    ["Mobile-first", "Exness / XM / Pepperstone apps", "Check device compatibility and account/platform restrictions."],
    ["Swap-free", "Exness / XM / IC Markets terms", "Check eligibility, covered symbols and replacement holding fees."],
    ["MT4/MT5 or EAs", "XM / IC Markets / Pepperstone", "Confirm supported account, EA rules and connectivity requirements."],
  ];
  const table = content?.table ?? { headers: ["Priority", "Compare", "Deciding check"], rows: defaults, caption: "Research starting points, subject to local eligibility and permission" };
  return <section className="cg-section" id="trader-fit"><p className="cg-eyebrow">Start with your needs</p><h2>{content?.title ?? "Which broker features matter to you?"}</h2><div className="cg-decision-table" role="region" aria-label="Broker research by trader priority" tabIndex={0}><table><caption>{table.caption}</caption><thead><tr>{table.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td data-label={table.headers[j]} key={j}>{cell}</td>)}</tr>)}</tbody></table></div></section>;
}
