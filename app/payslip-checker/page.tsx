import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import PayslipChecker from "@/components/PayslipChecker";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { expectedPayslip } from "@/lib/payslip";
import { gbp } from "@/lib/tax";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/payslip-checker"),
  description:
    "Payslip checker and payslip calculator: enter your gross pay and tax code to see the tax, National Insurance, student loan and net pay for 2026/27.",
  alternates: { canonical: "/payslip-checker" },
};

const ex = expectedPayslip({ gross: 3000, taxCode: "1257L", pension: 150, pensionMethod: "netpay" });

const faqs = [
  {
    q: "How do I check my payslip is correct?",
    a: "Enter your gross pay, pay frequency and tax code from your payslip into the checker, then add the tax, National Insurance and net pay shown. It works out what each deduction should be for 2026/27 and flags any figure that is more than £5 away.",
  },
  {
    q: "Why is the tax on my payslip different from the checker?",
    a: "Most payslips use cumulative tax: your tax-free allowance builds up through the year and each payslip corrects for earlier ones. If your pay changed, you had a bonus or overtime, started a new job or your tax code changed, this period's tax can be higher or lower than the simple figure. It usually evens out by the end of the tax year.",
  },
  {
    q: "What does tax code 1257L mean?",
    a: "1257L is the standard tax code for 2026/27. It gives you the full £12,570 Personal Allowance, so roughly the first £1,048 a month (£242 a week) is tax-free. The L means you get the standard allowance.",
  },
  {
    q: "What does an emergency tax code look like?",
    a: "An emergency code ends in W1, M1 or X — for example 1257L M1. Tax is worked out on each pay period on its own instead of cumulatively. It is common when you start a new job without a P45, and HMRC normally sends your employer the right code within a few weeks.",
  },
  {
    q: "How much National Insurance should I pay each month?",
    a: "For 2026/27, employees pay 8% on monthly earnings between £1,048 and £4,189, and 2% on anything above £4,189. Weekly, the thresholds are £242 and £967. National Insurance is worked out on each pay period separately, not cumulatively.",
  },
  {
    q: "Why is my student loan deduction a whole number?",
    a: "Payroll rounds student and postgraduate loan deductions down to the nearest pound each pay period. The deduction is 9% of pay above your plan's threshold for the period (6% for a Postgraduate Loan).",
  },
  {
    q: "What is the difference between net pay and salary sacrifice pensions?",
    a: "Both take your pension contribution before Income Tax. Salary sacrifice also lowers the pay used for National Insurance and student loans, and is usually already taken off the gross pay on your payslip. Relief at source pensions are taken after tax, and your pension provider claims the basic-rate tax relief.",
  },
  {
    q: "What should I do if my payslip is wrong?",
    a: "Ask your payroll or HR team first — most mistakes are fixed in the next pay run. If your tax code is wrong, update your details in your HMRC personal tax account or the HMRC app. If you are underpaid and your employer won't fix it, Acas can give free advice.",
  },
];

const TERMS = [
  { term: "Gross pay", meaning: "Your total pay before any deductions: basic salary plus overtime, bonus, commission and any taxable allowances." },
  { term: "Net pay (take-home pay)", meaning: "What is paid into your bank account after all deductions." },
  { term: "Tax code", meaning: "Tells your employer how much tax-free pay you get. 1257L is the standard code; S at the start means Scottish rates, C means Welsh." },
  { term: "PAYE / Income Tax", meaning: "Income Tax taken through Pay As You Earn. Usually worked out cumulatively over the tax year." },
  { term: "National Insurance (NI)", meaning: "8% of earnings between the primary threshold and upper earnings limit, 2% above. Worked out on each pay period." },
  { term: "NI number and NI letter", meaning: "Your National Insurance number, and a category letter — A for most employees, C if you are over State Pension age (no employee NI)." },
  { term: "Pension", meaning: "Your workplace pension contribution. Check whether it is taken before tax (net pay or salary sacrifice) or after tax (relief at source)." },
  { term: "Student loan / PGL", meaning: "Repayments of 9% above your plan threshold, or 6% for a Postgraduate Loan, rounded down to whole pounds." },
  { term: "Taxable pay to date / tax paid to date", meaning: "Running totals for the tax year so far — used to work out cumulative tax." },
  { term: "Tax period", meaning: "Which week (1–52) or month (1–12) of the tax year the payslip is for. Month 1 starts on 6 April." },
  { term: "SSP, SMP, SPP", meaning: "Statutory Sick Pay, Statutory Maternity Pay and Statutory Paternity Pay — taxed like normal pay." },
];

export default function PayslipCheckerPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Payslip Checker UK",
            url: `${SITE_URL}/payslip-checker`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />
      <h1>Payslip Checker UK 2026/27</h1>
      <Byline />
      <p className="lead">
        Check that the Income Tax, National Insurance and student loan on your payslip are right — a free payslip calculator
        that does the same sums as your employer&apos;s payroll calculator. Enter your gross pay and
        tax code, then the figures from your payslip, and we&apos;ll compare them line by line.
      </p>
      <PayslipChecker />

      <div className="prose">
        <h2>Payslip explained: what each line means</h2>
        <table>
          <thead>
            <tr>
              <th>On your payslip</th>
              <th>What it means</th>
            </tr>
          </thead>
          <tbody>
            {TERMS.map((t) => (
              <tr key={t.term}>
                <td>
                  <strong>{t.term}</strong>
                </td>
                <td>{t.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Example: a £3,000 monthly payslip</h2>
        <p>
          On {gbp(3000)} gross pay a month with tax code 1257L and a {gbp(150)} pension taken before tax, the payslip should
          show about {gbp(ex.incomeTax)} Income Tax, {gbp(ex.nationalInsurance)} National Insurance and{" "}
          <strong>{gbp(ex.netPay)} net pay</strong>. Tax is charged on {gbp(ex.taxablePay)} because the pension comes off
          first; National Insurance is still charged on the full {gbp(3000)}.
        </p>

        <h2>How to check your payslip in 4 steps</h2>
        <ol>
          <li>
            <strong>Check your hours and pay.</strong> Are your basic pay, overtime and any bonus right? If you are paid by
            the hour, make sure you are paid at least the <Link href="/minimum-wage-calculator">minimum wage</Link>.
          </li>
          <li>
            <strong>Check your tax code.</strong> 1257L is standard. A K code, BR, 0T or an emergency code (W1, M1 or X) is
            worth checking with HMRC.
          </li>
          <li>
            <strong>Check the deductions</strong> with the checker above.
          </li>
          <li>
            <strong>Keep your payslips</strong> — you need them for mortgages, tax refunds and to spot mistakes. Employers
            must give you a payslip on or before payday.
          </li>
        </ol>
        <p>
          Want to see your pay over a whole year? Use the <Link href="/">take home pay calculator</Link> or the{" "}
          <Link href="/monthly-salary-calculator">monthly salary calculator</Link>. Off sick? See what you should get with
          the <Link href="/statutory-sick-pay-calculator">Statutory Sick Pay calculator</Link>. To check just the National
          Insurance line, including a bonus month, use the <Link href="/national-insurance-calculator">National Insurance
          calculator</Link>. Got a company car in your tax code? See the{" "}
          <Link href="/company-car-tax-calculator">company car tax calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
