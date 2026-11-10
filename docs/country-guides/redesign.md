# Country guide: supplied reference layout

This replaces the research-question-card redesign at the user's request. The visual reference is the newly supplied saved BrokerChooser Japan HTML (SHA-256 `40dd33d93a866b3eb63c8761a11367850a2d6126235a19c1a6d8a943dcf6b2ea`), identical to the earlier supplied file. The reference was inspected with JavaScript disabled and external requests blocked. Its scripts and tracking are not run or imported into the app.

## Layout

- The original Devin Forex site header, logo, navigation and mobile drawer are retained exactly. The supplied template applies to the page below the site header.
- Pale slate title band with the direct answer immediately below the H1, a compact legal-status notice, breadcrumb/disclosure row and genuine author/review/date byline.
- Sticky, horizontally scrolling topic tabs, truncated labels and working circular overflow controls.
- Two-column broker directory above the article, with numbered strips, square typographic broker marks, country-status captions and chevrons. On phones the list becomes a single column. The previous research-question cards and prominent summary box are removed from the opening layout.
- Main article on the left and a white broker-list sidebar on the right. The sidebar's Brokers/Key checks tabs support pointer and keyboard selection; each item links to its real section.
- A single, horizontally scrollable research-status table replaces four repetitive broker panels. It keeps the broker column visible while scrolling and labels all unresolved country fields explicitly. Four short regulation/payment/cost/platform check cards precede the comprehensive country findings. Three focused Sri Lanka FAQs replace eleven repetitive ones; the substantive legal material remains in the article. Sources use a native expandable disclosure, with all source records retained in the initial HTML.
- Body typography matches the existing insight articles: Manrope, 18px, 1.7 line height. Controls inherit the same family. Reference layout spacing, visible focus, reduced-motion behavior and measured anchor offsets remain.

The directory shows only the supplied Sri Lanka dossier's four actual research subjects, in dossier order: Exness, XM, IC Markets and Pepperstone. Names are resolved through the existing broker master. The displayed marks are local text treatments, not imported third-party artwork. The numbered strips are a directory index, not performance rankings; the opening text and sidebar explain that there are no ranked recommendations. No score, local availability, endorsement, testing result, sponsorship, reviewer identity or freshness claim was invented to fill the reference's slots.

Only broker identity fields reach the interactive sidebar. Raw dossier fee, account and funding records remain server-side. Each country-specific result is labelled unresolved. The page remains draft/noindex, omitted from the sitemap, with commercial broker links disabled. Existing publication, evidence and affiliate approval gates are unchanged.

## Validation

TypeScript, ESLint and the production build pass. The browser regression suite passes all 49 tests, including broker-directory anchor navigation with and without JavaScript, keyboard-operated sidebar tabs, sticky navigation, responsive widths of 320/390/768/1440 pixels, source provenance and indexing, 51 independent affiliate failure conditions, site navigation and the existing broker reviews. Desktop and mobile screenshots were inspected against the supplied reference. `git diff --check` passes.

## Release

The user has requested that changes always be pushed to GitHub. This replacement is released through its feature branch and production `main`; the existing Vercel integration handles deployment. This environment cannot confirm the external site's deployment completion because its network policy blocks the live domain.

## Header and font correction

The country-specific dark header and replacement wordmark were removed following the user’s correction. Both shared header files match the versions before that change. Sticky offsets use the original header heights on desktop and mobile. A browser check compares the guide’s prose font against the existing funded-trading mistakes article and checks the original header’s logo, appearance and dimensions.

## Selected improvements from the supplied redesign prompt

The user authorized judgment rather than wholesale adoption. Applied: answer-first introduction, one research-only status table, four concise check cards, a less cluttered sidebar, three directly relevant FAQs and expandable sources. Retained: the supplied reference's broker directory and article/sidebar structure, the existing shared header/footer and Manrope body font, genuine author identity, honest date labels and all essential legal research. Decorative country artwork, generic awards, speculative account details, extra repeated summary panels and unsolicited site-wide changes were omitted.

### Changed files and components

- `src/components/country-guides/country-guide.tsx`: reusable composition, hero answer, compact sidebar and source disclosure.
- `src/components/country-guides/research-overview.tsx`: new server-rendered `ResearchStatusTable` and `ReaderChecks` components. Only known broker identities are inputs; unverified dossier fields are not promoted into facts.
- `src/app/forex-brokers/country-guides.css`: responsive table with a sticky identity column, check cards and disclosure styling; old broker-panel styles removed.
- `src/lib/country-guides/sri-lanka-dossier.ts`: three concise, country-specific FAQs using the existing evidence/provenance mechanism.
- `tests/country-guide-design.spec.ts`: table keyboard scrolling, FAQ count, source expansion and citation-fragment behavior, screenshots, original-header and cross-article typography checks.
- `tests/country-broker-guides.spec.ts` and `tests/sri-lanka-dossier.spec.ts`: align FAQ interaction checks with the edited content; existing legal, source and commercial guard checks are retained.

### Scope, SEO and unresolved research

The currently configured page is `/forex-brokers/sri-lanka`; the components remain reusable. The country library, review pages, article routes and global header/footer are unchanged. One H1, canonical metadata, WebPage/BreadcrumbList data and server-rendered content remain intact. The direct answer is easier to find and question headings are focused on reader intent; no unsupported rating or FAQ rich-result claims were added.

The Sri Lanka page remains a research draft: no independent current-law approval, confirmed serving entities, local authorization, resident eligibility or country-specific fees/platform entitlements have been established. Therefore it remains `noindex, follow`, absent from the sitemap and without commercial CTAs. The original dossier/archive and source verification states are unchanged.

The full regression run passed 49 tests. Following the final caption-size refinement, the focused design suite was rerun. Checks cover 320/390/768/1440-pixel layouts, native disclosure keyboard operation, citation fragments opening the source records, horizontal table navigation, original header appearance and article typography. Desktop/mobile screenshots of the opening page and new table, plus desktop check cards, were inspected. TypeScript, lint, the production build and whitespace checks pass.
