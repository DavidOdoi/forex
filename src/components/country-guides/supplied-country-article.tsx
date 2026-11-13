import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { CountryGuide, GuideRegistry } from "@/lib/country-guides/types";
import { CountrySectionNav } from "./section-nav";

// Deliberately small Markdown subset for supplied editorial copy. Raw HTML,
// images, arbitrary protocols and executable content are never interpreted.
function inline(text: string): ReactNode {
  const tokens = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return tokens.map((token, i) => {
    if (token.startsWith("**")) return <strong key={i}>{token.slice(2, -2)}</strong>;
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && (/^https:\/\//.test(link[2]) || /^\/(?!\/)/.test(link[2]))) {
      const signup = /^open (?:an? )?.*account$/i.test(link[1]);
      return link[2].startsWith("/") ? <Link key={i} href={link[2]}>{link[1]}</Link> : <a key={i} href={link[2]} className={signup ? "cg-signup-link" : undefined} target="_blank" rel={signup ? "nofollow noopener noreferrer" : "noopener noreferrer"}>{link[1]}</a>;
    }
    return <Fragment key={i}>{token}</Fragment>;
  });
}
const headingId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function blocks(markdown: string): ReactNode {
  return markdown.trim().split(/\n\s*\n/).filter(Boolean).map((block, i) => {
    if (block.startsWith("### ")) return <h3 key={i}>{inline(block.slice(4))}</h3>;
    const lines = block.split("\n");
    if (lines.every(line => /^\|/.test(line))) {
      const rows = lines.map(line => line.trim().slice(1, -1).split("|").map(cell => cell.trim()));
      const [headers, , ...body] = rows;
      return <div key={i} className="cg-decision-table" role="region" aria-label={headers.join(", ")} tabIndex={0}><table><thead><tr>{headers.map((cell, j) => <th key={j} scope="col">{inline(cell)}</th>)}</tr></thead><tbody>{body.map((row, j) => <tr key={j}>{row.map((cell, k) => k === 0 ? <th key={k} scope="row">{inline(cell)}</th> : <td key={k} data-label={headers[k]}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
    }
    if (lines.every(line => /^- /.test(line))) return <ul key={i} className="cg-bullets">{lines.map((line, j) => <li key={j}>{inline(line.slice(2))}</li>)}</ul>;
    if (lines.every(line => /^\d+\. /.test(line))) return <ol key={i} className="cg-bullets">{lines.map((line, j) => <li key={j}>{inline(line.replace(/^\d+\. /, ""))}</li>)}</ol>;
    return <p key={i}>{inline(block)}</p>;
  });
}

export function SuppliedCountryArticle({ country, registry }: { country: CountryGuide; registry: GuideRegistry }) {
  const [intro, ...sections] = country.articleMarkdown!.split(/^## /m);
  const parsed = sections.map(section => { const split = section.indexOf("\n"); const title = section.slice(0, split); return { title, body: section.slice(split + 1), id: headingId(title) }; });
  const items = parsed.map(({ id, title }) => ({ id, label: title.replace(/^\d+\. /, "") }));
  const author = registry.people.find(person => person.id === country.authorReference);
  return <main className="cg-page cg-guide cg-compact cg-supplied">
    <div className="cg-heading-band"><div className="cg-container"><nav className="cg-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/forex-brokers">Forex brokers by country</Link><span aria-hidden="true">/</span><span aria-current="page">{country.name}</span></nav><header className="cg-hero"><p className="cg-eyebrow">Country broker guide</p><h1>{country.title}</h1><div className="cg-standfirst">{blocks(intro)}</div><div className="cg-byline">{author && <Link href={author.profileUrl}>{author.name}</Link>}<span>Supplied research · independent verification pending</span></div></header></div></div>
    <CountrySectionNav items={items} />
    <div className="cg-container"><div className="cg-reading-layout"><article className="cg-article" aria-label={`${country.name} broker guide`}>
      {parsed.map(section => <section className={`cg-section${section.title === "FAQs" ? " cg-faq" : ""}`} key={section.id} id={section.id}><h2>{section.title}</h2>{section.title === "FAQs" ? country.faqs.map(faq => <details key={faq.question}><summary><h3>{faq.question}</h3><span aria-hidden="true">+</span></summary><p>{inline(faq.answer.value ?? "")}</p></details>) : blocks(section.body)}</section>)}
    </article><aside className="cg-sidebar"><nav aria-label="On this page"><h2>On this page</h2>{items.map(item => <a href={`#${item.id}`} key={item.id}>{item.label}</a>)}</nav></aside></div><footer className="cg-footer"><Link href="/forex-brokers">← Country broker guides</Link><p>Supplied references have not been independently checked. No live-account or withdrawal tests were performed. General information, not personal financial or legal advice.</p></footer></div>
  </main>;
}
