import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { Icon } from "@/components/icon";
import { faqs } from "@/lib/education";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Frequently asked questions",
  "Answers about Devin Forex, learning resources, trading risk, and our current coverage.",
  "/faq",
);
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="FREQUENTLY ASKED QUESTIONS"
        title="Good questions."
        accent="Clear answers."
        description="A little more context about the publication, the learning journey, and the risks that should stay in view."
      />
      <div className="container section reading-layout">
        <aside className="contents-nav">
          <p className="eyebrow">ON THIS PAGE</p>
          {["About Devin Forex", "Learning & risk", "Our coverage"].map(
            (c, i) => (
              <a href={`#questions-${i}`} key={c}>
                {c}
                <span>0{i + 1}</span>
              </a>
            ),
          )}
          <div className="aside-note">
            Still curious?
            <Link href="/contact">
              Visit our contact page <Icon name="arrow" size={14} />
            </Link>
          </div>
        </aside>
        <div>
          {["About Devin Forex", "Learning & risk", "Our coverage"].map(
            (c, i) => (
              <section className="faq-group" key={c} id={`questions-${i}`}>
                <p className="eyebrow">0{i + 1} / A LITTLE CONTEXT</p>
                <h2>{c}</h2>
                <div className="faq-list">
                  {faqs
                    .filter((f) => f.category === c)
                    .map((f) => (
                      <details key={f.question}>
                        <summary>
                          {f.question}
                          <Icon name="plus" size={18} />
                        </summary>
                        <p>{f.answer}</p>
                      </details>
                    ))}
                </div>
              </section>
            ),
          )}
        </div>
      </div>
    </>
  );
}
