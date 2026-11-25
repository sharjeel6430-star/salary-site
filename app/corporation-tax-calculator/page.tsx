import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import CorporationTaxCalculator from "@/components/CorporationTaxCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { corporationTax, CORPORATION_TAX } from "@/lib/business";
import { gbp, pct } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/corporation-tax-calculator"),
  description:
    "UK Corporation Tax calculator from 1 April 2026: 19% small profits rate, 25% main rate and marginal relief, with associated companies and short periods.",
  alternates: { canonical: "/corporation-tax-calculator" },
};

const faqs = [
  {
    q: "What is the Corporation Tax rate for 2026/27?",
    a: "For the financial year starting 1 April 2026, the main rate is 25% for profits over £250,000 and the small profits rate is 19% for profits of £50,000 or less. Profits in between pay 25% reduced by marginal relief.",
  },
  {
    q: "How is marginal relief worked out?",
    a: "Marginal relief = (upper limit − profits) × 3/200. You pay 25% on all your profits and then subtract the relief. For £100,000 of profits that is (£250,000 − £100,000) × 3/200 = £2,250 relief, so tax of £25,000 − £2,250 = £22,750.",
  },
  {
    q: "What are associated companies?",
    a: "Companies under common control (for example, two limited companies owned by the same person) are associated. The £50,000 and £250,000 limits are divided by the number of associated companies plus one, so two associated companies each get limits of £25,000 and £125,000.",
  },
  {
    q: "What if my accounting period is shorter than 12 months?",
    a: "The limits are reduced in proportion. A 6-month accounting period has limits of £25,000 and £125,000.",
  },
  {
    q: "When is Corporation Tax due?",
    a: "For most small and medium companies, Corporation Tax is due 9 months and 1 day after the end of the accounting period. The Company Tax Return (CT600) is due 12 months after the end of the period.",
  },
];

const EXAMPLES = [20000, 50000, 75000, 100000, 150000, 200000, 250000, 500000];

export default function CorporationTaxPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Corporation Tax Calculator UK</h1>
      <Byline />
      <p className="lead">
        Work out how much Corporation Tax your limited company pays on its profits for {CORPORATION_TAX.label},
        including marginal relief.
      </p>
      <CorporationTaxCalculator />
      <div className="prose">
        <h2>Corporation Tax rates from 1 April 2026</h2>
        <table>
          <thead>
            <tr>
              <th>Taxable profits</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Up to £50,000</td>
              <td>19% (small profits rate)</td>
            </tr>
            <tr>
              <td>£50,001 to £250,000</td>
              <td>25% less marginal relief (effective 19%–25%)</td>
            </tr>
            <tr>
              <td>Over £250,000</td>
              <td>25% (main rate)</td>
            </tr>
          </tbody>
        </table>
        <h2>Corporation Tax examples</h2>
        <table>
          <thead>
            <tr>
              <th>Profits</th>
              <th>Corporation Tax</th>
              <th>Effective rate</th>
              <th>Profit after tax</th>
            </tr>
          </thead>
          <tbody>
            {EXAMPLES.map((p) => {
              const r = corporationTax({ profits: p });
              return (
                <tr key={p}>
                  <td>{gbp(p, 0)}</td>
                  <td>{gbp(r.tax)}</td>
                  <td>{pct(r.effectiveRate)}</td>
                  <td>{gbp(r.afterTax)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted">12-month accounting period, no associated companies.</p>
        <p>
          Paying yourself from your company? Use the <Link href="/dividend-tax-calculator">dividend tax calculator</Link>{" "}
          to see the personal tax on dividends. Working as a sole trader instead? Use the{" "}
          <Link href="/self-employed-tax-calculator">self-employed tax calculator</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          Source: GOV.UK, &quot;Rates and allowances: Corporation Tax&quot;. Assumes augmented profits equal taxable
          profits (no exempt distributions received). Guidance only, not tax advice.
        </p>
      </div>
    </>
  );
}
