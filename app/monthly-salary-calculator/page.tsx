import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import MonthlyCalculator from "@/components/MonthlyCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { calculate, gbp, TAX_YEAR } from "@/lib/tax";
import { SALARY_PAGES, SITE_NAME, SITE_URL, salaryPath } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/monthly-salary-calculator"),
  description: `Work out your monthly take-home pay after Income Tax, National Insurance, pension and student loan for ${TAX_YEAR.label}, from an annual or monthly salary.`,
  alternates: { canonical: "/monthly-salary-calculator" },
};

const faqs = [
  {
    q: "How do I work out my monthly salary after tax?",
    a: "Work out your yearly take-home pay — gross salary minus Income Tax, National Insurance, pension and any student loan — then divide by 12. The calculator above does this for you and shows each deduction per month.",
  },
  {
    q: "How much is £30,000 a year per month after tax?",
    a: `A £30,000 salary is ${gbp(30000 / 12)} a month before tax. After Income Tax and National Insurance in ${TAX_YEAR.label} you take home about ${gbp(calculate({ gross: 30000 }).takeHome / 12)} a month in England, Wales and Northern Ireland, with no pension or student loan.`,
  },
  {
    q: "Why is my monthly pay different from the calculator?",
    a: "Your payslip can differ because of your tax code, pension scheme type, benefits in kind, overtime or bonuses, or if you started part-way through the tax year. Tax is worked out cumulatively through the year, so one month can be higher or lower and it usually evens out.",
  },
  {
    q: "Is monthly pay the same as dividing my salary by 12?",
    a: "Your gross monthly pay is your annual salary divided by 12. If you are paid every four weeks instead, you get 13 pay days a year, so each payment is your annual salary divided by 13.",
  },
  {
    q: "How much tax-free pay do I get each month?",
    a: `With the standard 1257L tax code you can earn ${gbp(TAX_YEAR.personalAllowance / 12)} a month (${gbp(TAX_YEAR.personalAllowance, 0)} a year) before paying Income Tax. National Insurance also starts at ${gbp(TAX_YEAR.ni.primaryThreshold / 12)} a month.`,
  },
  {
    q: "Does the calculator work for Scotland?",
    a: "Yes. Choose Scotland and the calculator uses the six Scottish Income Tax bands. National Insurance and student loans are the same across the UK.",
  },
  {
    q: "How do I find the salary I need for a monthly take-home amount?",
    a: "Use the net to gross salary calculator, or see our monthly take-home tables, which show the salary needed for take-home pay from £1,500 to £10,000 a month.",
  },
];

const TABLE = [15000, 18000, 20000, 22000, 25000, 28000, 30000, 32000, 35000, 40000, 45000, 50000, 55000, 60000, 70000, 80000, 100000];

export default function MonthlyPage() {
  const ex = calculate({ gross: 35000 });
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Monthly Salary Calculator UK",
            url: `${SITE_URL}/monthly-salary-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />
      <h1>Monthly Salary Calculator UK {TAX_YEAR.label}</h1>
      <Byline />
      <p className="lead">
        See exactly what lands in your bank account each month — your monthly take-home pay after Income Tax, National
        Insurance, pension and student loan.
      </p>
      <MonthlyCalculator />
      <div className="prose">
        <h2>Annual salary to monthly take-home pay ({TAX_YEAR.label})</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Annual salary</th>
                <th>Gross a month</th>
                <th>Take-home a month</th>
                <th>Take-home a month (Scotland)</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map((s) => {
                const r = calculate({ gross: s });
                const sc = calculate({ gross: s, region: "scotland" });
                return (
                  <tr key={s}>
                    <td>{SALARY_PAGES.includes(s) ? <Link href={salaryPath(s)}>{gbp(s, 0)}</Link> : gbp(s, 0)}</td>
                    <td>{gbp(s / 12)}</td>
                    <td>{gbp(r.takeHome / 12)}</td>
                    <td>{gbp(sc.takeHome / 12)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">No pension or student loan, standard 1257L tax code.</p>

        <h2>How your monthly pay is worked out</h2>
        <p>
          Take a £35,000 salary. Your gross pay is {gbp(35000 / 12)} a month. From that, your employer deducts:
        </p>
        <ul>
          <li>
            <strong>Income Tax</strong>: {gbp(ex.incomeTax / 12)} a month — 20% on pay above the {gbp(TAX_YEAR.personalAllowance / 12)}{" "}
            monthly Personal Allowance.
          </li>
          <li>
            <strong>National Insurance</strong>: {gbp(ex.nationalInsurance / 12)} a month — 8% on pay above{" "}
            {gbp(TAX_YEAR.ni.primaryThreshold / 12)} a month.
          </li>
        </ul>
        <p>
          That leaves <strong>{gbp(ex.takeHome / 12)} a month</strong> take-home pay. A pension contribution or student
          loan would reduce it further — add them in the calculator.
        </p>

        <h2>Why your monthly pay can change</h2>
        <ul>
          <li>
            <strong>Tax code changes</strong> — an emergency code or a code that collects underpaid tax changes how much
            tax-free pay you get each month.
          </li>
          <li>
            <strong>Bonuses and overtime</strong> — these are added to that month&apos;s pay, so more tax may be taken that
            month.
          </li>
          <li>
            <strong>Four-weekly pay</strong> — with 13 pay days a year, each payment is smaller than a calendar-month salary.
          </li>
          <li>
            <strong>Starting or leaving a job</strong> — your first and last payslips can include part-month pay.
          </li>
        </ul>
        <p>
          Want the full yearly breakdown? Use the <Link href="/">take home pay calculator</Link>. Know the monthly amount
          you need? See the <Link href="/take-home">monthly take-home to salary tables</Link> or the{" "}
          <Link href="/net-to-gross-salary-calculator">net to gross calculator</Link>. Paid by the hour? Use the{" "}
          <Link href="/hourly-to-salary">salary to hourly rate calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
