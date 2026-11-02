import Link from "next/link";
import { GlobeArt } from "@/components/globe-art";
import { Icon } from "@/components/icon";
import { PageHeading } from "@/components/page-heading";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "About Devin Forex",
  "A financial publication built around forex education, clear explanations, and awareness of risk. Learn what Devin Forex stands for.",
  "/about",
);
export default function About() {
  return (
    <>
      <PageHeading
        eyebrow="ABOUT DEVIN FOREX"
        title="For a more considered"
        accent="kind of curiosity."
        description="There’s a lot of noise around trading. We’re creating a place to step back, understand the essentials, and see the bigger picture."
      />
      <section className="container section about-story">
        <GlobeArt />
        <div>
          <p className="eyebrow">THE IDEA BEHIND THE PUBLICATION</p>
          <h2>
            Good information
            <br />
            gives you <em>perspective.</em>
          </h2>
          <p>
            Devin Forex starts with a simple idea: understanding should come
            before commitment. That means explaining unfamiliar concepts, making
            risk visible, and acknowledging what we don’t yet know.
          </p>
          <p>
            We’re building a financial publication around forex fundamentals and
            a thoughtful approach to evaluating trading services. We do not
            operate a brokerage, hold client funds, provide trading signals, or
            offer personalised financial advice.
          </p>
          <Link href="/learn" className="text-link">
            Find your starting point <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
      <section className="about-values">
        <div className="container section">
          <p className="eyebrow">A FEW THINGS WE BELIEVE</p>
          <h2>
            The standard is <em>substance.</em>
          </h2>
          <div className="value-grid">
            {[
              [
                "01",
                "Understand before you act.",
                "A clearer explanation is more useful than an urgent call to trade. We focus on knowledge, context, and thoughtful questions.",
              ],
              [
                "02",
                "Say what you know.",
                "No invented company history, qualifications, testing results, or ratings. Useful information includes its own limitations.",
              ],
              [
                "03",
                "Make the important visible.",
                "Risk, costs, and commercial relationships deserve clear treatment. Transparency is part of the experience, not a footnote.",
              ],
            ].map(([n, t, p]) => (
              <article key={n}>
                <span className="eyebrow">{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container section about-next">
        <div>
          <p className="eyebrow">WHERE WE GO FROM HERE</p>
          <h2>
            A foundation worth
            <br />
            <em>building on.</em>
          </h2>
        </div>
        <div>
          <p>
            Our learning hub and glossary are ready to explore. Future broker
            reviews, comparisons, and platform coverage will need a clear
            methodology, reliable sources, and appropriate disclosures before
            publication.
          </p>
          <div className="inline-links">
            <Link href="/methodology" className="text-link">
              Our methodology <Icon name="arrow" size={15} />
            </Link>
            <Link href="/editorial-standards" className="text-link">
              Editorial standards <Icon name="arrow" size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
