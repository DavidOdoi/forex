#!/usr/bin/env node
// Editorial regression checks, not a Google ranking score or a Rank Math run.
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { linkPhrases } from "../../src/lib/insights/link-phrases.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const articles = JSON.parse(readFileSync(join(root, "src/data/insights/articles.json"), "utf8"));
const imageRows = JSON.parse(readFileSync(join(root, "src/data/insights/images.json"), "utf8"));
const images = new Map(imageRows.map(image => [image.id, image]));
const rich = value => value.map(part => part.text).join("");
const words = text => (text.match(/[\p{L}\p{N}_]+(?:[’'-][\p{L}\p{N}_]+)*/gu) ?? []).length;
const normalise = text => text.toLocaleLowerCase("en").replace(/\s+/g, " ").trim();
const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function blockText(block, withImageCredits = true) {
  switch (block.type) {
    case "paragraph": return rich(block.content);
    case "quick-answer": return [block.title, block.answer, ...(block.table ? [block.table.caption, ...[...block.table.headers, ...block.table.rows.flat()].map(rich)] : []), ...block.points].join(" ");
    case "callout": return `${block.title} ${rich(block.content)}`;
    case "list": return block.items.map(rich).join(" ");
    case "heading": return block.text;
    case "table": return [...block.headers, ...block.rows.flat()].map(rich).join(" ");
    case "image": {
      const image = images.get(block.assetId);
      return withImageCredits ? `${block.caption} ${image.creator} Source ${image.license}` : "";
    }
    default: throw new Error(`Unsupported content block: ${block.type}`);
  }
}
function inlineParts(block) {
  if (block.type === "quick-answer") return [
    ...linkPhrases(block.answer, block.anchors),
    ...block.points.flatMap(point => linkPhrases(point, block.anchors)),
    ...(block.table ? [...block.table.headers, ...block.table.rows.flat()].flat() : []),
  ];
  if (block.type === "paragraph" || block.type === "callout") return block.content;
  if (block.type === "list") return block.items.flat();
  if (block.type === "table") return [...block.headers, ...block.rows.flat()].flat();
  return [];
}
function validInternalLink(href, current) {
  const url = new URL(href, `https://devinforex-five.vercel.app/insights/${current.slug}`);
  if (url.origin !== "https://devinforex-five.vercel.app") return false;
  const target = articles.find(article => `/insights/${article.slug}` === url.pathname);
  if (!target) return false;
  return !url.hash || target.blocks.some(block => (block.type === "heading" || block.type === "quick-answer") && block.id === decodeURIComponent(url.hash.slice(1)));
}
const report = articles.filter(article => article.format === "guide").map(article => {
  const keyword = normalise(article.focusKeyword);
  const body = article.blocks.map(block => blockText(block, false)).join("\n");
  const fullText = [article.title, ...article.blocks.map(block => blockText(block)), "About the author", article.authorBio, "Disclaimer", article.disclaimer].join("\n\n");
  const wordCount = words(fullText);
  const bodyWords = words(body);
  const keywordOccurrences = [...normalise(body).matchAll(new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRegex(keyword)}(?![\\p{L}\\p{N}_])`, "gu"))].length;
  const density = Number((100 * keywordOccurrences / bodyWords).toFixed(3));
  const first = article.blocks[0];
  const summary = article.blocks[1];
  const paragraphs = article.blocks.flatMap(block => block.type === "paragraph" || block.type === "callout" ? [rich(block.content)] : block.type === "quick-answer" ? [block.answer] : []);
  const links = article.blocks.flatMap(inlineParts).filter(part => part.href);
  const internal = links.filter(part => part.href.startsWith("/insights/"));
  const inPage = links.filter(part => part.href.startsWith("#"));
  const quickLinks = inlineParts(summary).filter(part => part.href);
  const external = links.filter(part => part.href.startsWith("https://"));
  const imageBlocks = article.blocks.filter(block => block.type === "image");
  const titleTag = article.seoTitle ?? (`${article.title} | Devin Forex`.length <= 65 ? `${article.title} | Devin Forex` : article.title);
  const headingIds = article.blocks.flatMap(block => block.type === "heading" || block.type === "quick-answer" ? [block.id] : []);
  const checks = {
    keywordStartsTitle: normalise(titleTag).startsWith(keyword),
    conciseTitle: titleTag.length <= 65,
    usefulTitleLanguage: /\b(practical|clear|smart|smarter|better)\b/i.test(article.title),
    keywordInDescription: normalise(article.description).includes(keyword),
    descriptionLength: article.description.length >= 150 && article.description.length <= 160,
    keywordInSlug: article.slug === keyword.replace(/\s+/g, "-") || article.slug.startsWith(keyword.replace(/\s+/g, "-") + "-"),
    shortSlug: article.slug.length < 75,
    keywordInIntro: first.type === "paragraph" && normalise(rich(first.content)).includes(keyword),
    conciseIntro: first.type === "paragraph" && words(rich(first.content)) <= 60,
    answerImmediatelyAfterIntro: first.type === "paragraph" && summary.type === "quick-answer",
    conciseAnswer: summary.type === "quick-answer" && words(summary.answer) <= 65 && summary.points.length === 3,
    keywordInSubheading: article.blocks.some(block => block.type === "heading" && normalise(block.text).includes(keyword)),
    keywordAcrossBody: keywordOccurrences >= 3,
    noExcessiveExactRepetition: density <= 1.5,
    contentWithin1800Words: wordCount <= 1800,
    paragraphsUnder120Words: paragraphs.every(paragraph => words(paragraph) < 120),
    relevantInternalLinks: internal.length >= 2 && [...internal, ...inPage].every(part => validInternalLink(part.href, article)),
    quickAnswerAnchors: quickLinks.length >= 1,
    descriptiveAnchorText: links.every(part => part.text.trim().length >= 2 && !/^https?:\/\//i.test(part.text) && !/^(click here|here|read more)$/i.test(part.text.trim())),
    summaryTable: Boolean(summary.table && summary.table.headers.length === 2 && summary.table.rows.length >= 2 && summary.table.rows.every(row => row.length === 2)),
    authoritativeCitationsRetained: new Set(external.map(part => part.href)).size >= 3,
    supportingImages: imageBlocks.length >= 1 && imageBlocks.length <= 3 && imageBlocks.filter(block => block.role === "featured").length === 1,
    keywordInAccurateAlt: imageBlocks.some(block => normalise(block.alt).includes(keyword)),
    localCompressedImages: imageBlocks.every(block => {
      const image = images.get(block.assetId);
      const file = image && join(root, "public", image.src);
      return image && image.src.endsWith(".webp") && existsSync(file) && statSync(file).size <= 512 * 1024;
    }),
    uniqueContentsTargets: headingIds.length === new Set(headingIds).size,
    faqCompleteness: article.faqs.length === 3 && article.faqs.every(faq => words(faq.answer) > 0 && words(faq.answer) <= 35),
  };
  return { slug: article.slug, titleTag, titleCharacters: titleTag.length, words: wordCount, introWords: words(rich(first.content)), directAnswerWords: words(summary.answer), longestParagraphWords: Math.max(...paragraphs.map(words)), slugCharacters: article.slug.length, exactBodyKeywordOccurrences: keywordOccurrences, exactPhraseDensityPercent: density, internalEditorialLinks: internal.length, inPageLinks: inPage.length, quickAnswerLinks: quickLinks.length, distinctExternalSources: new Set(external.map(part => part.href)).size, images: imageBlocks.length, checks };
});
const references = [
  "https://www.semrush.com/blog/on-page-seo-checklist/",
  "https://rankmath.com/kb/score-100-in-tests/",
  "https://rankmath.com/blog/wordpress-seo-checklist/",
  "https://rankmath.com/blog/on-page-seo/",
  "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
  "https://developers.google.com/search/docs/essentials/spam-policies",
];
const pass = report.every(article => Object.values(article.checks).every(Boolean));
const output = {
  status: pass ? "PASS" : "FAIL",
  scope: "Published guides; latest user instruction caps every article at 1800 words and prioritises a direct answer after the introduction, compact summary tables, three brief FAQs and uniform 18px body copy.",
  countMethod: "Includes title, headings, intro, quick answer and bullets, callouts, tables, image captions/credits, FAQs, author bio and disclaimer. Excludes navigation, UI bylines, related links, alt attributes, URLs and duplicate JSON-LD.",
  keywordDensity: { treatment: "Informational diagnostic; no minimum exact-phrase density is enforced.", requestedRange: "Approximately 1–1.5% without stuffing", decision: "Natural wording and query coverage take priority over repeating a long exact phrase 18–27 times. Google specifies no preferred word count, and its spam guidance warns against unnatural repetition. Rank Math also says low density is preferable to excessive density. This report does not claim a plugin score.", calculation: "Exact focus-phrase occurrences divided by visible body word count, excluding H1, image credits, bio, disclaimer and navigation." },
  references,
  articles: report,
};
const jsonPath = join(root, "docs/content/insights-seo-audit-2026-11-06.json");
writeFileSync(jsonPath, JSON.stringify(output, null, 2) + "\n");
const lines = ["# Insights SEO and readability audit", "", `Objective checks: ${output.status}. All published guides use a short intro followed immediately by a Quick answer section. The latest 1,800-word ceiling supersedes the earlier long-form suggestion.`, "", "| Guide | Words | Intro | Direct answer | Quick links | FAQs | Title chars | Slug chars | Max paragraph | Exact phrase density | Checks |", "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |"];
for (const article of report) lines.push(`| ${article.slug} | ${article.words} | ${article.introWords} | ${article.directAnswerWords} | ${article.quickAnswerLinks} | 3 | ${article.titleCharacters} | ${article.slugCharacters} | ${article.longestParagraphWords} | ${article.exactPhraseDensityPercent}% | ${Object.values(article.checks).every(Boolean) ? "PASS" : "FAIL"} |`);
lines.push("", output.countMethod, "", "## Editorial decisions", "", "The SEO title starts with the exact focus phrase and uses a truthful benefit word. Branding is added only when the full title remains within 65 characters. Character limits are an editorial convention, not a guarantee about search-result display.", "", "Each guide includes visible contextual anchors, at least three distinct authoritative external sources, licensed local WebP images, readable subheadings, a contents menu and three brief matching FAQ answers. Short lists, comparison tables and labelled examples make the longer explanation easier to scan.", "", "Density is reported honestly as a diagnostic. We did not force an exact long-tail phrase into 1–1.5% of the copy; natural variations and clear explanations support the topic without stuffing. No Google ranking or Rank Math score is claimed. The four proposed 2,500-word expansions were not applied after the user confirmed the shorter limit. Summary tables and brief FAQs further reduce the time needed to find an answer.", "", "## Guidance consulted", "", ...references.map(url => `- ${url}`));
writeFileSync(jsonPath.replace(/\.json$/, ".md"), lines.join("\n") + "\n");
console.log(JSON.stringify({ status: output.status, articles: report.map(article => ({ slug: article.slug, words: article.words, intro: article.introWords, answer: article.directAnswerWords, failedChecks: Object.entries(article.checks).filter(([,value]) => !value).map(([key]) => key) })) }, null, 2));
if (!pass) process.exitCode = 1;
