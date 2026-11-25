import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import SickPayCalculator from "@/components/SickPayCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { SSP, statutorySickPay } from "@/lib/ssp";
import { gbp } from "@/lib/tax";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/statutory-sick-pay-calculator"),
  description:
    "SSP calculator for the rules from 6 April 2026: the lower of £123.25 a week or 80% of average weekly earnings, paid from day one for up to 28 weeks.",
  alternates: { canonical: "/statutory-sick-pay-calculator" },
};

const faqs = [
  {
    q: "What is the SSP rate for 2026/27?",
    a: "From 6 April 2026, Statutory Sick Pay is £123.25 a week, or 80% of your average weekly earnings if that is lower. It is paid for up to 28 weeks.",
  },
  {
    q: "Is SSP paid from the first day of sickness?",
    a: "Yes. Since 6 April 2026 there are no waiting days: SSP is paid from your first qualifying day off sick. Before that, the first three days were unpaid.",
  },
  {
    q: "Do I need to earn a minimum amount to get SSP?",
    a: "No. The Lower Earnings Limit (£125 a week in 2025/26) was removed from 6 April 2026, so low-paid and part-time employees now qualify. If 80% of your average weekly earnings is less than £123.25, you get 80% of your earnings instead.",
  },
  {
    q: "How is my daily SSP worked out?",
    a: "Divide the weekly rate by the number of days you normally work in a week (your qualifying days). If you work 5 days, the full daily rate is £24.65. You are paid that for each qualifying day you are off sick.",
  },
  {
    q: "Who can get Statutory Sick Pay?",
    a: "Employees and workers on your employer's payroll who are too ill to work and tell their employer in time. Self-employed people, including those who pay their own tax through Self Assessment, cannot get SSP.",
  },
  {
    q: "Do I need a fit note?",
    a: "Not for the first 7 days in a row — you can self-certify. If you are off for more than 7 days, including non-working days, your employer can ask for a fit note from a GP, nurse, pharmacist or other healthcare professional.",
  },
  {
    q: "Is SSP taxed?",
    a: "Yes. SSP is paid through payroll like normal pay, so Income Tax and National Insurance are deducted in the usual way.",
  },
  {
    q: "What happens after 28 weeks of SSP?",
    a: "SSP stops. Your employer should send you form SSP1 so you can claim Universal Credit or New Style Employment and Support Allowance instead. Separate spells of sickness less than 8 weeks apart are linked and count towards the same 28 weeks.",
  },
];

const EARNINGS = [80, 100, 125, 150, 200, 400, 600];

export default function SickPayPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Statutory Sick Pay Calculator",
            url: `${SITE_URL}/statutory-sick-pay-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />
      <h1>Statutory Sick Pay Calculator 2026/27</h1>
      <Byline />
      <p className="lead">
        Work out your Statutory Sick Pay under the new rules from {SSP.from}: <strong>{gbp(SSP.weeklyRate)} a week</strong>{" "}
        or 80% of your earnings if lower, paid from your first day off sick.
      </p>
      <SickPayCalculator />

      <div className="prose">
        <h2>What changed in April 2026?</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Before 6 April 2026</th>
              <th>From 6 April 2026</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Waiting days</td>
              <td>First 3 days unpaid</td>
              <td>None — paid from day one</td>
            </tr>
            <tr>
              <td>Minimum earnings</td>
              <td>£125 a week (Lower Earnings Limit)</td>
              <td>No minimum</td>
            </tr>
            <tr>
              <td>Weekly rate</td>
              <td>£118.75 flat rate</td>
              <td>Lower of £123.25 or 80% of average weekly earnings</td>
            </tr>
            <tr>
              <td>Maximum length</td>
              <td>28 weeks</td>
              <td>28 weeks</td>
            </tr>
          </tbody>
        </table>
        <p>
          The changes come from the Employment Rights Act 2025. The Government estimates that around 1.3 million low-paid
          workers became eligible for the first time.
        </p>

        <h2>SSP by weekly earnings</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Average weekly earnings</th>
                <th>Weekly SSP</th>
                <th>Daily SSP (5-day week)</th>
              </tr>
            </thead>
            <tbody>
              {EARNINGS.map((e) => {
                const r = statutorySickPay({ averageWeeklyEarnings: e, qualifyingDaysPerWeek: 5, sickDays: 5 });
                return (
                  <tr key={e}>
                    <td>{gbp(e)}</td>
                    <td>{gbp(r.weeklyRate)}</td>
                    <td>{gbp(r.dailyRate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">
          Anyone earning £154.07 a week or more gets the full £123.25. Below that, SSP is 80% of average weekly earnings.
        </p>

        <h2>How SSP is calculated</h2>
        <ol>
          <li>
            <strong>Work out your average weekly earnings</strong> — usually your gross pay over the 8 weeks before you went
            off sick, divided by 8.
          </li>
          <li>
            <strong>Find your weekly rate</strong> — the lower of £123.25 and 80% of those earnings.
          </li>
          <li>
            <strong>Divide by your qualifying days</strong> — the days you normally work each week — to get the daily rate.
          </li>
          <li>
            <strong>Multiply by the qualifying days you are off sick</strong>, for up to 28 weeks.
          </li>
        </ol>

        <h2>SSP and company sick pay</h2>
        <p>
          SSP is the legal minimum. Many employers pay full or half pay for a set number of weeks under an occupational sick
          pay scheme, which includes your SSP. Check your contract or staff handbook. If your employer refuses to pay SSP,
          you can ask HMRC&apos;s Statutory Payment Disputes Team to decide.
        </p>
        <p>
          SSP shows on your payslip as a separate line — check it with the <Link href="/payslip-checker">payslip checker</Link>.
          To see a full year&apos;s pay after tax, use the <Link href="/">take home pay calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
