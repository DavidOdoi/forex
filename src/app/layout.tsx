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
  icons: {
    icon: [
      { url: "/favicon.ico?v=20261108", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico?v=20261108",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
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
