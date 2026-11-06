import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { canonical } from "@/lib/site";
import { insightImages } from "@/lib/insights/catalog";
import "../insights.css";

export const metadata: Metadata = {
  title: { absolute: "Article Image Credits & Licences | Devin Forex" },
  description: "Creator credits, source links, reuse licences and documented format changes for images used in Devin Forex trading guides.",
  alternates: canonical("/insights/image-credits"),
  robots: { index: false, follow: true },
};
export default function InsightImageCredits() {
  return <main className="insights-page"><div className="insight-container">
    <header className="insight-credits-header"><p className="insight-kicker"><Link href="/insights">Back to insights</Link></p><h1>Image sources & licences</h1><p>Credits and licences below apply to their respective image files. Photographs and diagrams illustrate the guides; historical examples are identified in article captions.</p><p>Source records were retrieved on 4 November 2026. Files were converted to WebP without retouching or cropping; the animated order-book example uses its first frame. Share-alike images retain their stated licence. The article text has separate rights.</p></header>
    <div className="insight-credit-grid">{insightImages.map(image => <section key={image.id} id={image.id} className="insight-credit-card"><h2>{image.title}</h2><div className="insight-image-frame"><Image src={image.src} width={image.width} height={image.height} alt={image.title} sizes="(max-width: 700px) 100vw, 550px" /></div><dl><dt>Creator</dt><dd>{image.creator}</dd><dt>Source and licence</dt><dd><a href={image.sourceUrl} rel="noopener noreferrer">Original source page</a> · <a href={image.licenseUrl} rel="noopener noreferrer">{image.license}</a></dd><dt>Format changes</dt><dd>{image.modifications}</dd></dl></section>)}</div>
  </div></main>;
}
