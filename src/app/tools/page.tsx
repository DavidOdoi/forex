import type { Metadata } from "next";
import { canonical } from "@/lib/site";
import Link from "next/link";
import { ArrowRight, Calculator, ChartNoAxesCombined, Clock3, Target, TrendingUp } from "lucide-react";
import { calculators, toolPath } from "@/lib/calculators/catalog";
import { calculatorsIndexable } from "@/lib/calculators/seo";
import styles from "@/components/calculators/calculator.module.css";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Forex Trading Tools & Calculators — Devin Forex" },
    description:
      "Free forex calculators for trading profit, pip value, position sizing and hypothetical compounding, plus prop firm consistency checks. Clear formulas, manual quotes and practical examples.",
    openGraph: {
      title: "Forex Trading Tools — Devin Forex",
      description: "Free pip, position size and profit calculators.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Trading Tools — Devin Forex",
      description: "Free pip, position size and profit calculators.",
    },
  },
  alternates: canonical("/tools"),
  robots: { index: calculatorsIndexable, follow: true },
};
const icons = { forex: Calculator, profit: TrendingUp, compounding: ChartNoAxesCombined, position: Target };
const legacyIds = { forex: "pip-calculator", profit: "profit-calculator", position: "position-size", compounding: "compounding-calculator" };
export default function Page() {
  return <main className={styles.page}><div className={styles.container}>
    <header className={styles.indexHero}><p className={styles.eyebrow}>Devin Forex tools <span>Free · No sign-up</span></p><h1>Clear numbers.<br /><em>Better questions.</em></h1><p>Free forex calculators for the decisions behind a trade. Explore profit, understand pip values, size a position or model a compounding scenario.</p></header>
    <section className={styles.toolGrid} aria-label="Forex trading calculators">{calculators.map(tool => { const Icon = icons[tool.kind]; return <article className={styles.toolCard} id={legacyIds[tool.kind]} key={tool.slug} data-tool-card><span className={styles.cardIcon}><Icon size={24} aria-hidden="true" /></span><h2><Link href={toolPath(tool)}>{tool.heading}</Link></h2><p>{tool.card}</p><Link className={styles.cardLink} href={toolPath(tool)}>Open calculator <ArrowRight size={18} aria-hidden="true" /></Link></article>; })}</section>
    <section className={styles.toolGrid} aria-label="Prop firm tools"><article className={styles.toolCard} data-tool-card><span className={styles.cardIcon}><Calculator size={24} aria-hidden="true" /></span><h2><Link href="/prop-firm-consistency-calculator">Prop firm consistency calculator</Link></h2><p>Check your best day’s share of net profit and the additional profit needed for a compatible consistency rule.</p><Link className={styles.cardLink} href="/prop-firm-consistency-calculator">Check consistency <ArrowRight size={18} aria-hidden="true" /></Link></article></section>
    <section className={styles.toolGrid} aria-label="Session planning tools"><article className={styles.toolCard} data-market-hours-card><span className={styles.cardIcon}><Clock3 size={24} aria-hidden="true" /></span><h2><Link href="/tools/forex-market-hours">Forex market hours</Link></h2><p>See conventional session windows in your timezone, explore overlaps and plan around your available hours.</p><Link className={styles.cardLink} href="/tools/forex-market-hours">Open session planner <ArrowRight size={18} aria-hidden="true" /></Link></article></section>
    <section className={styles.toolGrid} aria-label="Partial-exit tools"><article className={styles.toolCard} data-multi-target-card><span className={styles.cardIcon}><Target size={24} aria-hidden="true" /></span><h2><Link href="/tools/forex-multi-target-calculator">Forex Multi Target Calculator</Link></h2><p>Split one position across partial exits, check broker-step volumes and compare reversal paths.</p><Link className={styles.cardLink} href="/tools/forex-multi-target-calculator">Plan partial exits <ArrowRight size={18} aria-hidden="true" /></Link></article></section>
    <section className={styles.hubNote}><h2>Know what goes into the result.</h2><div><p>Our forex calculators use your inputs and disclosed formulas. Prices are manually entered; no live market feed is connected. EUR/USD starting prices are illustrative. The session clock uses timezone calculations and disclosed schedule conventions.</p><p>JPY pip conventions, account-currency conversions and configurable contract sizes are supported. Broker terms, execution, margin and charges still need checking.</p></div></section>
    <aside className={styles.hubLinks}><Link href="/reviews">Explore broker research <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/insights">Read our trading guides <ArrowRight size={17} aria-hidden="true" /></Link></aside>
  </div></main>;
}
