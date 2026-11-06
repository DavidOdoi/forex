import Image from "next/image";
import Link from "next/link";
import { getInsightImage, type InsightArticle, type RichText } from "@/lib/insights/catalog";

function InlineText({ content }: { content: RichText }) {
  return content.map((part, index) => part.href
    ? part.href.startsWith("/")
      ? <Link key={index} href={part.href} className="insight-context-link">{part.text}</Link>
      : <a key={index} href={part.href} className="insight-source-link" rel="noopener noreferrer">{part.text}</a>
    : part.text);
}

export function ArticleContent({ article }: { article: InsightArticle }) {
  return <div className="insight-content" data-article-content>
    {article.blocks.map((block, index) => {
      switch (block.type) {
        case "paragraph": return <p key={index}><InlineText content={block.content} /></p>;
        case "heading": return block.level === 2
          ? <h2 key={block.id} id={block.id}>{block.text}</h2>
          : <h3 key={block.id} id={block.id}>{block.text}</h3>;
        case "table": return <div key={index} className="insight-table" role="region" aria-label={block.label} tabIndex={0}>
          <table><thead><tr>{block.headers.map((cell, i) => <th key={i} scope="col"><InlineText content={cell} /></th>)}</tr></thead>
            <tbody>{block.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}><InlineText content={cell} /></td>)}</tr>)}</tbody></table>
        </div>;
        case "image": {
          const image = getInsightImage(block.assetId);
          return <figure key={block.role} className="insight-figure" data-image-role={block.role}>
            <div className="insight-image-frame"><Image
              src={image.src} width={image.width} height={image.height} alt={block.alt}
              sizes="(max-width: 900px) 100vw, 800px" preload={block.role === "featured"}
            /></div>
            <figcaption>{block.caption}<span className="insight-image-credit">
              {image.creator} · <a href={image.sourceUrl} rel="noopener noreferrer">Source</a> · <a href={image.licenseUrl} rel="noopener noreferrer">{image.license}</a>
            </span></figcaption>
          </figure>;
        }
      }
    })}
  </div>;
}
