import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { calculators, toolPath, type CalculatorDefinition, type Inline } from "@/lib/calculators/catalog";
import { calculatorSchema } from "@/lib/calculators/seo";
import { TradingCalculator } from "./trading-calculator";
import { CompoundingCalculator } from "./compounding-calculator";
import styles from "./calculator.module.css";

function InlineText({ content }: { content: Inline }) {
  return content.map((part, i) => part.href ? part.href.startsWith("/") ? <Link key={i} href={part.href}>{part.text}</Link> : <a key={i} href={part.href} rel="noopener noreferrer">{part.text}</a> : part.text);
}

export function CalculatorPage({ tool }: { tool: CalculatorDefinition }) {
  const contents = [{ id: "calculator", title: "Calculator" }, { id: "how-to-use", title: "How to use it" }, ...tool.sections.map(section => ({ id: section.id, title: section.title })), { id: "calculator-faq", title: "Frequently asked questions" }];
  const toc = contents.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>);
  return <main className={styles.page}>
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/tools">Trading tools</Link><span aria-hidden="true">/</span><span aria-current="page">{tool.heading}</span></nav>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Devin Forex tools <span>Free · No sign-up</span></p>
        <h1>{tool.heading}</h1>
        <p className={styles.intro}>{tool.intro}</p>
        <section className={styles.quickAnswer} aria-labelledby="quick-answer"><h2 id="quick-answer">Quick answer</h2><p>{tool.quickAnswer}</p></section>
      </header>
      <details className={styles.mobileContents}><summary>On this page <ChevronDown size={17} aria-hidden="true" /></summary><nav aria-label="Calculator page sections">{toc}</nav></details>
      <section id="calculator" className={styles.calculatorSection} aria-labelledby="calculator-title">
        <div className={styles.sectionHeading}><h2 id="calculator-title">{tool.kind === "compounding" ? "Build your scenario" : "Calculate your trade"}</h2><span>Calculated in your browser</span></div>
        {tool.kind === "compounding" ? <CompoundingCalculator /> : <TradingCalculator initialMode={tool.kind === "position" ? "position" : "profit"} tabbed={tool.kind === "forex"} />}
      </section>
      <div className={styles.educationLayout}>
        <aside className={styles.contents}><nav aria-label="Calculator page sections"><strong>On this page</strong>{toc}</nav></aside>
        <article className={styles.education} aria-label={`${tool.heading} guide`}>
          <section id="how-to-use"><h2>How to use this calculator</h2><ol>{tool.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
          {tool.sections.map(section => <section key={section.id} id={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph, i) => <p key={i}><InlineText content={paragraph} /></p>)}
            {section.formula && <aside className={styles.formula} aria-label="Formula">{section.formula}</aside>}
            {section.table && <div className={styles.tableScroll} role="region" aria-label={`${section.title} summary table`} tabIndex={0}><table><caption>{section.title}: at a glance</caption><thead><tr>{section.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
            {section.bullets && <ul>{section.bullets.map((bullet, i) => <li key={i}><InlineText content={bullet} /></li>)}</ul>}
          </section>)}
          <section id="calculator-faq" className={styles.faq}><h2>Frequently asked questions</h2>{tool.faqs.map(faq => <details key={faq.question}><summary><h3>{faq.question}</h3><ChevronDown size={19} aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</section>
          <aside className={styles.methodNote}><h2>Calculation notes</h2><p>Results use the formulas and assumptions above. Calculations keep unrounded values internally; displayed amounts are rounded. These tools are educational estimates, not personal financial advice or broker execution quotes.</p><p>Read <Link href="/about#research-methodology">how we research</Link> or <Link href="/about#corrections">how to report a correction</Link>.</p></aside>
        </article>
      </div>
      <aside className={styles.related} aria-labelledby="related-calculators"><div className={styles.sectionHeading}><h2 id="related-calculators">Keep the numbers connected</h2><Link href="/tools">All trading tools <ArrowRight size={16} aria-hidden="true" /></Link></div><div className={styles.relatedGrid}>{calculators.filter(item => item.slug !== tool.slug).map(item => <Link href={toolPath(item)} key={item.slug}><h3>{item.heading}</h3><p>{item.card}</p><span>Open calculator <ArrowRight size={17} aria-hidden="true" /></span></Link>)}</div></aside>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema(tool)).replace(/</g, "\\u003c") }} />
  </main>;
}
