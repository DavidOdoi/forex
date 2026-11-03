import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Forex Broker Reviews — Devin Forex" },
    description:
      "Honest, in-depth reviews of Exness, XM, IC Markets and Pepperstone.",
    openGraph: {
      title: "Forex Broker Reviews — Devin Forex",
      description: "Honest, in-depth forex broker reviews.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Broker Reviews — Devin Forex",
      description: "Honest, in-depth forex broker reviews.",
    },
  },
  alternates: canonical("/reviews"),
};
import { Check, X } from "lucide-react";
import { PageHero } from "@/components/site-header";
import { brokers } from "@/lib/brokers";

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="In-depth reviews"
        title="Honest broker"
        accent="reviews"
        text="We open real accounts, deposit real money and test withdrawals — then tell you exactly what we found."
      />
      <section className="mx-auto max-w-7xl space-y-6 px-6 pb-28">
        {brokers.map((b) => (
          <article
            key={b.slug}
            className="grid gap-8 rounded-2xl border bg-card p-8 md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-accent">
                {b.tag}
              </span>
              <h2 className="mt-2 font-display text-4xl">{b.name} review</h2>
              <p className="mt-3 text-muted-foreground">{b.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <ul className="space-y-2">
                {b.pros.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="h-4 w-4 text-gain" />
                    {p}
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {b.cons.map((c) => (
                  <li key={c} className="flex gap-2">
                    <X className="h-4 w-4 text-loss" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="text-gold font-display text-6xl">
                {b.rating}
              </span>
              <a
                href={b.url}
                target="_blank"
                rel="sponsored noopener"
                className="rounded-full bg-gold px-6 py-3 font-semibold text-primary-foreground"
              >
                Visit {b.name}
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
