import Link from "next/link";
import { Byline } from "@/components/Byline";
import { TOOLS, NOINDEX_TOOLS } from "@/lib/tools";
import Calculator from "@/components/Calculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { POPULAR_SALARIES, SITE_NAME, SITE_URL, salaryPath } from "@/lib/site";
import { TAX_YEAR, TAX_YEAR_2025, calculate, gbp } from "@/lib/tax";
import { hourlyPath } from "@/lib/hourly";
import { monthlyPath } from "@/lib/reverse";

const POPULAR_HOURLY = [12.71, 13, 14, 15, 16, 18, 20, 25, 30];
const POPULAR_MONTHLY = [1600, 1800, 2000, 2200, 2500, 3000, 3500, 4000];

const faqs = [
  {
    q: "How much tax will I pay on my salary in 2026/27?",
    a: "In England, Wales and Northern Ireland, the first £12,570 is tax-free (the Personal Allowance). The next £37,700 of taxable income is taxed at 20%, income up to £125,140 at 40%, and anything above that at 45%. Scotland has six bands from 19% to 48%. Enter your salary above to see your exact figures.",
  },
  {
    q: "How much National Insurance do employees pay?",
    a: "For 2026/27, employees pay 8% National Insurance on earnings between £12,570 and £50,270 a year, and 2% on earnings above £50,270. You do not pay employee NI once you reach State Pension age.",
  },
  {
    q: "What is the Personal Allowance taper?",
    a: "If your adjusted net income is over £100,000, you lose £1 of Personal Allowance for every £2 above that limit. It is fully removed at £125,140, which creates an effective 60% tax rate (62% including NI) between £100,000 and £125,140.",
  },
  {
    q: "Does salary sacrifice reduce my tax?",
    a: "Yes. With salary sacrifice, your pension contribution comes out of your pay before Income Tax, National Insurance and student loan are worked out, so you save on all three. A net pay arrangement saves Income Tax but not National Insurance.",
  },
  {
    q: "What is the difference between a salary calculator and a wage calculator?",
    a: "They do the same job. A wage calculator usually starts from an hourly or weekly wage, while a salary calculator starts from an annual salary. This calculator handles both: choose per hour, per day, per week, per month or per year next to the amount.",
  },
  {
    q: "How do I work out my monthly take-home pay?",
    a: "Enter your annual salary and the calculator shows your take-home pay per month after Income Tax, National Insurance, student loan and pension. If you know your monthly gross pay instead, choose 'per month' and enter that.",
  },
  {
    q: "How is a bonus taxed?",
    a: "A bonus is added to your pay and taxed in the same way, so it can push part of your income into a higher band. Open 'More options', add your annual bonus and the calculator includes it. In the month it is paid you may see more tax taken, which usually evens out over the year.",
  },
  {
    q: "Which student loan plan am I on?",
    a: "Plan 1 is for most English and Welsh students who started before September 2012 and Northern Irish students. Plan 2 covers English and Welsh students who started between September 2012 and July 2023. Plan 4 is for Scottish students and Plan 5 for English students who started from August 2023. You can check on the Student Loans Company website.",
  },
  {
    q: "How much will I take home compared with last year?",
    a: "Choose the tax year option in the calculator. It shows your take-home pay for 2025/26 or 2026/27 and how much more or less you take home per month than in the other year. In England, Wales and Northern Ireland the tax bands are frozen, so most changes come from student loan thresholds and, in Scotland, from changes to the Scottish bands.",
  },
  {
    q: "Is this a PAYE calculator?",
    a: "Yes. PAYE (Pay As You Earn) is the system employers use to take Income Tax and National Insurance from your wages before you are paid. This calculator works out the same PAYE deductions for 2026/27, plus student loan and pension, so you can see your take home pay per month, week or year.",
  },
  {
    q: "What tax code does the calculator use?",
    a: "It assumes the standard 1257L tax code (S1257L in Scotland), which gives the full £12,570 Personal Allowance. If your code is different, for example because of benefits in kind or underpaid tax, your actual pay will differ.",
  },
  {
    q: "Is this calculator accurate?",
    a: "It uses the official HMRC and Scottish Government rates for 2026/27 and is accurate for most employees on a standard 1257L tax code. Your payslip may differ slightly if you have a different tax code, benefits in kind, or irregular pay.",
  },
];

const TABLE_SALARIES = [20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 100000, 150000];

// "£12,571 – £15,537": a Scottish band shown as gross income, from taxable-income limits.
function band(pa: number, lower: number, upper: number) {
  return `${gbp(pa + lower + 1, 0)} – ${gbp(pa + upper, 0)}`;
}

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: `${SITE_NAME} – UK Salary Calculator`,
            url: SITE_URL,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          },
          { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
          faqSchema(faqs),
        ]}
      />
      <section className="hero">
        <div className="container">
          <h1>Salary Calculator UK {TAX_YEAR.label}</h1>
          <Byline />
          <p className="lead">
            Our free take home pay calculator and wage calculator shows your salary after tax, National Insurance,
            student loan and pension — monthly, weekly, daily and hourly. Updated for the tax year starting 6 April 2026,
            with last year&apos;s figures for comparison.
          </p>
          <ul className="trust">
            <li>HMRC 2026/27 rates</li>
            <li>Scottish tax bands</li>
            <li>Student loans &amp; pensions</li>
            <li>Free, no sign-up</li>
          </ul>
        </div>
      </section>

      <Calculator />

      <h2>Popular salaries after tax</h2>
      <ul className="pill-grid">
        {POPULAR_SALARIES.map((s) => (
          <li key={s}>
            <Link href={salaryPath(s)}>{gbp(s, 0)}</Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/salary">See every salary from £10,000 to £500,000 →</Link>
      </p>
      <p>
        <Link href="/research/income-tax-threshold-freeze-2026">New research: if your pay has only kept up with prices since 2021, the tax freeze may have made you a 40% taxpayer →</Link>
      </p>
      <p>
        <Link href="/data/uk-take-home-pay-2026-27">Take-home pay data 2026/27: charts and a free CSV of every salary from £15k to £150k →</Link>
      </p>

      <h2>Popular hourly rates after tax</h2>
      <ul className="pill-grid">
        {POPULAR_HOURLY.map((h) => (
          <li key={h}>
            <Link href={hourlyPath(h)}>{gbp(h, Number.isInteger(h) ? 0 : 2)} an hour</Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/hourly">See every hourly rate →</Link> · <Link href="/hourly-to-salary">Hourly wage calculator →</Link>
      </p>

      <h2>What salary gives this take-home pay a month?</h2>
      <ul className="pill-grid">
        {POPULAR_MONTHLY.map((m) => (
          <li key={m}>
            <Link href={monthlyPath(m)}>{gbp(m, 0)} a month</Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/take-home">See every monthly amount →</Link>
      </p>

      <h2>More UK pay calculators</h2>
      <ul className="guide-list">
        {TOOLS.filter((t) => t.href !== "/" && !NOINDEX_TOOLS.includes(t.href)).map((c) => (
          <li key={c.href} className="card">
            <Link href={c.href}>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="prose">
        <h2>How to use this take home pay calculator (UK)</h2>
        <ol>
          <li>
            Enter your salary or wage and choose whether it is per year, month, week, day or hour. It works as a salary
            calculator and a wage calculator.
          </li>
          <li>Choose where you live. Scotland has its own Income Tax rates.</li>
          <li>Add your student loan plan and pension contribution if you have them.</li>
          <li>
            Use <strong>More options</strong> for a bonus, your weekly hours, a Postgraduate Loan or if you are over State
            Pension age.
          </li>
          <li>
            Pick the tax year to see this year&apos;s take-home pay, or last year&apos;s, and how much it has changed.
          </li>
        </ol>
        <p>
          Weighing up a new job? <Link href="/compare-salaries">Compare two salaries side by side</Link>. Know what you
          want to take home? Work backwards with the <Link href="/net-to-gross-salary-calculator">net to gross calculator</Link>.
        </p>
        <p>
          Just want the monthly figure? The <Link href="/monthly-salary-calculator">monthly salary calculator</Link> shows
          your payslip month by month. Thinking about an electric car through work? Try the{" "}
          <Link href="/electric-car-salary-sacrifice-calculator">EV salary sacrifice calculator</Link>.
        </p>

        <h2>Take-home pay at common salaries ({TAX_YEAR.label})</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Salary</th>
                <th>Take-home a year</th>
                <th>A month</th>
                <th>A week</th>
                <th>A month in Scotland</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_SALARIES.map((s) => {
                const r = calculate({ gross: s });
                const sc = calculate({ gross: s, region: "scotland" });
                return (
                  <tr key={s}>
                    <td>
                      <Link href={salaryPath(s)}>{gbp(s, 0)}</Link>
                    </td>
                    <td>{gbp(r.takeHome)}</td>
                    <td>{gbp(r.takeHome / 12)}</td>
                    <td>{gbp(r.takeHome / 52)}</td>
                    <td>{gbp(sc.takeHome / 12)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">No pension or student loan, standard tax code.</p>

        <h2>UK tax rates and thresholds {TAX_YEAR.label}</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>What</th>
                <th>{TAX_YEAR.label}</th>
                <th>{TAX_YEAR_2025.label}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Personal Allowance</td>
                <td>£12,570</td>
                <td>£12,570</td>
              </tr>
              <tr>
                <td>Basic rate 20% (England, Wales, NI)</td>
                <td>£12,571 – £50,270</td>
                <td>£12,571 – £50,270</td>
              </tr>
              <tr>
                <td>Higher rate 40%</td>
                <td>£50,271 – £125,140</td>
                <td>£50,271 – £125,140</td>
              </tr>
              <tr>
                <td>Additional rate 45%</td>
                <td>Over £125,140</td>
                <td>Over £125,140</td>
              </tr>
              <tr>
                <td>Scottish starter rate 19%</td>
                <td>{band(12570, 0, TAX_YEAR.bands.scotland[0].upTo)}</td>
                <td>{band(12570, 0, TAX_YEAR_2025.bands.scotland[0].upTo)}</td>
              </tr>
              <tr>
                <td>Scottish basic rate 20%</td>
                <td>{band(12570, TAX_YEAR.bands.scotland[0].upTo, TAX_YEAR.bands.scotland[1].upTo)}</td>
                <td>{band(12570, TAX_YEAR_2025.bands.scotland[0].upTo, TAX_YEAR_2025.bands.scotland[1].upTo)}</td>
              </tr>
              <tr>
                <td>Employee National Insurance</td>
                <td>8% (£12,570 – £50,270), 2% above</td>
                <td>8% (£12,570 – £50,270), 2% above</td>
              </tr>
              <tr>
                <td>Plan 1 student loan threshold</td>
                <td>{gbp(TAX_YEAR.studentLoans.plan1.threshold, 0)}</td>
                <td>{gbp(TAX_YEAR_2025.studentLoans.plan1.threshold, 0)}</td>
              </tr>
              <tr>
                <td>Plan 2 student loan threshold</td>
                <td>{gbp(TAX_YEAR.studentLoans.plan2.threshold, 0)}</td>
                <td>{gbp(TAX_YEAR_2025.studentLoans.plan2.threshold, 0)}</td>
              </tr>
              <tr>
                <td>Plan 4 student loan threshold</td>
                <td>{gbp(TAX_YEAR.studentLoans.plan4.threshold, 0)}</td>
                <td>{gbp(TAX_YEAR_2025.studentLoans.plan4.threshold, 0)}</td>
              </tr>
              <tr>
                <td>Plan 5 student loan threshold</td>
                <td>{gbp(TAX_YEAR.studentLoans.plan5.threshold, 0)}</td>
                <td>Repayments start April 2026</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>What is take home pay? Gross pay vs net pay</h2>
        <p>
          <strong>Gross pay</strong> is your salary before anything is taken off — the figure in your contract or job
          advert. <strong>Net pay</strong> (take-home pay) is what reaches your bank account after Income Tax, National
          Insurance, pension and student loan. On a £35,000 salary, gross pay is {gbp(35000 / 12)} a month but net pay is{" "}
          {gbp(calculate({ gross: 35000 }).takeHome / 12)} a month. Job adverts, pay rises and mortgage applications use
          gross pay; your budget should use net pay.
        </p>
        <p>
          This is also a <strong>PAYE calculator</strong>: employers take Income Tax and National Insurance from your pay
          through Pay As You Earn (PAYE) before you are paid, and the figures above show exactly what PAYE deducts on a
          standard 1257L tax code. On the minimum wage? See your pay after tax with the{" "}
          <Link href="/minimum-wage-calculator">minimum wage calculator</Link>. Buying a home? The{" "}
          <Link href="/mortgage-calculator">mortgage calculator</Link> shows how much you could borrow on your salary.
        </p>

        <h2>How your take-home pay is calculated</h2>
        <p>
          Your take-home pay (also called net pay) is what is left of your gross salary after these deductions:
        </p>
        <ol>
          <li>
            <strong>Pension contributions</strong> — taken first if you use salary sacrifice or a net pay arrangement.
          </li>
          <li>
            <strong>Income Tax</strong> — charged on income above your Personal Allowance of {gbp(TAX_YEAR.personalAllowance, 0)}.
            See the <Link href="/guides/uk-tax-bands-2026-27">2026/27 tax bands</Link>.
          </li>
          <li>
            <strong>National Insurance</strong> — 8% between £12,570 and £50,270, then 2%. Read our{" "}
            <Link href="/guides/national-insurance-explained">National Insurance guide</Link>.
          </li>
          <li>
            <strong>Student loan repayments</strong> — 9% of income over your plan&apos;s threshold, plus 6% for a Postgraduate
            Loan. See <Link href="/guides/student-loan-repayments">student loan thresholds</Link>.
          </li>
        </ol>
        <p>
          Living in Scotland? Scottish taxpayers pay different Income Tax rates — use the{" "}
          <Link href="/scotland-salary-calculator">Scotland salary calculator</Link>. Paid by the hour? Try the{" "}
          <Link href="/hourly-to-salary">hourly to salary converter</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
