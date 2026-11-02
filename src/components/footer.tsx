import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { site } from "@/lib/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <Image src={site.logo} alt="" width={36} height={36} />
              <span>{site.name}</span>
            </Link>
            <p>
              Knowledge before the trade.
              <br />
              Perspective for the decisions ahead.
            </p>
            <Link href="/about" className="text-link">
              Get to know us <Icon name="arrow" size={15} />
            </Link>
          </div>
          <div className="footer-columns">
            <nav aria-label="Explore">
              <h2>Explore</h2>
              {site.resourceLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Publication">
              <h2>The publication</h2>
              <Link href="/about">About Devin Forex</Link>
              <Link href="/methodology">Our methodology</Link>
              <Link href="/editorial-standards">Editorial standards</Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <nav aria-label="Footer navigation">
              <h2>The important details</h2>
              {site.footerLinks
                .filter((link) => !["/about", "/contact"].includes(link.href))
                .map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
            </nav>
          </div>
        </div>
        <div className="footer-disclosures">
          <div>
            <Icon name="shield" size={21} />
            <p>
              <strong>Understand the risk.</strong> {site.disclaimer}
            </p>
          </div>
          <p>
            <strong>A note on transparency.</strong> We may introduce affiliate
            partnerships in the future. There are currently no active affiliate
            links.{" "}
            <Link href="/affiliate-disclosure">Read our disclosure.</Link>
          </p>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>Built around clarity. Grounded in perspective.</span>
          <a href="#main">Back to top ↑</a>
        </div>
        {site.socialLinks.length > 0 && (
          <nav aria-label="Social links">
            {site.socialLinks.map((link) => (
              <a key={link.href} href={link.href} rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
