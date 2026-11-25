import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { TAX_YEAR } from "@/lib/tax";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/scotland-salary-calculator"),
  description: `Calculate your take-home pay in Scotland for ${TAX_YEAR.label} using the six Scottish Income Tax bands (19% to 48%), National Insurance, Plan 4 student loan and pension.`,
  alternates: { canonical: "/scotland-salary-calculator" },
};

const faqs = [
  {
    q: "Who pays Scottish Income Tax?",
    a: "You pay Scottish Income Tax if your main home is in Scotland, even if you work elsewhere in the UK. Your tax code will start with an S.",
  },
  {
    q: "Is National Insurance different in Scotland?",
    a: "No. National Insurance is set UK-wide, so Scottish employees pay the same 8% and 2% rates as everyone else.",
  },
  {
    q: "Which student loan plan do Scottish students have?",
    a: "Most students from Scotland have a Plan 4 loan, which is repaid at 9% of income over £33,795 a year in 2026/27.",
  },
];

export default function ScotlandPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <h1>Take Home Pay Calculator Scotland {TAX_YEAR.label}</h1>
      <Byline />
      <p className="lead">
        Work out your take-home pay as a Scottish taxpayer. Scotland has six Income Tax bands, so your net pay can differ
        from the rest of the UK.
      </p>
      <Calculator initialRegion="scotland" />
      <div className="prose">
        <h2>Scottish Income Tax bands {TAX_YEAR.label}</h2>
        <table>
          <thead>
            <tr>
              <th>Band</th>
              <th>Total income</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Personal Allowance</td><td>Up to £12,570</td><td>0%</td></tr>
            <tr><td>Starter rate</td><td>£12,571 – £16,537</td><td>19%</td></tr>
            <tr><td>Basic rate</td><td>£16,538 – £29,526</td><td>20%</td></tr>
            <tr><td>Intermediate rate</td><td>£29,527 – £43,662</td><td>21%</td></tr>
            <tr><td>Higher rate</td><td>£43,663 – £75,000</td><td>42%</td></tr>
            <tr><td>Advanced rate</td><td>£75,001 – £125,140</td><td>45%</td></tr>
            <tr><td>Top rate</td><td>Over £125,140</td><td>48%</td></tr>
          </tbody>
        </table>
        <p className="muted">
          Assumes the standard Personal Allowance, which is reduced by £1 for every £2 of income over £100,000. Source:
          Scottish Government.
        </p>
        <p>
          Compare with the <Link href="/guides/uk-tax-bands-2026-27">rest of the UK tax bands</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
