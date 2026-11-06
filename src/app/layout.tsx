import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { indexable, siteOrigin } from "@/lib/site";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Devin Forex — Broker Research and Comparisons",
  description:
    "Explore forex broker research, account terms and trading risks. Research is in preparation.",
  openGraph: { type: "website" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
  robots: { index: indexable, follow: indexable },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="site-top">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
