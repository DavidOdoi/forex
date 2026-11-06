import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/insights/article-card";
import { insightCategories, insightGuides } from "@/lib/insights/catalog";
import { insightsIndexable } from "@/lib/insights/seo";
import { canonical, siteOrigin } from "@/lib/site";
import "./insights.css";

export const metadata: Metadata = {
  title: { absolute: "Trading Insights, Guides & Strategies — Devin Forex" },
  description: "Read practical guides to trading platforms, automation, swing indicators and risk, with documented sources, clear examples and transparent limitations.",
  alternates: canonical("/insights"),
  robots: { index: insightsIndexable, follow: true },
  openGraph: { title: "Trading Insights — Devin Forex", description: "Practical trading guides, tools and risk-management explanations.", type: "website", url: new URL("/insights", siteOrigin).href },
  twitter: { card: "summary_large_image", title: "Trading Insights — Devin Forex", description: "Explore trading tools, platforms, strategies and risk." },
};

export default function InsightsPage() {
  return <main className="insights-page"><div className="insight-container">
    <header className="insight-index-header"><p className="insight-kicker">The Devin Forex learning library</p><h1>Understand the tools.<br />Build a better process.</h1><p>Practical guides to trading platforms, automation and risk. Clear explanations, documented sources and examples you can evaluate for yourself.</p>
      <nav className="insight-category-links" aria-label="Browse insight topics"><a href="#beginner-guides">Beginner guides</a><a href="#strategies">Strategies & risk</a><a href="#market-guides">Platforms & technology</a></nav>
    </header>
    {insightCategories.map(category => <section key={category.id} id={category.id} className="insight-library-section" aria-labelledby={`${category.id}-title`}><h2 id={`${category.id}-title`}>{category.title}</h2><p>{category.description}</p><div className="insight-card-grid">{insightGuides.filter(article => article.category === category.id).map(article => <ArticleCard key={article.slug} article={article} />)}</div></section>)}
    <aside className="insight-library-note"><p>Prefer a reading list? Explore our <Link href="/insights/best-swing-trading-books">swing-trading book guide</Link>.</p><p>Guides use public documentation and labelled examples. Trading involves risk; product availability and provider terms vary by jurisdiction.</p><p>See the <Link href="/insights/image-credits">image sources and licences</Link> or learn about our <Link href="/about#research-methodology">research approach</Link>.</p></aside>
  </div></main>;
}
