import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import SacrificeCalculator from "@/components/SacrificeCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { calculate, gbp, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/salary-sacrifice-calculator"),
  description: `Salary sacrifice pension calculator for ${TAX_YEAR.label}: see how much Income Tax, National Insurance and student loan you save, and the cost to your take-home pay.`,
  alternates: { canonical: "/salary-sacrifice-calculator" },
};

const faqs = [
  {
    q: "What is salary sacrifice?",
    a: "Salary sacrifice is an agreement with your employer to give up part of your salary in exchange for a benefit, usually a pension contribution. Because your salary is lower, you pay less Income Tax and National Insurance.",
  },
  {
    q: "Is salary sacrifice better than a normal pension contribution?",
    a: "Usually, yes. A net pay pension saves Income Tax only, while salary sacrifice also saves National Insurance (8% for most earners, 2% above £50,270). Many employers also pass on some of their own NI saving.",
  },
  {
    q: "Can salary sacrifice get me under £100,000?",
    a: "Yes. If your income is between £100,000 and £125,140 you lose part of your Personal Allowance. Sacrificing enough salary to bring your adjusted net income back to £100,000 can save tax at an effective 60% plus 2% NI.",
  },
  {
    q: "Are there any downsides?",
    a: "Your salary must not drop below the National Minimum Wage, and a lower salary can affect mortgage applications, some state benefits and life cover based on salary. Check your scheme's rules before signing.",
  },
  {
    q: "Is salary sacrifice changing?",
    a: "The government announced in the November 2025 Budget that, from April 2029, pension contributions made through salary sacrifice above £2,000 a year will no longer be exempt from National Insurance. For the 2026/27 tax year the full NI saving still applies.",
  },
  {
    q: "How much salary should I sacrifice into my pension?",
    a: "Many people start by matching their employer's maximum contribution, because that is free money. Higher-rate taxpayers often sacrifice enough to bring their pay down towards £50,270, and people earning over £100,000 to bring their adjusted net income back to £100,000, where the savings are largest.",
  },
  {
    q: "Can I use salary sacrifice for an electric car?",
    a: "Yes. Many employers offer electric car schemes through salary sacrifice. You pay for the car from gross pay and pay a small benefit-in-kind tax (4% of the list price in 2026/27). Use our electric car salary sacrifice calculator to see the real monthly cost.",
  },
  {
    q: "Does salary sacrifice affect my State Pension?",
    a: "Usually not. You build up State Pension qualifying years as long as your pay stays above the National Insurance Lower Earnings Limit, which is far below most salaries. It only matters if a large sacrifice takes your pay very low.",
  },
];

const TABLE = [25000, 35000, 45000, 55000, 70000, 90000];

export default function SacrificePage() {
  const a = calculate({ gross: 45000 });
  const b = calculate({ gross: 45000, pensionPercent: 5, pensionType: "sacrifice" });
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Salary Sacrifice Calculator UK {TAX_YEAR.label}</h1>
      <Byline />
      <p className="lead">
        See how much tax and National Insurance you save by paying into your pension through salary sacrifice — and what
        it really costs your take-home pay.
      </p>
      <SacrificeCalculator />
      <div className="prose">
        <h2>How salary sacrifice saves you money</h2>
        <p>
          On a £45,000 salary, sacrificing 5% puts {gbp(b.pension, 0)} a year into your pension, but your take-home pay
          only falls by {gbp(a.takeHome - b.takeHome)}. The difference — {gbp(b.pension - (a.takeHome - b.takeHome))} — is
          Income Tax and National Insurance you no longer pay.
        </p>
        <h2>Salary sacrifice savings at common salaries ({TAX_YEAR.label})</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Salary</th>
                <th>5% into pension</th>
                <th>Cost to your take-home pay</th>
                <th>Tax and NI saved</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map((s) => {
                const before = calculate({ gross: s });
                const after = calculate({ gross: s, pensionPercent: 5, pensionType: "sacrifice" });
                const cost = before.takeHome - after.takeHome;
                return (
                  <tr key={s}>
                    <td>{gbp(s, 0)}</td>
                    <td>{gbp(after.pension, 0)}</td>
                    <td>{gbp(cost, 0)}</td>
                    <td>{gbp(after.pension - cost, 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">England, Wales and Northern Ireland, no student loan.</p>

        <h2>Salary sacrifice and the £100,000 tax trap</h2>
        <p>
          Between £100,000 and £125,140 you lose £1 of Personal Allowance for every £2 you earn, so the effective tax rate
          on that slice is 60% (62% with National Insurance). Salary sacrifice reduces the income used for this test.
        </p>
        <p>
          On a £110,000 salary, sacrificing {gbp(10000, 0)} into your pension costs you only{" "}
          {gbp(calculate({ gross: 110000 }).takeHome - calculate({ gross: 110000, pensionPercent: (10000 / 110000) * 100 }).takeHome, 0)}{" "}
          in take-home pay and restores your full Personal Allowance. If you also have children, it can keep you under the
          limit for 30 hours of funded childcare and Tax-Free Childcare.
        </p>

        <h2>Other salary sacrifice schemes</h2>
        <ul>
          <li>
            <strong>Electric cars</strong> — a new EV through your employer, paid from gross pay. See the{" "}
            <Link href="/electric-car-salary-sacrifice-calculator">electric car salary sacrifice calculator</Link>.
          </li>
          <li>
            <strong>Cycle to Work</strong> — a bike and safety equipment, paid back from gross pay over 12 months or more.
          </li>
          <li>
            <strong>Extra holiday</strong> — some employers let you buy extra days of leave from gross pay.
          </li>
        </ul>
        <p>
          Read more in our guide to{" "}
          <Link href="/guides/salary-sacrifice-pension">salary sacrifice vs net pay pensions</Link>, or see the full
          picture in the <Link href="/">take home pay calculator</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
