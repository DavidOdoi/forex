# Country guide: supplied reference layout

This replaces the research-question-card redesign at the user's request. The visual reference is the newly supplied saved BrokerChooser Japan HTML (SHA-256 `40dd33d93a866b3eb63c8761a11367850a2d6126235a19c1a6d8a943dcf6b2ea`), identical to the earlier supplied file. The reference was inspected with JavaScript disabled and external requests blocked. Its scripts and tracking are not run or imported into the app.

## Layout

- Compact dark navigation with Devin Forex's name in white/gold, scoped to country detail routes; existing site menus and mobile drawer remain functional. Other site headers retain their existing branding and styling.
- Pale slate title band, breadcrumb/disclosure row and compact three-part author/review/date byline.
- Sticky, horizontally scrolling topic tabs, truncated labels and working circular overflow controls.
- Two-column broker directory above the article, with numbered strips, square typographic broker marks, country-status captions and chevrons. On phones the list becomes a single column. The previous research-question cards and prominent summary box are removed from the opening layout.
- Main article on the left and a white broker-list sidebar on the right. The sidebar's Brokers/Key checks tabs support pointer and keyboard selection; each item links to its real section.
- Individual broker research panels use a pale header and striped status rows. Existing country findings, legal notice, source records, methodology, FAQs and corrections remain available below.
- Uniform Manrope body typography, responsive spacing, visible focus, reduced-motion behavior and measured anchor offsets.

The directory shows only the supplied Sri Lanka dossier's four actual research subjects, in dossier order: Exness, XM, IC Markets and Pepperstone. Names are resolved through the existing broker master. The displayed marks are local text treatments, not imported third-party artwork. The numbered strips are a directory index, not performance rankings; the opening text and sidebar explain that there are no ranked recommendations. No score, local availability, endorsement, testing result, sponsorship, reviewer identity or freshness claim was invented to fill the reference's slots.

Only broker identity fields reach the interactive sidebar. Raw dossier fee, account and funding records remain server-side. Each country-specific result is labelled unresolved. The page remains draft/noindex, omitted from the sitemap, with commercial broker links disabled. Existing publication, evidence and affiliate approval gates are unchanged.

## Validation

TypeScript, ESLint and the production build pass. The browser regression suite passes all 47 tests, including broker-directory anchor navigation with and without JavaScript, keyboard-operated sidebar tabs, sticky navigation, responsive widths of 320/390/768/1440 pixels, source provenance and indexing, 51 independent affiliate failure conditions, site navigation and the existing broker reviews. Desktop and mobile screenshots were inspected against the supplied reference. `git diff --check` passes.

## Release

The user has requested that changes always be pushed to GitHub. This replacement is released through its feature branch and production `main`; the existing Vercel integration handles deployment. This environment cannot confirm the external site's deployment completion because its network policy blocks the live domain.
