"use client";

// Full results list for /search?q=...
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadIndex, search, type Prepared } from "@/lib/search";

export function SearchResults() {
  const params = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);
  const [index, setIndex] = useState<Prepared[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => setQ(initial), [initial]);
  useEffect(() => {
    loadIndex().then(setIndex).catch(() => setFailed(true));
  }, []);

  const hits = index && q.trim() ? search(index, q, 40) : [];

  return (
    <>
      <form role="search" action="/search" className="search-page-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search-page-input" className="visually-hidden">Search</label>
        <input
          id="search-page-input"
          name="q"
          type="search"
          value={q}
          placeholder="Search calculators, salaries and guides"
          onChange={(e) => {
            setQ(e.target.value);
            const url = new URL(window.location.href);
            url.searchParams.set("q", e.target.value);
            window.history.replaceState(null, "", url);
          }}
        />
      </form>
      {failed && <p className="muted">Search is not available right now.</p>}
      {!index && !failed && <p className="muted">Loading…</p>}
      {index && q.trim() && (
        <p className="muted">
          {hits.length ? `${hits.length}${hits.length === 40 ? "+" : ""} pages found` : `No pages found for “${q.trim()}”.`}
        </p>
      )}
      <ol className="search-page-list">
        {hits.map((h) => (
          <li key={h.entry.u}>
            <Link href={h.entry.u}>{h.entry.t}</Link>
            <p>{h.snippet}</p>
          </li>
        ))}
      </ol>
      {index && !hits.length && (
        <p>
          Try a salary such as <Link href="/search?q=35000">35000</Link>, a job like{" "}
          <Link href="/search?q=nurse">nurse</Link>, or browse <Link href="/calculators">all calculators</Link>.
        </p>
      )}
    </>
  );
}
