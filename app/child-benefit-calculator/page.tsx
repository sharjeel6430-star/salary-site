import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import ChildBenefitCalculator from "@/components/ChildBenefitCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { CB_RATES, childBenefitCharge, childBenefitWeekly, childBenefitYearly } from "@/lib/childBenefit";
import { gbp, pct } from "@/lib/tax";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/child-benefit-calculator"),
  description:
    "Child Benefit calculator 2026/27: £27.05 a week for the eldest child, £17.90 for each other. See what you keep after the High Income Child Benefit Charge.",
  alternates: { canonical: "/child-benefit-calculator" },
};

const rates = CB_RATES["2026/27"];
const two70 = childBenefitCharge({ income: 70000, children: 2 });

const faqs = [
  {
    q: "How much is Child Benefit in 2026/27?",
    a: `Child Benefit is £${rates.eldest.toFixed(2)} a week for your eldest or only child and £${rates.other.toFixed(2)} a week for each additional child, from 6 April 2026. That is ${gbp(childBenefitYearly(1))} a year for one child and ${gbp(childBenefitYearly(2))} for two. There is no limit on the number of children you can claim for.`,
  },
  {
    q: "What is the High Income Child Benefit Charge?",
    a: "It is a tax charge that takes back some or all of your Child Benefit if you or your partner has adjusted net income over £60,000. You repay 1% of the Child Benefit for every £200 of income above £60,000, so at £80,000 or more the whole amount is taken back.",
  },
  {
    q: "Who pays the charge?",
    a: "The partner with the higher adjusted net income pays it, whoever receives the Child Benefit. 'Partner' includes someone you are married to, in a civil partnership with, or living with as a couple. The charge is based on individual income, so two parents each earning £59,000 pay nothing.",
  },
  {
    q: "How much Child Benefit do I keep on £70,000?",
    a: `With two children, adjusted net income of £70,000 means half the Child Benefit is taken back: you receive ${gbp(two70.benefit)}, the charge is ${gbp(two70.charge, 0)} and you keep ${gbp(two70.kept)} a year.`,
  },
  {
    q: "What is adjusted net income?",
    a: "Your total taxable income — salary, bonus, benefits in kind, self-employed profits, rental income and taxable savings or dividend income — minus pension contributions and Gift Aid donations (grossed up), and certain trading losses.",
  },
  {
    q: "How can I reduce the High Income Child Benefit Charge?",
    a: "Paying more into a pension reduces adjusted net income, especially through salary sacrifice, which also saves National Insurance. Gift Aid donations reduce it too. If your income is between £60,000 and £80,000, each extra £1 in your pension can save you more than 50p in tax, NI and charge combined.",
  },
  {
    q: "How do I pay the charge?",
    a: "Traditionally through a Self Assessment tax return. Employed people can now report Child Benefit to HMRC online and have the charge collected through their tax code instead. Either way, you must tell HMRC if your income goes over £60,000.",
  },
  {
    q: "Should I still claim Child Benefit if I earn over £80,000?",
    a: "Usually yes — but you can choose not to receive the payments. Claiming gives a parent who is not working, or earns less than the National Insurance threshold, National Insurance credits towards their State Pension while the child is under 12, and means your child gets a National Insurance number automatically at 16.",
  },
];

const INCOMES = [60000, 62000, 65000, 68000, 70000, 72000, 75000, 78000, 80000];

export default function ChildBenefitPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Child Benefit Calculator",
            url: `${SITE_URL}/child-benefit-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />
      <h1>Child Benefit Calculator 2026/27</h1>
      <Byline />
      <p className="lead">
        See how much Child Benefit you get and how much you keep after the High Income Child Benefit Charge — and how
        paying more into your pension could bring the charge down.
      </p>
      <ChildBenefitCalculator />

      <div className="prose">
        <h2>Child Benefit rates 2026/27</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Children</th>
                <th>Weekly</th>
                <th>Every 4 weeks</th>
                <th>Yearly 2026/27</th>
                <th>Yearly 2025/26</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((c) => (
                <tr key={c}>
                  <td>{c}</td>
                  <td>{gbp(childBenefitWeekly(c))}</td>
                  <td>{gbp(childBenefitWeekly(c) * 4)}</td>
                  <td>{gbp(childBenefitYearly(c))}</td>
                  <td>{gbp(childBenefitYearly(c, "2025/26"))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The eldest or only child gets £{rates.eldest.toFixed(2)} a week and each other child £{rates.other.toFixed(2)}{" "}
          (up from £{CB_RATES["2025/26"].eldest.toFixed(2)} and £{CB_RATES["2025/26"].other.toFixed(2)} in 2025/26).
          Child Benefit is usually paid every four weeks and continues until 16, or 20 if your child stays in approved
          education or training.
        </p>

        <h2>How the High Income Child Benefit Charge works</h2>
        <p>
          If the higher earner&apos;s adjusted net income is over £60,000, they repay 1% of the family&apos;s Child Benefit for
          every £200 above it. At £80,000 the charge equals the whole benefit. The percentage is rounded down, so £60,199
          means no charge and £60,200 means 1%.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Adjusted net income</th>
                <th>Charge</th>
                <th>Kept: 1 child</th>
                <th>Kept: 2 children</th>
                <th>Kept: 3 children</th>
              </tr>
            </thead>
            <tbody>
              {INCOMES.map((i) => (
                <tr key={i}>
                  <td>{gbp(i, 0)}</td>
                  <td>{childBenefitCharge({ income: i, children: 1 }).percent}%</td>
                  {[1, 2, 3].map((c) => (
                    <td key={c}>{gbp(childBenefitCharge({ income: i, children: c }).kept, 0)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>The £60,000 to £80,000 tax trap</h2>
        <p>
          In this range the charge acts like an extra tax on top of 40% Income Tax and 2% National Insurance. With two
          children at £70,000, each extra £200 of pay costs {pct(two70.marginalRate, 0)} in tax, NI and lost Child
          Benefit — so a pay rise is worth much less than you might expect. Use the{" "}
          <Link href="/compare-salaries">compare salaries tool</Link> to see a pay rise after tax.
        </p>

        <h2>How to reduce the charge with your pension</h2>
        <p>
          Pension contributions come off your adjusted net income. Someone earning £70,000 who pays an extra £10,000 a year
          into their pension brings their income down to £60,000 and keeps all their Child Benefit. With salary sacrifice
          they also save Income Tax and National Insurance on the £10,000 — see the{" "}
          <Link href="/salary-sacrifice-calculator">salary sacrifice calculator</Link> or the{" "}
          <Link href="/pension-calculator">pension calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
