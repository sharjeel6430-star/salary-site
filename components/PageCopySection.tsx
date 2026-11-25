// Worked example, edge case and "checked" line for pages with hand-written copy (lib/pageCopy.ts).
import Link from "next/link";
import { COPY_CHECKED, COPY_SOURCE, type PageCopy } from "@/lib/pageCopy";

export function PageCopySection({ copy, subject }: { copy: PageCopy; subject: string }) {
  return (
    <section className="page-copy prose">
      <h2>A worked example at {subject}</h2>
      <p>{copy.example}</p>
      <h2>Watch out for this at {subject}</h2>
      <p>{copy.edge}</p>
      <p className="muted checked-line">
        {COPY_CHECKED} Source: <a href={COPY_SOURCE.href} rel="noopener">{COPY_SOURCE.label}</a>.{" "}
        <Link href={copy.link.href}>{copy.link.label} →</Link>
      </p>
    </section>
  );
}
