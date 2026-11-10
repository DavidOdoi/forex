import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/insights/article-card";
import { insightCategories, insightGuides, forexCountryGuides } from "@/lib/insights/catalog";
import { insightsIndexable } from "@/lib/insights/seo";
import { canonical, siteOrigin } from "@/lib/site";
import "./insights.css";

export const metadata: Metadata = {
  title: { absolute: "Trading Insights, Guides & Strategies — Devin Forex" },
  description: "Read practical guides to trading platforms, crypto payments, indicators and risk, with documented sources, clear examples and transparent limitations.",
  alternates: canonical("/insights"),
  robots: { index: insightsIndexable, follow: true },
  openGraph: { title: "Trading Insights — Devin Forex", description: "Practical trading guides, tools and risk-management explanations.", type: "website", url: new URL("/insights", siteOrigin).href },
  twitter: { card: "summary_large_image", title: "Trading Insights — Devin Forex", description: "Explore trading tools, platforms, strategies and risk." },
};

export default function InsightsPage() {
  return <main className="insights-page"><div className="insight-container">
    <header className="insight-index-header"><p className="insight-kicker">The Devin Forex learning library</p><h1>Understand the tools.<br />Build a better process.</h1><p>Practical guides to trading platforms, crypto payments and risk. Clear explanations, documented sources and examples you can evaluate for yourself.</p>
      <nav className="insight-category-links" aria-label="Browse insight topics"><a href="#beginner-guides">Beginner guides</a><a href="#strategies">Strategies & risk</a><a href="#market-guides">Platforms & technology</a><a href="#crypto-payments">Crypto & payments</a></nav>
    </header>
    {insightCategories.map(category => <section key={category.id} id={category.id} className="insight-library-section" aria-labelledby={`${category.id}-title`}><h2 id={`${category.id}-title`}>{category.title}</h2><p>{category.description}</p>{category.id === "beginner-guides" && <nav className="insight-category-links insight-country-navigation" aria-label="Forex guides by country">{forexCountryGuides.map(article => <Link key={article.slug} href={`/insights/${article.slug}`}>{article.title.split(":")[0].replace("How to Start Forex Trading in ", "")}</Link>)}</nav>}<div className="insight-card-grid">{insightGuides.filter(article => article.category === category.id).map(article => <ArticleCard key={article.slug} article={article} />)}</div></section>)}
    <section className="insight-library-section" aria-labelledby="chart-reading-lab"><h2 id="chart-reading-lab">The chart-reading lab</h2><p>Original diagrams and hands-on examples for learning price structure.</p><article className="insight-library-note"><h3><Link href="/insights/triangle-chart-patterns">Triangle chart patterns: types, examples & breakouts</Link></h3><p>Compare three shapes, reveal successful and failed breaks, and practise recognition. Educational draft: independent source checks pending.</p></article></section>
    <section className="insight-library-section" aria-labelledby="prop-firm-resources"><h2 id="prop-firm-resources">Prop firm rules, made clearer</h2><p>Match your automated strategy to verified programme rules, then check a compatible consistency formula.</p><div className="insight-card-grid"><article className="insight-library-note"><h3><Link href="/best-prop-firm-forex-eas">Best prop firms for forex EAs</Link></h3><p>Compare five firms’ official EA policies, account restrictions and published fees.</p></article><article className="insight-library-note"><h3><Link href="/prop-firm-consistency-calculator">Prop firm consistency calculator</Link></h3><p>Use your total net profit, best day and chosen limit to calculate the remaining amount.</p></article></div></section>
    <aside className="insight-library-note"><p>Prefer a reading list? Explore our <Link href="/insights/best-swing-trading-books">swing-trading book guide</Link>.</p><p>Guides use public documentation and labelled examples. Trading involves risk; product availability and provider terms vary by jurisdiction.</p><p>See the <Link href="/insights/image-credits">image sources and licences</Link> or learn about our <Link href="/about#research-methodology">research approach</Link>.</p></aside>
  </div></main>;
}
