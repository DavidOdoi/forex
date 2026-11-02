"use client";
import { useState } from "react";
import { terms } from "@/lib/education";
import { Icon } from "@/components/icon";
export function Glossary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All terms");
  const categories = [
    "All terms",
    "Fundamentals",
    "Pricing",
    "Risk",
    "Orders",
    "Products",
  ];
  const results = terms.filter(
    (t) =>
      (category === "All terms" || t.category === category) &&
      `${t.term} ${t.definition}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="glossary-workspace">
      <div className="glossary-controls">
        <div className="glossary-search">
          <Icon name="search" size={21} />
          <label className="sr-only" htmlFor="term-search">
            Search forex terms
          </label>
          <input
            id="term-search"
            type="search"
            placeholder="A word you want to understand…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span>{terms.length} terms</span>
        </div>
        <div className="filter-tabs" aria-label="Filter glossary by topic">
          {categories.map((c) => (
            <button
              type="button"
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="results-heading">
        <span role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "term" : "terms"}
          {query ? ` matching “${query}”` : " to explore"}
        </span>
        {(query || category !== "All terms") && (
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setQuery("");
              setCategory("All terms");
            }}
          >
            Clear filters ×
          </button>
        )}
      </div>
      <div className="glossary-results">
        {results.map((t) => (
          <article className="glossary-entry" key={t.slug} id={t.slug}>
            <span className="entry-letter" aria-hidden="true">
              {t.term[0]}
            </span>
            <div>
              <div className="entry-heading">
                <h2>{t.term}</h2>
                <span className="badge">{t.category}</span>
              </div>
              <p>{t.definition}</p>
            </div>
          </article>
        ))}
      </div>
      {!results.length && (
        <div className="empty-state">
          <Icon name="search" size={34} />
          <h2>No matching terms, yet.</h2>
          <p>
            Try another word or clear your filters to explore the full glossary.
          </p>
          <button
            type="button"
            className="button primary"
            onClick={() => {
              setQuery("");
              setCategory("All terms");
            }}
          >
            Show all terms
          </button>
        </div>
      )}
    </div>
  );
}
