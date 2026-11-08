"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site-header";
import { BrokerCard } from "@/components/broker-card";
import { brokers, brokerResearchNotice } from "@/lib/brokers";

const questions = [
  { key: "beginner", q: "Are you new to trading?" },
  { key: "lowCost", q: "Are low spreads your top priority?" },
  { key: "demo", q: "Do you want to compare demo accounts?" },
] as const;

export default function Page({ publishedLinks = {} }: { publishedLinks?: Record<string, string> }) {
  const [answers, setAnswers] = useState<boolean[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(0);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    if (previousStep.current !== answers.length) heading.current?.scrollIntoView({ block: "center" });
    previousStep.current = answers.length;
  }, [answers.length]);
  const done = answers.length === questions.length;
  const ranked = [...brokers].sort((a, b) => score(b) - score(a));
  function score(b: (typeof brokers)[number]) {
    return questions.reduce(
      (s, q, i) => s + (answers[i] && b[q.key] ? 1 : 0),
      0,
    );
  }

  return (
    <main className="bg-white text-black">
      <PageHero
        eyebrow="30-second quiz"
        title="Find your"
        accent="research starting point"
        text="Preview how preference matching could work once broker profiles are verified. This demonstration uses unverified export data and is not a recommendation."
      />
      <section id="broker-finder" aria-label="Broker finder" className="mx-auto max-w-3xl scroll-mt-36 px-6 pb-28">
        <noscript><p className="mb-6 text-lg">Enable JavaScript to use the quiz, or <Link className="underline" href="/reviews">browse the broker directory</Link>.</p></noscript>
        {!done ? (
          <div className="rounded-2xl border bg-card p-10 text-center shadow-glow">
            <p className="text-sm font-semibold uppercase tracking-widest text-black" role="status">
              Question {answers.length + 1} of {questions.length}
            </p>
            <progress aria-label="Broker finder progress" value={answers.length} max={questions.length} className="mt-5 h-2 w-full accent-[#b58736]" />
            <h2 ref={heading} tabIndex={-1} className="mt-6 font-display text-4xl outline-none">
              {questions[answers.length]?.q}
            </h2>
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setAnswers(previous => previous.length < questions.length ? [...previous, true] : previous)}
                className="rounded-full bg-gold px-10 py-4 font-semibold text-primary-foreground"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setAnswers(previous => previous.length < questions.length ? [...previous, false] : previous)}
                className="rounded-full border border-[#777] bg-white px-10 py-4 font-semibold text-black"
              >
                No
              </button>
            </div>
            {answers.length > 0 && <button type="button" onClick={() => setAnswers(previous => previous.slice(0, -1))} className="mx-auto mt-7 inline-flex items-center gap-2 rounded px-3 py-2 text-base font-semibold"><ArrowLeft size={17} aria-hidden="true" />Previous question</button>}
          </div>
        ) : (
          <div>
            <h2 ref={heading} tabIndex={-1} className="mb-6 text-center font-display text-4xl outline-none">
              Illustrative match
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-black">
              {brokerResearchNotice}
            </p>
            {ranked[0] && <BrokerCard b={ranked[0]} reviewHref={publishedLinks[ranked[0].slug]} />}
            <Link href="/reviews" className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-black px-6 py-3 text-base font-semibold">Browse all broker research <ArrowRight size={17} aria-hidden="true" /></Link>
            <button
              type="button"
              onClick={() => setAnswers([])}
              className="mx-auto mt-4 block rounded px-3 py-2 text-base text-black underline"
            >
              Start again
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
