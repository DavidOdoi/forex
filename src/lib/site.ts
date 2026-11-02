import type { Metadata } from "next";
// Replace nulls with verified brand details. Never invent contact or social URLs.
const domain = process.env.SITE_URL;
if (domain && (new URL(domain).protocol !== "https:" || new URL(domain).pathname !== "/")) {
  throw new Error("SITE_URL must be an HTTPS origin without a path");
}
export const site = {
  name: "Devin Forex",
  domain: domain ? new URL(domain).origin : null, // PLACEHOLDER: confirmed public domain
  description: "A considered approach to understanding forex trading services. Clear information, transparent evaluation, and risk awareness.",
  logo: "/brand.svg",
  favicon: "/favicon.svg",
  contactEmail: null as string | null, // PLACEHOLDER: verified contact email
  socialLinks: [] as { label: string; href: string }[], // PLACEHOLDER: verified profiles
  navigation: [{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }],
  footerLinks: [{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "Affiliate Disclosure", href: "/affiliate-disclosure" }, { label: "Risk Disclosure", href: "/risk-disclosure" }, { label: "Privacy Policy", href: "/privacy-policy" }, { label: "Terms and Conditions", href: "/terms-and-conditions" }],
  disclaimer: "This website provides general information only and does not provide financial or investment advice. Forex and CFD trading involve substantial risk, and you may lose some or all of your invested capital.",
};
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: site.domain ? { canonical: path } : undefined,
    openGraph: { title: `${title} | ${site.name}`, description, type: "website", siteName: site.name, ...(site.domain ? { url: path } : {}) },
    twitter: { card: "summary", title: `${title} | ${site.name}`, description },
  };
}
export const publicPaths = ["/", ...site.footerLinks.map(link => link.href)];
