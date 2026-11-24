import { BrokerRecommendations } from "@/components/broker-recommendations/broker-recommendations";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import { getInsightImage, type InsightArticle, type InsightInfographic, type RichText } from "@/lib/insights/catalog";
import { linkPhrases } from "@/lib/insights/link-phrases.mjs";

function InlineText({ content }: { content: RichText }) {
  return content.map((part, index) => part.href
    ? part.intent === "signup" && part.href.startsWith("https://")
      ? <a key={index} className="insight-account-button" href={part.href} target="_blank" rel="nofollow noopener noreferrer">{part.text}<ArrowUpRight size={20} aria-hidden="true" /></a>
      : part.href.startsWith("#")
      ? <a key={index} href={part.href} className="insight-context-link insight-section-link">{part.text}</a>
      : part.href.startsWith("/")
      ? <Link key={index} href={part.href} className="insight-context-link">{part.text}</Link>
      : <a key={index} href={part.href} className="insight-source-link" rel="noopener noreferrer">{part.text}</a>
    : part.text);
}

function DataTable({ headers, rows, label, compact = false }: { headers: RichText[]; rows: RichText[][]; label: string; compact?: boolean }) {
  return <div className={`insight-table${compact ? " insight-summary-table" : ""}`} role="region" aria-label={label} tabIndex={0}>
    <table>{compact && <caption>{label}</caption>}
      <thead><tr>{headers.map((cell, i) => <th key={i} scope="col"><InlineText content={cell} /></th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}><InlineText content={cell} /></td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function EducationalInfographic({ block }: { block: InsightInfographic }) {
  return <figure className={`insight-infographic insight-infographic-${block.variant}`} data-learning-visual={block.id} aria-labelledby={`${block.id}-title`}>
    <header><span className="insight-infographic-kicker">{block.kicker}</span><h3 id={`${block.id}-title`}>{block.title}</h3></header>
    <ol className="insight-infographic-items">{block.items.map((item, index) => <li key={item.label}>
      {block.variant === "equation" && index > 0 && <span className="insight-infographic-operator" aria-hidden="true">{index === 1 ? "×" : "="}</span>}
      <span className="insight-infographic-step" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <span className="insight-infographic-label">{item.label}</span>
      <strong className="insight-infographic-value">{item.value}</strong>
      <span className="insight-infographic-detail">{item.detail}</span>
    </li>)}</ol>
    <figcaption><p><InlineText content={block.note} /></p><span className="insight-infographic-source"><InlineText content={block.sources} /></span></figcaption>
  </figure>;
}

export function ArticleContent({ article }: { article: InsightArticle }) {
  const introduction = article.blocks.findIndex(block => block.type === "paragraph");
  const brokerActions = article.blocks.filter(block => block.type === "broker-cta");
  const sections = article.blocks.flatMap(block => block.type === "quick-answer"
    ? [{ id: block.id, text: block.title }]
    : block.type === "heading" && block.level === 2 ? [{ id: block.id, text: block.text }] : []);
  return <div className="insight-content" data-article-content>
    {article.blocks.map((block, index) => {
      switch (block.type) {
        case "paragraph": return <Fragment key={index}><p><InlineText content={block.content} /></p>{index === introduction && (brokerActions.length
          ? <nav className="insight-broker-shortlist" data-broker-discovery aria-label="Brokers compared in this guide"><strong>In this comparison</strong><div>{brokerActions.map(action => <a key={action.broker} href={`#${action.sectionId}`}>{action.broker}</a>)}</div></nav>
          : <BrokerRecommendations />)}</Fragment>;
        case "quick-answer": return <Fragment key={block.id}>
          <section className="insight-answer" data-quick-answer aria-labelledby={block.id}>
            <h2 id={block.id}>{block.title}</h2><p><InlineText content={linkPhrases(block.answer, block.anchors)} /></p>
            {block.ordered && <ol className="insight-answer-steps">{block.points.map(point => <li key={point}><InlineText content={linkPhrases(point, block.anchors)} /></li>)}</ol>}
            {block.table && <DataTable headers={block.table.headers} rows={block.table.rows} label={block.table.caption} compact />}
            {!block.ordered && <ul>{block.points.map(point => <li key={point}><InlineText content={linkPhrases(point, block.anchors)} /></li>)}</ul>}
          </section>
          <details className="insight-toc-mobile"><summary>On this page</summary><nav aria-label="On this page">{sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.text}</a>)}</nav></details>
        </Fragment>;
        case "callout": return <aside key={index} className="insight-example" role="note" aria-label={block.title}><h3>{block.title}</h3><p><InlineText content={block.content} /></p></aside>;
        case "list": {
          const items = block.items.map((item, i) => <li key={i}><InlineText content={item} /></li>);
          return block.ordered ? <ol key={index} className="insight-steps">{items}</ol> : <ul key={index} className="insight-bullets">{items}</ul>;
        }
        case "heading": return block.level === 2
          ? <h2 key={block.id} id={block.id}>{block.text}</h2>
          : <h3 key={block.id} id={block.id}>{block.text}</h3>;
        case "table": return <DataTable key={index} headers={block.headers} rows={block.rows} label={block.label} />;
        case "infographic": return <EducationalInfographic key={block.id} block={block} />;
        case "broker-cta": return <aside key={block.broker} className="insight-broker-action" data-broker-signup={block.broker} aria-label={`${block.broker} account information`}>
          <div><strong>{block.broker}</strong><p>{block.note}</p></div>
          <a className="insight-account-button" href={block.signupUrl} target="_blank" rel="nofollow noopener noreferrer">Open {block.broker} account<ArrowUpRight size={20} aria-hidden="true" /></a>
        </aside>;
        case "image": {
          const image = getInsightImage(block.assetId);
          const zoomable = image.presentation === "illustration" && block.role !== "featured";
          const picture = <Image
            src={image.src} width={image.width} height={image.height} alt={block.alt}
            sizes="(max-width: 900px) 100vw, 800px" preload={block.role === "featured"} style={{ objectPosition: image.objectPosition }}
          />;
          return <figure key={block.role} className={`insight-figure${image.presentation === "photo" ? " insight-figure-photo" : ""}`} data-image-role={block.role}>
            <div className="insight-image-frame">{zoomable ? <a href={image.src} className="insight-diagram-open" target="_blank" rel="noopener noreferrer" aria-label={`Open full-size diagram: ${block.alt} (new tab)`}>{picture}</a> : picture}</div>
            <figcaption>{block.caption}{zoomable && <> <a className="insight-diagram-full-size" href={image.src} target="_blank" rel="noopener noreferrer" aria-label="View full-size diagram (opens in a new tab)">View full-size diagram</a></>}<span className="insight-image-credit">
              {image.creator} · <a href={image.sourceUrl} rel="noopener noreferrer">Source</a> · <a href={image.licenseUrl} rel="noopener noreferrer">{image.license}</a>
            </span></figcaption>
          </figure>;
        }
      }
    })}
  </div>;
}
