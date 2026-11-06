import Image from "next/image";
import Link from "next/link";
import { featuredImage, readingMinutes, type InsightArticle } from "@/lib/insights/catalog";

export function ArticleCard({ article }: { article: InsightArticle }) {
  const image = featuredImage(article);
  return <article className="insight-card" data-insight-card>
    {image && <div className="insight-card-cover">
      <Link href={`/insights/${article.slug}`} tabIndex={-1} aria-hidden="true">
        <Image src={image.src} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 550px" />
      </Link>
      <Link className="insight-cover-credit" href={`/insights/image-credits#${image.id}`}>Image credit</Link>
    </div>}
    <div className="insight-card-copy"><p className="insight-kicker">{article.topic} <span>· {readingMinutes(article)} min read</span></p>
      <h3><Link href={`/insights/${article.slug}`}>{article.title}</Link></h3>
      <p>{article.description}</p><Link className="insight-read-link" href={`/insights/${article.slug}`} aria-label={`Read ${article.title}`}>Read guide <span aria-hidden="true">↗</span></Link>
    </div>
  </article>;
}
