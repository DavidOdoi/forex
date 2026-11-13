"use client";

import { useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { BrokerMark, type ResearchBroker } from "./broker-mark";

export function ResearchShortlist({ brokers, checks }: { brokers: ResearchBroker[]; checks: { id: string; title: string }[] }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = ["Brokers", "Key checks"];
  return <section className="cg-shortlist" aria-labelledby="cg-shortlist-title">
    <h2 id="cg-shortlist-title">Brokers in this research</h2>
    <div className="cg-shortlist-tabs" role="tablist" aria-label="Research overview">
      {labels.map((label, i) => <button key={label} ref={node => { tabs.current[i] = node; }} type="button" role="tab" id={`cg-shortlist-tab-${i}`} aria-selected={selected === i} aria-controls={`cg-shortlist-panel-${i}`} tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - i;
        setSelected(next); tabs.current[next]?.focus();
      }}>{label}</button>)}
    </div>
    <div role="tabpanel" id="cg-shortlist-panel-0" aria-labelledby="cg-shortlist-tab-0" hidden={selected !== 0}>
      <ol className="cg-shortlist-brokers">{brokers.map((broker, i) => <li key={broker.slug}><a href={`#research-${broker.slug}`}><span>{i + 1}</span><BrokerMark broker={broker} /><span><strong>{broker.name}</strong><small>Research candidate</small></span><ChevronRight size={15} aria-hidden="true" /></a></li>)}</ol>
      <p>Unranked research subjects.</p>
    </div>
    <div role="tabpanel" id="cg-shortlist-panel-1" aria-labelledby="cg-shortlist-tab-1" hidden={selected !== 1}>
      <ul className="cg-shortlist-checks">{checks.map(check => <li key={check.id}><a href={`#${check.id}`}>{check.title}<ChevronRight size={15} aria-hidden="true" /></a></li>)}</ul>
    </div>
  </section>;
}
