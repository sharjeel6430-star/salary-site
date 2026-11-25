import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="prose">
      <h1>Page not found</h1>
      <p>Sorry, we couldn&apos;t find that page.</p>
      <p>
        <Link href="/">Go to the salary calculator →</Link>
      </p>
    </div>
  );
}
