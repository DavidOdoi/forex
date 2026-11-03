import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Best Forex Brokers 2026 — Devin Forex" },
    description:
      "Our ranked list of the best regulated forex brokers for spreads, deposits and payouts.",
    openGraph: {
      title: "Best Forex Brokers 2026 — Devin Forex",
      description: "Ranked, regulated forex brokers tested by Devin Forex.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Best Forex Brokers 2026 — Devin Forex",
      description: "Ranked, regulated forex brokers tested by Devin Forex.",
    },
  },
  alternates: canonical("/best-brokers"),
};
import { PageHero } from "@/components/site-header";
import { BrokerCard } from "@/components/broker-card";
import { brokers } from "@/lib/brokers";

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Ranked · Updated monthly"
        title="The best forex brokers of"
        accent="2026"
        text="Every broker is scored on regulation, fees, execution speed, deposits and withdrawals."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 md:grid-cols-2">
        {brokers.map((b, i) => (
          <BrokerCard key={b.slug} b={b} rank={i + 1} />
        ))}
      </section>
      <section className="mx-auto max-w-7xl overflow-x-auto px-6 pb-28">
        <h2 className="mb-6 font-display text-4xl">
          Side-by-side <em className="text-gold">comparison</em>
        </h2>
        <table className="w-full min-w-[640px] rounded-2xl border bg-card text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              {[
                "Broker",
                "Rating",
                "Spread",
                "Min deposit",
                "Leverage",
                "M-Pesa",
              ].map((h) => (
                <th key={h} className="border-b p-4 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {brokers.map((b) => (
              <tr key={b.slug} className="border-b last:border-0">
                <td className="p-4 font-semibold">{b.name}</td>
                <td className="p-4 text-primary">★ {b.rating}</td>
                <td className="p-4">{b.spread} pips</td>
                <td className="p-4">{b.min}</td>
                <td className="p-4">{b.lev}</td>
                <td
                  className={`p-4 ${b.mpesa ? "text-gain" : "text-muted-foreground"}`}
                >
                  {b.mpesa ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
