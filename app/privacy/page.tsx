import type { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <div className="prose">
      <h1>Privacy Policy</h1>
      <p>
        The figures you enter, including salary, height, weight and marks, are calculated in your browser and are never
        sent to or stored on our servers.
      </p>
      <h2>Postcode lookups</h2>
      <p>
        If you type a postcode into the{" "}
        <a href="/as-the-crow-flies-distance-calculator">as the crow flies distance calculator</a>, your browser sends
        that postcode to postcodes.io, a free open-data service, to find its location. Nothing else is sent, and town names
        and coordinates are worked out in your browser without any lookup.
      </p>
      <h2>Analytics</h2>
      <p>
        We use Cloudflare Web Analytics and Ahrefs Web Analytics to understand how the site is used, such as which
        pages are visited and which sites send visitors here. Neither uses cookies or tracks you across other websites,
        and both show us totals rather than information about individual visitors.
      </p>
      <h2>Advertising and cookies</h2>
      <p>
        We show adverts from Google AdSense. Google and its partners may use cookies and similar technologies to show
        ads, measure their performance and, if you agree, personalise them based on your visits to this and other
        websites.
      </p>
      <p>
        Visitors in the UK, the EU and Switzerland are asked for consent through Google&apos;s consent message before any
        personalised advertising cookies are used. You can change your choice at any time using the{" "}
        <strong>Privacy and cookie settings</strong> link that appears on the page. You can also manage personalised ads at{" "}
        <a href="https://adssettings.google.com" rel="noopener noreferrer">adssettings.google.com</a>.
      </p>
      <p>
        Learn how Google uses information from sites that use its services:{" "}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">
          policies.google.com/technologies/partner-sites
        </a>
        .
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </div>
  );
}
