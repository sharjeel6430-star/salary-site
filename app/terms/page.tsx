import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from "@/lib/site";
import { LAST_REVIEWED } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Terms of Use and Disclaimer",
  description: `The terms for using ${SITE_NAME}, including our disclaimer that calculator results are estimates and not financial or tax advice.`,
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <div className="prose">
      <h1>Terms of Use and Disclaimer</h1>
      <p className="muted">Last updated: {LAST_REVIEWED}</p>
      <p>
        These terms apply to your use of {SITE_NAME} ({SITE_URL.replace("https://", "")}). By using the site you agree
        to them. If you don&apos;t agree, please don&apos;t use the site.
      </p>

      <h2>1. Guidance only, not advice</h2>
      <p>
        Our calculators and guides give <strong>estimates</strong> based on published UK tax rates and the information
        you enter. They are for general information only and are <strong>not financial, tax, legal or accounting
        advice</strong>. Your actual pay, tax or entitlement may differ, for example because of your tax code, benefits
        in kind, how your employer runs payroll, or changes to the rules.
      </p>
      <p>
        Before making an important decision, such as accepting a job offer, changing pension contributions or paying
        yourself from a company, check with HMRC, your employer, or a qualified adviser.
      </p>

      <h2>2. Accuracy</h2>
      <p>
        We take care to keep every figure accurate and up to date, and we list our sources on the{" "}
        <Link href="/about">About page</Link>. However, we can&apos;t guarantee that the site is always complete,
        accurate or free from errors. If you spot a mistake, please <Link href="/contact">let us know</Link> and we will
        correct it.
      </p>

      <h2>3. Limitation of liability</h2>
      <p>
        To the extent allowed by law, {SITE_NAME} is not responsible for any loss or damage arising from your use of the
        site or from relying on its results. Nothing in these terms limits liability that cannot be limited under UK law.
      </p>

      <h2>4. Independent website</h2>
      <p>
        {SITE_NAME} is an independent website. It is not affiliated with, endorsed by or connected to HMRC, the UK
        Government, the Scottish Government, the NHS, the Department for Education or any employer.
      </p>

      <h2>5. Advertising and links</h2>
      <p>
        The site is funded by advertising, including Google AdSense. Adverts are provided by third parties and do not
        mean we recommend the advertiser. We also link to other websites, such as GOV.UK. We are not responsible for the
        content of websites we don&apos;t run. See our <Link href="/privacy">privacy policy</Link> for how adverts use
        cookies.
      </p>

      <h2>6. Using our content</h2>
      <p>
        The text, design and code of this site belong to {SITE_NAME}. You&apos;re welcome to link to any page and to
        quote short extracts with a link back. Please don&apos;t copy whole pages or calculators without permission.
      </p>

      <h2>7. Acceptable use</h2>
      <p>
        Please don&apos;t misuse the site, for example by trying to disrupt it, scraping it in bulk or using it for
        anything unlawful.
      </p>

      <h2>8. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The date at the top of this page shows when they last changed.
      </p>

      <h2>9. Governing law</h2>
      <p>These terms are governed by the laws of England and Wales.</p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </div>
  );
}
