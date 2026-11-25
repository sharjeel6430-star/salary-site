"use client";

// Byline under each page's H1, plus WebPage structured data naming the author, reviewer and publisher.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AUTHOR, ORG_ID, PERSON_ID, SITE_URL } from "@/lib/site";
import { LAST_REVIEWED, LAST_REVIEWED_ISO } from "@/lib/sources";
import { pageInfo } from "@/lib/pageInfo";

export function Byline() {
  const path = usePathname() || "/";
  // Pages that are not about tax (BMI, fuel cost and so on) make no claim about HMRC rates.
  const plain = pageInfo(path)?.plain;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    author: { "@id": PERSON_ID },
    reviewedBy: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    dateModified: LAST_REVIEWED_ISO,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p className="byline">
        By <Link href={AUTHOR.path}>{AUTHOR.name}</Link>
        {!plain && " · Checked against HMRC rates"} · <Link href="/methodology">How we calculate</Link> · Updated{" "}
        <time dateTime={LAST_REVIEWED_ISO}>{LAST_REVIEWED}</time>
      </p>
    </>
  );
}
