import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Devin Forex — Broker Research and Comparisons" },
    description:
      "Explore the questions behind broker regulation, account costs and trading services. Research is in preparation.",
    openGraph: {
      title: "Devin Forex — Broker Research and Comparisons",
      description:
        "Broker research and comparisons in preparation. No hands-on testing or ratings are currently published.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Devin Forex — Broker Research and Comparisons",
      description:
        "Broker research and comparisons in preparation. No hands-on testing or ratings are currently published.",
    },
  },
  alternates: canonical("/"),
};
import Image from "next/image";
import hero from "@/assets/hero-fx-light.jpg";
import { brokers, brokerResearchNotice } from "@/lib/brokers";
import { BrokerCard } from "@/components/broker-card";
import { MarketTicker } from "@/components/market-ticker";

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
            Broker research · In preparation
          </p>
          <h1 className="font-display text-6xl leading-[0.95] md:text-8xl">
            Trade the world&apos;s <em className="text-gold">largest market</em>{" "}
            with the right partner.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            We are preparing source-based broker profiles covering regulation,
            costs, platforms and withdrawals. We have not carried out hands-on
            testing or published broker ratings.
          </p>
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
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {brokers.map((b) => (
            <BrokerCard key={b.slug} b={b} />
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-6 pb-28">
        <h2 className="font-display text-5xl md:text-6xl">
          Three steps to your <em className="text-gold">first trade</em>
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            [
              "01",
              "Choose a broker",
              "Research the legal entity, account terms and restrictions relevant to your country.",
            ],
            [
              "02",
              "Verify & fund",
              "Verify your identity and choose a payment method supported for your country and account.",
            ],
            [
              "03",
              "Start trading",
              "Practice on a free demo, then go live when you're ready.",
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
            "Yes, in most countries — always choose a broker regulated in your region.",
          ],
          [
            "How much do I need to start?",
            "Some brokers accept as little as $5–$10. Start small and learn on a demo first.",
          ],
          [
            "Do you charge anything?",
            "No. We may earn a commission from brokers when you sign up, at no cost to you.",
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
