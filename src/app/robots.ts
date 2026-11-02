import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  const indexable =
    Boolean(site.domain) && process.env.VERCEL_ENV !== "preview";
  return {
    rules: {
      userAgent: "*",
      ...(indexable ? { allow: "/" } : { disallow: "/" }),
    },
    ...(indexable ? { sitemap: `${site.domain}/sitemap.xml` } : {}),
  };
}
