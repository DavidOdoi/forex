import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/tools/forex-position-size-calculator", destination: "/calculators/forex-lot-size-calculator", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/reviews/:slug/data",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
