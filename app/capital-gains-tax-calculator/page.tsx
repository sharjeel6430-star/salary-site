import type { Metadata } from "next";
import Link from "next/link";
import { Byline } from "@/components/Byline";
import CapitalGainsCalculator from "@/components/CapitalGainsCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { capitalGainsTax, CGT_YEAR } from "@/lib/capitalGains";
import { gbp } from "@/lib/tax";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

const PATH = "/capital-gains-tax-calculator";

export const metadata: Metadata = {
  title: shortTitle("/capital-gains-tax-calculator"),
  description:
    "Capital Gains Tax calculator 2026/27: tax on selling shares, property, crypto or business assets, with the £3,000 allowance, 18% and 24% rates and losses.",
  alternates: { canonical: PATH },
};

const ex1 = capitalGainsTax({ income: 32570, salePrice: 12600, purchasePrice: 0 });
const ex2 = capitalGainsTax({ income: 32570, salePrice: 52600, purchasePrice: 0 });

const faqs = [
  {
    q: "What are the Capital Gains Tax rates for 2026/27?",
    a: "18% on gains that fit within your unused basic rate band and 24% on the rest. The same rates apply to shares, residential property, crypto and other assets. Gains that qualify for Business Asset Disposal Relief are taxed at 18% whatever your income.",
  },
  {
    q: "How much is the Capital Gains Tax allowance?",
    a: "The annual exempt amount is £3,000 for 2026/27. You only pay Capital Gains Tax on total gains above that, after taking off any losses. Unused allowance can't be carried forward.",
  },
  {
    q: "How is my Capital Gains Tax rate worked out?",
    a: `Add your taxable gains (after the £3,000 allowance) to your taxable income. Whatever falls within the £37,700 basic rate band is taxed at 18%, and the rest at 24%. For example, with £20,000 of taxable income and a £12,600 gain you pay ${gbp(ex1.tax, 0)}; with a £52,600 gain you pay ${gbp(ex2.tax, 0)}.`,
  },
  {
    q: "Do I pay Capital Gains Tax when I sell my home?",
    a: "Usually not. Private Residence Relief means there's no tax on selling the home you've lived in as your main residence the whole time you owned it. You may pay some if you let it out, used part of it only for business, or the grounds are over 5,000 square metres.",
  },
  {
    q: "When do I pay Capital Gains Tax on property?",
    a: "If you sell UK residential property and owe tax, you must report and pay it within 60 days of completion, using HMRC's Capital Gains Tax on UK property service. Other gains are reported on a Self Assessment tax return, with the tax due by 31 January 2028 for gains made in 2026/27.",
  },
  {
    q: "What costs can I deduct?",
    a: "Costs of buying and selling, such as solicitor and estate agent fees and stamp duty, and the cost of improvements that added value (not repairs or maintenance). For shares, broker fees and stamp duty count.",
  },
  {
    q: "How do losses work?",
    a: "Losses made in the same tax year are taken off your gains in full. Losses from earlier years, if you reported them to HMRC within four years, only reduce your gains down to the £3,000 allowance, and anything left carries forward.",
  },
  {
    q: "What is Business Asset Disposal Relief?",
    a: "It lets owners selling all or part of a qualifying business pay 18% on up to £1 million of lifetime gains, even if they're higher-rate taxpayers. The lifetime limit falls to £500,000 for disposals from 6 April 2027.",
  },
  {
    q: "Do Scottish taxpayers pay different Capital Gains Tax?",
    a: "No. Capital Gains Tax uses the UK-wide rates and the £37,700 basic rate band for everyone, even though Scottish taxpayers have different Income Tax bands.",
  },
];

export default function CapitalGainsPage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("Capital Gains Tax Calculator", `${SITE_URL}${PATH}`, "FinanceApplication")]} />
      <h1>Capital Gains Tax Calculator {CGT_YEAR}</h1>
      <Byline />
      <p className="lead">
        Work out the Capital Gains Tax on selling shares, a second property, crypto or business assets, using this
        year&apos;s £3,000 allowance and the 18% and 24% rates.
      </p>
      <CapitalGainsCalculator />
      <div className="prose">
        <h2>Capital Gains Tax rates {CGT_YEAR}</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th></th><th>Rate</th></tr></thead>
            <tbody>
              <tr><td>Annual exempt amount (tax-free)</td><td>£3,000</td></tr>
              <tr><td>Gains within your unused basic rate band</td><td>18%</td></tr>
              <tr><td>Gains above it (higher and additional rate)</td><td>24%</td></tr>
              <tr><td>Business Asset Disposal Relief and Investors&apos; Relief</td><td>18%</td></tr>
              <tr><td>Trustees and personal representatives</td><td>24%</td></tr>
            </tbody>
          </table>
        </div>
        <h2>Capital Gains Tax examples</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Gain</th><th>Income £30,000</th><th>Income £50,000</th><th>Income £80,000</th></tr></thead>
            <tbody>
              {[5000, 10000, 20000, 50000, 100000].map((g) => (
                <tr key={g}>
                  <td>{gbp(g, 0)}</td>
                  {[30000, 50000, 80000].map((inc) => (
                    <td key={inc}>{gbp(capitalGainsTax({ income: inc, salePrice: g, purchasePrice: 0 }).tax)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">One gain in the year, no losses, full £3,000 allowance available.</p>
        <p>
          Selling shares you were paid in dividends? See the <Link href="/dividend-tax-calculator">dividend tax calculator</Link>.
          Selling a business? Compare with the <Link href="/corporation-tax-calculator">Corporation Tax calculator</Link> and the{" "}
          <Link href="/self-employed-tax-calculator">self-employed tax calculator</Link>. Buying another property? Work out the{" "}
          <Link href="/stamp-duty-calculator">stamp duty</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          Sources: GOV.UK &quot;Capital Gains Tax rates and allowances&quot;, &quot;Capital Gains Tax: rates&quot; (worked
          examples), &quot;Tax when you sell your home&quot; and &quot;Report and pay your Capital Gains Tax&quot;; Budget 2026
          (Business Asset Disposal Relief limit from April 2027). Guidance only, not tax advice.
        </p>
      </div>
    </>
  );
}
