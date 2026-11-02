import Link from "next/link";
import { Icon } from "@/components/icon";
import { GlobeArt } from "@/components/globe-art";
import { pageMetadata, site } from "@/lib/site";
export const metadata = {
  ...pageMetadata("Knowledge before the trade", site.description, "/"),
  title: { absolute: `${site.name} | Knowledge before the trade` },
};
const reading = [
  {
    number: "01",
    category: "THE ESSENTIALS",
    title: "A currency pair. Two sides to every story.",
    text: "Understand what you’re actually looking at when you see a forex quote.",
    href: "/learn#basics",
    art: "pairs",
    label: "Understand currency pairs",
  },
  {
    number: "02",
    category: "RISK & PERSPECTIVE",
    title: "Before the opportunity, understand the risk.",
    text: "Leverage, margin, and why protecting capital starts with understanding loss.",
    href: "/learn#risk",
    art: "risk",
    label: "Learn about trading risk",
  },
  {
    number: "03",
    category: "THE TOOLKIT",
    title: "Know the tools. Ask better questions.",
    text: "The questions to bring to any trading platform before making a commitment.",
    href: "/learn#platforms",
    art: "tools",
    label: "Explore platform essentials",
  },
];
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              FOR THE CURIOUS. FOR THE CONSIDERED.
            </p>
            <h1>
              Your next move
              <br />
              starts with
              <br />
              <em>understanding.</em>
            </h1>
            <p className="hero-description">
              Make sense of forex, one clear explanation at a time. Explore the
              fundamentals, understand the risks, and approach trading services
              with better questions.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/learn">
                Build your knowledge <Icon name="arrow" size={17} />
              </Link>
              <a className="text-link" href="#explore">
                Take a look around <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-footnote">
              <Icon name="shield" size={16} />
              <span>General education. No trading signals. No promises.</span>
            </div>
          </div>
          <GlobeArt />
        </div>
      </section>
      <div className="principles-strip">
        <div className="container">
          <span className="strip-label">A BETTER STARTING POINT</span>
          <span>
            <Icon name="book" size={19} />
            Plain-language education
          </span>
          <span>
            <Icon name="compass" size={19} />A thoughtful framework
          </span>
          <span>
            <Icon name="shield" size={19} />
            Risk always in view
          </span>
        </div>
      </div>
      <section className="section container" id="explore">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / THE READING ROOM</p>
            <h2>
              A little knowledge.
              <br />
              <em>A wider perspective.</em>
            </h2>
          </div>
          <div className="section-intro">
            <p>
              You don’t need more noise.
              <br />
              You need somewhere clear to start.
            </p>
            <Link href="/learn" className="text-link">
              Explore the learning hub <Icon name="arrow" size={15} />
            </Link>
          </div>
        </div>
        <div className="reading-grid">
          {reading.map((item) => (
            <Link href={item.href} className="reading-card" key={item.number}>
              <div className={`reading-art ${item.art}`} aria-hidden="true">
                <span className="art-index">FIELD NOTES / {item.number}</span>
                {item.art === "pairs" ? (
                  <div className="currency-art">
                    <span>€</span>
                    <div className="currency-divider" />
                    <span>$</span>
                  </div>
                ) : item.art === "risk" ? (
                  <div className="risk-art">
                    <div />
                    <div />
                    <div />
                    <span>KNOW YOUR EXPOSURE</span>
                  </div>
                ) : (
                  <div className="tools-art">
                    <span />
                    <span />
                    <span />
                    <i />
                    <i />
                  </div>
                )}
                <span className="art-corner">
                  <Icon name="arrow" size={18} />
                </span>
              </div>
              <div className="reading-content">
                <span className="eyebrow">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="card-action">
                  {item.label}
                  <Icon name="arrow" size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="perspective-section">
        <div className="container perspective-grid">
          <div className="perspective-heading">
            <p className="eyebrow">02 / THE DEVIN PERSPECTIVE</p>
            <h2>
              Less hype.
              <br />
              More <em>substance.</em>
            </h2>
            <p>
              Financial information should help you think clearly. That’s the
              standard we’re building around.
            </p>
            <Link href="/editorial-standards" className="button light-button">
              What we stand for <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="perspective-principles">
            {[
              {
                icon: "book" as const,
                title: "Clarity over complexity",
                text: "Straightforward explanations that put unfamiliar terms into context.",
              },
              {
                icon: "layers" as const,
                title: "Context over shortcuts",
                text: "Understand the mechanics and the trade-offs before considering a decision.",
              },
              {
                icon: "shield" as const,
                title: "Transparency, by default",
                text: "Clear disclosures, visible limitations, and no invented track records.",
              },
            ].map((p, i) => (
              <div className="perspective-principle" key={p.title}>
                <span className="principle-number">0{i + 1}</span>
                <Icon name={p.icon} size={25} />
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container glossary-teaser">
        <div className="glossary-teaser-copy">
          <p className="eyebrow">03 / FIND THE WORDS</p>
          <h2>
            Forex has a language.
            <br />
            <em>Let’s make it yours.</em>
          </h2>
          <p>
            Pips. Spreads. Margin. Start with clear definitions of the terms
            you’ll encounter, without getting lost in the jargon.
          </p>
          <Link href="/glossary" className="button outline-button">
            Open the glossary <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="term-stack">
          <Link href="/glossary#leverage" className="term-preview">
            <span className="term-letter">L</span>
            <div>
              <h3>Leverage</h3>
              <p>Greater exposure. Greater potential for loss.</p>
            </div>
            <Icon name="arrow" size={18} />
          </Link>
          <Link href="/glossary#spread" className="term-preview">
            <span className="term-letter">S</span>
            <div>
              <h3>Spread</h3>
              <p>The gap between bid and ask prices.</p>
            </div>
            <Icon name="arrow" size={18} />
          </Link>
          <Link href="/glossary#pip" className="term-preview">
            <span className="term-letter">P</span>
            <div>
              <h3>Pip</h3>
              <p>A conventional unit of price movement.</p>
            </div>
            <Icon name="arrow" size={18} />
          </Link>
          <span className="handwritten-note">
            Big ideas. Clear definitions.
          </span>
        </div>
      </section>
      <section className="coverage-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / ON THE HORIZON</p>
              <h2>Our next chapter.</h2>
            </div>
            <p>
              Thoughtful coverage takes a foundation.
              <br />
              Here’s what we’re preparing next.
            </p>
          </div>
          <div className="category-grid">
            {[
              {
                icon: "compass" as const,
                title: "Broker Reviews",
                text: "A framework for looking beyond a service’s headline claims.",
              },
              {
                icon: "layers" as const,
                title: "Broker Comparisons",
                text: "A structured way to understand differences and trade-offs.",
              },
              {
                icon: "globe" as const,
                title: "Trading Platforms",
                text: "A closer look at the tools behind the trading experience.",
              },
            ].map((c, i) => (
              <article className="category-card" key={c.title}>
                <div className="category-top">
                  <Icon name={c.icon} />
                  <span className="badge">Coming soon</span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="category-number">0{i + 1}</span>
              </article>
            ))}
          </div>
          <div className="coverage-bottom">
            <span>No active broker recommendations or affiliate links.</span>
            <Link href="/methodology" className="text-link">
              Explore our evaluation framework <Icon name="arrow" size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section container home-faq">
        <div>
          <p className="eyebrow">A FEW GOOD QUESTIONS</p>
          <h2>
            Before you
            <br />
            <em>go further.</em>
          </h2>
          <Link href="/faq" className="text-link">
            All frequently asked questions <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="faq-list">
          {[
            [
              "Is Devin Forex a broker?",
              "No. Devin Forex is an educational publication. We do not open trading accounts, hold client funds, execute trades, or provide trading signals.",
            ],
            [
              "Is this personalised financial advice?",
              "No. Our material is general information and does not account for your personal circumstances, objectives, or ability to bear losses.",
            ],
            [
              "Can I compare or choose brokers here?",
              "Broker reviews and comparisons are not published yet. You can explore our evaluation framework to understand the questions we plan to consider.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Icon name="plus" size={18} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="container newsletter">
        <div className="newsletter-mark" aria-hidden="true">
          <Icon name="mail" size={32} />
        </div>
        <div>
          <p className="eyebrow">GOOD READING. NO NOISE.</p>
          <h2>
            A clearer perspective,
            <br />
            <em>in your inbox.</em>
          </h2>
          <p>Our newsletter is taking shape. No sign-ups just yet.</p>
        </div>
        <span className="newsletter-status">
          <span className="status-dot" />
          Newsletter · Coming soon
        </span>
      </section>
    </>
  );
}
