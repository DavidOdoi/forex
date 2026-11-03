"use client";
import { useState } from "react";
import { PageHero } from "@/components/site-header";
import { BrokerCard } from "@/components/broker-card";
import { brokers, brokerResearchNotice } from "@/lib/brokers";

const questions = [
  { key: "beginner", q: "Are you new to trading?" },
  { key: "lowCost", q: "Are low spreads your top priority?" },
  { key: "mpesa", q: "Do you want to deposit with M-Pesa?" },
] as const;

export default function Page() {
  const [answers, setAnswers] = useState<boolean[]>([]);
  const done = answers.length === questions.length;
  const ranked = [...brokers].sort((a, b) => score(b) - score(a));
  function score(b: (typeof brokers)[number]) {
    return questions.reduce(
      (s, q, i) => s + (answers[i] && b[q.key] ? 1 : 0),
      0,
    );
  }

  return (
    <main>
      <PageHero
        eyebrow="30-second quiz"
        title="Find your"
        accent="research starting point"
        text="Preview how preference matching could work once broker profiles are verified. This demonstration uses unverified export data and is not a recommendation."
      />
      <section className="mx-auto max-w-3xl px-6 pb-28">
        {!done ? (
          <div className="rounded-2xl border bg-card p-10 text-center shadow-glow">
            <p className="text-xs uppercase tracking-widest text-accent">
              Question {answers.length + 1} of {questions.length}
            </p>
            <h2 className="mt-4 font-display text-4xl">
              {questions[answers.length]?.q}
            </h2>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setAnswers([...answers, true])}
                className="rounded-full bg-gold px-10 py-4 font-semibold text-primary-foreground"
              >
                Yes
              </button>
              <button
                onClick={() => setAnswers([...answers, false])}
                className="rounded-full glass px-10 py-4 font-semibold"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="mb-6 text-center font-display text-4xl">
              Illustrative match
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {brokerResearchNotice}
            </p>
            {ranked[0] && <BrokerCard b={ranked[0]} />}
            <button
              onClick={() => setAnswers([])}
              className="mx-auto mt-6 block text-sm text-muted-foreground underline"
            >
              Start again
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
