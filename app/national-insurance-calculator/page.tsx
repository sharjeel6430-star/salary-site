import type { Metadata } from "next";
import Link from "next/link";
import { Byline } from "@/components/Byline";
import NationalInsuranceCalculator from "@/components/NationalInsuranceCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { NI_PERIODS, NI_YEAR, niForPeriod, EMPLOYMENT_ALLOWANCE } from "@/lib/nationalInsurance";
import { gbp } from "@/lib/tax";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

const PATH = "/national-insurance-calculator";

export const metadata: Metadata = {
  title: shortTitle("/national-insurance-calculator"),
  description:
    "National Insurance calculator 2026/27: what comes out of your pay and what your employer pays, weekly, monthly or yearly, by NI category, with bonus months.",
  alternates: { canonical: PATH },
};

const ex = (pay: number) => niForPeriod(pay, "month", "A");

const faqs = [
  {
    q: "How much National Insurance do I pay in 2026/27?",
    a: `Employees pay 8% on earnings between £242 and £967 a week (£1,048 to £4,189 a month), and 2% on earnings above that. Nothing is due below £242 a week. On £3,000 a month you pay ${gbp(ex(3000).employee)} a month.`,
  },
  {
    q: "How much National Insurance does my employer pay?",
    a: `Employers pay 15% on everything you earn above £96 a week (£417 a month, £5,000 a year), with no upper limit. On £3,000 a month that is ${gbp(ex(3000).employer)} a month on top of your salary. For employees under 21, apprentices under 25 and veterans in their first year of civilian work, employers pay 0% up to £967 a week.`,
  },
  {
    q: "Why did I pay more National Insurance in my bonus month?",
    a: "NI is worked out on each pay period on its own, not on your annual pay. A bonus pushes that month's pay higher, so more of it falls in the 8% band, and anything over £4,189 in the month is charged at 2%. Unlike Income Tax, NI paid in a high month is not refunded at the end of the year.",
  },
  {
    q: "What is my National Insurance category letter?",
    a: "It is on your payslip. Most people are category A. M is for employees under 21, H for apprentices under 25, C for people over State Pension age (no employee NI) and B for married women or widows who elected the reduced rate before 1977.",
  },
  {
    q: "Do I pay National Insurance after State Pension age?",
    a: "No employee NI is due once you reach State Pension age (category C), but your employer still pays 15% above the Secondary Threshold.",
  },
  {
    q: "Do company directors pay National Insurance differently?",
    a: "Directors normally use an annual earnings period, so their NI is worked out on pay for the whole year rather than each month. Choose the yearly option above to see the result.",
  },
  {
    q: "What is the Employment Allowance?",
    a: `Most employers can claim the Employment Allowance, which reduces their employer NI bill by up to ${gbp(EMPLOYMENT_ALLOWANCE, 0)} a year. It does not change what employees pay.`,
  },
  {
    q: "Does salary sacrifice reduce National Insurance?",
    a: "Yes. Pension, cycle-to-work and electric car salary sacrifice reduce the pay that NI is charged on, for you and your employer. Enter your pay after the sacrifice.",
  },
];

const MONTHLY = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 8000];

export default function NationalInsurancePage() {
  const m = NI_PERIODS.find((p) => p.key === "month")!;
  const w = NI_PERIODS.find((p) => p.key === "week")!;
  const y = NI_PERIODS.find((p) => p.key === "year")!;
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("National Insurance Calculator", `${SITE_URL}${PATH}`, "FinanceApplication")]} />
      <h1>National Insurance Calculator {NI_YEAR}</h1>
      <Byline />
      <p className="lead">
        See how much National Insurance comes out of your pay and how much your employer pays on top, for any pay
        period and NI category.
      </p>
      <NationalInsuranceCalculator />
      <div className="prose">
        <h2>National Insurance thresholds {NI_YEAR}</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Threshold</th><th>Weekly</th><th>Monthly</th><th>Yearly</th></tr></thead>
            <tbody>
              <tr><td>Lower Earnings Limit (counts for State Pension)</td><td>{gbp(w.lel, 0)}</td><td>{gbp(m.lel, 0)}</td><td>{gbp(y.lel, 0)}</td></tr>
              <tr><td>Primary Threshold (you start paying 8%)</td><td>{gbp(w.pt, 0)}</td><td>{gbp(m.pt, 0)}</td><td>{gbp(y.pt, 0)}</td></tr>
              <tr><td>Secondary Threshold (employer starts paying 15%)</td><td>{gbp(w.st, 0)}</td><td>{gbp(m.st, 0)}</td><td>{gbp(y.st, 0)}</td></tr>
              <tr><td>Upper Earnings Limit (your rate drops to 2%)</td><td>{gbp(w.uel, 0)}</td><td>{gbp(m.uel, 0)}</td><td>{gbp(y.uel, 0)}</td></tr>
            </tbody>
          </table>
        </div>
        <h2>National Insurance on monthly pay</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Monthly pay</th><th>Your NI</th><th>Employer NI</th><th>Pay after NI</th></tr></thead>
            <tbody>
              {MONTHLY.map((p) => {
                const r = ex(p);
                return (
                  <tr key={p}><td>{gbp(p, 0)}</td><td>{gbp(r.employee)}</td><td>{gbp(r.employer)}</td><td>{gbp(p - r.employee)}</td></tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">Category A. Employer figures are before any Employment Allowance.</p>
        <p>
          Want your full take-home pay after Income Tax too? Use the <Link href="/">salary calculator</Link>, check a payslip
          with the <Link href="/payslip-checker">payslip checker</Link>, or read{" "}
          <Link href="/guides/national-insurance-explained">National Insurance explained</Link>. Self-employed? See the{" "}
          <Link href="/self-employed-tax-calculator">self-employed tax calculator</Link> for Class 4 NI.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          Sources: GOV.UK, &quot;Rates and thresholds for employers 2026 to 2027&quot; and &quot;National Insurance rates and
          categories&quot;. Uses HMRC&apos;s exact percentage method. Guidance only, not tax advice.
        </p>
      </div>
    </>
  );
}
