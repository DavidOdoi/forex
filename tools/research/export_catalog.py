#!/usr/bin/env python3
"""Export a bounded, unverified research catalogue; never approve financial facts."""
import argparse
import json
from urllib.parse import urlparse
from pathlib import Path
from research import safe_url, write_json


def export_catalog(out: Path) -> dict:
    manifest = json.loads((out / "directory-manifest.json").read_text())
    entries = []
    for seed in manifest:
        if seed["provider_queue"] != "retail-research":
            continue
        dossier_path = out / "brokers" / seed["id"] / "evidence-candidates.json"
        dossier = json.loads(dossier_path.read_text()) if dossier_path.exists() else {}
        sources, notes, statuses = [], [], []
        official_hosts = {urlparse(seed.get("website_candidate") or "").hostname}
        for page in dossier.get("pages", []):
            if page["fetch"]["requested_url"] == seed.get("website_candidate") and page["fetch"].get("final_url"):
                official_hosts.add(urlparse(page["fetch"]["final_url"]).hostname)
        official_hosts = {h.removeprefix("www.") for h in official_hosts if h}
        for page in dossier.get("pages", []):
            fetch, analysis = page["fetch"], page.get("analysis") or {}
            statuses.append(fetch["status"] if fetch["status"] != "ok" else analysis.get("status", "unanalysed"))
            url = safe_url(fetch.get("final_url") or fetch["requested_url"])
            if fetch["status"] != "ok" or analysis.get("status") != "extracted" or not url:
                continue
            if any(s["url"] == url for s in sources):
                continue
            source_id = "collected-" + str(len(sources) + 1)
            sources.append({"id": source_id, "title": analysis.get("title", "Collected document"), "url": url,
                            "checkedAt": fetch["fetched_at"][:10], "sha256": fetch["content_sha256"]})
            # At most 3 short quotations / 75 words per broker, across all sources.
            # Quotes remain source notes, never verified template findings.
            remaining_words = 75 - sum(len(n["excerpt"].split()) for n in notes)
            if (urlparse(url).hostname or "").removeprefix("www.") not in official_hosts:
                continue
            for candidate in analysis.get("candidates", []):
                if len(notes) >= 3 or remaining_words < 8:
                    break
                if any(set(candidate["field_ids"]) & set(n["fieldIds"]) for n in notes):
                    continue
                words = candidate["excerpt"].split()
                excerpt = " ".join(words[:min(25, remaining_words)])
                if len(excerpt) < len(candidate["excerpt"]):
                    excerpt += "…"
                notes.append({"sourceId": source_id, "excerpt": excerpt, "fieldIds": candidate["field_ids"]})
                remaining_words -= len(excerpt.split())
        entries.append({"slug": seed["id"], "name": seed["name"],
                        "countryCandidates": seed["jurisdiction_candidates"],
                        "sources": sources, "notes": notes,
                        "collectionStatuses": list(dict.fromkeys(statuses))})
    return {"schemaVersion": 1, "inputEntries": len(manifest), "separateProviderEntries": len(manifest) - len(entries),
            "entries": sorted(entries, key=lambda e: e["name"].casefold())}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=Path("research-output"))
    parser.add_argument("--destination", type=Path, default=Path("src/data/review-research.json"))
    args = parser.parse_args()
    result = export_catalog(args.out)
    write_json(args.destination, result)
    print(json.dumps({"retail_entries": len(result["entries"]), "with_sources": sum(bool(e["sources"]) for e in result["entries"]), "separate_providers": result["separateProviderEntries"]}))
