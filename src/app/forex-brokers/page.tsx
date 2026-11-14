import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { countryGuides, countryRegistry } from "@/lib/country-guides/catalog";
import { guideApproved } from "@/lib/country-guides/publication";
import { evaluationDate, countryGuidePath } from "@/lib/country-guides/seo";
import { canonical, indexable } from "@/lib/site";
import "./country-guides.css";

export const metadata: Metadata = {
  title: { absolute: "Forex Brokers by Country: Rules & Research | Devin Forex" },
  description: "Country-specific broker research starts with local rules, exact entities and evidence. Explore each guide's legal and editorial status before comparing providers.",
  alternates: canonical("/forex-brokers"),
  robots: { index: indexable, follow: true },
};
export default function CountryResearchIndex() {
  const asOf = evaluationDate();
  return <main className="cg-page cg-index"><div className="cg-container"><nav className="cg-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Forex Brokers by Country</span></nav><header className="cg-index-hero"><p className="cg-eyebrow">The country research library</p><h1>Local rules first.<br />Broker comparisons second.</h1><p>Registration availability, a foreign licence and permission to trade are different questions. Each country guide keeps its evidence and unanswered questions visible.</p></header><section className="cg-country-list" aria-labelledby="country-guides-heading"><h2 id="country-guides-heading">Forex Brokers by Country</h2>{countryGuides.map(country => <article className="cg-library-card" key={country.slug}><div><p className="cg-eyebrow">{guideApproved(country, countryRegistry, asOf) ? "Approved informational guide" : "Research draft · legal review pending"}</p><h3><Link href={countryGuidePath(country.slug)}>{country.name}</Link></h3><p>{country.directAnswer}</p></div><Link className="cg-text-link" href={countryGuidePath(country.slug)}>Read the country research <ArrowRight size={18} aria-hidden="true" /></Link></article>)}</section><aside className="cg-index-note"><ShieldCheck size={26} aria-hidden="true" /><p>Only individually researched guides are listed. Research status and outstanding checks remain visible; listing a guide does not certify its claims. Read our <Link href="/about#research-methodology">research methodology</Link> and <Link href="/about#corrections">corrections process</Link>.</p></aside></div></main>;
}
