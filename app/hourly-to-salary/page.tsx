import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import HourlyConverter from "@/components/HourlyConverter";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { HOURLY_RATES, hourlyPath } from "@/lib/hourly";
import { MIN_WAGE } from "@/lib/site";
import { calculate, gbp, TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/hourly-to-salary"),
  description: `Hourly wage calculator: convert an hourly rate to a yearly salary, or a salary to an hourly rate, and see your take-home pay after tax for ${TAX_YEAR.label}.`,
  alternates: { canonical: "/hourly-to-salary" },
};

const faqs = [
  {
    q: "How do I convert an hourly rate to a yearly salary?",
    a: "Multiply your hourly rate by the hours you work each week, then by 52. For example, £15 an hour × 37.5 hours × 52 weeks = £29,250 a year.",
  },
  {
    q: "How do I work out my hourly rate from my salary?",
    a: "Divide your annual salary by 52, then by your weekly hours. For example, £30,000 ÷ 52 ÷ 37.5 = £15.38 an hour.",
  },
  {
    q: "What is the National Living Wage in 2026?",
    a: `From 1 April 2026 the National Living Wage for workers aged 21 and over is ${gbp(MIN_WAGE.nlw)} an hour. The rate for 18 to 20 year olds is ${gbp(MIN_WAGE.age18to20)}, and for 16 to 17 year olds and apprentices it is ${gbp(MIN_WAGE.age16to17)}.`,
  },
  {
    q: "How much is the National Living Wage a year?",
    a: `At ${gbp(MIN_WAGE.nlw)} an hour, 37.5 hours a week for 52 weeks is ${gbp(MIN_WAGE.nlw * 37.5 * 52, 0)} a year before tax, or about ${gbp(calculate({ gross: MIN_WAGE.nlw * 37.5 * 52 }).takeHome / 12)} a month after tax and National Insurance.`,
  },
  {
    q: "Should I use 37.5 or 40 hours a week?",
    a: "Use the hours in your contract. 37.5 hours (7.5 hours a day) is common in offices and the public sector; 40 hours is common in retail, warehouses and hospitality. You can change the hours in the calculator.",
  },
  {
    q: "Why multiply by 52 weeks if I get paid holiday?",
    a: "Paid holiday is part of your salary, so a yearly salary already covers all 52 weeks including holidays. If you are paid only for the hours you work, with no paid holiday, your yearly pay will be lower.",
  },
  {
    q: "How is overtime taxed?",
    a: "Overtime is taxed in the same way as normal pay. It is added to your earnings for that pay period, so you may see more tax taken that month, but you do not pay a special higher rate on overtime.",
  },
  {
    q: "How do I work out a daily rate?",
    a: "Divide your yearly salary by the number of working days, usually 260 (52 weeks × 5 days). For example, £32,500 ÷ 260 = £125 a day before tax.",
  },
  {
    q: "How do I convert a monthly salary to an hourly rate?",
    a: "Multiply your monthly salary by 12, then divide by 52 and by your weekly hours. For example, £2,500 a month × 12 ÷ 52 ÷ 37.5 = £15.38 an hour.",
  },
  {
    q: "How many working hours are there in a year?",
    a: "At 37.5 hours a week there are 1,950 paid hours in a year (37.5 × 52). At 40 hours a week there are 2,080. Paid holiday is included, because a salary covers all 52 weeks.",
  },
  {
    q: "How do I work out a weekly wage from a salary?",
    a: "Divide your annual salary by 52. A £30,000 salary is £576.92 a week before tax. If you are paid every four weeks, divide by 13 instead to get each payment.",
  },
];

const MONTHLY_TABLE = [1500, 2000, 2500, 3000, 3500, 4000, 5000];

const SALARY_TABLE = [20000, 25000, 30000, 35000, 40000, 50000, 60000, 80000];

const TABLE = [MIN_WAGE.nlw, 13, 14, 15, 16, 18, 20, 22, 25, 30, 35, 40, 50].filter((r) => HOURLY_RATES.includes(r));

export default function HourlyPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Hourly Wage Calculator UK</h1>
      <Byline />
      <p className="lead">
        Our hourly wage calculator turns your hourly rate into a yearly salary — or works out the hourly rate of your salary —
        and shows what you take home after tax in {TAX_YEAR.label}. It works as a salary to hourly calculator and an hourly
        rate calculator in one.
      </p>
      <HourlyConverter />
      <div className="prose">
        <h2>Hourly rate to annual salary table</h2>
        <p>Based on 37.5 hours a week, 52 weeks a year, England, Wales and Northern Ireland.</p>
        <table>
          <thead>
            <tr>
              <th>Hourly rate</th>
              <th>Annual salary</th>
              <th>Monthly take-home</th>
            </tr>
          </thead>
          <tbody>
            {TABLE.map((h) => {
              const annual = h * 37.5 * 52;
              const r = calculate({ gross: annual });
              return (
                <tr key={h}>
                  <td>
                    <Link href={hourlyPath(h)}>{gbp(h)} an hour</Link>
                    {h === MIN_WAGE.nlw ? " (National Living Wage)" : ""}
                  </td>
                  <td>{gbp(annual, 0)}</td>
                  <td>{gbp(r.takeHome / 12)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p>
          <Link href="/hourly">See every hourly rate from £8 to £100 →</Link>
        </p>

        <h2>Annual salary to hourly rate table</h2>
        <p>Gross and take-home hourly pay at 37.5 hours a week, England, Wales and Northern Ireland.</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Salary</th>
                <th>Hourly (before tax)</th>
                <th>Hourly (after tax)</th>
                <th>Daily (before tax)</th>
              </tr>
            </thead>
            <tbody>
              {SALARY_TABLE.map((s) => {
                const r = calculate({ gross: s });
                return (
                  <tr key={s}>
                    <td>{gbp(s, 0)}</td>
                    <td>{gbp(s / 52 / 37.5)}</td>
                    <td>{gbp(r.takeHome / 52 / 37.5)}</td>
                    <td>{gbp(s / 260)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2>Monthly salary to hourly rate table</h2>
        <p>Gross monthly pay converted to an hourly rate, at 37.5 and 40 hours a week.</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Monthly salary</th>
                <th>Yearly salary</th>
                <th>Hourly at 37.5 hours</th>
                <th>Hourly at 40 hours</th>
                <th>Weekly</th>
              </tr>
            </thead>
            <tbody>
              {MONTHLY_TABLE.map((m) => (
                <tr key={m}>
                  <td>{gbp(m, 0)}</td>
                  <td>{gbp(m * 12, 0)}</td>
                  <td>{gbp((m * 12) / 52 / 37.5)}</td>
                  <td>{gbp((m * 12) / 52 / 40)}</td>
                  <td>{gbp((m * 12) / 52)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How to work out your hourly rate from your salary</h2>
        <ol>
          <li>Start with your annual salary (or monthly salary × 12).</li>
          <li>Divide by 52 to get your weekly pay.</li>
          <li>Divide by the hours you work each week. That is your gross hourly rate.</li>
        </ol>
        <p>
          A £35,000 salary at 37.5 hours a week is {gbp(35000 / 52 / 37.5)} an hour before tax and{" "}
          {gbp(calculate({ gross: 35000 }).takeHome / 52 / 37.5)} after tax. For contract or day-rate work, divide by
          working days instead — usually 260 a year, or 232 once the statutory 28 days of holiday (including bank holidays) are taken off.
        </p>
        <p>
          Want to see your pay per month instead? Use the <Link href="/monthly-salary-calculator">monthly salary calculator</Link>.
        </p>

        <h2>Minimum wage rates from 1 April 2026</h2>
        <table>
          <thead>
            <tr>
              <th>Age</th>
              <th>Hourly rate</th>
              <th>Yearly at 37.5 hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>21 and over (National Living Wage)</td>
              <td>{gbp(MIN_WAGE.nlw)}</td>
              <td>{gbp(MIN_WAGE.nlw * 37.5 * 52, 0)}</td>
            </tr>
            <tr>
              <td>18 to 20</td>
              <td>{gbp(MIN_WAGE.age18to20)}</td>
              <td>{gbp(MIN_WAGE.age18to20 * 37.5 * 52, 0)}</td>
            </tr>
            <tr>
              <td>16 to 17 and apprentices</td>
              <td>{gbp(MIN_WAGE.age16to17)}</td>
              <td>{gbp(MIN_WAGE.age16to17 * 37.5 * 52, 0)}</td>
            </tr>
          </tbody>
        </table>
        <p>
          Part-time? Work out your pay from a full-time salary with the{" "}
          <Link href="/pro-rata-salary-calculator">pro rata salary calculator</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
