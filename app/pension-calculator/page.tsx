import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import PensionCalculator from "@/components/PensionCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { PENSION, STATE_PENSION_YEARLY, projectPension } from "@/lib/pension";
import { gbp } from "@/lib/tax";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/pension-calculator"),
  description:
    "UK pension calculator: your workplace pension pot at retirement, the income it could pay with the State Pension, your tax-free cash and the real cost.",
  alternates: { canonical: "/pension-calculator" },
};

const ex = projectPension({ age: 30, retireAge: 68, salary: 35000, employeePct: 5, employerPct: 3, basis: "qualifying", currentPot: 10000 });

const faqs = [
  {
    q: "How much will my pension be worth when I retire?",
    a: `It depends on how much you and your employer pay in, how long you save and how your investments grow. For example, a 30-year-old on £35,000 paying the auto-enrolment minimum, with £10,000 already saved, could build a pot of around ${gbp(ex.pot, 0)} in today's money by 68, assuming 3% growth a year after inflation and charges.`,
  },
  {
    q: "What are the minimum workplace pension contributions?",
    a: "Under auto-enrolment, at least 8% of your qualifying earnings must go in, with at least 3% from your employer. In 2026/27 qualifying earnings are your earnings between £6,240 and £50,270. Many employers pay more, or base contributions on your full salary.",
  },
  {
    q: "How much is the State Pension in 2026/27?",
    a: `The full new State Pension is £${PENSION.statePensionWeekly.toFixed(2)} a week (${gbp(STATE_PENSION_YEARLY)} a year) in 2026/27. You usually need 35 qualifying years of National Insurance to get the full amount and at least 10 to get any. Check your forecast on GOV.UK.`,
  },
  {
    q: "How much should I pay into my pension?",
    a: "A common rule of thumb is to take the age you start saving, halve it, and put that percentage of your salary into your pension each year, including your employer's share — so 15% if you start at 30. Use the calculator to see what different amounts could give you.",
  },
  {
    q: "How much of my pension can I take tax-free?",
    a: "Usually 25% of your pension pot, up to a total of £268,275 (the Lump Sum Allowance) for most people. The rest is taxed as income when you take it.",
  },
  {
    q: "When can I take my pension?",
    a: "You can usually access a personal or workplace pension from age 55, rising to 57 from 6 April 2028. The State Pension starts at State Pension age, which is currently 66 and rising to 67 between 2026 and 2028.",
  },
  {
    q: "How does tax relief on pension contributions work?",
    a: "Your contributions are paid from your pay before Income Tax (net pay) or topped up by 25% by the Government (relief at source), so a basic-rate taxpayer pays £80 for every £100 that goes into their pension. Higher-rate taxpayers get 40% relief. With salary sacrifice you save National Insurance as well.",
  },
  {
    q: "Is this calculator accurate?",
    a: "It is an estimate. Investment returns are not guaranteed and can go down as well as up, and the result is in today's money. Your pension provider can give you a personalised projection, and free guidance is available from MoneyHelper and Pension Wise.",
  },
];

const EXAMPLES = [25000, 35000, 50000, 70000];
const RATES = [8, 12, 15];

export default function PensionPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Pension Calculator UK",
            url: `${SITE_URL}/pension-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />
      <h1>Pension Calculator UK</h1>
      <Byline />
      <p className="lead">
        See how much your workplace pension could be worth when you retire, the income it could pay alongside the State
        Pension, and what your contributions really cost you after tax relief.
      </p>
      <PensionCalculator />

      <div className="prose">
        <h2>How this retirement calculator works</h2>
        <p>
          Each year, your contribution and your employer&apos;s are added to your pot, which grows at the rate you choose.
          Everything is shown in today&apos;s money: the growth rate is after inflation and charges, so{" "}
          {gbp(ex.pot, 0)} means what that amount would buy now. To estimate income, the calculator assumes you draw 4% of
          your pot each year and adds the full new State Pension of {gbp(STATE_PENSION_YEARLY, 0)} a year.
        </p>

        <h2>Workplace pension minimums for 2026/27</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>2026/27</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Auto-enrolment earnings trigger</td>
              <td>{gbp(PENSION.autoEnrolTrigger, 0)} a year</td>
            </tr>
            <tr>
              <td>Qualifying earnings</td>
              <td>
                {gbp(PENSION.qualifyingLower, 0)} to {gbp(PENSION.qualifyingUpper, 0)}
              </td>
            </tr>
            <tr>
              <td>Minimum total contribution</td>
              <td>8% of qualifying earnings</td>
            </tr>
            <tr>
              <td>Minimum from your employer</td>
              <td>3% of qualifying earnings</td>
            </tr>
            <tr>
              <td>Full new State Pension</td>
              <td>£{PENSION.statePensionWeekly.toFixed(2)} a week</td>
            </tr>
            <tr>
              <td>Annual allowance (tax relief limit)</td>
              <td>{gbp(PENSION.annualAllowance, 0)}</td>
            </tr>
          </tbody>
        </table>
        <p>
          You are automatically enrolled if you are aged 22 to State Pension age and earn more than £10,000 a year. On £35,000,
          the minimum is 5% of £28,760 from you ({gbp(28760 * 0.05, 0)} a year) and 3% from your employer (
          {gbp(28760 * 0.03, 0)}).
        </p>

        <h2>Pension pot at 68 by salary and contribution</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Salary</th>
                {RATES.map((r) => (
                  <th key={r}>{r}% of salary, from age 25</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map((s) => (
                <tr key={s}>
                  <td>{gbp(s, 0)}</td>
                  {RATES.map((r) => (
                    <td key={r}>
                      {gbp(
                        projectPension({ age: 25, retireAge: 68, salary: s, employeePct: r - 3, employerPct: 3, basis: "full" }).pot,
                        0,
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">
          Total contributions (yours plus 3% from your employer) on full salary, no existing savings, 3% growth a year after
          inflation and charges, today&apos;s money.
        </p>

        <h2>How much do I need to retire?</h2>
        <p>
          The Pensions and Lifetime Savings Association&apos;s Retirement Living Standards are a useful guide: they estimate
          the yearly income needed for a minimum, moderate or comfortable retirement for singles and couples. The State
          Pension covers part of the minimum level on its own; your workplace and personal pensions make up the rest.
        </p>

        <h2>Ways to boost your pension</h2>
        <ul>
          <li>
            <strong>Get the full employer contribution.</strong> Some employers match extra contributions up to a limit — it
            is free money.
          </li>
          <li>
            <strong>Use salary sacrifice</strong> if your employer offers it, to save National Insurance as well as tax. See
            the <Link href="/salary-sacrifice-calculator">salary sacrifice calculator</Link>.
          </li>
          <li>
            <strong>Pay in more after a pay rise</strong>, before you get used to the extra money.
          </li>
          <li>
            <strong>Check your State Pension forecast</strong> and fill gaps in your National Insurance record if it is
            worth it.
          </li>
          <li>
            <strong>Combine old pots</strong> to keep track of them and reduce charges — but check for valuable guarantees
            or exit fees first.
          </li>
        </ul>
        <p>
          Earning £60,000 to £80,000 with children? Pension contributions can also cut the High Income Child Benefit Charge —
          try the <Link href="/child-benefit-calculator">Child Benefit calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          This calculator gives estimates for information only and is not financial advice. The value of investments can
          fall as well as rise.
        </p>
      </div>
    </>
  );
}
