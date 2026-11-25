import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import MortgageCalculator from "@/components/MortgageCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { monthlyRepayment, repaymentPlan } from "@/lib/mortgage";
import { calculate, gbp, pct } from "@/lib/tax";
import { SITE_NAME, SITE_URL, salaryPath } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/mortgage-calculator"),
  description:
    "UK mortgage calculator: monthly repayments, total interest and loan to value, or how much you can borrow on your salary at 4 to 5.5 times income.",
  alternates: { canonical: "/mortgage-calculator" },
};

const ex = repaymentPlan({ loan: 200000, ratePct: 4.5, years: 25 });
const crossover = ex.schedule.find((r) => r.capital > r.interest)?.year ?? 0;

const faqs = [
  {
    q: "How much would a £200,000 mortgage cost a month?",
    a: `Over 25 years at 4.5% interest, a £200,000 repayment mortgage costs ${gbp(ex.monthly)} a month. You would pay ${gbp(ex.totalInterest, 0)} in interest over the term. An interest-only mortgage would cost ${gbp(ex.interestOnlyMonthly)} a month, but you would still owe the £200,000 at the end.`,
  },
  {
    q: "How much can I borrow for a mortgage?",
    a: "Most UK lenders offer around 4 to 4.5 times your annual income before tax, or your joint income if you buy with someone else. Some lenders go up to 5 or 5.5 times for higher earners or certain professions. The final amount depends on an affordability check of your spending, debts and credit history.",
  },
  {
    q: "How much can I borrow on a £35,000 salary?",
    a: "At 4.5 times income, around £157,500, or £175,000 at 5 times. With a £20,000 deposit that would let you buy a home worth roughly £177,500 to £195,000.",
  },
  {
    q: "What is a repayment mortgage?",
    a: "With a repayment (capital and interest) mortgage, each monthly payment covers the interest and repays part of the loan, so you own your home outright at the end of the term. In the early years most of each payment is interest.",
  },
  {
    q: "What is loan to value (LTV)?",
    a: "LTV is the mortgage as a percentage of the property price. A £270,000 mortgage on a £300,000 home is 90% LTV (a 10% deposit). Lenders usually offer lower interest rates as the LTV falls, often at 60%, 75%, 85% and 90%.",
  },
  {
    q: "Does a longer mortgage term save money?",
    a: "A longer term lowers the monthly payment but increases the total interest. For example, £200,000 at 4.5% costs £1,111.66 a month over 25 years but about £1,013 over 30 years — and roughly £31,000 more in interest overall.",
  },
  {
    q: "What costs does the calculator not include?",
    a: "It shows the mortgage repayment only. Budget separately for stamp duty (Land and Buildings Transaction Tax in Scotland, Land Transaction Tax in Wales), arrangement fees, valuation and survey, solicitor's fees, buildings insurance and moving costs.",
  },
  {
    q: "Is the interest rate fixed for the whole term?",
    a: "Usually not. Most UK mortgages are fixed for 2 or 5 years and then move to the lender's standard variable rate unless you remortgage. The calculator assumes one rate for the whole term, so use a realistic long-term rate.",
  },
];

const LOANS = [100000, 150000, 200000, 250000, 300000, 400000];
const RATES = [3.5, 4.5, 5.5];
const SALARIES = [25000, 30000, 35000, 40000, 45000, 50000, 60000, 75000, 100000];

export default function MortgagePage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Mortgage Calculator UK",
            url: `${SITE_URL}/mortgage-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />
      <h1>Mortgage Calculator UK</h1>
      <Byline />
      <p className="lead">
        Work out your monthly mortgage repayments and total interest, or see how much you could borrow on your salary — and
        what share of your take-home pay the repayments would take.
      </p>
      <MortgageCalculator />

      <div className="prose">
        <h2>How mortgage repayments are worked out</h2>
        <p>
          A repayment mortgage is paid off in equal monthly instalments. Each payment covers that month&apos;s interest and
          repays a little of the loan. Take a £200,000 mortgage over 25 years at 4.5%: the payment is {gbp(ex.monthly)} a
          month. In the first year {gbp(ex.schedule[0].interest, 0)} goes on interest and only{" "}
          {gbp(ex.schedule[0].capital, 0)} reduces the loan. From year {crossover}, more of each payment repays the loan than goes on interest.
        </p>

        <h2>Monthly mortgage repayments table</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Mortgage</th>
                {RATES.map((r) => (
                  <th key={r}>At {r}%</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOANS.map((l) => (
                <tr key={l}>
                  <td>{gbp(l, 0)}</td>
                  {RATES.map((r) => (
                    <td key={r}>{gbp(monthlyRepayment(l, r, 25))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">Repayment mortgage over 25 years.</p>

        <h2>How much can I borrow on my salary?</h2>
        <p>
          Lenders start with an income multiple, then check what you can afford. Here is what common multiples give on a
          single salary, and what the repayment would be at 4.5% over 25 years.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Salary</th>
                <th>4.5 × income</th>
                <th>5 × income</th>
                <th>Monthly repayment (4.5×)</th>
                <th>Share of take-home</th>
              </tr>
            </thead>
            <tbody>
              {SALARIES.map((s) => {
                const loan = s * 4.5;
                const m = monthlyRepayment(loan, 4.5, 25);
                const th = calculate({ gross: s }).takeHome / 12;
                return (
                  <tr key={s}>
                    <td>
                      <Link href={salaryPath(s)}>{gbp(s, 0)}</Link>
                    </td>
                    <td>{gbp(loan, 0)}</td>
                    <td>{gbp(s * 5, 0)}</td>
                    <td>{gbp(m, 0)}</td>
                    <td>{pct(m / th, 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p>
          Buying with a partner? Lenders add your incomes together, so two £35,000 salaries at 4.5 times could support a
          mortgage of about £315,000. Click a salary to see its full take-home pay.
        </p>

        <h2>What lenders check besides your salary</h2>
        <ul>
          <li>
            <strong>Spending and debts</strong> — car finance, credit cards, student loan repayments and childcare all
            reduce what you can borrow.
          </li>
          <li>
            <strong>A stress test</strong> — whether you could still pay if interest rates rose.
          </li>
          <li>
            <strong>Your deposit</strong> — a bigger deposit means a lower LTV and usually a better rate.
          </li>
          <li>
            <strong>Your credit record and job</strong> — self-employed applicants usually need two or more years of
            accounts.
          </li>
        </ul>
        <p>
          Salary sacrifice lowers your gross salary, which some lenders use for affordability. If you have an{" "}
          <Link href="/electric-car-salary-sacrifice-calculator">EV salary sacrifice</Link> or a large{" "}
          <Link href="/salary-sacrifice-calculator">pension sacrifice</Link>, ask how the lender treats it.
        </p>
        <p>
          Budget for the tax on the purchase too: the <Link href="/stamp-duty-calculator">stamp duty calculator</Link> covers
          England, Northern Ireland, Scotland and Wales, including first-time buyer relief.
        </p>

        <h2>Repayment vs interest-only mortgages</h2>
        <p>
          Interest-only payments are lower because you only pay the interest — on £200,000 at 4.5% that is{" "}
          {gbp(ex.interestOnlyMonthly)} a month instead of {gbp(ex.monthly)}. But the whole loan is still owed at the end,
          so lenders want proof of a repayment plan, such as investments or other property, and usually a large deposit.
          Most homebuyers choose a repayment mortgage.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          This calculator gives estimates only and is not mortgage advice. Speak to a lender or a qualified mortgage adviser
          before you apply.
        </p>
      </div>
    </>
  );
}
