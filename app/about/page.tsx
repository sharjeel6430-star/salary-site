import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/site";
import { TAX_YEAR } from "@/lib/tax";
import { SOURCES, LAST_REVIEWED } from "@/lib/sources";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/about"),
  description: `About ${SITE_NAME}: who runs the site, the official sources behind every figure, how often the calculators are updated and how to report a mistake.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="prose">
      <h1>About {SITE_NAME}</h1>
      <p className="lead">
        {SITE_NAME} is a free, independent website that helps people in the UK understand their pay: what they take
        home after tax, what a job offer is really worth, and how changes to tax rules affect them.
      </p>

      <h2>Who runs the site</h2>
      <p>
        {SITE_NAME} is run by <strong>Sharjeel</strong>, an independent publisher who builds and maintains every
        calculator and guide on the site. I started it because most salary calculators either hide how they get their
        numbers or are buried under ads, and I wanted a set of clear tools that show their working.
      </p>
      <p>
        The site is <strong>not affiliated with HMRC, the UK Government, the NHS or any employer</strong>. It is funded
        by advertising, which keeps every calculator free to use. Advertisers have no say in what we publish.
      </p>

      <h2>Where our figures come from</h2>
      <p>
        Every rate and threshold comes from an official published source. We don&apos;t use figures from other
        calculators. The current figures are for the <strong>{TAX_YEAR.label} tax year</strong> (6 April 2026 to 5 April
        2027).
      </p>
      <table>
        <thead>
          <tr>
            <th>Figures</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {SOURCES.map((s) => (
            <tr key={s.topic}>
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

      <h2>How we check the calculators</h2>
      <p>
        The calculations are covered by automated tests that compare results against worked examples taken from the
        sources above, such as the exact tax and National Insurance on a given salary. Every change to the site must pass
        those tests before it goes live.
      </p>

      <h2>How often we update</h2>
      <ul>
        <li>
          <strong>Every new tax year (6 April):</strong> all Income Tax, National Insurance, student loan and dividend
          figures are updated.
        </li>
        <li>
          <strong>After each Budget or Spending Review:</strong> we update any announced changes as soon as the official
          figures are published.
        </li>
        <li>
          <strong>When pay awards are confirmed:</strong> NHS Agenda for Change and teacher pay scales are updated once
          the award is officially confirmed.
        </li>
        <li>
          <strong>Minimum wage rates:</strong> updated each April when the new rates take effect.
        </li>
      </ul>
      <p>
        <strong>Last reviewed: {LAST_REVIEWED}.</strong>
      </p>

      <h2>What the calculators don&apos;t cover</h2>
      <p>
        Results assume a standard 1257L (or S1257L) tax code and pay spread evenly across the year. They don&apos;t
        include benefits in kind, the High Income Child Benefit Charge, Marriage Allowance, self-employment income or
        emergency tax codes. Your payslip may differ slightly because employers round figures each pay period.
        Everything on this site is for guidance only and is not financial or tax advice.
      </p>

      <h2>Found a mistake?</h2>
      <p>
        If something looks wrong, please tell us. We check every report and correct confirmed errors quickly. Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use the <Link href="/contact">contact page</Link>.
      </p>
    </div>
  );
}
