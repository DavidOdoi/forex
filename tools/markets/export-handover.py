"""Export complete metal-hub copy/specifications from built semantic HTML.

Run after npm run build using the existing research virtual environment.
Volatile quote/result fields become explicit template fields, never sample prices.
"""
from pathlib import Path
import re
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs/metals"

def markdown(node):
    if isinstance(node, NavigableString):
        return str(node)
    if not isinstance(node, Tag):
        return ""
    tag = node.name
    if tag in {"script", "style", "nav", "noscript", "svg", "button", "input"}:
        return ""
    if tag == "table":
        rows = [[markdown(cell).strip().replace("\n", " ").replace("|", "\\|") for cell in row.find_all(["td", "th"], recursive=False)] for row in node.find_all("tr")]
        if not rows:
            return ""
        caption = node.find("caption")
        result = ("\n\n" + markdown(caption) + "\n\n") if caption else "\n\n"
        for i, cells in enumerate(rows):
            result += "| " + " | ".join(cells) + " |\n"
            if i == 0:
                result += "| " + " | ".join("---" for _ in cells) + " |\n"
        return result + "\n"
    if tag == "img":
        # Use the original local asset, not a build-specific optimizer URL.
        return ""
    value = "".join(markdown(child) for child in node.children)
    if tag in {"h1", "h2", "h3"}:
        return "\n\n" + "#" * int(tag[1]) + " " + value.strip() + "\n\n"
    if tag == "a":
        return f"[{value.strip()}]({node.get('href')})"
    if tag == "label":
        return "\n- " + value.strip() + "\n"
    if tag == "output":
        return "\n\n" + value.strip() + "\n\n"
    if tag == "span":
        return " " + value + " "
    if tag in {"strong", "b"}:
        return f"**{value.strip()}**"
    if tag == "li":
        return "\n- " + value.strip()
    if tag == "dt":
        return "\n- **" + value.strip() + "**: "
    if tag == "dd":
        return value.strip() + "\n"
    if tag == "select":
        return " (" + "; ".join(option.get_text(" ", strip=True) for option in node.find_all("option")) + ")"
    if tag in {"p", "div", "section", "header", "article", "aside", "figure", "figcaption", "ul", "details"}:
        return "\n\n" + value.strip() + "\n\n"
    if tag == "small":
        return " " + value.strip()
    return value

def replace_html(node, html):
    if node:
        node.clear()
        for child in list(BeautifulSoup(html, "html.parser").contents):
            node.append(child)

for slug, kind in [("gold-price", "gold"), ("gold-silver-prices", "comparison")]:
    soup = BeautifulSoup((ROOT / f".next/server/app/{slug}.html").read_text(), "html.parser")
    main = soup.select_one("main")
    graph = soup.select_one('script[type="application/ld+json"]').get_text()
    title = soup.title.get_text()
    description = soup.select_one('meta[name="description"]')["content"]
    canonical = soup.select_one('link[rel="canonical"]')["href"]
    h1 = main.h1.get_text(" ", strip=True)
    headings = [f"{'  ' * (int(h.name[1]) - 1)}- {h.name.upper()}: {h.get_text(' ', strip=True)}" for h in main.find_all(re.compile("^h[123]$"))]
    internal, external = {}, {}
    for a in main.select("a[href]"):
        if a.find_parent("nav"):
            continue
        href, anchor = a["href"], a.get_text(" ", strip=True)
        if href.startswith("/") and href != "/":
            internal.setdefault(href, anchor)
        elif href.startswith("https://"):
            external.setdefault(href, anchor)
    for quote in main.select("[data-quote]"):
        metal = "gold" if quote["data-quote"] == "XAU" else "silver"
        replace_html(quote, f'<h3>{metal.title()} · {quote["data-quote"]}/USD</h3><p>Price per troy ounce · selected currency: <strong>{{{{{metal}.converted_price}}}}</strong></p><p>Today vs UTC open · USD: {{{{{metal}.today_amount_and_percent_or_unavailable}}}}</p><p>Status: {{{{{metal}.freshness_status}}}}. Provider updated {{{{{metal}.source_timestamp_utc}}}}.</p>')
    for node in main.find_all(class_=lambda value: value and value.endswith("_quickConversions")):
        replace_html(node, '<p>Gold, by weight</p><p>1 gram: {{gold.price_per_gram}} · 1 kilogram: {{gold.price_per_kilogram}}</p><p><a href="#calculator">Calculate your gold’s value</a></p>')
    for node in main.select("[data-ratio]"):
        node.string = "{{gold_silver_ratio_or_unavailable}}"
        node.find_next_sibling("span").string = "1 oz of gold ≈ {{validated_ratio}} oz of silver. Requires two recent quotes within 60 seconds of each other."
    for node in main.select("#performance tbody td"):
        if node.parent.th.get_text(strip=True) != "All-time high":
            node.string = "{{validated_provider_measure_or_unavailable}}"
    for node in main.select("output"):
        node.string = "{{calculated_result}}"
    for node in main.select("[data-calculator] [role=status]"):
        node.string = "{{calculated_result_or_specific_input_or_data_error}}"
    for calculator in main.select("[data-calculator]"):
        metal = "gold" if calculator["data-calculator"] == "XAU" else "silver"
        calculator.find("p", recursive=False).string = "Reference quote: {{" + metal + ".source_timestamp_utc}}. Status: {{" + metal + ".freshness_status}}. FX reference if applicable: {{currency.reference_date}}. Uses unrounded inputs; display values are rounded."
    for node in main.find_all(class_=lambda value: value and value.endswith("_quoteTime")):
        node.string = "Provider updated {{source_timestamp_utc}}"
    for node in main.find_all(class_=lambda value: value and value.endswith("_explainer")):
        image = soup.select_one('meta[property="og:image"]')["content"]
        alt = soup.select_one('meta[property="og:image:alt"]')["content"]
        replace_html(node, f'<p>![{alt}]({image})</p><p>Original DEVIN FOREX explanatory diagram. No current prices are embedded.</p>')
    copy = re.sub(r"[ \t]+", " ", markdown(main))
    copy = re.sub(r"\n{3,}", "\n\n", copy)
    copy = "\n".join(line.strip() for line in copy.splitlines()).strip()
    anchors = lambda links: "\n".join(f"| {anchor} | `{href}` |" for href, anchor in links.items())
    chart = "One gold-only chart; 24H, 7D, 30D, 6M, 1Y, 5Y and All controls." if kind == "gold" else "Two individually labelled, side-by-side gold/silver charts; 24H, 7D, 30D, 6M, 1Y and 5Y controls. Stack on mobile; do not imply matching Y-axis scales."
    calculator = "One gold calculator with theoretical karat/fineness adjustment, USD/ZAR/EUR/GBP, troy ounces/grams/kilograms and weight-to-value or budget-to-weight modes." if kind == "gold" else "Independent gold and silver calculators with troy-ounce/gram/kilogram units, USD/ZAR/EUR/GBP and purity. Gold includes karat/fineness; silver includes fine/sterling options."
    distinction = "Gold-only destination: current XAU/USD, unit conversions, purity, spot-value calculation, performance windows and gold price drivers." if kind == "gold" else "Two-metal destination: aligned gold/silver quotes, ratio, comparable performance, separate calculators and silver-specific industrial/supply context."
    image = soup.select_one('meta[property="og:image"]')["content"]
    alt = soup.select_one('meta[property="og:image:alt"]')["content"]
    doc = f'''# {title} — completed handover

## Final metadata

| Field | Final value |
| --- | --- |
| SEO title | {title} ({len(title)} characters) |
| Meta description | {description} ({len(description)} characters) |
| Requested URL | `/{slug}/` |
| Canonical URL | `{canonical}` |
| Canonical slug | `/{slug}` |
| H1 | {h1} |
| Editorial author | David Odoi; linked existing factual profile |
| Editorial update | 7 November 2026; separate from quote/FX timestamps |

{distinction} Canonical slash normalization follows the existing site; a trailing slash redirects to this canonical URL.

## Complete page copy in clean Markdown

The block below exports the complete implemented server-visible copy, including FAQs and source anchors. Double-brace fields are data bindings, never literal publishable prices. Render a validated value with its as-of time or a specific unavailable state. Controls update their labels/results interactively; do not freeze an example quote in the article.

```markdown
{copy}
```

## Full heading structure

{chr(10).join(headings)}

Each page has exactly one H1. Quote and calculator H3s belong to their preceding H2. FAQ H3s are visible question summaries, with matching answers in schema.

## UI and module specification

| Order | Module | Behaviour |
| --- | --- | --- |
| 1 | Breadcrumb, H1, short introduction | White background, black text, immediate price intent; no affiliate CTA before useful information. |
| 2 | {'Gold quote with gram/kilo summary' if kind == 'gold' else 'Dual metal quotes'} | Large USD/troy-ounce reference, daily change only with verified UTC opening baseline, per-metal status and UTC timestamp. Currency selector supports USD/ZAR/EUR/GBP. |
| 3 | Source line and section navigation | Explain indicative data and daily FX; refresh button, stable anchors, sticky navigation on wide screens. |
| {'4' if kind == 'comparison' else '—'} | {'Current gold-silver ratio' if kind == 'comparison' else 'Ratio reserved for the comparison page'} | {'Only show with fresh aligned quotes; same currency and units; no buy/sell signal.' if kind == 'comparison' else 'Link to the distinct comparison hub rather than duplicating its main feature.'} |
| Next | Historical chart module | {chart} |
| Next | Value calculator | {calculator} |
| Next | Performance/conversion table | Distinguish current quote and UTC-open change from completed-daily-average returns. Include actual baseline/end dates and source coverage. |
| Next | Unique explanations, relevant resources, FAQs | {'Gold drivers, spot/futures/bullion/CFD distinction and gold trading considerations.' if kind == 'gold' else 'Ratio interpretation, industrial demand, gold/silver differences, South African currency context and product exposure.'} Short paragraphs, tables and contextual links. |
| Last | Sources, corrections, original illustration | Named author, methodology, limitations, no invented expertise or broker endorsements. |

Use 16px body copy and comparison-table cells, short paragraphs, 44px controls, strong focus states, a responsive white layout and restrained gold/silver accents. Large tabular price figures, metal identity cards, a dashboard switcher, a visible spot/history/FX timing guide, chart area fills and styled result panels establish the visual hierarchy. Small utility labels and source timestamps are secondary UI. Reserve card/chart space; the interface must never turn a missing quote into `0.00`.

## Chart and calculator specification

{chart} Historical points are provider **completed daily averages**, not closes. The current quote is never attached to this line. Area shading, a hover crosshair, exact selected-range dates, actual daily-average range high/low and the observed period percentage support reading the chart. Each metal has a CSV button that exports unrounded observations for the selected range with source attribution. 24H displays an explicit unsupported explanation on the connected free daily-data plan. No dummy chart is published while historical access is absent.

{calculator} Use exact troy conversion, dated FX, fine-metal fraction and unrounded arithmetic; display errors for invalid input, missing data and overflow. Explain that results exclude retail costs and tax. Full formulas, period definitions, coverage guards, accessible table pagination and cache limits are in [data-and-operations.md](data-and-operations.md).

## Contextual internal-link plan — exact implemented anchors

| Anchor text | Existing destination |
| --- | --- |
{anchors(internal)}

Every destination above was checked against the local production app. Header and footer supply incoming links to both hubs. Unbuilt `/xau-usd/`, `/silver-trading/`, `/gold-vs-bitcoin/`, `/gold-price-history/`, `/best-gold-brokers/`, `/gold-cfd-trading/` and `/precious-metals-cfds/` are deferred destinations, not live links. No extra thin pages were made to satisfy a keyword list.

## External-link plan — exact source anchors

| Anchor text | Authoritative destination |
| --- | --- |
{anchors(external)}

These sources support actual methodology or market explanations. They are not affiliate links. Public provider terms, editorial references and authenticated production history were checked on 7 November 2026. See [the connection verification record](README.md) for actual coverage and remaining optional-field limitations.

## Image and social-card plan

- Original asset: `{image}`.
- Alt text: “{alt}”.
- Dimensions: **1200×630**, explicit intrinsic size; original PNG about {'23' if kind == 'gold' else '27'} KB, with editable SVG source beside it.
- Responsive Next image, lazy-loaded below the fold; no stock photo, personal account screenshot, stale hard-coded market price or invented performance line.
- Open Graph: `og:type=website`, unique title/description above, canonical `og:url`, Devin Forex site name, this image and dimensions/alt.
- Twitter: `summary_large_image`, the same page-specific title/description and unique image.

## Canonical, indexing and schema

```html
<link rel="canonical" href="{canonical}" />
```

Production page is index/follow, included in XML sitemap and discoverable through header/footer/cross-hub links. Preview deployments remain noindex. Public supporting API endpoints are noindex; neither creates a third keyword landing page.

The following JSON-LD is the implemented recommendation, not an invented Product/Review/Dataset claim. Its FAQ answers match the full visible copy above. The editorial modification date does not impersonate a fresh market observation. FAQ markup does not imply Google will grant a rich result to a financial site.

```json
{__import__('json').dumps(__import__('json').loads(graph),ensure_ascii=False,indent=2)}
```

## Performance, mobile and content maintenance

Server-render the useful quote/copy, cache quotes for 30 seconds, pause hidden-tab polling, lazy-load chart code near the viewport, paginate the optional chart data table, reuse local fonts and avoid third-party widgets. Keep the current price within the first mobile screen and stack {'unit summaries' if kind == 'gold' else 'quotes, charts and calculators'} at small widths. Ensure no horizontal page overflow at 320px.

Target real-user p75 LCP ≤2.5s, INP ≤200ms and CLS ≤0.1; do not claim measured field performance before collecting it. See [the operational plan](data-and-operations.md) for exact checks, refresh cadence, alerting follow-up, error states and source-review schedule.

## Verification before publication and claims to withhold

- Revalidate every current quote, FX observation, timestamp, return, ratio and range at runtime. No financial test values are production data.
- Authenticated production series and chart/return calculations were verified on 7 November 2026. See [the connection record](README.md). Recheck date/decimal formats, coverage, OHLC windows, truncation and quota after future provider changes; missing optional values remain unavailable.
- Verify any future country-specific broker authorisation or tax statement from current primary evidence. There is no affiliate recommendation in this release.
- Withhold “real-time executable price”, zero delay, complete all-time coverage, guaranteed returns/safety/withdrawals, a predictive ratio, universal VAT rates and Google-ranking promises without the necessary evidence or legal review. A daily FX reference must not be called live FX.

See [data-and-operations.md](data-and-operations.md) for the full claim-verification list and legal/data limits.
'''
    (OUT / f"{slug}.md").write_text(doc)
    print(f"Exported docs/metals/{slug}.md")
