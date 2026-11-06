import Link from "next/link";
import { ArrowRight, ArrowUp, Globe2 } from "lucide-react";
import styles from "./site-footer.module.css";

const linkGroups = [
  {
    title: "Explore",
    links: [
      { label: "Broker reviews", href: "/reviews" },
      { label: "Compare brokers", href: "/best-brokers" },
      { label: "Find my broker", href: "/find-my-broker" },
    ],
  },
  {
    title: "Keep learning",
    links: [
      { label: "Beginner guides", href: "/insights#beginner-guides" },
      { label: "Strategies & risk", href: "/insights#strategies" },
      { label: "Platforms & technology", href: "/insights#market-guides" },
    ],
  },
  {
    title: "Trading tools",
    links: [
      { label: "Pip calculator", href: "/tools#pip-calculator" },
      { label: "Position size", href: "/tools#position-size" },
      { label: "Profit calculator", href: "/tools#profit-calculator" },
    ],
  },
  {
    title: "Get to know us",
    links: [
      { label: "Our story", href: "/about#our-story" },
      { label: "How we research", href: "/about#research-methodology" },
      { label: "Meet the author", href: "/authors/david-odoi" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer} aria-label="Devin Forex footer">
      <div className={styles.inner}>
        <section className={styles.invitation} aria-labelledby="footer-heading">
          <div className={styles.lead}>
            <p className={styles.eyebrow}>Perspective for your next step</p>
            <h2 id="footer-heading" className={styles.heading}>
              Clarity before <em>your next move.</em>
            </h2>
            <p className={styles.description}>
              Explore broker research, practical guides and trading tools.
              Start with the information that matters to you.
            </p>
          </div>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/reviews">
              Explore brokers
              <span className={styles.actionIcon} aria-hidden="true"><ArrowRight size={18} /></span>
            </Link>
            <Link className={styles.secondaryAction} href="/insights">
              Read the latest insights <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <div className={styles.navigation}>
          <div className={styles.identity}>
            <Link href="/" className={styles.wordmark} aria-label="Devin Forex home">
              Devin <span>Forex</span>
            </Link>
            <p className={styles.brandDescription}>
              A global perspective on brokers, markets and the tools behind your decisions.
            </p>
            <p className={styles.locale}><Globe2 size={17} aria-hidden="true" /> Global · English</p>
          </div>
          <nav className={styles.linkGroups} aria-label="Footer navigation">
            {linkGroups.map(group => (
              <div className={styles.linkGroup} key={group.title}>
                <h3>{group.title}</h3>
                <ul>{group.links.map(link => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}</ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.disclosures}>
          <section aria-labelledby="footer-risk">
            <h3 id="footer-risk">Understand the risk</h3>
            <p>Forex and CFDs are complex, leveraged products. You can lose money rapidly.
              Understand the risks and only trade with money you can afford to lose.</p>
          </section>
          <section aria-labelledby="footer-transparency">
            <h3 id="footer-transparency">Transparency matters</h3>
            <p>Our content is for information, not personal financial advice.
              There are currently no active affiliate referral links.
              Future commercial relationships will be disclosed.</p>
          </section>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getUTCFullYear()} Devin Forex. All rights reserved.</p>
          <nav className={styles.policyLinks} aria-label="Research policies">
            <Link href="/about#commercial-policy">Commercial disclosure</Link>
            <Link href="/about#corrections">Corrections</Link>
          </nav>
          <a href="#site-top" className={styles.backToTop}>Back to top <ArrowUp size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </footer>
  );
}
