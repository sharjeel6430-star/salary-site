import Link from "next/link";
import { TAX_YEAR, TAX_YEAR_2025, calculate, gbp } from "./tax";

export interface Guide {
  slug: string;
  title: string; // title tag and card heading
  description: string; // meta description and card text (160 characters or less)
  h1?: string; // page heading, if different from the title
  lead?: string; // first paragraph, if different from the description
  body?: () => React.ReactNode; // hand-written JSX
  markdown?: string; // file in content/guides rendered as the body (after any JSX body)
}

const ex40 = calculate({ gross: 40000 });

export const GUIDES: Guide[] = [
  {
    slug: "uk-tax-bands-2026-27",
    title: `UK Tax Brackets ${TAX_YEAR.label}: Income Tax Bands and Rates`,
    description: `UK tax brackets for ${TAX_YEAR.label} and 2025/26: Income Tax bands and rates, the £12,570 Personal Allowance and its taper, for all four UK nations.`,
    markdown: "uk-tax-bands-additions.md",
    body: () => (
      <>
        <p>
          The {TAX_YEAR.label} tax year runs from 6 April 2026 to 5 April 2027. The Personal Allowance stays at £12,570,
          and the thresholds are frozen until April 2031.
        </p>
        <h2>England, Wales and Northern Ireland</h2>
        <table>
          <thead>
            <tr><th>Band</th><th>Taxable income</th><th>Rate</th></tr>
          </thead>
          <tbody>
            <tr><td>Personal Allowance</td><td>Up to £12,570</td><td>0%</td></tr>
            <tr><td>Basic rate</td><td>£12,571 – £50,270</td><td>20%</td></tr>
            <tr><td>Higher rate</td><td>£50,271 – £125,140</td><td>40%</td></tr>
            <tr><td>Additional rate</td><td>Over £125,140</td><td>45%</td></tr>
          </tbody>
        </table>
        <h2>Scotland</h2>
        <p>
          Scotland sets its own rates: 19% starter, 20% basic, 21% intermediate, 42% higher, 45% advanced and 48% top. See
          the full table on our <Link href="/scotland-salary-calculator">Scotland salary calculator</Link>.
        </p>
        <h3>Scottish tax brackets {TAX_YEAR.label} and 2025/26</h3>
        <table>
          <thead>
            <tr><th>Band</th><th>Rate</th><th>{TAX_YEAR.label} (gross income)</th><th>2025/26 (gross income)</th></tr>
          </thead>
          <tbody>
            {TAX_YEAR.bands.scotland.map((b, i) => {
              const row = (bands: readonly { upTo: number }[]) => {
                const lower = i === 0 ? 0 : bands[i - 1].upTo;
                const upper = bands[i].upTo;
                const pa = TAX_YEAR.personalAllowance;
                // The Personal Allowance is fully withdrawn at £125,140, so the top bands are shown as gross income.
                if (upper === Infinity) return "Over £125,140";
                if (upper >= 125140) return `${gbp(pa + lower + 1, 0)} – £125,140`;
                return `${gbp(pa + lower + 1, 0)} – ${gbp(pa + upper, 0)}`;
              };
              return (
                <tr key={b.name}>
                  <td>{b.name}</td>
                  <td>{Math.round(b.rate * 100)}%</td>
                  <td>{row(TAX_YEAR.bands.scotland)}</td>
                  <td>{row(TAX_YEAR_2025.bands.scotland)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted">Assumes the standard £12,570 Personal Allowance, which is reduced above £100,000.</p>
        <h2>UK tax brackets 2025/26</h2>
        <p>
          In England, Wales and Northern Ireland the 2025/26 tax brackets were exactly the same as in {TAX_YEAR.label}:
          0% up to £12,570, 20% to £50,270, 40% to £125,140 and 45% above that. In Scotland the starter and basic rate
          bands were narrower in 2025/26, as the table above shows.
        </p>
        <h2>Personal Allowance {TAX_YEAR.label}</h2>
        <p>
          The Personal Allowance is the amount of income you can earn each tax year before paying any Income Tax. It is{" "}
          <strong>£12,570</strong> in {TAX_YEAR.label}, the same as in 2025/26, and it is frozen until April 2031. It applies
          across the UK, including Scotland.
        </p>
        <ul>
          <li>
            <strong>Over £100,000:</strong> you lose £1 of allowance for every £2 of adjusted net income above £100,000, so
            it is gone completely at £125,140.
          </li>
          <li>
            <strong>Marriage Allowance:</strong> if you earn less than £12,570, you can transfer £1,260 of your allowance to
            a spouse or civil partner who is a basic-rate taxpayer, saving them up to £252 a year.
          </li>
          <li>
            <strong>Your tax code</strong> tells your employer how much allowance to give you. The standard code is 1257L
            (S1257L in Scotland, C1257L in Wales).
          </li>
        </ul>
        <h2>The £100,000 Personal Allowance trap</h2>
        <p>
          Your Personal Allowance goes down by £1 for every £2 of adjusted net income over £100,000, and disappears at
          £125,140. In that range you effectively pay 60% Income Tax plus 2% NI. Paying more into a pension through salary
          sacrifice is a common way to bring your income back under £100,000.
        </p>
        <h2>Worked example</h2>
        <p>
          On a £40,000 salary: £12,570 is tax-free, and the remaining £27,430 is taxed at 20%, giving{" "}
          {gbp(ex40.incomeTax)} Income Tax. Add {gbp(ex40.nationalInsurance)} National Insurance and the take-home pay is{" "}
          {gbp(ex40.takeHome)}. <Link href="/salary/40000-after-tax">See the full £40,000 breakdown</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "national-insurance-explained",
    title: `National Insurance Explained ${TAX_YEAR.label}`,
    description: `Employee and employer National Insurance rates and thresholds for ${TAX_YEAR.label}, with worked examples, what NI pays for, and how to pay less legally.`,
    markdown: "national-insurance-explained.md",
  },
  {
    slug: "student-loan-repayments",
    title: `Student Loan Repayment Thresholds ${TAX_YEAR.label}`,
    description: `How much you repay on Plan 1, 2, 4, 5 and Postgraduate Loans in ${TAX_YEAR.label}, with a repayment table by salary and when loans are written off.`,
    lead: `How much you repay on Plan 1, 2, 4, 5 and Postgraduate Loans in ${TAX_YEAR.label}, with a repayment table by salary, when loans are written off, and whether overpaying is worth it.`,
    markdown: "student-loan-repayments.md",
  },
  {
    slug: "salary-sacrifice-pension",
    title: "Salary Sacrifice vs Net Pay vs Relief at Source",
    h1: "Salary Sacrifice vs Net Pay vs Relief at Source: Which Pension Saves More?",
    description: `How the three ways of paying into a workplace pension affect your tax, NI, student loan and take-home pay, with ${TAX_YEAR.label} examples.`,
    lead: `How the three ways of paying into a workplace pension affect your Income Tax, National Insurance, student loan and take-home pay, with ${TAX_YEAR.label} examples at £40,000 and £60,000.`,
    markdown: "salary-sacrifice-pension.md",
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
