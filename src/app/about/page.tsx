import type { Metadata } from "next";
import { canonical } from "@/lib/site";
export const metadata: Metadata = {
  ...{
    title: { absolute: "About Devin Forex — Our Story & Testing Method" },
    description:
      "Who we are, how we test brokers and how Devin Forex is funded.",
    openGraph: {
      title: "About Devin Forex",
      description: "Who we are and how we test forex brokers.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "About Devin Forex",
      description: "Who we are and how we test forex brokers.",
    },
  },
  alternates: canonical("/about"),
};
import { PageHero } from "@/components/site-header";

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="About us"
        title="Helping traders choose"
        accent="wisely"
        text="Devin Forex was built to cut through the noise and point traders to brokers they can genuinely trust."
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 md:grid-cols-3">
        {[
          [
            "Our story",
            "We started Devin Forex after seeing too many new traders lose money to unregulated brokers.",
          ],
          [
            "How we test",
            "We check regulation, open live accounts, measure spreads and test real withdrawals.",
          ],
          [
            "How we earn",
            "Brokers may pay us a referral commission. It never costs you anything extra.",
          ],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl glass p-8">
            <h2 className="font-display text-3xl text-gold">{t}</h2>
            <p className="mt-3 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-3xl px-6 pb-28 text-center">
        <h2 className="font-display text-4xl">
          Get in <em className="text-gold">touch</em>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Questions or partnership ideas? Email us at hello@devinforex.com
        </p>
      </section>
    </main>
  );
}
