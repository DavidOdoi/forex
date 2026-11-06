import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/insights/article-content";
import { insightArticles, getInsight, insightDate, readingMinutes, relatedInsights } from "@/lib/insights/catalog";
import { insightMetadata, insightStructuredData } from "@/lib/insights/seo";
import { davidOdoi } from "@/lib/authors";
import "../insights.css";

export const dynamicParams = false;
export function generateStaticParams() {
  return insightArticles.map(article => ({ slug: article.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  return article ? insightMetadata(article) : {};
}
export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();
  const headings = article.blocks.filter(block => block.type === "heading" && block.level === 2);
  const navLinks = headings.map(heading => heading.type === "heading" && <a key={heading.id} href={`#${heading.id}`}>{heading.text}</a>);
  const related = relatedInsights(article);
  return <main className="insights-page">
    <div className="insight-container">
      <nav className="insight-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/insights">Insights</Link><span aria-hidden="true">/</span><span aria-current="page">{article.title}</span></nav>
      <div className="insight-layout">
        <aside className="insight-toc"><nav aria-label="On this page"><strong>On this page</strong>{navLinks}</nav></aside>
        <article className="insight-article">
          <details className="insight-toc-mobile"><summary>On this page</summary><nav aria-label="On this page">{navLinks}</nav></details>
          <header className="insight-article-header"><p className="insight-kicker">{article.topic}</p><h1>{article.title}</h1>
            <div className="insight-byline"><span>By <Link href={davidOdoi.profileUrl}>{davidOdoi.name}</Link></span><span>Published <time dateTime={article.publishedAt}>{insightDate(article.publishedAt)}</time></span><span>{readingMinutes(article)} min read</span><span>Research prepared {insightDate(article.researchPreparedAt)}</span></div>
          </header>
          <ArticleContent article={article} />
          <section className="insight-author" aria-labelledby="about-the-author"><h2 id="about-the-author">About the author</h2><p className="insight-author-role"><Link href={davidOdoi.profileUrl}>{davidOdoi.name}</Link> · Author at Devin Forex</p><p>{article.authorBio}</p></section>
          <section className="insight-disclaimer" aria-labelledby="article-disclaimer"><h2 id="article-disclaimer">Disclaimer</h2><p>{article.disclaimer}</p></section>
        </article>
      </div>
      <aside className="insight-related" aria-labelledby="related-guides"><h2 id="related-guides">Keep exploring</h2><div className="insight-related-links">{related.map(other => <Link key={other.slug} href={`/insights/${other.slug}`}><span>{other.topic}</span>{other.title}</Link>)}</div></aside>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(insightStructuredData(article)).replace(/</g, "\\u003c") }} />
  </main>;
}
