import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { PageHeading } from "@/components/page-heading";
import { Icon } from "@/components/icon";
import { pageMetadata, site } from "@/lib/site";
export const metadata = pageMetadata(
  "Contact",
  "Contact information and a local contact-form demonstration for Devin Forex.",
  "/contact",
);
export default function Contact() {
  return (
    <>
      <PageHeading
        eyebrow="CONTACT"
        title="Good conversations"
        accent="start with a question."
        description="A suggestion, a question, or something that could be clearer? Here’s where our conversation will begin."
      />
      <div className="container section contact-layout">
        <aside>
          <span className="contact-icon">
            <Icon name="mail" size={28} />
          </span>
          <h2>
            A little context
            <br />
            before you write.
          </h2>
          <p>
            Our message service is still being prepared. The form is a local
            demonstration and does not send or store messages.
          </p>
          {site.contactEmail ? (
            <a className="text-link" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
              <Icon name="arrow" size={15} />
            </a>
          ) : (
            <p className="contact-status">
              <span className="status-dot" />
              Verified contact email coming soon
            </p>
          )}
          <div className="contact-help">
            <h3>Looking for a quick answer?</h3>
            <Link className="text-link" href="/faq">
              Explore frequently asked questions <Icon name="arrow" size={15} />
            </Link>
            <p>
              Please don’t enter passwords, account numbers, or sensitive
              financial information.
            </p>
          </div>
        </aside>
        <div className="form-panel">
          <p className="eyebrow">LET’S MAKE THINGS CLEARER</p>
          <h2>What’s on your mind?</h2>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
