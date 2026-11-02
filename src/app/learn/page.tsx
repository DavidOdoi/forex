import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { Icon } from "@/components/icon";
import { pageMetadata, site } from "@/lib/site";
export const metadata = pageMetadata(
  "Learn forex fundamentals",
  "Start with currency pairs, trading costs, leverage, risk, and questions to ask about trading platforms. General forex education.",
  "/learn",
);
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="THE LEARNING HUB"
        title="Start with curiosity."
        accent="Build understanding."
        description="A focused introduction to the mechanics, the language, and the risks of forex. Move at your own pace. Ask questions along the way."
      />
      <div className="container section reading-layout">
        <aside className="contents-nav">
          <p className="eyebrow">YOUR STARTING POINT</p>
          {[
            ["basics", "Currency pairs"],
            ["costs", "Costs & execution"],
            ["risk", "Leverage & risk"],
            ["platforms", "Trading platforms"],
          ].map(([id, label], i) => (
            <a href={`#${id}`} key={id}>
              {label}
              <span>0{i + 1}</span>
            </a>
          ))}
          <div className="aside-note">
            <Icon name="book" />
            <p>A term you don’t recognise?</p>
            <Link href="/glossary">
              Keep the glossary handy <Icon name="arrow" size={14} />
            </Link>
          </div>
        </aside>
        <div className="learning-content">
          <section id="basics" className="learning-chapter">
            <p className="eyebrow">01 / THE ESSENTIALS</p>
            <h2>
              Every pair tells
              <br />
              <em>a two-sided story.</em>
            </h2>
            <p>
              Foreign exchange concerns the value of one currency in relation to
              another. A currency pair expresses that relationship. Buying a
              pair means buying its base currency and selling its quote
              currency; selling the pair reverses those sides.
            </p>
            <div className="pair-explainer">
              <div>
                <span className="currency-code">EUR</span>
                <small>BASE CURRENCY</small>
              </div>
              <span className="pair-slash">/</span>
              <div>
                <span className="currency-code">USD</span>
                <small>QUOTE CURRENCY</small>
              </div>
              <p>
                One euro, expressed in US dollars.
                <br />
                An illustration of notation, not a live quote.
              </p>
            </div>
            <p>
              A change in the quote reflects a change in the base currency’s
              value relative to the quote currency. It does not mean that either
              currency is moving in isolation. Currency values can respond to
              economic conditions, interest-rate expectations, policy decisions,
              and unexpected events.
            </p>
            <div className="key-takeaway">
              <Icon name="compass" />
              <div>
                <strong>Keep this in mind</strong>
                <p>
                  Understanding a quote is a starting point. It does not make
                  future price changes predictable.
                </p>
              </div>
            </div>
          </section>
          <section id="costs" className="learning-chapter">
            <p className="eyebrow">02 / THE DETAILS ADD UP</p>
            <h2>
              Look beyond
              <br />
              <em>the headline price.</em>
            </h2>
            <p>
              The cost of a trade can involve more than a single fee. Service
              terms and trading conditions can change the overall outcome, so
              read the full pricing schedule and account terms.
            </p>
            <div className="concept-grid">
              {[
                [
                  "Spread",
                  "The gap between bid and ask prices. It may vary with conditions and liquidity.",
                ],
                [
                  "Commission",
                  "A separate transaction charge that may apply, depending on the account and product.",
                ],
                [
                  "Overnight financing",
                  "A charge or credit that may apply when a position remains open overnight.",
                ],
                [
                  "Execution",
                  "The price you see and the price at which an order executes may differ.",
                ],
              ].map(([title, text]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <p>
              Other charges can include currency conversion, inactivity,
              deposits, or withdrawals. Availability and terms depend on the
              provider. Consider the full costs of the activity you have in
              mind, rather than relying on one advertised number.
            </p>
          </section>
          <section id="risk" className="learning-chapter">
            <p className="eyebrow">03 / RISK COMES FIRST</p>
            <h2>
              Leverage changes
              <br />
              <em>your exposure.</em>
            </h2>
            <p>
              Leverage allows a position to be larger than the funds committed
              as margin. That magnifies the impact of price movements. A
              movement that looks small in the underlying currency can produce a
              substantial change relative to the margin.
            </p>
            <div className="risk-callout">
              <Icon name="shield" size={26} />
              <div>
                <h3>Margin is not a loss limit.</h3>
                <p>
                  Do not assume you can lose only the amount used to open a
                  position. Losses and any account protections depend on product
                  terms, your jurisdiction, and applicable rules.
                </p>
              </div>
            </div>
            <p>
              A standard stop-loss order does not guarantee an execution price.
              During gaps or fast-moving markets, an order may execute at a less
              favourable level. Demo environments also cannot reproduce every
              aspect of live execution or the emotional effect of real losses.
            </p>
            <p>
              Before considering a leveraged product, assess whether you
              understand its mechanics and can bear the potential loss. Seek
              appropriately qualified independent advice when needed.
            </p>
            <Link href="/risk-disclosure" className="text-link">
              Read the full risk disclosure <Icon name="arrow" size={15} />
            </Link>
          </section>
          <section id="platforms" className="learning-chapter">
            <p className="eyebrow">04 / KNOW YOUR TOOLS</p>
            <h2>
              Ask better questions
              <br />
              <em>about the platform.</em>
            </h2>
            <p>
              A clean interface is useful, but it does not establish that a
              service is suitable or trustworthy. Look at the full arrangement,
              including the legal entity, product terms, and how funds and
              orders are handled.
            </p>
            <ol className="question-list">
              <li>
                Which legal entity would hold your account, and can its claims
                be checked directly with the relevant authority?
              </li>
              <li>
                Which products and order types are available, and how do they
                behave in volatile conditions?
              </li>
              <li>
                What are the total fees, financing terms, and withdrawal
                conditions?
              </li>
              <li>
                Which account protections actually apply to your location and
                client classification?
              </li>
              <li>
                Can you understand the platform controls and reach support
                without committing funds?
              </li>
            </ol>
            <Link href="/methodology" className="text-link">
              Explore our evaluation framework <Icon name="arrow" size={15} />
            </Link>
          </section>
          <aside className="document-disclaimer">{site.disclaimer}</aside>
          <div className="next-read">
            <div>
              <p className="eyebrow">KEEP YOUR PERSPECTIVE GROWING</p>
              <h3>Make the language familiar.</h3>
            </div>
            <Link href="/glossary" className="button primary">
              Explore the glossary <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
