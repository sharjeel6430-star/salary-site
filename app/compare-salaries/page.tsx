import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import CompareCalculator from "@/components/CompareCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { calculate, gbp, pct, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/compare-salaries"),
  description: `Compare two salaries or job offers side by side after tax, NI, student loan and pension. See what a pay rise really adds to your monthly pay in ${TAX_YEAR.label}.`,
  alternates: { canonical: "/compare-salaries" },
};

const RISES = [
  [25000, 28000],
  [28000, 32000],
  [30000, 35000],
  [35000, 40000],
  [40000, 45000],
  [45000, 50000],
  [50000, 55000],
  [55000, 60000],
  [60000, 70000],
  [90000, 100000],
  [100000, 110000],
  [120000, 130000],
];

const SCOT = [25000, 30000, 35000, 40000, 50000, 60000, 80000, 100000];

export default function ComparePage() {
  const r30 = calculate({ gross: 30000 });
  const r35 = calculate({ gross: 35000 });
  const rise5k = r35.takeHome - r30.takeHome;
  const r100 = calculate({ gross: 100000 });
  const r110 = calculate({ gross: 110000 });
  const rise100 = r110.takeHome - r100.takeHome;

  const faqs = [
    {
      q: "How do I compare two job offers in the UK?",
      a: "Enter both salaries, any bonus and the pension contribution for each job. The calculator works out tax, National Insurance and student loan for each one and shows the difference in your monthly take-home pay. Remember to also compare employer pension, holidays, benefits and travel costs.",
    },
    {
      q: "How much more will I take home from a pay rise?",
      a: `It depends on your tax band. For example, going from £30,000 to £35,000 adds ${gbp(rise5k)} a year, about ${gbp(rise5k / 12)} a month, because 20% Income Tax and 8% National Insurance come off the extra £5,000.`,
    },
    {
      q: "Why do I keep less of a pay rise as I earn more?",
      a: "Above £50,270 you pay 40% Income Tax (42% or more in Scotland), so you keep less of each extra pound. Student loan repayments (9% above the threshold) also reduce what you keep.",
    },
    {
      q: "What is the 60% tax trap?",
      a: `Between £100,000 and £125,140 your Personal Allowance is reduced by £1 for every £2 you earn, which creates an effective tax rate of 60% (plus 2% NI). A rise from £100,000 to £110,000 adds only ${gbp(rise100)} to your take-home pay.`,
    },
    {
      q: "Is a higher salary in Scotland worth less?",
      a: "Scottish taxpayers pay slightly less tax on lower salaries but more above about £33,500, because of the Intermediate (21%), Higher (42%) and Advanced (45%) rates. Use the job location option to compare a job in Scotland with one in England.",
    },
    {
      q: "Should I compare salaries before or after pension?",
      a: "After. A job with a lower salary but a higher employer pension contribution can be worth more overall. This calculator shows your take-home pay after your own pension contribution; add the employer contribution separately when comparing total reward.",
    },
    {
      q: "Can I compare this year with last year?",
      a: "Yes. Choose the 2025/26 tax year to see what the same salaries would have paid last year. In Scotland the starter and basic rate bands were raised for 2026/27, and student loan thresholds went up.",
    },
  ];

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Compare Salaries: Pay Rise and Job Offer Calculator</h1>
      <Byline />
      <p className="lead">
        Compare two salaries side by side and see what the difference really means for your take-home pay after tax,
        National Insurance, student loan and pension in {TAX_YEAR.label}.
      </p>
      <CompareCalculator />
      <div className="prose">
        <h2>How much of a pay rise do you keep?</h2>
        <p>
          A pay rise is always smaller once tax and National Insurance come off. This table shows the real difference for
          common pay rises in England, Wales and Northern Ireland, with no pension or student loan.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Extra take-home a year</th>
                <th>Extra a month</th>
                <th>You keep</th>
              </tr>
            </thead>
            <tbody>
              {RISES.map(([from, to]) => {
                const extra = calculate({ gross: to }).takeHome - calculate({ gross: from }).takeHome;
                return (
                  <tr key={`${from}-${to}`}>
                    <td>{gbp(from, 0)}</td>
                    <td>{gbp(to, 0)}</td>
                    <td>{gbp(extra)}</td>
                    <td>{gbp(extra / 12)}</td>
                    <td>{pct(extra / (to - from), 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2>Same salary in Scotland vs England</h2>
        <p>Scottish Income Tax rates are different, so the same salary can give a different take-home pay.</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Salary</th>
                <th>England, Wales, NI (a month)</th>
                <th>Scotland (a month)</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              {SCOT.map((s) => {
                const e = calculate({ gross: s }).takeHome / 12;
                const sc = calculate({ gross: s, region: "scotland" }).takeHome / 12;
                const d = sc - e;
                return (
                  <tr key={s}>
                    <td>{gbp(s, 0)}</td>
                    <td>{gbp(e)}</td>
                    <td>{gbp(sc)}</td>
                    <td>
                      {d >= 0 ? "+" : "−"}
                      {gbp(Math.abs(d))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2>What else to compare in a job offer</h2>
        <ul>
          <li>
            <strong>Employer pension:</strong> 3% (the legal minimum) and 10% on a £40,000 salary is a £2,800 a year
            difference.
          </li>
          <li>
            <strong>Holiday:</strong> 25 days plus bank holidays is common; some employers offer more. Check the{" "}
            <Link href="/pro-rata-holiday-calculator">holiday calculator</Link> for part-time roles.
          </li>
          <li>
            <strong>Hours and commute:</strong> convert both offers to an hourly rate with the{" "}
            <Link href="/hourly-to-salary">hourly to salary calculator</Link>.
          </li>
          <li>
            <strong>Salary sacrifice benefits:</strong> see how much a pension or EV scheme saves with the{" "}
            <Link href="/salary-sacrifice-calculator">salary sacrifice calculator</Link>.
          </li>
        </ul>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
