import { BrokerRecommendations } from "@/components/broker-recommendations/broker-recommendations";
import type { Metadata } from "next";
import { canonical } from "@/lib/site";
import Link from "next/link";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Devin Forex — Broker Research and Comparisons" },
    description:
      "Compare forex broker accounts, check local trading rules and use gold-price dashboards and trading calculators. Read the sources behind each review.",
    openGraph: {
      title: "Devin Forex — Broker Research and Comparisons",
      description:
        "Broker account comparisons, country guides, gold prices and trading calculators, with linked sources and clear limits.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Devin Forex — Broker Research and Comparisons",
      description:
        "Broker account comparisons, country guides, gold prices and trading calculators, with linked sources and clear limits.",
    },
  },
  alternates: canonical("/"),
};
import Image from "next/image";
import hero from "@/assets/hero-fx-light.jpg";
import { brokers, brokerResearchNotice } from "@/lib/brokers";
import { BrokerCard } from "@/components/broker-card";
import { MarketTicker } from "@/components/market-ticker";
import { visibleReviewHref } from "@/lib/reviews/visibility";

export default function Index() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-12">
        <Image
          priority
          unoptimized
          src={hero}
          alt=""
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full rounded-[2rem] object-cover opacity-60"
        />
        <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="max-w-3xl py-20">
          <p className="mb-6 inline-block rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary">
            Broker reviews · Trading guides · Calculators
          </p>
          <h1 className="font-display text-6xl leading-[0.95] md:text-8xl">
            Understand forex <em className="text-gold">before you trade.</em>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Compare account costs, check the company behind a broker and work
            out your position size. Our reviews link to the documents behind
            the figures and explain what still needs checking.
          </p>
          <BrokerRecommendations />
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#brokers"
              className="rounded-full bg-gold px-8 py-4 font-semibold text-primary-foreground shadow-glow transition hover:scale-105"
            >
              Compare brokers
            </a>
            <a
              href="#how"
              className="rounded-full glass px-8 py-4 font-semibold"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      <MarketTicker />

      <section id="brokers" className="mx-auto max-w-7xl px-6 py-28">
        <h2 className="font-display text-5xl md:text-6xl">
          Broker <em className="text-gold">research</em>
        </h2>
        <p className="mt-4 text-muted-foreground">{brokerResearchNotice}</p>
        <p className="mt-4 text-base leading-relaxed">Start with <Link className="underline" href="/forex-brokers">forex brokers by country</Link> for local rules, or use the <Link className="underline" href="/find-my-broker">broker research checklist</Link> to decide what to compare.</p>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {brokers.map((b) => (
            <BrokerCard key={b.slug} b={b} reviewHref={visibleReviewHref(b.slug)} />
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-6 pb-28">
        <h2 className="font-display text-5xl md:text-6xl">
          Start with the <em className="text-gold">checks that matter</em>
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            [
              "01",
              "Check local rules",
              "Confirm the product, provider and funding rules for your country. A foreign licence alone may not cover your account.",
            ],
            [
              "02",
              "Practise on a demo",
              "Learn the platform and order controls with virtual money. Demo results do not establish what you will earn live.",
            ],
            [
              "03",
              "Plan your risk",
              "Calculate position size, margin and costs before considering a funded account. Keep essential living expenses out of your trading budget.",
            ],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-2xl glass p-8">
              <span className="font-display text-6xl text-gold">{n}</span>
              <h3 className="mt-4 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-6 pb-28">
        <h2 className="font-display text-5xl">Questions</h2>
        {[
          [
            "Is forex trading legal?",
            "Rules depend on your country of residence, the product, the broker’s legal company and how you fund the account. Check the relevant regulator’s current guidance before depositing; an overseas broker accepting your application does not establish permission.",
          ],
          [
            "How much do I need to start?",
            "An account-opening minimum is different from a sensible risk budget. Check the minimum trade size, margin, fees and how much you could lose. You can learn the controls on a demo before putting money at risk.",
          ],
          [
            "Do you charge anything?",
            "The guides and tools are free to read and use. We currently have no active affiliate tracking links. If that changes, paid links will be labelled; the broker’s own account and trading charges still apply.",
          ],
        ].map(([q, a]) => (
          <details key={q} className="border-b py-6">
            <summary className="cursor-pointer text-lg font-semibold">
              {q}
            </summary>
            <p className="mt-3 text-muted-foreground">{a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
