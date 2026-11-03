#!/usr/bin/env python3
"""Import a broker directory and collect research evidence, never publish it.

CSV assertions, website text and snippets remain unverified candidates. This
script does not create recommendations, scores, licences or hands-on claims.
"""
from __future__ import annotations
import argparse
import copy
import csv
import hashlib
import io
import ipaddress
import json
import re
import subprocess
import time
from collections import Counter
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib import robotparser
from urllib.parse import urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
USER_AGENT = "DevinForexResearchBot/0.1 (+https://devinforex-five.vercel.app/)"
BOT_NAME = "DevinForexResearchBot"
REQUIRED_COLUMNS = {"Broker", "Website", "Provider type", "Evidence level", "English-speaking jurisdiction evidence", "Primary / country evidence URL"}
UNKNOWN = {"not established", "not verified", "not independently retrieved", "not recorded", "not recorded (not proof of eligibility)", "not independently researched", "no positive country allowlist recorded", "not applicable: interbank service", ""}
MAX_BYTES = 5 * 1024 * 1024
PATTERNS = {
    "minimum-deposit": r"\bminimum\s+(?:initial\s+)?deposit\b|\bmin\.?\s+deposit\b",
    "forex-spread-and-commission": r"\bspreads?\b|\bcommission(?:s)?\b",
    "withdrawal-fee": r"\bwithdraw(?:al|als)?\b",
    "currency-conversion-fee": r"\bcurrency conversion\b|\bconversion fee\b",
    "inactivity-fee": r"\binactivity\b|\binactive\b",
    "overnight-financing": r"\bswaps?\b|\bovernight\b|\bfinancing\b",
    "regulator-and-register-entry": r"\bregulat(?:ed|or|ion|ory)\b|\blicen[cs](?:e|ed|ing)\b|\bauthori[sz]ed\b",
    "contracting-legal-entity": r"\blimited\b|\bltd\.?\b|\bllc\b|\b(?:legal|contracting) entity\b",
    "negative-balance-protection": r"\bnegative balance\b",
    "compensation-scheme-and-limits": r"\bcompensation (?:scheme|fund)\b|\bFSCS\b|\bSIPC\b",
    "leverage-by-product-and-region": r"\bleverage\b",
    "platform-and-availability": r"\bMetaTrader\b|\bcTrader\b|\bTradingView\b|\btrading platform\b",
    "country-availability": r"\bresidents?\b|\brestricted\b|\bjurisdictions?\b|\bcountries\b",
    "deposit-methods-and-charges": r"\bM-Pesa\b|\bbank transfer\b|\bdeposit methods?\b|\bcredit card\b",
    "identity-and-address-requirements": r"\bproof of (?:identity|address)\b|\bverification documents\b|\bKYC\b",
}


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.casefold()).strip("-") or "unknown"


def safe_url(value: str) -> str | None:
    """Accept public HTTPS URLs only; never guess a missing website."""
    try:
        p = urlparse(value.strip())
        host = (p.hostname or "").rstrip(".").lower()
        if p.scheme != "https" or not host or p.username or p.password or p.port not in (None, 443):
            return None
        if not re.fullmatch(r"[a-z0-9.-]+", host) or "." not in host or ".." in host:
            return None
        if host.endswith((".localhost", ".local", ".internal", ".test", ".invalid")):
            return None
        try:
            address = ipaddress.ip_address(host)
            if not address.is_global:
                return None
        except ValueError:
            pass
        return urlunparse(("https", host, p.path or "/", "", p.query, ""))
    except (ValueError, AttributeError):
        return None


def urls(value: str) -> list[str]:
    found = []
    for candidate in re.split(r"\s*\|\s*", value):
        normalized = safe_url(candidate)
        if normalized and normalized not in found:
            found.append(normalized)
    return found


def countries(value: str) -> list[str]:
    return list(dict.fromkeys(part.strip() for part in value.split(";") if part.strip().casefold() not in UNKNOWN))


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def read_directory(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        missing = REQUIRED_COLUMNS - set(reader.fieldnames or [])
        if missing:
            raise ValueError("Missing required CSV columns: " + ", ".join(sorted(missing)))
        rows = []
        for line, row in enumerate(reader, 2):
            if None in row or any(value is None for value in row.values()):
                raise ValueError(f"Malformed CSV row {line}; repair it rather than silently dropping fields")
            if not row["Broker"].strip():
                raise ValueError(f"Missing broker name on row {line}")
            rows.append({key: value.strip() for key, value in row.items()})
    keys = [slug(row["Broker"]) for row in rows]
    if len(set(keys)) != len(keys):
        raise ValueError("Duplicate or colliding broker identities; resolve before importing")
    return rows


def provider_queue(row: dict[str, str]) -> str:
    kind = row["Provider type"].casefold()
    if "interbank" in kind:
        return "interbank-separate-template"
    if "institutional" in kind or "professional fx" in kind:
        return "institutional-separate-template"
    if "introducing" in kind or "relationship" in kind:
        return "introducing-broker-manual-review"
    return "retail-research" if kind == "forex / forex cfds" else "provider-type-manual-review"


def seed_record(row: dict[str, str]) -> dict[str, Any]:
    website = safe_url(row["Website"])
    hints = countries(row["English-speaking jurisdiction evidence"])
    flags = ["csv-assertions-not-independently-verified", "jurisdiction-column-is-not-a-headquarters-or-client-eligibility-list"]
    if not website:
        flags.append("official-website-needs-identification")
    if not hints:
        flags.append("country-location-not-established")
    if row["Evidence level"].casefold() == "english service only":
        flags.append("english-language-is-not-jurisdiction-evidence")
    if row.get("Explicit directory-allowed English markets", "").casefold() in UNKNOWN:
        flags.append("no-positive-client-eligibility-evidence")
    primary = urls(row["Primary / country evidence URL"])
    if not primary:
        flags.append("no-primary-source-url-in-directory")
    if row.get("Website check", "").casefold() != "official page fetched":
        flags.append("website-not-fully-retrieved-in-directory")
    return {"id": slug(row["Broker"]), "name": row["Broker"], "provider_queue": provider_queue(row), "website_candidate": website, "jurisdiction_candidates": hints, "jurisdiction_status": "unverified-seed", "headquarters": None, "contracting_entities": [], "client_eligibility": [], "primary_source_candidates": primary, "directory_references": urls(row.get("Directory reference URL", "")), "directory_allowed_markets": countries(row.get("Explicit directory-allowed English markets", "")), "directory_restricted_markets": countries(row.get("Directory-restricted English markets", "")), "seed_evidence_label": row["Evidence level"], "seed_research_date": row.get("Research date"), "seed_notes": row.get("Notes", ""), "flags": flags}


def audit(rows: list[dict[str, str]], out: Path, csv_path: Path) -> list[dict[str, Any]]:
    records = [seed_record(row) for row in rows]
    report = {"generated_at": now(), "input_sha256": hashlib.sha256(csv_path.read_bytes()).hexdigest(), "total_entries": len(rows), "provider_queues": dict(Counter(r["provider_queue"] for r in records)), "csv_evidence_labels": dict(Counter(r["Evidence level"] for r in rows)), "jurisdictions_not_established": sum(not r["jurisdiction_candidates"] for r in records), "websites_needing_identification": sum(not r["website_candidate"] for r in records), "primary_urls_missing": sum(not r["primary_source_candidates"] for r in records), "headquarters_verified_by_this_run": 0, "client_eligibility_verified_by_this_run": 0, "country_rule": "Listed jurisdictions are research candidates only; they do not establish headquarters, licensing or permission to accept residents."}
    write_json(out / "audit.json", report)
    write_json(out / "directory-manifest.json", records)
    lines = ["# Broker directory audit", "", f"Generated: {report['generated_at']}", "", "## Input inventory", "", f"- Total entries: {len(rows)}", f"- Jurisdiction not established: {report['jurisdictions_not_established']}", f"- Official website requiring identification: {report['websites_needing_identification']}", f"- Entries without a usable primary source URL: {report['primary_urls_missing']}", "", "## Provider queues", ""]
    lines += [f"- {key}: {count}" for key, count in report["provider_queues"].items()]
    lines += ["", "## Country scope", "", report["country_rule"], "", "The CSV’s country column is limited to English-speaking jurisdiction evidence. It is not a complete headquarters register. A missing country is not filled by guessing from language, a website suffix, or a directory listing.", "", "All directory labels, allowed/restricted-market lists, notes, and research dates remain unverified seed assertions. No review is approved or published by this audit.", "", "## Broker research status", "", "| Broker | Queue | Candidate jurisdictions | Website identified in CSV |", "| --- | --- | --- | --- |"]
    for r in records:
        lines.append(f"| {r['name'].replace('|', '/')} | {r['provider_queue']} | {'; '.join(r['jurisdiction_candidates']) or 'Not established'} | {'Candidate URL only' if r['website_candidate'] else 'Needs identification'} |")
    (out / "audit.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return records


def template_record() -> dict[str, Any]:
    result = subprocess.run(["node", "--experimental-strip-types", str(ROOT / "tools/research/export-template.mjs")], cwd=ROOT, capture_output=True, text=True, check=True)
    record = json.loads(result.stdout)
    if record.get("status") != "template" or len(record.get("chapters", [])) != 7:
        raise ValueError("Unexpected review template; update the importer before writing drafts")
    return record


def prepare(records: list[dict[str, Any]], out: Path, base: dict[str, Any]) -> dict[str, int]:
    counts = Counter()
    for record in records:
        if record["provider_queue"] != "retail-research":
            counts["separate_provider_queue"] += 1
            continue
        folder = out / "brokers" / record["id"]
        draft = copy.deepcopy(base)
        draft.update(status="draft", jurisdiction=None)
        draft["broker"] = {"name": record["name"], "slug": record["id"], "website": None}
        draft_path = folder / "draft.json"
        # Preserve edited research and reviews on subsequent runs.
        if not draft_path.exists():
            write_json(draft_path, draft)
            counts["drafts_created"] += 1
        else:
            counts["existing_drafts_preserved"] += 1
        write_json(folder / "directory-seed.json", record)
    write_json(out / "prepare-summary.json", dict(counts))
    return dict(counts)


@dataclass
class FetchResult:
    requested_url: str
    final_url: str | None
    status: str
    fetched_at: str
    http_status: int | None = None
    content_type: str | None = None
    content_sha256: str | None = None
    snapshot_path: str | None = None
    cache_hit: bool = False
    note: str | None = None


class Fetcher:
    def __init__(self, out: Path, allowed_hosts: set[str], delay: float = 1.0, timeout: float = 20.0, cache_hours: float = 24.0, session: requests.Session | None = None):
        self.out = out
        self.allowed_hosts = allowed_hosts
        self.delay = max(1.0, delay)
        self.timeout = timeout
        self.cache_hours = cache_hours
        self.session = session or requests.Session()
        # Keep inherited HTTPS proxy, injected credentials and CA configuration.
        self.session.headers.update({"User-Agent": USER_AGENT, "Accept": "text/html,application/pdf,text/plain;q=0.9"})
        self.last_request: dict[str, float] = {}
        self.robots: dict[str, tuple[robotparser.RobotFileParser | None, str, float]] = {}
        self.current_run: dict[str, FetchResult] = {}

    def raw(self, url: str, enforce_redirect_robots: bool = False) -> tuple[FetchResult, bytes]:
        first = url
        for _ in range(6):
            normalized = safe_url(url)
            if not normalized:
                return FetchResult("[rejected-url]", None, "unsafe-url", now()), b""
            host = urlparse(normalized).hostname
            if host not in self.allowed_hosts:
                return FetchResult(first, normalized, "unlisted-redirect-host", now(), note="Add this destination only after confirming its identity and network permission"), b""
            pause = self.delay - (time.monotonic() - self.last_request.get(host, 0))
            if pause > 0:
                time.sleep(pause)
            self.last_request[host] = time.monotonic()
            try:
                with self.session.get(normalized, timeout=self.timeout, allow_redirects=False, stream=True) as response:
                    code = response.status_code
                    if code in (301, 302, 303, 307, 308):
                        location = response.headers.get("Location")
                        if not location:
                            return FetchResult(first, normalized, "invalid-redirect", now(), code), b""
                        url = urljoin(normalized, location)
                        if enforce_redirect_robots:
                            next_url = safe_url(url)
                            if next_url and urlparse(next_url).hostname in self.allowed_hosts:
                                allowed, reason = self.robots_policy(next_url)
                                if not allowed:
                                    return FetchResult(first, next_url, reason, now(), note="Redirect target was not fetched"), b""
                        continue
                    content_type = response.headers.get("Content-Type", "").split(";", 1)[0].lower()
                    result = FetchResult(first, normalized, "ok", now(), code, content_type)
                    if code != 200:
                        result.status = "rate-limited" if code == 429 else "access-denied" if code in (401, 403, 451) else "http-error"
                        return result, b""
                    if response.headers.get("Content-Length", "").isdigit() and int(response.headers["Content-Length"]) > MAX_BYTES:
                        result.status = "oversized-response"
                        return result, b""
                    chunks, size = [], 0
                    for chunk in response.iter_content(65536):
                        size += len(chunk)
                        if size > MAX_BYTES:
                            result.status = "oversized-response"
                            return result, b""
                        chunks.append(chunk)
                    return result, b"".join(chunks)
            except requests.exceptions.ProxyError:
                return FetchResult(first, normalized, "proxy-or-policy-blocked", now(), note="The configured proxy could not open the destination; inspect environment network access"), b""
            except requests.exceptions.SSLError:
                return FetchResult(first, normalized, "tls-verification-failed", now()), b""
            except requests.exceptions.Timeout:
                return FetchResult(first, normalized, "timeout", now()), b""
            except requests.exceptions.RequestException:
                return FetchResult(first, normalized, "network-error", now()), b""
        return FetchResult(first, normalized, "redirect-limit", now()), b""

    def robots_policy(self, url: str) -> tuple[bool, str]:
        p = urlparse(url)
        origin = f"https://{p.netloc}"
        if origin not in self.robots:
            result, body = self.raw(origin + "/robots.txt")
            if result.status == "ok":
                if result.content_type not in ("text/plain", "text/html", ""):
                    self.robots[origin] = None, "robots-unreadable", self.delay
                else:
                    text = body.decode("utf-8", errors="replace")
                    if re.search(r"<html|<!doctype|<script", text, re.I) or any(line.strip() and not line.lstrip().startswith("#") for line in text.splitlines()) and not re.search(r"^\s*User-agent\s*:", text, re.I | re.M):
                        self.robots[origin] = None, "robots-unreadable", self.delay
                        return False, "robots-unreadable"
                    parser = robotparser.RobotFileParser(origin + "/robots.txt")
                    parser.parse(text.splitlines())
                    crawl_delay = parser.crawl_delay(BOT_NAME) or parser.crawl_delay("*") or 0
                    self.robots[origin] = parser, "ok", max(self.delay, float(crawl_delay))
            elif result.http_status in (404, 410):
                self.robots[origin] = None, "robots-not-found", self.delay
            else:
                self.robots[origin] = None, result.status, self.delay
        parser, status, delay = self.robots[origin]
        if status not in ("ok", "robots-not-found"):
            return False, status
        if delay > 30:
            return False, "crawl-delay-exceeds-budget"
        self.delay = max(self.delay, delay)
        if parser and not parser.can_fetch(BOT_NAME, url):
            return False, "robots-disallowed"
        return True, status

    def fetch(self, url: str) -> tuple[FetchResult, bytes]:
        normalized = safe_url(url)
        if not normalized:
            return FetchResult("[rejected-url]", None, "unsafe-url", now()), b""
        if normalized in self.current_run:
            result = self.current_run[normalized]
            return result, self.snapshot_bytes(result)
        cache_key = hashlib.sha256(normalized.encode()).hexdigest()
        cache_file = self.out / "http-cache" / f"{cache_key}.json"
        cached = None
        if cache_file.exists():
            try:
                cached = FetchResult(**json.loads(cache_file.read_text()))
                age = (datetime.now(timezone.utc) - datetime.fromisoformat(cached.fetched_at)).total_seconds() / 3600
                data = self.snapshot_bytes(cached)
                if age < 0 or age > self.cache_hours or not data:
                    cached = None
            except (ValueError, TypeError, OSError):
                cached = None
        if cached:
            cached.cache_hit = True
            self.current_run[normalized] = cached
            return cached, self.snapshot_bytes(cached)
        allowed, reason = self.robots_policy(normalized)
        if not allowed:
            result = FetchResult(normalized, None, reason, now(), note="No page content was collected")
            self.current_run[normalized] = result
            return result, b""
        result, body = self.raw(normalized, enforce_redirect_robots=True)
        if result.status == "ok":
            if result.content_type not in ("text/html", "application/xhtml+xml", "application/pdf", "text/plain"):
                result.status = "unsupported-content-type"
                body = b""
            else:
                digest = hashlib.sha256(body).hexdigest()
                ext = ".pdf" if result.content_type == "application/pdf" else ".html" if "html" in result.content_type else ".txt"
                snapshot = self.out / "snapshots" / (digest + ext)
                snapshot.parent.mkdir(parents=True, exist_ok=True)
                if not snapshot.exists():
                    snapshot.write_bytes(body)
                result.content_sha256 = digest
                result.snapshot_path = str(snapshot.relative_to(self.out))
                write_json(cache_file, asdict(result))
        self.current_run[normalized] = result
        return result, body

    def snapshot_bytes(self, result: FetchResult) -> bytes:
        if not result.snapshot_path or not result.content_sha256:
            return b""
        path = (self.out / result.snapshot_path).resolve()
        if not path.is_relative_to(self.out.resolve()) or not path.exists():
            return b""
        body = path.read_bytes()
        return body if hashlib.sha256(body).hexdigest() == result.content_sha256 else b""


def extract_document(body: bytes, content_type: str, source_url: str, broker_name: str) -> dict[str, Any]:
    links = []
    if content_type == "application/pdf":
        try:
            reader = PdfReader(io.BytesIO(body))
            if len(reader.pages) > 100:
                return {"status": "pdf-page-limit", "text": "", "candidates": [], "links": []}
            text = "\n".join((page.extract_text() or "") for page in reader.pages)
        except Exception:
            return {"status": "pdf-extraction-failed", "text": "", "candidates": [], "links": []}
        title, scripts = "PDF source", 0
        blocks = re.split(r"\n+", text)
    elif "html" in content_type:
        soup = BeautifulSoup(body, "html.parser")
        title = soup.title.get_text(" ", strip=True) if soup.title else "Untitled source"
        if re.search(r"just a moment|access denied|verify you are human|attention required", title, re.I):
            return {"status": "access-challenge", "title": title, "text": "", "candidates": [], "links": []}
        scripts = len(soup.find_all("script"))
        # Discover links before stripping navigation; only same-host public documents.
        for a in soup.find_all("a", href=True):
            candidate = safe_url(urljoin(source_url, a["href"]))
            if not candidate or urlparse(candidate).hostname != urlparse(source_url).hostname:
                continue
            descriptor = a.get_text(" ", strip=True) + " " + urlparse(candidate).path
            if re.search(r"login|logout|sign[-_]?up|register|open[-_]account|/apply", descriptor, re.I):
                continue
            weight = sum(score for expression, score in [(r"legal|regulat|licen[cs]|terms|entity", 60), (r"fees|commission|pricing|spread", 50), (r"account", 40), (r"withdraw|deposit|payment", 30), (r"platform|product", 20)] if re.search(expression, descriptor, re.I))
            if weight:
                links.append({"url": candidate, "priority": weight})
        for node in soup(["script", "style", "noscript", "svg", "nav", "form"]):
            node.decompose()
        text = soup.get_text(" ", strip=True)
        blocks = [node.get_text(" ", strip=True) for node in soup.find_all(["p", "li", "td", "th", "h1", "h2", "h3"])]
        if not blocks:
            blocks = [text]
    else:
        text = body.decode("utf-8", errors="replace")
        title, scripts = "Text source", 0
        blocks = re.split(r"\n+", text)
    candidates, seen = [], set()
    for block in blocks:
        excerpt = re.sub(r"\s+", " ", block).strip()
        if not 15 <= len(excerpt) <= 2000:
            continue
        excerpt = excerpt[:600]
        keys = [key for key, pattern in PATTERNS.items() if re.search(pattern, excerpt, re.I)]
        if not keys or excerpt in seen:
            continue
        seen.add(excerpt)
        candidates.append({"candidate_id": hashlib.sha256((source_url + excerpt).encode()).hexdigest()[:20], "field_ids": keys, "excerpt": excerpt, "source_url": source_url, "evidence_status": "needs-verification", "legal_entity": None, "jurisdiction": None, "verified_value": None})
        if len(candidates) >= 80:
            break
    unique_links = {item["url"]: item for item in links}
    status = "browser-rendering-may-be-required" if len(text) < 200 and scripts else "pdf-text-unavailable" if content_type == "application/pdf" and not text.strip() else "empty-content" if not text.strip() else "extracted"
    return {"status": status, "title": title[:250], "text": text, "broker_name_mentioned": bool(re.search(r"\b" + re.escape(broker_name) + r"\b", text, re.I)), "candidates": candidates, "links": sorted(unique_links.values(), key=lambda x: (-x["priority"], x["url"]))}


def collect(records: list[dict[str, Any]], out: Path, names: list[str] | None, limit: int, max_pages: int) -> dict[str, Any]:
    selected = [r for r in records if r["provider_queue"] == "retail-research"]
    if names:
        requested = {name.casefold() for name in names}
        selected = [r for r in selected if r["name"].casefold() in requested]
        missing = requested - {r["name"].casefold() for r in selected}
        if missing:
            raise ValueError("Unknown or non-retail selection: " + ", ".join(sorted(missing)))
    selected = selected[:limit]
    hosts = {urlparse(url).hostname for r in selected for url in [r["website_candidate"], *r["primary_source_candidates"]] if url}
    fetcher = Fetcher(out, hosts)
    summary: dict[str, Any] = {"started_at": now(), "selected_brokers": [r["name"] for r in selected], "required_source_domains": sorted(hosts), "fetch_statuses": Counter(), "pages_collected": 0, "usable_source_documents": 0, "analysis_statuses": Counter(), "unverified_snippet_candidates": 0, "verified_fields": 0, "reviews_published": 0, "brokers": []}
    write_json(out / "required-domains.json", sorted(hosts))
    for record in selected:
        queue = list(dict.fromkeys(u for u in [record["website_candidate"], *record["primary_source_candidates"]] if u))
        folder = out / "brokers" / record["id"]
        pages, seen = [], set()
        while queue and len(pages) < max_pages:
            url = queue.pop(0)
            if url in seen:
                continue
            seen.add(url)
            result, body = fetcher.fetch(url)
            page = {"fetch": asdict(result), "analysis": None}
            summary["fetch_statuses"][result.status] += 1
            if result.status == "ok":
                analysis = extract_document(body, result.content_type or "", result.final_url or url, record["name"])
                page["analysis"] = {k: v for k, v in analysis.items() if k != "text"}
                extracted = folder / "extracted" / f"{result.content_sha256}.txt"
                extracted.parent.mkdir(parents=True, exist_ok=True)
                extracted.write_text(analysis["text"], encoding="utf-8")
                summary["pages_collected"] += 1
                summary["analysis_statuses"][analysis["status"]] += 1
                if analysis["status"] == "extracted":
                    summary["usable_source_documents"] += 1
                summary["unverified_snippet_candidates"] += len(analysis["candidates"])
                if urlparse(result.final_url or url).hostname == urlparse(record["website_candidate"] or "").hostname:
                    queue.extend(item["url"] for item in analysis["links"] if item["url"] not in seen)
            pages.append(page)
        dossier = {"broker_id": record["id"], "collected_at": now(), "review_status": "draft-not-verified", "scope": {"basis": "listed-jurisdiction-candidates", "country_candidates": record["jurisdiction_candidates"], "headquarters": None, "verified_contracting_entities": [], "verified_client_markets": []}, "flags": record["flags"], "pages": pages, "publication_blockers": ["Human source verification and entity/country mapping are outstanding", "No independently verified factual fields have been approved"]}
        write_json(folder / "evidence-candidates.json", dossier)
        summary["brokers"].append({"id": record["id"], "country_candidates": record["jurisdiction_candidates"], "fetch_statuses": [p["fetch"]["status"] for p in pages]})
    summary["completed_at"] = now()
    summary["fetch_statuses"] = dict(summary["fetch_statuses"])
    summary["analysis_statuses"] = dict(summary["analysis_statuses"])
    write_json(out / "collection-summary.json", summary)
    return summary


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["audit", "prepare", "collect"])
    parser.add_argument("--csv", required=True, type=Path)
    parser.add_argument("--out", type=Path, default=ROOT / "research-output")
    parser.add_argument("--brokers", nargs="+", help="Exact CSV broker names for a research pilot")
    parser.add_argument("--limit", type=int, default=5, help="Collection limit; audit and prepare always retain the full directory")
    parser.add_argument("--max-pages", type=int, default=5, help="Per-broker request budget")
    args = parser.parse_args()
    if not 1 <= args.limit <= 325 or not 1 <= args.max_pages <= 15:
        parser.error("Use --limit 1..325 and --max-pages 1..15")
    try:
        rows = read_directory(args.csv)
        records = audit(rows, args.out, args.csv)
        print(json.dumps({"entries": len(rows), "queues": dict(Counter(r["provider_queue"] for r in records))}))
        if args.command in ("prepare", "collect"):
            print(json.dumps(prepare(records, args.out, template_record())))
        if args.command == "collect":
            summary = collect(records, args.out, args.brokers, args.limit, args.max_pages)
            print(json.dumps({key: summary[key] for key in ["selected_brokers", "pages_collected", "unverified_snippet_candidates", "verified_fields", "fetch_statuses", "required_source_domains"]}))
            # Distinguish blocked collection from successful audit/setup in automation.
            return 2 if summary["usable_source_documents"] == 0 else 0
        return 0
    except (ValueError, OSError, subprocess.CalledProcessError) as exc:
        print(f"Research setup failed: {type(exc).__name__}: {str(exc)[:250]}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
