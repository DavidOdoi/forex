# Country guide featured images

The shared country template supports a separately sourced image for each country through `src/lib/country-guides/media.ts`. A missing country image returns no image; the Sri Lanka photograph is never copied automatically to other countries.

## Sri Lanka — added 13 November 2026

- **Image:** *Colombo Skyline Jan 2022.jpg*, showing the city from the Port City project gallery.
- **Photographer:** XKillSwitchXxx.
- **Source:** <https://commons.wikimedia.org/wiki/File:Colombo_Skyline_Jan_2022.jpg>.
- **Licence:** [Creative Commons Attribution–ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/). This licence applies to the photograph and its delivered derivative, not the page text or site code.
- **Delivered asset:** `public/images/countries/sri-lanka-colombo-skyline.webp`, 1600 × 900, 249,770 bytes.
- **Changes:** proportional resize and WebP encoding; no retouching or generated imagery. CSS crops the photograph for a desktop banner and adjusts the framing on mobile. Visible credit states that it was resized/cropped, links to its source and licence, and identifies the historical month/year.
- **Evidence record:** `docs/research/country-featured-image-sri-lanka-2026-11-13.json`, containing the retrieved Commons metadata, source/download URLs, file dimensions and SHA-256.

The image is geographic context, not an illustration of a broker's office, a current trading screen or proof of resident eligibility. It appears after the introduction, Quick answer and existing actions; the immediate answer remains ahead of the photograph. Next Image supplies responsive variants from the local asset, with explicit dimensions and CSS height reserving the layout. No external image host is contacted by readers.

Open Graph, Twitter large-image cards and the existing WebPage/Article image field use the same country-specific asset. Legal/evidence, affiliate and indexing status are unchanged.

Validation: production build, ESLint, TypeScript and all 23 country-guide/dossier/design checks passed. The rendered main content is **1,661 words**, including image credit and collapsed source/FAQ text, with exactly **three FAQs**. The responsive image loaded successfully in Chromium; screenshots at 320, 390, 768 and 1440 pixels showed no horizontal page overflow. Open Graph and Twitter metadata use the selected image. The final desktop/mobile banner crops were visually reviewed.

## Country batches

Malaysia’s initial draft photo was removed before publication at the owner’s request. The three new pages (Malaysia, UK and Netherlands) should have no featured image until the owner adds one manually. The old Malaysia image metadata is retained only as a historical attribution record; its public asset and country-image mapping were removed. Sri Lanka’s published image is unchanged.

Use **three countries per research/implementation batch**. Reuse the layout while independently verifying each country's resident eligibility, contracting companies, regulation, funding rules and supporting sources. Each country also needs its own relevant image/credit. Keep the three-FAQ and 1,700-word requirements unless the owner changes them. This batch size is a practical review choice, not a Google ranking rule.
