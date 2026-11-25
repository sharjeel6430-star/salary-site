import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${SITE_NAME} to report a mistake, suggest a calculator or ask about advertising.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <div className="prose">
      <h1>Contact us</h1>
      <p className="lead">
        Questions, corrections and suggestions are always welcome. The quickest way to reach us is by email.
      </p>
      <div className="card contact-box">
        <p style={{ margin: 0 }}>
          Email:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <strong>{CONTACT_EMAIL}</strong>
          </a>
        </p>
        <p className="muted" style={{ margin: "6px 0 0" }}>
          We aim to reply within a few working days.
        </p>
      </div>

      <h2>What you can contact us about</h2>
      <ul>
        <li>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Possible%20error`}>
            <strong>Report an error</strong>
          </a>{" "}
          — tell us the page, the figures you entered and what you expected to see.
        </li>
        <li>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Suggestion`}>
            <strong>Suggest a calculator or guide</strong>
          </a>{" "}
          — let us know what would help you.
        </li>
        <li>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Advertising%20or%20partnership`}>
            <strong>Advertising and partnerships</strong>
          </a>
        </li>
      </ul>

      <h2>Please note</h2>
      <p>
        We can&apos;t give personal tax or financial advice, and we can&apos;t look at your payslip or tax account. For
        questions about your own tax code or tax bill, contact HMRC directly through{" "}
        <a href="https://www.gov.uk/contact-hmrc" target="_blank" rel="noopener noreferrer">
          GOV.UK
        </a>
        .
      </p>
      <p>
        Read more <Link href="/about">about who runs {SITE_NAME}</Link> or see our{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </div>
  );
}
