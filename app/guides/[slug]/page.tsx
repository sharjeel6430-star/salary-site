import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "@/lib/guides";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import { guideFaqs, readGuideMarkdown, renderGuideMarkdown } from "@/lib/markdown";
import { ORG_ID, PERSON_ID, SITE_URL } from "@/lib/site";
import { LAST_REVIEWED_ISO } from "@/lib/sources";
import { SHORT_TITLES } from "@/lib/titleOverrides";

type Params = { slug: string };
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return {
    title: SHORT_TITLES[`/guides/${g.slug}`] ? { absolute: SHORT_TITLES[`/guides/${g.slug}`] } : g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { type: "article", title: g.title, description: g.description, images: ["/og-image.png"] },
  };
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const url = `${SITE_URL}/guides/${g.slug}`;
  const md = g.markdown ? readGuideMarkdown(g.markdown) : null;
  const faqs = md ? guideFaqs(md) : [];
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: g.h1 ?? g.title,
            description: g.description,
            mainEntityOfPage: url,
            author: { "@id": PERSON_ID },
            publisher: { "@id": ORG_ID },
            dateModified: LAST_REVIEWED_ISO,
          },
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Guides", url: `${SITE_URL}/guides` },
            { name: g.title, url },
          ]),
          ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
        ]}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> › <Link href="/guides">Guides</Link>
      </nav>
      <article className="prose">
        <h1>{g.h1 ?? g.title}</h1>
        <Byline />
        <p className="lead">{g.lead ?? g.description}</p>
        {g.body?.()}
        {md && <div dangerouslySetInnerHTML={{ __html: renderGuideMarkdown(md) }} />}
        <p>
          <Link href="/">← Back to the salary calculator</Link>
        </p>
      </article>
    </>
  );
}
