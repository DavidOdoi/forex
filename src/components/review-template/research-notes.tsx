import { ExternalLink } from "lucide-react";
import type { ResearchEntry } from "@/lib/reviews/research-types";

const statuses: Record<string, string> = {
  "access-denied": "Source denied access",
  "unlisted-redirect-host": "Redirect destination needs identity review",
  "proxy-or-policy-blocked": "Source connection unavailable",
  "http-error": "Source returned an HTTP error",
  "robots-unreadable": "Collection paused: robots policy unreadable",
  "robots-disallowed": "Collection not permitted by robots policy",
  "rate-limited": "Source requested a collection pause",
  "browser-rendering-may-be-required": "Page requires browser rendering",
  "access-challenge": "Source presented an access challenge",
};
export function CollectedResearch({ entry, hasFindings }: { entry: ResearchEntry; hasFindings: boolean }) {
  return (
    <section id="collected-research" className="review-collected">
      <span className="review-overline">RESEARCH IN PROGRESS</span>
      <h2>{hasFindings ? "Further source material" : "Collected source notes"}</h2>
      <p>These documents have been collected, but their statements have not been approved as account facts. Their country and legal entity may differ from the selected profile. An office or licence in a country does not establish that residents can open an account.</p>
      {!hasFindings && entry.notes.map((note, i) => {
        const source = entry.sources.find(s => s.id === note.sourceId);
        return source ? <figure key={`${note.sourceId}-${i}`}>
          <span className="review-pending-label">Unverified source excerpt</span>
          <blockquote>“{note.excerpt}”</blockquote>
          <figcaption><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink size={14} /></a><span>Retrieved {source.checkedAt} · Entity and country allocation pending</span></figcaption>
        </figure> : null;
      })}
      {entry.sources.length > 0 && <details><summary>{entry.sources.length} collected document{entry.sources.length === 1 ? "" : "s"}</summary><ul>{entry.sources.map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<ExternalLink size={14} /></a><p>{new URL(source.url).hostname} · Retrieved {source.checkedAt}</p></li>)}</ul></details>}
      {entry.countryCandidates.length > 0 && <p><strong>Additional countries mentioned in the supplied directory:</strong> {entry.countryCandidates.join(", ")}. These are research leads, not confirmed headquarters or a client-eligibility list.</p>}
      {entry.collectionStatuses.some(s => statuses[s]) && <p><strong>Outstanding source checks:</strong> {[...new Set(entry.collectionStatuses.filter(s => statuses[s]).map(s => statuses[s]))].join("; ")}.</p>}
      {!entry.sources.length && <p>No usable source text is currently available. Unsupported financial claims and country permissions have been left unset.</p>}
    </section>
  );
}
