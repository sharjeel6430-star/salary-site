import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every UK Salary Tools calculator, salary page and guide.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="prose">
      <h1>Search</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
