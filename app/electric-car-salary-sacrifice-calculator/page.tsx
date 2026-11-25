import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import EvSacrificeCalculator from "@/components/EvSacrificeCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { evSacrifice, EV_BIK_FUTURE, BIK_YEAR } from "@/lib/ev";
import { gbp, pct } from "@/lib/tax";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/electric-car-salary-sacrifice-calculator"),
  description: "Electric car salary sacrifice calculator 2026/27: the real monthly cost of an EV through your employer, with 4% benefit-in-kind tax and your tax savings.",
  alternates: { canonical: "/electric-car-salary-sacrifice-calculator" },
};

const faqs = [
  {
    q: "How does electric car salary sacrifice work?",
    a: "You agree to give up part of your gross salary each month and, in return, your employer provides a new electric car, usually including insurance, servicing and breakdown cover. Because the cost comes out of your pay before Income Tax and National Insurance, the car costs you much less than paying the same lease out of your take-home pay.",
  },
  {
    q: "What is the BIK rate for electric cars in 2026/27?",
    a: "The benefit-in-kind rate for fully electric cars is 4% of the list price in 2026/27. It rises to 5% in 2027/28, 7% in 2028/29 and 9% from 2029/30. A £40,000 electric car therefore has a taxable benefit of £1,600 a year in 2026/27, costing a basic-rate taxpayer £320 a year in tax.",
  },
  {
    q: "How much can I save with an EV salary sacrifice scheme?",
    a: "Compared with paying the same monthly cost from your take-home pay, basic-rate taxpayers typically save around 20% to 25%, and higher-rate taxpayers around 30% to 40%, depending on the car's list price. People earning between £100,000 and £125,140 can save close to half, because the sacrifice also restores some of their Personal Allowance.",
  },
  {
    q: "Do I pay National Insurance on the car benefit?",
    a: "No. Employees do not pay National Insurance on a company car benefit. Your employer pays Class 1A National Insurance on it instead, and some schemes build that cost into the monthly price.",
  },
  {
    q: "Can I join a car salary sacrifice scheme on a low salary?",
    a: "Your salary after the sacrifice must not fall below the National Minimum Wage or National Living Wage for your hours. Many schemes also set their own minimum salary and may run an affordability check.",
  },
  {
    q: "Does the 2029 salary sacrifice change affect cars?",
    a: "No. The cap announced for April 2029 applies to pension contributions made by salary sacrifice above £2,000 a year. Car schemes for electric and low-emission cars are not affected by that change.",
  },
  {
    q: "What about plug-in hybrids?",
    a: "Plug-in hybrids with CO2 emissions of 1 to 50g/km have a BIK rate between 4% and 16% in 2026/27, depending on their electric range. Cars up to 75g/km keep the full salary sacrifice tax advantage; above that, the optional remuneration rules usually remove most of the saving.",
  },
  {
    q: "What happens if I leave my job?",
    a: "It depends on the scheme. Many include early termination cover for resignation, redundancy or long-term sickness; others charge a fee. Check the terms before you sign, as the agreement usually lasts two to four years.",
  },
  {
    q: "Will salary sacrifice affect my mortgage or pension?",
    a: "Your gross salary is lower, which some lenders use for mortgage applications, and it can reduce pension contributions or life cover based on salary. Many employers use a 'reference salary' to protect pension and benefits — ask yours.",
  },
];

const EXAMPLES = [
  { salary: 30000, monthly: 400, price: 32000 },
  { salary: 45000, monthly: 500, price: 40000 },
  { salary: 60000, monthly: 550, price: 45000 },
  { salary: 80000, monthly: 650, price: 50000 },
  { salary: 110000, monthly: 800, price: 60000 },
];

export default function EvSacrificePage() {
  const ex = evSacrifice({ salary: 45000, monthlySacrifice: 500, listPrice: 40000 });
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Electric Car Salary Sacrifice Calculator",
            url: `${SITE_URL}/electric-car-salary-sacrifice-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />
      <h1>Electric Car Salary Sacrifice Calculator UK</h1>
      <Byline />
      <p className="lead">
        Find out what an electric car really costs through your employer&apos;s salary sacrifice scheme in {BIK_YEAR} —
        after Income Tax and National Insurance savings and the {pct(0.04, 0)} benefit-in-kind tax.
      </p>
      <EvSacrificeCalculator />
      <div className="prose">
        <h2>How an EV salary sacrifice scheme saves you money</h2>
        <p>
          Take a £45,000 salary and a £40,000 electric car that costs £500 a month through the scheme. Paying that from your
          take-home pay would cost £6,000 a year. Through salary sacrifice, your take-home pay falls by only{" "}
          {gbp(ex.netCostYear, 0)} — about {gbp(ex.netCostMonth, 0)} a month — even after paying {gbp(ex.bikTax, 0)} a year in
          benefit-in-kind tax. That is a saving of {gbp(ex.savingYear, 0)} ({pct(ex.savingPercent, 0)}).
        </p>
        <ol>
          <li>
            <strong>Your gross salary falls</strong> by the monthly cost, so you pay less Income Tax and National Insurance.
          </li>
          <li>
            <strong>You pay tax on the car benefit</strong>: list price × BIK rate. For electric cars this is just 4% in{" "}
            {BIK_YEAR}.
          </li>
          <li>
            <strong>The price often includes extras</strong> — insurance, servicing, tyres and breakdown cover — that you would
            otherwise pay for yourself.
          </li>
        </ol>

        <h2>EV salary sacrifice savings by salary</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Salary</th>
                <th>Scheme cost a month</th>
                <th>Car list price</th>
                <th>Real cost a month</th>
                <th>Saving</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map((e) => {
                const r = evSacrifice({ salary: e.salary, monthlySacrifice: e.monthly, listPrice: e.price });
                return (
                  <tr key={e.salary}>
                    <td>{gbp(e.salary, 0)}</td>
                    <td>{gbp(e.monthly, 0)}</td>
                    <td>{gbp(e.price, 0)}</td>
                    <td>{gbp(r.netCostMonth)}</td>
                    <td>{pct(r.savingPercent, 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">England, Wales and Northern Ireland, fully electric car, no student loan or pension.</p>

        <h2>Electric car BIK rates</h2>
        <table>
          <thead>
            <tr>
              <th>Tax year</th>
              <th>BIK rate (zero-emission cars)</th>
              <th>Yearly tax on a £40,000 EV (20% taxpayer)</th>
            </tr>
          </thead>
          <tbody>
            {EV_BIK_FUTURE.map((y) => (
              <tr key={y.year}>
                <td>{y.year}</td>
                <td>{pct(y.pct, 0)}</td>
                <td>{gbp(40000 * y.pct * 0.2, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Plug-in hybrids with 1–50g/km CO2 are taxed at 4% to 16% in {BIK_YEAR} depending on their electric range. Choose
          the type of car in the calculator to see the difference.
        </p>

        <h2>Is EV salary sacrifice worth it?</h2>
        <p>For most employees who want a new car, yes, but check these points first:</p>
        <ul>
          <li>Your pay after the sacrifice must stay above the National Minimum Wage.</li>
          <li>A lower gross salary can reduce mortgage borrowing and salary-linked benefits.</li>
          <li>Find out what happens if you leave your job, go on parental leave or are off sick.</li>
          <li>Compare the scheme&apos;s price with a personal lease of the same car, including insurance.</li>
        </ul>
        <p>
          Paying into a pension through your employer instead? Use the{" "}
          <Link href="/salary-sacrifice-calculator">pension salary sacrifice calculator</Link>, or see your full pay in the{" "}
          <Link href="/">take home pay calculator</Link>. Offered a company car instead? Compare the monthly tax with the{" "}
          <Link href="/company-car-tax-calculator">company car tax calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
