"use client";

// Header search box: searches page titles and content as you type, using /search-index.json.
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadIndex, search, type Hit, type Prepared } from "@/lib/search";

export function SiteSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<Prepared[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const hits: Hit[] = index && q.trim().length >= 2 ? search(index, q, 8) : [];

  function ensureIndex() {
    if (index || failed) return;
    loadIndex().then(setIndex).catch(() => setFailed(true));
  }

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQ("");
    setActive(-1);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (active >= 0 && hits[active]) go(hits[active].entry.u);
    else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  const showList = open && q.trim().length >= 2;

  return (
    <div className="site-search" ref={boxRef}>
      <form role="search" onSubmit={onSubmit} action="/search">
        <label htmlFor={`${listId}-input`} className="visually-hidden">
          Search UK Salary Tools
        </label>
        <input
          id={`${listId}-input`}
          name="q"
          type="search"
          placeholder="Search e.g. 35k, NHS band 5, Scotland"
          autoComplete="off"
          value={q}
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${listId}-list`}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
          onFocus={() => {
            ensureIndex();
            setOpen(true);
          }}
          onChange={(e) => {
            ensureIndex();
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
        />
      </form>
      {showList && (
        <ul id={`${listId}-list`} role="listbox" className="search-results" aria-label="Search results">
          {!index && !failed && <li className="search-empty">Loading…</li>}
          {failed && <li className="search-empty">Search is not available right now.</li>}
          {index && hits.length === 0 && <li className="search-empty">No pages found for “{q.trim()}”.</li>}
          {hits.map((h, i) => (
            <li
              key={h.entry.u}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "active" : undefined}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                go(h.entry.u);
              }}
            >
              <span className="search-title">{h.entry.t}</span>
              <span className="search-snippet">{h.snippet}</span>
            </li>
          ))}
          {index && hits.length > 0 && (
            <li className="search-all" onMouseDown={(e) => { e.preventDefault(); go(`/search?q=${encodeURIComponent(q.trim())}`); }}>
              See all results for “{q.trim()}” →
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
