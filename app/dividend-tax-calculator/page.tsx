import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import DividendTaxCalculator from "@/components/DividendTaxCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { dividendTax, DIVIDENDS } from "@/lib/business";
import { gbp } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/dividend-tax-calculator"),
  description:
    "UK dividend tax calculator for 2026/27 with the new 10.75% and 35.75% rates and the £500 allowance. See the tax on your dividends and total take-home.",
  alternates: { canonical: "/dividend-tax-calculator" },
};

const faqs = [
  {
    q: "What are the dividend tax rates for 2026/27?",
    a: "From 6 April 2026 dividends are taxed at 10.75% in the basic rate band, 35.75% in the higher rate band and 39.35% in the additional rate band. The ordinary and upper rates each rose by 2 percentage points; the additional rate is unchanged.",
  },
  {
    q: "How much is the dividend allowance?",
    a: "The dividend allowance is £500 for 2026/27. The first £500 of dividends is taxed at 0%, but it still counts towards your income and uses up part of your tax band.",
  },
  {
    q: "Do Scottish taxpayers pay different dividend tax?",
    a: "No. Dividend tax uses the UK-wide bands and rates, even if you pay Scottish Income Tax on your salary.",
  },
  {
    q: "Why are dividends taxed after my salary?",
    a: "HMRC treats dividends as the top slice of your income. Your salary uses up the Personal Allowance and tax bands first, and the dividends fill whatever is left.",
  },
  {
    q: "Do I pay National Insurance on dividends?",
    a: "No. Dividends are not subject to National Insurance, which is why many company directors take a small salary and the rest as dividends.",
  },
  {
    q: "When do I pay dividend tax?",
    a: "If your dividends are over £10,000 you must file a Self Assessment tax return. Tax for 2026/27 is due by 31 January 2028.",
  },
];

const EXAMPLES = [
  { salary: 12570, dividends: 20000 },
  { salary: 12570, dividends: 37700 },
  { salary: 12570, dividends: 50000 },
  { salary: 30000, dividends: 10000 },
  { salary: 50000, dividends: 10000 },
  { salary: 12570, dividends: 100000 },
];

export default function DividendTaxPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Dividend Tax Calculator UK</h1>
      <Byline />
      <p className="lead">
        See how much tax you pay on dividends in {DIVIDENDS.label}, based on your salary and the new dividend tax rates.
      </p>
      <DividendTaxCalculator />
      <div className="prose">
        <h2>Dividend tax rates {DIVIDENDS.label}</h2>
        <table>
          <thead>
            <tr>
              <th>Band</th>
              <th>Taxable income</th>
              <th>Dividend rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dividend allowance</td>
              <td>First £500 of dividends</td>
              <td>0%</td>
            </tr>
            <tr>
              <td>Basic rate</td>
              <td>£12,571 to £50,270</td>
              <td>10.75%</td>
            </tr>
            <tr>
              <td>Higher rate</td>
              <td>£50,271 to £125,140</td>
              <td>35.75%</td>
            </tr>
            <tr>
              <td>Additional rate</td>
              <td>Over £125,140</td>
              <td>39.35%</td>
            </tr>
          </tbody>
        </table>
        <h2>Dividend tax examples</h2>
        <table>
          <thead>
            <tr>
              <th>Salary</th>
              <th>Dividends</th>
              <th>Dividend tax</th>
              <th>Total take-home</th>
            </tr>
          </thead>
          <tbody>
            {EXAMPLES.map((e) => {
              const r = dividendTax(e);
              return (
                <tr key={`${e.salary}-${e.dividends}`}>
                  <td>{gbp(e.salary, 0)}</td>
                  <td>{gbp(e.dividends, 0)}</td>
                  <td>{gbp(r.dividendTax)}</td>
                  <td>{gbp(r.takeHome)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted">Salary taxed at England, Wales and Northern Ireland rates with employee NI.</p>
        <p>
          Working out your company&apos;s tax first? Try the{" "}
          <Link href="/corporation-tax-calculator">Corporation Tax calculator</Link>. Selling shares at a profit? Use the{" "}
          <Link href="/capital-gains-tax-calculator">Capital Gains Tax calculator</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          Source: GOV.UK, &quot;Tax on dividends&quot; and the rates announced for 2026/27. Doesn&apos;t include savings
          interest or the Personal Savings Allowance. Guidance only, not tax advice.
        </p>
      </div>
    </>
  );
}
