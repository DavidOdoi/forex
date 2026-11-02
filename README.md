# Devin Forex

A Next.js App Router foundation built with TypeScript, React, and Tailwind CSS. All pages use Server Components by default; only the mobile navigation and local contact demo need client interactivity. No external fonts, tracking, financial data feeds, or content integrations are loaded.

## Local development

Requires Node.js 20.9 or newer (Node 24 used for validation) and npm.

```sh
npm ci
npm run dev
```

Run commands in the repository root. Development uses port 3000. Production: `npm run build`, then `npm start`. Stop a running server with Ctrl+C.

```sh
npm run typecheck
npm run lint
npm run build
```

## Pages

- `/`: homepage
- `/about`
- `/contact`: frontend-only form; validates locally and sends/stores nothing
- `/affiliate-disclosure`
- `/risk-disclosure`
- `/privacy-policy`
- `/terms-and-conditions`
- Custom 404 for unmatched URLs

Search, category cards, and newsletter are clearly marked coming soon and do not collect data or link to unpublished content.

## Brand and launch configuration

Edit `src/lib/site.ts` for the site name, description, domain, logo, favicon, verified email, social profiles, navigation, footer links, and general disclaimer. The current monogram assets are temporary editable SVGs in `public/`. Optional social links are empty until verified; contact email is unset. Do not enter invented URLs or email addresses.

Set `SITE_URL` to the confirmed HTTPS origin (for example your actual custom domain without a path) before building for the public domain. `.env.example` documents this optional, non-secret variable. No secrets or email service are required. Do not add credentials to source control.

Without `SITE_URL`, robots blocks indexing, canonical URLs and unknown organization properties are omitted, and the sitemap is empty rather than pointing to a fabricated domain. With `SITE_URL`, each existing page receives a canonical URL and the sitemap lists exactly the seven public pages. The 404 is not included. Organization schema uses only the verified configuration fields. Open Graph and Twitter metadata are included without fabricated images or social handles.

`VERCEL_ENV=preview` blocks indexing even when a domain is supplied. Also keep Vercel's preview deployment protection enabled: robots directives are not access control. For a local indexable-domain smoke test, use `SITE_URL` with a temporary test origin only for the test build; do not publish it. Rebuild after changing domain settings.

All legal text is a draft. Confirm operator identity, jurisdiction, effective dates, privacy handling, and contact details with qualified legal review before public launch. Review hosting-provider logging and retention. There are no invented company credentials, historical claims, ratings, broker names, or testimonials.

## Deploy on Vercel (manual; not deployed)

1. Push this repository to GitHub when you are ready.
2. Create a **separate** Vercel project and import the repository. Select the Next.js framework and the repository root as the root directory. Use Node.js 24.x (or a supported version >=20.9), install command `npm ci`, and build command `npm run build`. Leave the output directory at the framework default.
3. Use preview deployments to review the site. No service credentials are needed.
4. In project Settings → Domains, add the domain you already own and follow the DNS records Vercel provides. Domain purchase and deployment require your explicit go-ahead.
5. Set `SITE_URL` to that verified HTTPS origin for Production. Rebuild after changing it. Confirm canonical metadata, `/sitemap.xml`, `/robots.txt`, TLS, all navigation, contact-demo wording, mobile navigation, and the custom 404 before launch.
6. Complete legal and brand review before enabling public indexing. Never use the preview hostname as the canonical production domain.

Security headers cover MIME sniffing, framing, referrer policy, restricted browser capabilities, and limited CSP directives. The CSP intentionally preserves the Next.js runtime; review a nonce-based strict CSP if future integrations require it. Adding a contact backend will require server-side validation, abuse controls, secure delivery, updated privacy disclosures, and separate testing.

## Browser checks

`tests/foundation.spec.ts` covers desktop/mobile navigation, all public routes, local form validation, placeholders, security headers, metadata, robots/sitemap behavior, and 404 status. Browser binaries are a development-only prerequisite:

```sh
npx playwright install chromium
npm run build
npx playwright test
```

If a system Chromium is already installed, skip the browser download and run `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test` instead.

Tests start a production server on port 3100. Screenshots are saved in the ignored `test-results` directory. Re-run with `SITE_URL` supplied at **both build and test time** to check domain-specific metadata. A local HTML and interaction smoke test is not a full accessibility audit or a measured Core Web Vitals result.

## Next phase

Keyword research, taxonomy, articles, review/comparison pages, detailed evaluation methodology, publishing requirements, affiliate integrations, newsletter collection, and contact delivery are intentionally deferred.

## File map

All files were created in the previously empty checkout; no existing application files were overwritten.

- `src/app/`: root layout, global styles, homepage, About, Contact, the four legal pages, custom 404, robots and sitemap routes.
- `src/components/`: header/mobile menu, footer, local contact form, legal-page template, and decorative SVG arrow.
- `src/lib/site.ts`: central brand configuration, navigation, SEO helper, and public URL list.
- `src/lib/legal.ts`: draft legal content.
- `public/brand.svg`, `public/favicon.svg`: temporary monogram assets.
- `package.json`, `package-lock.json`: scripts and locked dependencies.
- `tsconfig.json`, generated `next-env.d.ts`: TypeScript configuration.
- `next.config.ts`: production defaults and security headers.
- `postcss.config.mjs`, `eslint.config.mjs`: Tailwind and lint configuration.
- `playwright.config.ts`, `tests/foundation.spec.ts`: production browser checks.
- `.env.example`, `.gitignore`, `README.md`: environment documentation, exclusions, and operating instructions.

## Validated in this environment

Clean `npm ci`, type checking, linting (zero errors/warnings), and production build passed. All five browser tests passed using system Chromium. Both unconfigured-domain behavior and a temporary test-only configured-domain build were checked; the final build has no domain configured. Desktop/mobile screenshots were inspected, and all seven public pages were checked for horizontal overflow at 320, 390, 768, and 1440 pixels. Production dependency audit reported zero known vulnerabilities at validation time. These checks do not constitute legal approval, a full accessibility audit, or measured Core Web Vitals. Nothing was deployed or purchased.
