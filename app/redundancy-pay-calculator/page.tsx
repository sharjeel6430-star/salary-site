import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import RedundancyCalculator from "@/components/RedundancyCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { REDUNDANCY, statutoryRedundancy } from "@/lib/redundancy";
import { gbp } from "@/lib/tax";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/redundancy-pay-calculator"),
  description:
    "Statutory redundancy pay calculator from 6 April 2026: weekly pay capped at £751 (£783 in NI), up to 20 years' service, with the £30,000 tax-free limit.",
  alternates: { canonical: "/redundancy-pay-calculator" },
};

const ex = statutoryRedundancy({ age: 45, years: 12, weeklyPay: 650 });

const faqs = [
  {
    q: "How is statutory redundancy pay calculated?",
    a: "You get half a week's pay for each full year you worked while under 22, one week's pay for each full year aged 22 to 40, and one and a half weeks' pay for each full year aged 41 or over. Only your last 20 years count, and weekly pay is capped at £751 for redundancies on or after 6 April 2026.",
  },
  {
    q: "What is the maximum statutory redundancy pay in 2026?",
    a: "£22,530 in England, Scotland and Wales (20 years × 1.5 weeks × £751), and £23,490 in Northern Ireland, where the weekly cap is £783.",
  },
  {
    q: "Do I qualify for redundancy pay?",
    a: "You need to be an employee with at least 2 years' continuous service with your employer. You may lose the right if you unreasonably turn down suitable alternative work offered by your employer. Workers, contractors and the self-employed are not entitled to statutory redundancy pay.",
  },
  {
    q: "Is redundancy pay taxed?",
    a: "The first £30,000 of redundancy pay, including statutory and extra non-contractual redundancy pay, is free of Income Tax and National Insurance. Anything above £30,000 is taxed as income. Notice pay, holiday pay and pay in lieu of notice are taxed as normal pay.",
  },
  {
    q: "What counts as a week's pay?",
    a: "Your normal gross weekly pay before tax. If your hours or pay vary, it is the average over the 12 weeks before you were given notice. Whatever you earn, no more than £751 a week (£783 in Northern Ireland) is used.",
  },
  {
    q: "Can my employer pay more than statutory redundancy pay?",
    a: "Yes. Many employers offer enhanced redundancy pay, for example by removing the weekly cap or paying more weeks per year. Check your contract and staff handbook. Add the extra amount in the calculator to see the tax on your whole package.",
  },
  {
    q: "Am I entitled to notice pay as well?",
    a: "Yes. By law you get at least one week's notice once you have worked for a month, and one week for each full year once you have worked for 2 years or more, up to 12 weeks — or longer if your contract says so. You can be paid in lieu of notice instead of working it.",
  },
  {
    q: "When should I be paid?",
    a: "Usually on or soon after your last day. If your employer doesn't pay, raise it with them in writing, contact Acas, and if necessary claim through an employment tribunal — usually within 6 months. If your employer is insolvent, you can claim from the government's Redundancy Payments Service.",
  },
];

const AGES = [25, 30, 35, 40, 45, 50, 55, 60];
const YEARS = [2, 5, 10, 15, 20];
const CAPS = [
  { from: "6 April 2026", cap: 751, max: 22530 },
  { from: "6 April 2025", cap: 719, max: 21570 },
  { from: "6 April 2024", cap: 700, max: 21000 },
  { from: "6 April 2023", cap: 643, max: 19290 },
];

export default function RedundancyPage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Redundancy Pay Calculator UK",
            url: `${SITE_URL}/redundancy-pay-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />
      <h1>Redundancy Pay Calculator UK 2026</h1>
      <Byline />
      <p className="lead">
        Work out the statutory redundancy pay you are owed from your age, years of service and weekly pay, using the{" "}
        {gbp(REDUNDANCY.weeklyCap.gb, 0)} weekly cap that applies from {REDUNDANCY.from} — plus the tax on any package over
        £30,000.
      </p>
      <RedundancyCalculator />

      <div className="prose">
        <h2>How statutory redundancy pay works</h2>
        <p>Redundancy pay depends on three things: your age, your full years of service and your weekly pay.</p>
        <ul>
          <li>
            <strong>Half a week&apos;s pay</strong> for each full year you worked while under 22
          </li>
          <li>
            <strong>One week&apos;s pay</strong> for each full year aged 22 to 40
          </li>
          <li>
            <strong>One and a half weeks&apos; pay</strong> for each full year aged 41 or older
          </li>
        </ul>
        <p>
          Years are counted back from the date you are made redundant, and only the last 20 count. For example, someone
          aged 45 with 12 years&apos; service on £650 a week gets {ex.weeks} weeks&apos; pay: {gbp(ex.pay)}.
        </p>

        <h2>Redundancy pay table (weeks&apos; pay)</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Age</th>
                {YEARS.map((y) => (
                  <th key={y}>{y} years</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AGES.map((a) => (
                <tr key={a}>
                  <td>{a}</td>
                  {YEARS.map((y) => {
                    const r = statutoryRedundancy({ age: a, years: y, weeklyPay: 1 });
                    return <td key={y}>{y > a - 16 ? "–" : r.weeks}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">Multiply by your weekly pay, up to {gbp(REDUNDANCY.weeklyCap.gb, 0)}.</p>

        <h2>Weekly pay cap and maximum redundancy pay</h2>
        <table>
          <thead>
            <tr>
              <th>Redundancies from</th>
              <th>Weekly pay cap</th>
              <th>Maximum statutory pay</th>
            </tr>
          </thead>
          <tbody>
            {CAPS.map((c) => (
              <tr key={c.from}>
                <td>{c.from}</td>
                <td>{gbp(c.cap, 0)}</td>
                <td>{gbp(c.max, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          England, Scotland and Wales. In Northern Ireland the cap is {gbp(REDUNDANCY.weeklyCap.ni, 0)} a week from 6 April
          2026, making the maximum {gbp(REDUNDANCY.weeklyCap.ni * 30, 0)}. The cap goes up every April.
        </p>

        <h2>Is redundancy pay taxable?</h2>
        <p>
          The first {gbp(REDUNDANCY.taxFree, 0)} of a redundancy payment is free of Income Tax and National Insurance, so
          statutory redundancy pay is never taxed on its own. If an enhanced package takes you over £30,000, the excess is
          taxed at your normal rates (no employee National Insurance is due on it). These are paid and taxed as normal pay:
        </p>
        <ul>
          <li>your final salary and any notice pay or pay in lieu of notice;</li>
          <li>holiday pay for leave you haven&apos;t taken;</li>
          <li>bonuses or commission you were owed.</li>
        </ul>
        <p>
          Your take-home pay on your normal salary is in the <Link href="/">take home pay calculator</Link>. If you have a
          large payout, putting some into a pension can reduce the tax — see the{" "}
          <Link href="/pension-calculator">pension calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          This calculator gives an estimate of statutory redundancy pay. It is not legal advice — check your contract, and
          contact Acas for free advice about your situation.
        </p>
      </div>
    </>
  );
}
