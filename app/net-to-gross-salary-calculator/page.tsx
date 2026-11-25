import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import NetToGrossCalculator from "@/components/NetToGrossCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { grossForTakeHome, MONTHLY_TARGETS, monthlyPath } from "@/lib/reverse";
import { gbp, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/net-to-gross-salary-calculator"),
  description: `Reverse salary calculator: enter the take-home pay you want each month or year and see the gross salary you need in ${TAX_YEAR.label}, including Scotland.`,
  alternates: { canonical: "/net-to-gross-salary-calculator" },
};

const faqs = [
  {
    q: "How do I work out gross salary from net pay?",
    a: "You can't simply add a fixed percentage, because tax and National Insurance change at different thresholds. This calculator tries salaries until it finds the lowest one that gives the take-home pay you entered.",
  },
  {
    q: "What salary do I need to take home £3,000 a month?",
    a: `In England, Wales and Northern Ireland you need a salary of about ${gbp(grossForTakeHome(36000), 0)} to take home £3,000 a month in ${TAX_YEAR.label}, with no pension or student loan.`,
  },
  {
    q: "Why is the salary needed in Scotland higher?",
    a: "Scottish Income Tax rates are higher above about £33,500 of salary, so you need a slightly bigger gross salary to take home the same amount.",
  },
  {
    q: "Does this include pension contributions?",
    a: "Yes. Enter your pension percentage and the calculator works out the gross salary needed after salary sacrifice pension contributions.",
  },
];

export default function NetToGrossPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Net to Gross Salary Calculator UK</h1>
      <Byline />
      <p className="lead">
        Know what you want to take home? Work backwards to the salary you need to ask for in {TAX_YEAR.label}.
      </p>
      <NetToGrossCalculator />
      <div className="prose">
        <h2>Salary needed for each monthly take-home</h2>
        <table>
          <thead>
            <tr>
              <th>Take-home a month</th>
              <th>Salary needed</th>
              <th>Salary needed (Scotland)</th>
            </tr>
          </thead>
          <tbody>
            {MONTHLY_TARGETS.map((m) => (
              <tr key={m}>
                <td>
                  <Link href={monthlyPath(m)}>{gbp(m, 0)}</Link>
                </td>
                <td>{gbp(grossForTakeHome(m * 12), 0)}</td>
                <td>{gbp(grossForTakeHome(m * 12, { region: "scotland" }), 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted">No pension or student loan. Rounded up to the nearest pound.</p>
        <p>
          Already know your salary? Use the <Link href="/">take home pay calculator</Link> instead.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
