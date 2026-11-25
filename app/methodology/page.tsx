import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AUTHOR, CONTACT_EMAIL, ORG_ID, PERSON_ID, SITE_NAME, SITE_URL } from "@/lib/site";
import { SOURCES, LAST_REVIEWED, LAST_REVIEWED_ISO } from "@/lib/sources";
import { TAX_YEAR, calculate, gbp } from "@/lib/tax";
import { CHANGE_LOG } from "@/lib/changelog";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/methodology"),
  description: `How ${SITE_NAME} works out Income Tax, National Insurance, student loans and pensions for ${TAX_YEAR.label}, where every rate comes from, and how we correct mistakes.`,
  alternates: { canonical: "/methodology" },
};

const Y = TAX_YEAR;
const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;
const ex = calculate({ gross: 40000 });

export default function Methodology() {
  return (
    <div className="prose">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          url: `${SITE_URL}/methodology`,
          name: "How we calculate your take-home pay",
          publisher: { "@id": ORG_ID },
          author: { "@id": PERSON_ID },
          lastReviewed: LAST_REVIEWED_ISO,
          citation: [
            "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027",
            "https://www.gov.uk/scottish-income-tax",
            "https://www.gov.uk/repaying-your-student-loan/what-you-pay",
          ],
        }}
      />
      <h1>How we calculate your take-home pay</h1>
      <p className="byline">
        By <Link href={AUTHOR.path}>{AUTHOR.name}</Link> · Last reviewed <time dateTime={LAST_REVIEWED_ISO}>{LAST_REVIEWED}</time>
      </p>
      <p className="lead">
        Every calculator on {SITE_NAME} follows the same steps an employer&apos;s payroll uses, with the official{" "}
        {Y.label} rates. This page explains each step, the assumptions we make and where every figure comes from.
      </p>

      <h2>The steps, in order</h2>
      <ol>
        <li>
          <strong>Pension first.</strong> With salary sacrifice, your pension comes off your pay before Income Tax, National
          Insurance and student loan are worked out. With a net pay arrangement, it comes off before Income Tax only.
        </li>
        <li>
          <strong>Personal Allowance.</strong> The first {gbp(Y.personalAllowance, 0)} is tax-free. Above{" "}
          {gbp(Y.taperThreshold, 0)}, you lose £1 of allowance for every £2 of income, so it is gone at{" "}
          {gbp(Y.taperThreshold + Y.personalAllowance * 2, 0)}.
        </li>
        <li>
          <strong>Income Tax.</strong> The rest is taxed band by band: 20%, 40% and 45% in England, Wales and Northern
          Ireland, and the six Scottish rates (19% to 48%) for Scottish taxpayers.
        </li>
        <li>
          <strong>National Insurance.</strong> {pct(Y.ni.mainRate)} on pay between {gbp(Y.ni.primaryThreshold, 0)} and{" "}
          {gbp(Y.ni.upperEarningsLimit, 0)}, then {pct(Y.ni.upperRate)} above. The rates are the same across the UK.
        </li>
        <li>
          <strong>Student loans.</strong> 9% of pay above your plan&apos;s threshold (Plan 1 {gbp(Y.studentLoans.plan1.threshold, 0)}, Plan 2{" "}
          {gbp(Y.studentLoans.plan2.threshold, 0)}, Plan 4 {gbp(Y.studentLoans.plan4.threshold, 0)}, Plan 5{" "}
          {gbp(Y.studentLoans.plan5.threshold, 0)}), plus 6% above {gbp(Y.postgraduateLoan.threshold, 0)} for a Postgraduate Loan.
        </li>
        <li>
          <strong>Take-home pay</strong> is what is left: gross pay minus pension, Income Tax, National Insurance and student
          loan repayments.
        </li>
      </ol>
      <p>
        <strong>Example:</strong> on £40,000 in England, Income Tax is {gbp(ex.incomeTax)} and National Insurance is{" "}
        {gbp(ex.nationalInsurance)}, leaving {gbp(ex.takeHome)} a year, or {gbp(ex.takeHome / 12)} a month. See the full{" "}
        <Link href="/salary/40000-after-tax">£40,000 after tax breakdown</Link>.
      </p>

      <h2>Assumptions</h2>
      <ul>
        <li>A standard 1257L tax code (S1257L in Scotland), with pay spread evenly across the tax year.</li>
        <li>Hourly and weekly figures use a 37.5-hour week and 52 paid weeks, unless you change them.</li>
        <li>
          No benefits in kind, Marriage Allowance, self-employment income or emergency tax codes, unless a calculator asks
          for them.
        </li>
        <li>
          Sector calculators add their own rules: the NHS Pension and Teachers&apos; Pension contribution tiers, and the
          published NHS, teacher and doctor pay scales.
        </li>
      </ul>
      <p>
        Your payslip can differ by a few pounds, because payroll works out tax and National Insurance for each pay period
        and rounds as it goes.
      </p>

      <h2>Where the figures come from</h2>
      <p>We only use official published sources, never figures from other calculators.</p>
      <table>
        <thead>
          <tr>
            <th>Figures</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {SOURCES.map((s) => (
            <tr key={s.id}>
              <td>{s.topic}</td>
              <td>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.source}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>How we check our work</h2>
      <p>
        The calculations are covered by automated tests that compare results with worked examples from the sources above,
        such as the exact tax and National Insurance on a given salary. Written figures on our pages are tested too, so a
        paragraph that no longer matches the current rates is caught before an update goes live. Every change must pass
        all the tests first.
      </p>

      <h2>When we update</h2>
      <ul>
        <li>Every new tax year (6 April): all Income Tax, National Insurance, student loan and pension figures.</li>
        <li>After each Budget: any announced changes, once the official figures are published.</li>
        <li>When pay awards are confirmed: NHS, teacher and doctor pay scales.</li>
        <li>Each April: minimum wage rates.</li>
      </ul>
      <p>
        <strong>Last reviewed: {LAST_REVIEWED}.</strong>
      </p>

      <h2 id="corrections">Corrections</h2>
      <p>
        If you think a figure is wrong, please tell us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or through
        the <Link href="/contact">contact page</Link>. We check every report against the official source. If we got
        something wrong, we fix it, add a test so it can&apos;t happen again, and update the date on the page.
      </p>
      <h3 id="log">Corrections and updates log</h3>
      <p>
        {CHANGE_LOG.some((e) => e.type === "correction")
          ? "Every correction to a published figure is listed here, with the date it was fixed."
          : "No errors in published figures have been reported so far. Any correction will be listed here with the date and what changed."}
      </p>
      <ul className="change-log">
        {CHANGE_LOG.map((e) => (
          <li key={e.date + e.text}>
            <time dateTime={e.date}>{new Date(e.date + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>
            {" · "}
            <strong>{e.type === "correction" ? "Correction" : "Update"}:</strong> {e.text}
          </li>
        ))}
      </ul>
      <p>
        This site gives general information, not financial or tax advice. It is not affiliated with HMRC or the UK
        Government. Read more <Link href="/about">about {SITE_NAME}</Link> or about <Link href={AUTHOR.path}>{AUTHOR.name}</Link>, who
        writes and checks it.
      </p>
    </div>
  );
}
