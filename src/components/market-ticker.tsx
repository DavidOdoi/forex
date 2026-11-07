"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { useState } from "react";
import styles from "./market-ticker.module.css";

// Illustrative values from the original homepage, not a live price feed.
const examples = [
  { symbol: "EUR/USD", name: "Euro / US dollar", mark: "€", price: "1.0872", change: "+0.12%", quote: "USD" },
  { symbol: "GBP/USD", name: "British pound / US dollar", mark: "£", price: "1.2741", change: "−0.08%", quote: "USD" },
  { symbol: "USD/JPY", name: "US dollar / Japanese yen", mark: "¥", price: "151.32", change: "+0.31%", quote: "JPY" },
  { symbol: "XAU/USD", name: "Gold / troy ounce", mark: "Au", price: "2,384.10", change: "+0.54%", quote: "USD" },
  { symbol: "AUD/USD", name: "Australian dollar / US dollar", mark: "A$", price: "0.6612", change: "−0.15%", quote: "USD" },
  { symbol: "USD/CHF", name: "US dollar / Swiss franc", mark: "Fr", price: "0.9034", change: "+0.05%", quote: "CHF" },
  { symbol: "BTC/USD", name: "Bitcoin / US dollar", mark: "₿", price: "68,210.00", change: "+1.20%", quote: "USD" },
];

export function MarketTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <section className={styles.board} aria-labelledby="market-snapshot-title" aria-describedby="market-snapshot-note">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}><span aria-hidden="true" /> Forex · Gold · Bitcoin</p>
          <h2 id="market-snapshot-title">Markets at a glance</h2>
          <p id="market-snapshot-note" className={styles.note}>Illustrative quotes · not live market data</p>
        </div>
        <div className={styles.actions}>
          <Link href="/gold-price" className={styles.dashboardLink}>Gold price dashboard <ArrowUpRight size={19} aria-hidden="true" /></Link>
          <button type="button" className={styles.motionControl} onClick={() => setPaused(value => !value)} aria-label={paused ? "Play market ticker" : "Pause market ticker"} title={paused ? "Play market ticker" : "Pause market ticker"}>
            {paused ? <Play size={19} aria-hidden="true" /> : <Pause size={19} aria-hidden="true" />}
          </button>
          <span className={styles.scrollHint}>Scroll to explore <ArrowUpRight size={16} aria-hidden="true" /></span>
        </div>
      </div>

      <div className={styles.viewport} tabIndex={0} role="region" aria-label="Illustrative forex, gold and Bitcoin quotes">
        <div className={`ticker ${styles.track}`} style={{ animationPlayState: paused ? "paused" : undefined }}>
          {[false, true].map(copy => (
            <ul key={String(copy)} className={`${styles.group} ${copy ? styles.copy : ""}`} aria-hidden={copy || undefined}>
              {examples.map(item => {
                const positive = item.change.startsWith("+");
                const Direction = positive ? ArrowUpRight : ArrowDownRight;
                return (
                  <li key={item.symbol} className={`${styles.card} ${item.symbol === "XAU/USD" ? styles.goldCard : ""}`}>
                    <div className={styles.instrument}>
                      <span className={styles.mark} aria-hidden="true">{item.mark}</span>
                      <div><h3>{item.symbol}</h3><p>{item.name}</p></div>
                    </div>
                    <div className={styles.quote}><span className={styles.price}>{item.price}</span><span className={styles.currency}>{item.quote}</span></div>
                    <div className={styles.cardFooter}>
                      <span className={`${styles.change} ${positive ? styles.gain : styles.loss}`}><Direction size={17} aria-hidden="true" />{item.change}</span>
                      <span className={styles.exampleLabel}>Example quote</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
      <div className={styles.footer}><span>Make your next step an informed one.</span><Link href="/tools">Explore trading calculators <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </section>
  );
}
