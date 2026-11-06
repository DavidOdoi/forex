import articleData from "@/data/insights/articles.json";
import imageData from "@/data/insights/images.json";

export type RichText = { text: string; href?: string }[];
export type InsightSummaryTable = { caption: string; headers: RichText[]; rows: RichText[][] };
export type InsightBlock =
  | { type: "paragraph"; content: RichText }
  | { type: "quick-answer"; id: string; title: string; answer: string; points: string[]; anchors?: { text: string; href: string }[]; table?: InsightSummaryTable }
  | { type: "callout"; title: string; content: RichText }
  | { type: "list"; ordered: boolean; items: RichText[] }
  | { type: "heading"; level: 2 | 3; id: string; text: string }
  | { type: "table"; label: string; headers: RichText[]; rows: RichText[][] }
  | { type: "image"; assetId: string; role: "featured" | "inline-1" | "inline-2"; alt: string; caption: string };
export type InsightArticle = {
  slug: string;
  title: string;
  description: string;
  focusKeyword: string;
  format: "guide" | "reading-list";
  category: "beginner-guides" | "strategies" | "market-guides";
  topic: string;
  publishedAt: string;
  updatedAt: string;
  researchPreparedAt: string;
  authorBio: string;
  disclaimer: string;
  blocks: InsightBlock[];
  faqs: { question: string; answer: string }[];
};
export type InsightImage = {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
  creator: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  modifications: string;
  sourceRetrievedAt: string;
  sha256: string;
};

export const insightArticles = articleData as InsightArticle[];
export const insightImages = imageData as InsightImage[];
export const insightGuides = insightArticles.filter(article => article.format === "guide");
export const insightCategories = [
  { id: "beginner-guides", title: "Start with the essentials", description: "Understand the tools and workflows before putting money at risk." },
  { id: "strategies", title: "Strategies & risk", description: "Build a process for evaluating ideas, exposure and automated systems." },
  { id: "market-guides", title: "Platforms & technology", description: "Explore the systems, infrastructure and equipment behind modern trading." },
] as const;

export function getInsight(slug: string) {
  return insightArticles.find(article => article.slug === slug);
}
export function getInsightImage(id: string): InsightImage {
  const image = insightImages.find(image => image.id === id);
  if (!image) throw new Error(`Missing insight image: ${id}`);
  return image;
}
export function featuredImage(article: InsightArticle) {
  const block = article.blocks.find(block => block.type === "image" && block.role === "featured");
  return block?.type === "image" ? { ...getInsightImage(block.assetId), alt: block.alt } : undefined;
}
export function articleText(article: InsightArticle) {
  const rich = (value: RichText) => value.map(part => part.text).join("");
  return [article.title, ...article.blocks.map(block => {
    switch (block.type) {
      case "paragraph": return rich(block.content);
      case "quick-answer": return [block.title, block.answer, ...(block.table ? [block.table.caption, ...[...block.table.headers, ...block.table.rows.flat()].map(rich)] : []), ...block.points].join("\n");
      case "callout": return `${block.title}\n${rich(block.content)}`;
      case "list": return block.items.map(rich).join("\n");
      case "heading": return block.text;
      case "table": return [...block.headers, ...block.rows.flat()].map(rich).join(" ");
      case "image": {
        const image = getInsightImage(block.assetId);
        return `${block.caption} ${image.creator} Source ${image.license}`;
      }
    }
  }), "About the author", article.authorBio, "Disclaimer", article.disclaimer].join("\n\n");
}
export function articleWordCount(article: InsightArticle) {
  return (articleText(article).match(/[\p{L}\p{N}_]+(?:[’'-][\p{L}\p{N}_]+)*/gu) ?? []).length;
}
export function readingMinutes(article: InsightArticle) {
  return Math.max(1, Math.ceil(articleWordCount(article) / 220));
}
export function relatedInsights(article: InsightArticle) {
  const others = insightGuides.filter(other => other.slug !== article.slug);
  return [...others.filter(other => other.category === article.category), ...others.filter(other => other.category !== article.category)].slice(0, 3);
}
export function insightDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}
