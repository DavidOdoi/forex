import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { site } from "@/lib/site";
export function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: readonly (readonly [string, string])[];
}) {
  return (
    <>
      <PageHeading
        eyebrow="TRUST & TRANSPARENCY"
        title={title}
        accent="The important details."
        description="Clear disclosures and honest boundaries are part of the foundation. Read the details behind your use of Devin Forex."
      />
      <article className="container section reading-layout">
        <aside className="contents-nav">
          <p className="eyebrow">TRUST CENTRE</p>
          {site.footerLinks
            .filter((l) => !["/about", "/contact"].includes(l.href))
            .map((l) => (
              <Link href={l.href} key={l.href}>
                {l.label}
              </Link>
            ))}
        </aside>
        <div className="legal-content">
          <p className="review-notice">
            <strong>Draft — for final legal review.</strong> Operator details,
            jurisdiction, and effective date must be confirmed before public
            launch.
          </p>
          {sections.map(([heading, text]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{text}</p>
            </section>
          ))}
          <aside className="document-disclaimer">{site.disclaimer}</aside>
        </div>
      </article>
    </>
  );
}
