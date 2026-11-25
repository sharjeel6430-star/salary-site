"use client";

// Shown at the foot of every calculator and content page: related tools, sources and the last review date.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { pageInfo } from "@/lib/pageInfo";
import { SOURCES, LAST_REVIEWED } from "@/lib/sources";
import { TOOLS } from "@/lib/tools";

export function PageFooterInfo() {
  const info = pageInfo(usePathname() || "/");
  if (!info) return null;
  const tools = info.related.map((h) => TOOLS.find((t) => t.href === h)).filter((t): t is (typeof TOOLS)[number] => !!t);
  const sources = info.sources.map((id) => SOURCES.find((s) => s.id === id)).filter((s): s is (typeof SOURCES)[number] => !!s);

  return (
    <aside className="page-footer-info" aria-label="Related calculators and sources">
      {tools.length > 0 && <h2>Related calculators</h2>}
      <ul className="guide-list">
        {tools.map((c) => (
          <li key={c.href} className="card">
            <Link href={c.href}>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="card trust-box">
        <p className="trust-updated">
          <strong>Last updated: {LAST_REVIEWED}</strong>
          {!info.plain && " · Figures for the 2026/27 tax year"}
        </p>
        {sources.length > 0 && <p className="trust-label">Sources used on this page:</p>}
        <ul>
          {sources.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.source}
              </a>
            </li>
          ))}
        </ul>
        <p className="muted">
          Results are estimates for guidance only, not {info.plain ? "professional" : "financial"} advice. Spotted a mistake?{" "}
          <Link href="/contact">Tell us</Link> · <Link href="/methodology">How we check our figures</Link>
        </p>
      </div>
    </aside>
  );
}
