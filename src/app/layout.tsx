import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";
import "./globals.css";
const indexable = Boolean(site.domain) && process.env.VERCEL_ENV !== "preview";
export const metadata: Metadata = {
  ...(site.domain ? { metadataBase: new URL(site.domain) } : {}),
  title: { default: `${site.name} | A clearer perspective on forex`, template: `%s | ${site.name}` },
  description: site.description, icons: { icon: site.favicon },
  robots: { index: indexable, follow: indexable },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: site.name, description: site.description,
    ...(site.domain ? { url: site.domain, logo: new URL(site.logo, site.domain).href } : {}),
    ...(site.contactEmail ? { email: site.contactEmail } : {}),
    ...(site.socialLinks.length ? { sameAs: site.socialLinks.map(link => link.href) } : {}) };
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main" tabIndex={-1}>{children}</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\u003c") }}/></body></html>;
}
