import csv
import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import requests
import research


def row(**overrides):
    value = {"Broker": "Sample Broker", "Website": "https://broker.example/", "Provider type": "Forex / forex CFDs", "Evidence level": "English service only", "English-speaking jurisdiction evidence": "Not established", "Primary / country evidence URL": "Not independently retrieved", "Explicit directory-allowed English markets": "No positive country allowlist recorded", "Directory-restricted English markets": "United States", "Notes": "Unverified input", "Website check": "Official site not fully retrieved"}
    value.update(overrides)
    return value


class FakeResponse:
    def __init__(self, code=200, body=b"", content_type="text/plain", **headers):
        self.status_code = code
        self.body = body
        self.headers = {"Content-Type": content_type, **headers}
    def __enter__(self):
        return self
    def __exit__(self, *args):
        return False
    def iter_content(self, chunk_size):
        yield self.body


class FakeSession:
    def __init__(self, responses):
        self.responses = list(responses)
        self.headers = {}
        self.calls = []
    def get(self, url, **kwargs):
        self.calls.append((url, kwargs))
        response = self.responses.pop(0)
        if isinstance(response, Exception):
            raise response
        return response


class DirectoryTests(unittest.TestCase):
    def test_csv_seed_never_becomes_verified_location_or_client_eligibility(self):
        seed = research.seed_record(row(**{"Evidence level": "Regulator-listed", "English-speaking jurisdiction evidence": "Kenya; Seychelles"}))
        self.assertEqual(seed["jurisdiction_candidates"], ["Kenya", "Seychelles"])
        self.assertIsNone(seed["headquarters"])
        self.assertEqual(seed["contracting_entities"], [])
        self.assertEqual(seed["client_eligibility"], [])
        self.assertEqual(seed["jurisdiction_status"], "unverified-seed")
        self.assertIn("csv-assertions-not-independently-verified", seed["flags"])

    def test_unknown_websites_and_english_service_are_not_filled_by_inference(self):
        seed = research.seed_record(row(Website="Not verified"))
        self.assertIsNone(seed["website_candidate"])
        self.assertEqual(seed["jurisdiction_candidates"], [])
        self.assertIn("english-language-is-not-jurisdiction-evidence", seed["flags"])
        self.assertEqual(research.countries("No positive country allowlist recorded"), [])

    def test_non_retail_providers_have_separate_queues(self):
        for kind, expected in [("Ghana interbank FX broker", "interbank-separate-template"), ("Institutional / professional FX", "institutional-separate-template"), ("Introducing / relationship broker", "introducing-broker-manual-review")]:
            self.assertEqual(research.provider_queue(row(**{"Provider type": kind})), expected)

    def test_missing_columns_and_duplicate_identity_are_errors(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "input.csv"
            path.write_text("Broker\nOnly name\n")
            with self.assertRaisesRegex(ValueError, "Missing required"):
                research.read_directory(path)
            with path.open("w", newline="") as handle:
                writer = csv.DictWriter(handle, fieldnames=list(row()))
                writer.writeheader()
                writer.writerow(row())
                writer.writerow(row())
            with self.assertRaisesRegex(ValueError, "Duplicate"):
                research.read_directory(path)

    def test_real_ts_template_is_used_and_modified_drafts_are_preserved(self):
        template = research.template_record()
        records = [research.seed_record(row()), research.seed_record(row(Broker="Interbank", **{"Provider type": "Ghana interbank FX broker"}))]
        with tempfile.TemporaryDirectory() as temp:
            out = Path(temp)
            result = research.prepare(records, out, template)
            self.assertEqual(result["drafts_created"], 1)
            self.assertEqual(result["separate_provider_queue"], 1)
            path = out / "brokers/sample-broker/draft.json"
            draft = json.loads(path.read_text())
            self.assertEqual(draft["status"], "draft")
            self.assertIsNone(draft["broker"]["website"])
            self.assertIsNone(draft["jurisdiction"])
            self.assertIsNone(draft["overallScore"])
            self.assertEqual(draft["sources"], [])
            draft["verdict"] = "Existing editor work"
            research.write_json(path, draft)
            research.prepare(records, out, template)
            self.assertEqual(json.loads(path.read_text())["verdict"], "Existing editor work")


class CollectionTests(unittest.TestCase):
    def test_successful_collection_stages_candidates_without_approving_draft_facts(self):
        body=b"<html><title>Sample Broker terms</title><p>Minimum deposit is $50 for an example account. Sample Broker Limited lists its fees in the terms.</p></html>"
        class FakeFetcher:
            def fetch(self, url):
                return research.FetchResult(url,url,"ok",research.now(),200,"text/html",research.hashlib.sha256(body).hexdigest()),body
        record=research.seed_record(row(**{"English-speaking jurisdiction evidence":"Kenya"}))
        with tempfile.TemporaryDirectory() as temp:
            out=Path(temp)
            research.prepare([record],out,research.template_record())
            with patch("research.Fetcher",return_value=FakeFetcher()):
                summary=research.collect([record],out,["Sample Broker"],1,1)
            self.assertEqual(summary["usable_source_documents"],1)
            self.assertGreater(summary["unverified_snippet_candidates"],0)
            self.assertEqual(summary["verified_fields"],0)
            self.assertEqual(summary["reviews_published"],0)
            draft=json.loads((out/"brokers/sample-broker/draft.json").read_text())
            self.assertIsNone(draft["jurisdiction"])
            self.assertEqual(draft["sources"],[])
            self.assertTrue(all(field["value"] is None for field in draft["keyData"]))
            dossier=json.loads((out/"brokers/sample-broker/evidence-candidates.json").read_text())
            self.assertEqual(dossier["scope"]["country_candidates"],["Kenya"])
            self.assertEqual(dossier["scope"]["verified_client_markets"],[])


class ExtractionTests(unittest.TestCase):
    def test_html_extracts_candidates_without_promoting_facts(self):
        html = b'''<html><head><title>Sample Broker</title></head><body><p>Minimum deposit is $50 for the example account.</p><p>Sample Broker Limited is regulated in a jurisdiction.</p><script>this must not be executed</script><a href="/legal/">Legal terms</a><a href="/fees">Fees</a><a href="https://other.example/">Other</a><a href="/open-account">Open account</a></body></html>'''
        data = research.extract_document(html, "text/html", "https://broker.example/", "Sample Broker")
        self.assertTrue(data["broker_name_mentioned"])
        self.assertNotIn("must not be executed", data["text"])
        self.assertTrue(any("minimum-deposit" in c["field_ids"] for c in data["candidates"]))
        self.assertEqual({c["evidence_status"] for c in data["candidates"]}, {"needs-verification"})
        self.assertTrue(all(c["verified_value"] is None and c["jurisdiction"] is None for c in data["candidates"]))
        self.assertEqual({v["url"] for v in data["links"]}, {"https://broker.example/legal/", "https://broker.example/fees"})

    def test_javascript_only_pages_and_access_challenges_are_not_claimed_as_research(self):
        js = research.extract_document(b'<html><script src="app.js"></script><div id="root"></div></html>', "text/html", "https://broker.example/", "Broker")
        self.assertEqual(js["status"], "browser-rendering-may-be-required")
        blocked = research.extract_document(b'<title>Just a moment...</title><p>Verify you are human</p>', "text/html", "https://broker.example/", "Broker")
        self.assertEqual(blocked["status"], "access-challenge")
        self.assertEqual(blocked["candidates"], [])

    def test_pdf_text_can_generate_unverified_candidates(self):
        from pypdf import PdfWriter
        from pypdf.generic import DictionaryObject, NameObject, DecodedStreamObject
        writer=PdfWriter()
        page=writer.add_blank_page(width=612,height=792)
        font=DictionaryObject({NameObject("/Type"):NameObject("/Font"),NameObject("/Subtype"):NameObject("/Type1"),NameObject("/BaseFont"):NameObject("/Helvetica")})
        page[NameObject("/Resources")]=DictionaryObject({NameObject("/Font"):DictionaryObject({NameObject("/F1"):writer._add_object(font)})})
        content=DecodedStreamObject()
        content.set_data(b"BT /F1 12 Tf 50 700 Td (Minimum deposit is 100 units for an example account.) Tj ET")
        page[NameObject("/Contents")]=writer._add_object(content)
        buffer=io.BytesIO()
        writer.write(buffer)
        data=research.extract_document(buffer.getvalue(),"application/pdf","https://broker.example/terms.pdf","Broker")
        self.assertEqual(data["status"],"extracted")
        self.assertIn("Minimum deposit",data["text"])
        self.assertIsNone(data["candidates"][0]["verified_value"])


class FetchTests(unittest.TestCase):
    def test_unsafe_urls_are_rejected_without_requests(self):
        for url in ["file:///etc/passwd", "http://broker.example/", "https://127.0.0.1/", "https://169.254.169.254/", "https://user:password@broker.example/", "https://service.internal/", "https://broker.example:8443/"]:
            self.assertIsNone(research.safe_url(url), url)

    @patch("research.time.sleep")
    def test_robots_disallow_prevents_page_fetch(self, sleep):
        session = FakeSession([FakeResponse(body=b"User-agent: *\nDisallow: /legal")])
        with tempfile.TemporaryDirectory() as temp:
            result, body = research.Fetcher(Path(temp), {"broker.example"}, session=session).fetch("https://broker.example/legal")
        self.assertEqual(result.status, "robots-disallowed")
        self.assertEqual(body, b"")
        self.assertEqual(len(session.calls), 1)

    @patch("research.time.sleep")
    def test_robots_html_challenge_is_not_treated_as_permission(self, sleep):
        session = FakeSession([FakeResponse(body=b"<html>Blocked</html>", content_type="text/html")])
        with tempfile.TemporaryDirectory() as temp:
            result, _ = research.Fetcher(Path(temp), {"broker.example"}, session=session).fetch("https://broker.example/legal")
        self.assertEqual(result.status, "robots-unreadable")
        self.assertEqual(len(session.calls), 1)

    @patch("research.time.sleep")
    def test_proxy_block_is_distinct_and_does_not_expose_error_credentials(self, sleep):
        session = FakeSession([requests.exceptions.ProxyError("secret must not appear")])
        with tempfile.TemporaryDirectory() as temp:
            result, body = research.Fetcher(Path(temp), {"broker.example"}, session=session).fetch("https://broker.example/")
        self.assertEqual(result.status, "proxy-or-policy-blocked")
        self.assertNotIn("secret", json.dumps(research.asdict(result)))
        self.assertEqual(body, b"")

    @patch("research.time.sleep")
    def test_redirect_target_robots_is_checked_before_fetch(self, sleep):
        session = FakeSession([FakeResponse(body=b"User-agent: *\nAllow: /"), FakeResponse(code=302, Location="https://entity.example/legal"), FakeResponse(body=b"User-agent: *\nDisallow: /")])
        with tempfile.TemporaryDirectory() as temp:
            result, _ = research.Fetcher(Path(temp), {"broker.example", "entity.example"}, session=session).fetch("https://broker.example/")
        self.assertEqual(result.status, "robots-disallowed")
        self.assertEqual([c[0] for c in session.calls], ["https://broker.example/robots.txt", "https://broker.example/", "https://entity.example/robots.txt"])

    @patch("research.time.sleep")
    def test_snapshots_are_hashed_and_cache_integrity_is_verified(self, sleep):
        session = FakeSession([FakeResponse(body=b"User-agent: *\nAllow: /"), FakeResponse(body=b"<p>Minimum deposit is $50.</p>", content_type="text/html")])
        with tempfile.TemporaryDirectory() as temp:
            out = Path(temp)
            fetcher = research.Fetcher(out, {"broker.example"}, session=session)
            result, body = fetcher.fetch("https://broker.example/")
            self.assertEqual(result.status, "ok")
            self.assertTrue(result.content_sha256)
            self.assertEqual(fetcher.snapshot_bytes(result), body)
            unused_session = FakeSession([])
            cached, same_body = research.Fetcher(out, {"broker.example"}, session=unused_session).fetch("https://broker.example/")
            self.assertTrue(cached.cache_hit)
            self.assertEqual(same_body, body)
            self.assertEqual(unused_session.calls, [])
            (out / result.snapshot_path).write_bytes(b"tampered")
            self.assertEqual(fetcher.snapshot_bytes(result), b"")

    @patch("research.time.sleep")
    def test_redirects_outside_source_scope_stop_without_request(self, sleep):
        session = FakeSession([FakeResponse(body=b"User-agent: *\nAllow: /"), FakeResponse(code=302, Location="https://unlisted.example/")])
        with tempfile.TemporaryDirectory() as temp:
            result, _ = research.Fetcher(Path(temp), {"broker.example"}, session=session).fetch("https://broker.example/")
        self.assertEqual(result.status, "unlisted-redirect-host")
        self.assertEqual(len(session.calls), 2)


if __name__ == "__main__":
    unittest.main()
