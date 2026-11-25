import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { AUTHOR } from "@/lib/site";
import { TAX_YEAR } from "@/lib/tax";

export const metadata: Metadata = {
  title: `UK Tax and Salary Guides ${TAX_YEAR.label}`,
  description: "Plain-English guides to UK Income Tax, National Insurance, student loans and pensions, checked against HMRC and GOV.UK figures.",
  alternates: { canonical: "/guides" },
};

const guide = (slug: string) => GUIDES.find((g) => g.slug === slug)!;

const GROUPS: { heading: string; items: { href: string; title: string; text: string }[] }[] = [
  {
    heading: "Tax and National Insurance",
    items: [
      { href: `/guides/uk-tax-bands-2026-27`, title: guide("uk-tax-bands-2026-27").title, text: "Income Tax bands for England, Wales, NI and Scotland, the Personal Allowance and the £100,000 trap." },
      { href: `/guides/national-insurance-explained`, title: guide("national-insurance-explained").title, text: "Employee and employer rates, why bonuses cost more NI, and what NI pays for." },
    ],
  },
  {
    heading: "Deductions you can control",
    items: [
      { href: `/guides/salary-sacrifice-pension`, title: guide("salary-sacrifice-pension").title, text: "Which pension method saves the most, including the April 2029 change." },
      { href: `/guides/student-loan-repayments`, title: guide("student-loan-repayments").title, text: "Thresholds and repayment tables for Plans 1, 2, 4, 5 and Postgraduate." },
    ],
  },
  {
    heading: "Cost of living",
    items: [
      { href: "/salary-needed-to-live-uk-cities", title: `Salary Needed to Live in UK Cities ${TAX_YEAR.label}`, text: "Rent, bills and the salary you need in London and nine other cities." },
    ],
  },
];

export default function GuidesIndex() {
  return (
    <>
      <h1>UK Tax and Salary Guides {TAX_YEAR.label}</h1>
      <p className="lead">
        Plain-English guides to what comes out of your pay, written and checked by <Link href={AUTHOR.path}>{AUTHOR.name}</Link> against
        HMRC and GOV.UK figures. Every guide is updated each April and after every Budget. See{" "}
        <Link href="/methodology">how we check our figures</Link>.
      </p>
      {GROUPS.map((g) => (
        <section key={g.heading}>
          <h2>{g.heading}</h2>
          <ul className="guide-list">
            {g.items.map((it) => (
              <li key={it.href} className="card">
                <Link href={it.href}>
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section>
        <h2>Research and data</h2>
        <ul className="guide-list">
          <li className="card">
            <Link href="/research/income-tax-threshold-freeze-2026">
              <h3>The £39,317 line: what the tax threshold freeze costs you</h3>
              <p>Extra income tax and NI at every salary in 2026/27 and 2027/28, with charts and a free data pack.</p>
            </Link>
          </li>
          <li className="card">
            <Link href="/data/uk-take-home-pay-2026-27">
              <h3>UK take-home pay 2026/27: every salary £15k–£150k</h3>
              <p>Charts, the full table and a free CSV: tax, NI, marginal rates, Scotland and student loans for 136 salaries.</p>
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}
