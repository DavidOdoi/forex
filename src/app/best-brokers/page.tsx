import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Forex Broker Comparisons — Devin Forex" },
    description:
      "A preview of broker comparisons. Source verification is pending; no broker rankings or ratings are published.",
    openGraph: {
      title: "Forex Broker Comparisons — Devin Forex",
      description:
        "Broker comparisons in preparation. No hands-on testing or ratings are currently published.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Broker Comparisons — Devin Forex",
      description:
        "Broker comparisons in preparation. No hands-on testing or ratings are currently published.",
    },
  },
  alternates: canonical("/best-brokers"),
};
import { PageHero } from "@/components/site-header";
import { BrokerCard } from "@/components/broker-card";
import { brokers, brokerResearchNotice } from "@/lib/brokers";

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Research in preparation"
        title="Explore forex"
        accent="brokers"
        text={brokerResearchNotice}
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 md:grid-cols-2">
        {brokers.map((b) => (
          <BrokerCard key={b.slug} b={b} />
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
                "Research scope",
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
                <td className="p-4 text-muted-foreground">Not rated</td>
                <td className="p-4">{b.spread}</td>
                <td className="p-4">{b.min}</td>
                <td className="p-4">{b.lev}</td>
                <td
                  className="p-4 text-muted-foreground"
                >
                  Global overview
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
