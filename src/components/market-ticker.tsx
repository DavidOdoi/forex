"use client";

import Link from "next/link";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useState } from "react";
import styles from "./market-ticker.module.css";

// Link to sourced dashboards and useful tools instead of displaying fixed
// sample prices beside live-market content.
const resources = [
  { symbol: "EUR/USD", name: "Forex calculations", mark: "€", value: "Calculate", detail: "Profit and loss", href: "/tools/forex-calculator" },
  { symbol: "XAU/USD", name: "Gold price", mark: "Au", value: "View spot", detail: "Price, chart and value", href: "/gold-price" },
  { symbol: "XAG/USD", name: "Gold and silver", mark: "Ag", value: "Compare", detail: "Metal prices and ratio", href: "/gold-silver-prices" },
  { symbol: "Position size", name: "Trade risk", mark: "%", value: "Size a trade", detail: "Lots and planned risk", href: "/tools/forex-position-size-calculator" },
  { symbol: "Market hours", name: "Trading sessions", mark: "◷", value: "Plan ahead", detail: "Sessions in your timezone", href: "/tools/forex-market-hours" },
  { symbol: "USDC / ETH", name: "Crypto transfers", mark: "Ξ", value: "Check fees", detail: "Networks, costs and risks", href: "/insights/usdc-vs-ethereum-sending-money" },
];

export function MarketTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <section className={styles.board} aria-labelledby="market-snapshot-title" aria-describedby="market-snapshot-note">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}><span aria-hidden="true" /> Forex · Gold · Bitcoin</p>
          <h2 id="market-snapshot-title">Markets and trading tools</h2>
          <p id="market-snapshot-note" className={styles.note}>Price dashboards, trade calculations and guides to using them.</p>
        </div>
        <div className={styles.actions}>
          <Link href="/gold-price" className={styles.dashboardLink}>Gold price dashboard <ArrowUpRight size={19} aria-hidden="true" /></Link>
          <button type="button" className={styles.motionControl} onClick={() => setPaused(value => !value)} aria-label={paused ? "Play market ticker" : "Pause market ticker"} title={paused ? "Play market ticker" : "Pause market ticker"}>
            {paused ? <Play size={19} aria-hidden="true" /> : <Pause size={19} aria-hidden="true" />}
          </button>
          <span className={styles.scrollHint}>Scroll to explore <ArrowUpRight size={16} aria-hidden="true" /></span>
        </div>
      </div>

      <div className={styles.viewport} tabIndex={0} role="region" aria-label="Market dashboards and trading tools">
        <div className={`ticker ${styles.track}`} style={{ animationPlayState: paused ? "paused" : undefined }}>
          {[false, true].map(copy => (
            <ul key={String(copy)} className={`${styles.group} ${copy ? styles.copy : ""}`} aria-hidden={copy || undefined}>
              {resources.map(item => <li key={item.symbol} className={`${styles.card} ${item.symbol === "XAU/USD" ? styles.goldCard : ""}`}>
                <Link href={item.href} className={styles.resourceLink} tabIndex={copy ? -1 : undefined}>
                  <div className={styles.instrument}><span className={styles.mark} aria-hidden="true">{item.mark}</span><div><h3>{item.symbol}</h3><p>{item.name}</p></div></div>
                  <div className={styles.quote}><span className={styles.price}>{item.value}</span></div>
                  <div className={styles.cardFooter}><span>{item.detail}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
                </Link>
              </li>)}
            </ul>
          ))}
        </div>
      </div>
      <div className={styles.footer}><span>Check the figures before placing an order.</span><Link href="/tools">Explore trading calculators <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </section>
  );
}
