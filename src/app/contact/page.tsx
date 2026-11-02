import { ContactForm } from "@/components/contact-form";
import { pageMetadata, site } from "@/lib/site";
export const metadata = pageMetadata("Contact", "Contact information and a local contact-form demonstration for Devin Forex.", "/contact");
export default function Contact() { return <div className="container document"><p className="eyebrow">GET IN TOUCH</p><h1>A conversation starts here.</h1><p className="document-lead">Our contact service is being prepared. Please don’t enter sensitive personal or financial information.</p>{site.contactEmail ? <p>Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p> : <p className="form-notice">A verified contact email will be added before the contact service launches.</p>}<ContactForm/></div>; }
