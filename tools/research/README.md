# Broker research collector

A Python/BeautifulSoup pipeline for **staging evidence**, using the user-supplied November 2, 2026 broker directory. It does not publish reviews or treat scraped claims as verified findings.

## Set up

Requires Python 3.12+ and Node.js 24 (Node runs the existing TypeScript review-template factory).

```sh
cd /workspace/forex
python -m venv .venv-research
.venv-research/bin/python -m pip install -r tools/research/requirements.txt
```

No service credentials are required. Requests uses the existing HTTPS proxy and CA configuration. TLS verification stays enabled. Install packages through the environment's supported network route.

## Audit and prepare

```sh
.venv-research/bin/python tools/research/research.py audit \
  --csv /path/to/forex-broker-directory-2026-11-02.csv

.venv-research/bin/python tools/research/research.py prepare \
  --csv /path/to/forex-broker-directory-2026-11-02.csv
```

The importer understands the actual uploaded columns, including `Broker`, `Website`, `Provider type`, `Evidence level`, `English-speaking jurisdiction evidence`, primary source URLs, directory references, and allowed/restricted-market assertions. It rejects malformed rows, missing required columns, and identity collisions rather than silently losing data.

Output defaults to ignored `research-output/`:

- `audit.md` / `audit.json`: inventory, provider queues, country limitations, and input checksum.
- `directory-manifest.json`: all input entries retained as **unverified seeds**.
- `brokers/<slug>/draft.json`: blank retail review record from the actual TypeScript factory, with the broker name and slug. Website, jurisdiction, factual values, sources, scores and affiliate URLs remain unset.
- `brokers/<slug>/directory-seed.json`: candidate website, jurisdiction hints, source URLs, and flags. This is separate from the publishable data model.

`prepare` creates one brand-level starting draft for each retail FX/CFD provider. Institutional, interbank and introducing providers stay in separate manual queues; a retail trading template is not silently applied to them. Existing draft files are preserved on reruns so editor work is not overwritten. Directory seed files and aggregate reports refresh from the latest input.

## Country scope

The requested scope is the countries associated with each broker's legal entities. The CSV's **English-speaking jurisdiction evidence** column supplies research candidates only. It is not a complete list of headquarters, legal entities, or eligible client markets. A broker can be located in one country and accept clients under different entities elsewhere.

- Preserve headquarters, legal-entity jurisdictions, and client eligibility as separate facts.
- A listed country is not automatically assigned to a published review.
- English-language service, an absent restriction, a directory badge, or a website suffix does not prove local authorisation or resident acceptance.
- Unknown countries remain unresolved until official entity documents and regulator entries can be checked.
- Create country-specific records from confirmed entity/account evidence later. Do not force one brand's terms across every listed country.

## Collect a first pilot

```sh
.venv-research/bin/python tools/research/research.py collect \
  --csv /path/to/forex-broker-directory-2026-11-02.csv \
  --brokers Exness XM 'IC Markets' Pepperstone FXPesa \
  --limit 5 --max-pages 5
```

This pilot selection is for testing research coverage, not a recommendation. The source CSV associates these brands with Kenya and, for IC Markets, Seychelles; those assertions still need independent checks.

The collector:

1. Reads broker and primary-evidence URLs from the directory, without inventing official websites.
2. Checks robots.txt before collection and before following page redirects. Unreadable robots responses, disallowed paths, access denials, and challenges are flagged rather than bypassed.
3. Uses a descriptive user agent, a per-host delay of at least one second, a 20-second request timeout, limited redirects, a 5 MiB response cap, and an explicit source-host scope. It does not retry policy blocks unchanged or rotate identities/proxies.
4. Fetches HTML, text and PDFs. BeautifulSoup extracts readable blocks and same-host research links; pypdf extracts text from PDFs. JavaScript shells, scanned/textless PDFs and access challenges are flagged for a different supported acquisition method or manual research.
5. Retains timestamped fetch metadata and SHA-256 content snapshots. Successful snapshots can be reused for up to 24 hours; integrity is checked before reuse. Cache hits keep the original retrieval time.
6. Produces short, source-linked **candidate excerpts**, not verified account figures or legal conclusions. Every candidate has an empty legal entity, jurisdiction and verified value until reviewed.

The per-broker document-attempt budget includes selected source URLs and discovered documents. Robots checks and up to six redirect hops are additional bounded requests. HTTPS public URL syntax is checked; the configured network proxy/policy remains responsible for permitted destinations. A new redirect hostname is recorded for identity/network review before collection continues. No authentication walls or anti-bot challenges are circumvented.

Additional output:

- `collection-summary.json`: requested brokers, fetch/analysis statuses, usable source count, unverified candidate count, and **zero verified/published counts**.
- `required-domains.json`: exact initial source hosts for the selected batch. Add confirmed redirect hosts as they are discovered.
- `brokers/<slug>/evidence-candidates.json`: source attempts, candidate excerpts, unresolved country scope, and publication blockers.
- `snapshots/`, `http-cache/`, and per-broker `extracted/`: staged raw and extracted source material.

Exit status is `0` for successful audit/preparation, or collection with at least one usable document; **read the summary for partial failures**. Status `2` means no usable source documents could be collected. Status `1` means input/setup failed. None of these outcomes approves publication or establishes review accuracy.

## Current run and network access

The uploaded directory has **325 entries**: 298 retail FX/CFD research candidates, 14 institutional/professional providers, 12 interbank providers, and one introducing/relationship broker. The importer prepared 298 blank drafts. Across the complete directory, 224 entries have no established jurisdiction, 12 lack a verified website, and 147 have no usable primary-source URL recorded.

The November 3 collection attempted all **298 retail brokers** with a three-page budget and four workers. It retrieved 661 successful page responses and produced usable source documents for **232 brokers**. Some responses are JavaScript shells, duplicates or generic regulatory guidance; successful retrieval is not a verified review. Access denials, unreadable robots policies, unapproved redirect hosts and rate limits remain recorded. No additional scraping is needed to render the saved catalogue.

```sh
.venv-research/bin/python tools/research/research.py collect \
  --csv /path/to/forex-broker-directory-2026-11-02.csv \
  --limit 298 --max-pages 3 --workers 4

.venv-research/bin/python tools/research/export_catalog.py
```

Workers use independent sessions and a shared per-host throttle; robot crawl delays still apply. JSON/cache writes are atomic. Bare and `www` canonical aliases are supported without bypassing the environment proxy or a site's access controls. PDF extraction includes fontTools support.

`export_catalog.py` reads saved dossiers without making network requests. It exports the 298 retail identities, retrieval metadata, content hashes, source-status flags, unverified country leads and at most three short source quotations (75 words total per broker). Generic regulator guidance is not quoted as a broker's own terms. It never approves a field, assigns a score, enables an affiliate link or marks a review published. The bounded export is tracked at `src/data/review-research.json`; raw snapshots and full page text remain ignored.

Country-specific findings that were separately read and checked are maintained in `src/lib/reviews/curated.ts` and `international.ts`. Provider-reported permissions are attributed as provider claims. Kenyan licence entries were cross-checked with the CMA register. These profiles remain editorial drafts, not independently approved reviews or trading tests. Countries mentioned in the input directory are still leads unless a specific entity profile has been researched.

## Validate

```sh
.venv-research/bin/python -m unittest discover -s tools/research -p 'test_*.py' -v
```

The collector stops at evidence staging; the catalogue export and explicitly curated country profiles render in noindex research pages. An independent editorial review must resolve account conditions, eligibility, protection claims and conflicts before publication. There is no measured 90% accuracy result, rating methodology or active affiliate destination. Software checks verify data consistency and UI behaviour, not the truth of financial claims.
