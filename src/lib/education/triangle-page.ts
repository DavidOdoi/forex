import type { Metadata } from "next";
import { indexable, siteOrigin } from "../site";

export const trianglePath = "/insights/triangle-chart-patterns";
export const triangleTitle = "Triangle Chart Patterns: Types, Examples & Breakouts";
export const triangleDescription = "Compare ascending, descending and symmetrical triangle chart patterns. Explore breakouts and failures, measure a reference target and practise spotting the shapes.";
export const triangleFaqs = [
  { question: "What are the three main triangle chart patterns?", answer: "Ascending triangles have approximately horizontal highs and rising lows. Descending triangles have falling highs and approximately horizontal lows. Symmetrical triangles have falling highs and rising lows." },
  { question: "Is an ascending triangle always bullish?", answer: "No. A bullish interpretation is a convention, not a guaranteed upside break. Price can break below rising support, remain inside or stop respecting the drawn boundaries." },
  { question: "Is a descending triangle always bearish?", answer: "No. The usual bearish interpretation does not rule out an upward break. This explorer deliberately supports both directions for every triangle type." },
  { question: "How do symmetrical triangles differ from wedges?", answer: "A symmetrical triangle’s upper boundary falls while its lower boundary rises. A wedge’s two converging boundaries generally slope in the same direction. Context and drawing choices still matter." },
  { question: "How do traders estimate a triangle target?", answer: "One convention measures the vertical distance between the two boundaries at the widest defined part, then adds or subtracts that height from a chosen breakout reference. The result is hypothetical, not a promised destination." },
  { question: "Can a triangle breakout fail?", answer: "Yes. Price can cross a boundary and return inside. A retest can hold, fail or never occur; a close beyond a line is not proof of future continuation." },
  { question: "Can triangle patterns be used in forex?", answer: "Their geometry can describe a forex price chart, but the drawing does not establish an edge. Spreads, slippage, news and broker execution can alter a hypothetical plan’s results." },
  { question: "Does forex tick volume represent the whole market?", answer: "No. Tick activity reflects updates in a particular feed, not total global forex turnover. Exchange-reported contract volume covers that exchange’s instrument; neither should be relabelled as the entire spot forex market." },
  { question: "Which timeframe is best for triangle patterns?", answer: "There is no universal best timeframe established here. Bar duration, trading costs, the amount of evidence and the strategy being evaluated affect interpretation. No timeframe has been backtested for this guide." },
];
export const triangleMetadata: Metadata = {
  title: { absolute: "Triangle Chart Patterns: Types & Examples | DEVIN FOREX" },
  description: triangleDescription,
  alternates: { canonical: siteOrigin + trianglePath },
  // Search eligibility is owner-authorised; verification disclosures remain.
  robots: { index: indexable, follow: true },
  openGraph: { type: "website", title: triangleTitle, description: triangleDescription, url: siteOrigin + trianglePath, siteName: "Devin Forex", images: [{ url: siteOrigin + trianglePath + "/opengraph-image", width: 1200, height: 630, alt: "Three original illustrative triangle diagrams; not historical data" }] },
  twitter: { card: "summary_large_image", title: triangleTitle, description: triangleDescription, images: [siteOrigin + trianglePath + "/opengraph-image"] },
};
export function triangleStructuredData() {
  const url = siteOrigin + trianglePath;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": url + "#webpage", url, name: triangleTitle, description: triangleDescription, inLanguage: "en", publisher: { "@type": "Organization", name: "Devin Forex", url: siteOrigin }, creativeWorkStatus: "Draft: source verification pending" },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin + "/" },
      { "@type": "ListItem", position: 2, name: "Insights", item: siteOrigin + "/insights" },
      { "@type": "ListItem", position: 3, name: "Triangle chart patterns", item: url },
    ] },
    { "@type": "FAQPage", mainEntity: triangleFaqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ] };
}
