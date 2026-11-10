export type ResearchBroker = { slug: string; name: string };

// Local typographic marks identify the research subjects without loading assets
// or scripts from the reference page or a broker website.
export function BrokerMark({ broker }: { broker: ResearchBroker }) {
  const label = { exness: "ex", xm: "XM", "ic-markets": "IC", pepperstone: "P" }[broker.slug] ?? broker.name.slice(0, 2);
  return <span className={`cg-broker-mark cg-mark-${broker.slug}`} aria-hidden="true">{label}</span>;
}
