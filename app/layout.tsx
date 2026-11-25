import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_NAME, SITE_URL, SITE_TAGLINE, ADSENSE_CLIENT, CONTACT_EMAIL, ORG_ID, PERSON_ID, AUTHOR } from "@/lib/site";
import { UnionFlag } from "@/components/UnionFlag";
import { PageFooterInfo } from "@/components/PageFooterInfo";
import { SiteSearch } from "@/components/SiteSearch";
import { SHORT_TITLES } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SHORT_TITLES["/"],
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free UK salary calculator and take home pay calculator for 2026/27. See your pay after tax, National Insurance, student loan and pension, including Scotland.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${SITE_NAME} – free UK salary and take-home pay calculators` }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  alternates: { canonical: "/" },
  other: { "google-adsense-account": ADSENSE_CLIENT },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#012169" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1324" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        {/* Google AdSense. Also loads Google's certified consent message (set up in AdSense → Privacy & messaging). */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        {/* Who publishes the site: referenced by every page's byline schema. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": ORG_ID,
              name: SITE_NAME,
              url: `${SITE_URL}/`,
              email: CONTACT_EMAIL,
              logo: `${SITE_URL}/logo.png`,
              founder: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR.name, url: `${SITE_URL}${AUTHOR.path}`, sameAs: [AUTHOR.linkedin] },
              publishingPrinciples: `${SITE_URL}/methodology`,
              correctionsPolicy: `${SITE_URL}/methodology#corrections`,
            }),
          }}
        />
        {/* Ahrefs Web Analytics (cookieless visitor statistics). */}
        <script src="https://analytics.ahrefs.com/analytics.js" data-key="qrolBqRnN9YOtz7DK4DOdw" async />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="logo" aria-label={`${SITE_NAME} home`}>
              <UnionFlag square />
              <span>
                {SITE_NAME}
                <small>2026/27 UK tax year</small>
              </span>
            </Link>
            <SiteSearch />
            <nav aria-label="Main">
              <Link href="/">Salary calculator</Link>
              <Link href="/scotland-salary-calculator">Scotland</Link>
              <Link href="/nhs-take-home-pay-calculator">NHS</Link>
              <Link href="/compare-salaries">Compare</Link>
              <Link href="/teacher-take-home-pay-calculator">Teachers</Link>
              <Link href="/pro-rata-salary-calculator">Pro rata</Link>
              <Link href="/hourly-to-salary">Hourly</Link>
              <Link href="/guides">Guides</Link>
              <Link href="/calculators">All tools</Link>
            </nav>
          </div>
          <div className="flag-ribbon" />
        </header>
        <main id="main" className="container">
          {children}
          <PageFooterInfo />
        </main>
        <footer className="site-footer">
          <div className="flag-ribbon" />
          <div className="container footer-inner">
            <div>
              <strong>{SITE_NAME}</strong>
              <p className="muted">{SITE_TAGLINE}. Figures are estimates for guidance only and are not financial advice.</p>
              <p className="nations">Covering England · Scotland · Wales · Northern Ireland</p>
            </div>
            <nav aria-label="Footer">
              <Link href="/salary">All salaries after tax</Link>
              <Link href="/nhs-pay-bands">NHS pay bands 2026/27</Link>
              <Link href="/hourly">Hourly rates after tax</Link>
              <Link href="/take-home">Monthly take-home to salary</Link>
              <Link href="/guides/uk-tax-bands-2026-27">Tax brackets 2026/27</Link>
              <Link href="/minimum-wage-calculator">Minimum wage 2026</Link>
              <Link href="/salary-needed-to-live-uk-cities">Salary needed by city</Link>
              <Link href="/calculators">All calculators</Link>
              <Link href="/about">About</Link>
              <Link href="/methodology">How we calculate</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms of use</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
