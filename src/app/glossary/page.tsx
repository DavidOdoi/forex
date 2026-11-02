import { PageHeading } from "@/components/page-heading";
import { Glossary } from "@/components/glossary";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Forex glossary",
  "Clear definitions of forex terms, from currency pairs and spreads to leverage and margin. Search by term or filter by topic.",
  "/glossary",
);
export default function Page() {
  return (
    <>
      <PageHeading
        eyebrow="THE FOREX GLOSSARY"
        title="Less jargon."
        accent="More understanding."
        description="The words behind the markets, explained in plain language. A reference to return to whenever something needs a little clarity."
      />
      <section className="container section">
        <Glossary />
        <p className="fine-print">
          Definitions are general explanations. Product terms, quote
          conventions, and protections can differ between services and
          jurisdictions.
        </p>
      </section>
    </>
  );
}
