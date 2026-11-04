import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "Forex Insights, Guides & Strategies — Devin Forex" },
    description:
      "Beginner guides, trading strategies and market insights from Devin Forex.",
    openGraph: {
      title: "Forex Insights — Devin Forex",
      description: "Guides, strategies and market insights.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Forex Insights — Devin Forex",
      description: "Guides, strategies and market insights.",
    },
  },
  alternates: canonical("/insights"),
};
import { PageHero } from "@/components/site-header";

const posts = [
  [
    "Beginner guide",
    "What is forex trading? A complete beginner's guide",
    "8 min",
  ],
  [
    "Beginner guide",
    "How to choose a broker and funding method for your country",
    "5 min",
  ],
  ["Strategy", "Risk management: the 2% rule explained", "6 min"],
  ["Strategy", "Support & resistance: trading the key levels", "9 min"],
  ["Market", "Why gold (XAU/USD) moves the way it does", "7 min"],
  ["Market", "How interest rates drive currency prices", "6 min"],
];

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Learn & grow"
        title="Trading"
        accent="insights"
        text="Plain-language guides to help you trade with more confidence."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-28 md:grid-cols-3">
        {posts.map(([cat, title, time], i) => (
          <article
            key={title}
            id={i === 0 ? "beginner-guides" : i === 2 ? "strategies" : i === 4 ? "market-guides" : undefined}
            className={`group cursor-pointer rounded-2xl border bg-card p-8 transition hover:border-primary/50 hover:shadow-glow ${i === 0 ? "md:col-span-2" : ""}`}
          >
            <span className="text-xs uppercase tracking-widest text-accent">
              {cat} · {time}
            </span>
            <h2
              className={`mt-4 font-display leading-tight transition group-hover:text-primary ${i === 0 ? "text-5xl" : "text-3xl"}`}
            >
              {title}
            </h2>
            <p className="mt-6 text-sm text-muted-foreground">Coming soon →</p>
          </article>
        ))}
      </section>
    </main>
  );
}
