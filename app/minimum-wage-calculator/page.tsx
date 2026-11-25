import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import MinimumWageCalculator from "@/components/MinimumWageCalculator";
import { JsonLd, Faqs, faqSchema } from "@/components/JsonLd";
import { AGE_BANDS, WAGE_YEARS, minimumRate, minimumWagePay } from "@/lib/minimumWage";
import { gbp } from "@/lib/tax";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/minimum-wage-calculator"),
  description:
    "National Minimum Wage 2026: £12.71 an hour for 21 and over, £10.85 for 18–20, £8.00 for 16–17 and apprentices. See your pay after tax and the 2027 rates.",
  alternates: { canonical: "/minimum-wage-calculator" },
};

const r26 = (b: Parameters<typeof minimumRate>[0]) => gbp(minimumRate(b, "2026/27"));
const r27 = (b: Parameters<typeof minimumRate>[0]) => gbp(minimumRate(b, "2027/28"));
const fullTime = minimumWagePay({ band: "21plus", hoursPerWeek: 37.5 });

const faqs = [
  {
    q: "What is the minimum wage in the UK in 2026?",
    a: "From 1 April 2026 the National Living Wage for workers aged 21 and over is £12.71 an hour. The minimum wage is £10.85 an hour for 18 to 20 year olds, and £8.00 an hour for 16 and 17 year olds and apprentices.",
  },
  {
    q: "What will the minimum wage be in April 2027?",
    a: "The Government confirmed on 28 October 2026 that from 1 April 2027 the National Living Wage rises by 3.9% to £13.21 an hour. The 18–20 rate rises to £11.27, and the 16–17 and apprentice rates to £8.31.",
  },
  {
    q: "How much is minimum wage per month?",
    a: `At £12.71 an hour for a 37.5-hour week, you earn ${gbp(fullTime.monthly)} a month before tax, or about ${gbp(fullTime.takeHomeMonth)} after Income Tax and National Insurance (no pension or student loan). That is ${gbp(fullTime.yearly, 0)} a year.`,
  },
  {
    q: "What is the minimum wage for an 18 year old?",
    a: "An 18 year old must be paid at least £10.85 an hour from April 2026, rising to £11.27 from April 2027. If they are an apprentice in the first year of their apprenticeship, the apprentice rate of £8.00 an hour applies instead.",
  },
  {
    q: "What is the minimum wage for a 16 year old?",
    a: "Once you are over school leaving age, the minimum wage for 16 and 17 year olds is £8.00 an hour from April 2026 and £8.31 from April 2027. There is no minimum wage for children below school leaving age.",
  },
  {
    q: "Is the minimum wage different in London or Scotland?",
    a: "No. The legal minimum wage is the same everywhere in the UK, including London, Scotland, Wales and Northern Ireland. The higher 'Real Living Wage' and 'London Living Wage' are voluntary rates set by the Living Wage Foundation, which some employers choose to pay.",
  },
  {
    q: "Is there a minimum wage increase in October?",
    a: "No. Minimum wage rates change once a year, on 1 April. The new rates are usually announced in the autumn (often in October or November), which is why people search for an 'October increase' — but the pay rise itself starts the following April.",
  },
  {
    q: "What is the difference between the National Living Wage and the National Minimum Wage?",
    a: "Both are legal minimums. The National Living Wage is the rate for workers aged 21 and over; the National Minimum Wage is the set of lower rates for 16–20 year olds and apprentices. The voluntary Real Living Wage is different again.",
  },
  {
    q: "What can I do if I'm paid less than the minimum wage?",
    a: "Raise it with your employer in writing first — mistakes with unpaid training, uniform costs or overtime are common. You can get free advice from Acas, and report underpayment to the government through GOV.UK's pay and work rights service. Employers who underpay must repay arrears at current rates and can be fined.",
  },
];

const HOURS = [16, 20, 25, 30, 35, 37.5, 40];
const HISTORY = [
  { year: "2027/28 (from April 2027)", nlw: 13.21, age: "21+" },
  { year: "2026/27", nlw: 12.71, age: "21+" },
  { year: "2025/26", nlw: 12.21, age: "21+" },
  { year: "2024/25", nlw: 11.44, age: "21+" },
  { year: "2023/24", nlw: 10.42, age: "23+" },
  { year: "2022/23", nlw: 9.5, age: "23+" },
  { year: "2021/22", nlw: 8.91, age: "23+" },
];

export default function MinimumWagePage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs),
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Minimum Wage Calculator UK",
            url: `${SITE_URL}/minimum-wage-calculator`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />
      <h1>Minimum Wage Calculator UK 2026</h1>
      <Byline />
      <p className="lead">
        The National Living Wage is <strong>{r26("21plus")} an hour</strong> from 1 April 2026. See what the minimum wage
        pays per week, month and year after tax for your age — and check that your employer is paying you enough.
      </p>
      <MinimumWageCalculator />

      <div className="prose">
        <h2>National Minimum Wage rates 2026</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Age</th>
                <th>April 2025</th>
                <th>April 2026 (now)</th>
                <th>April 2027</th>
              </tr>
            </thead>
            <tbody>
              {AGE_BANDS.map((b) => (
                <tr key={b.key}>
                  <td>{b.key === "21plus" ? "21 and over (National Living Wage)" : b.short}</td>
                  <td>{gbp(minimumRate(b.key, "2025/26"))}</td>
                  <td>
                    <strong>{gbp(minimumRate(b.key, "2026/27"))}</strong>
                  </td>
                  <td>{gbp(minimumRate(b.key, "2027/28"))}</td>
                </tr>
              ))}
              <tr>
                <td>Accommodation offset (per day)</td>
                {WAGE_YEARS.map((y) => (
                  <td key={y.key}>{gbp(y.accommodationOffset)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The apprentice rate applies to apprentices under 19, and to apprentices of any age in the first year of their
          apprenticeship. After that, they get the rate for their age — so a 21-year-old apprentice who has finished their
          first year is entitled to {r26("21plus")} an hour.
        </p>

        <h2>Minimum wage 2027: the new rates from April 2027</h2>
        <p>
          On 28 October 2026 the Government accepted the Low Pay Commission&apos;s recommendations in full. From 1 April 2027
          every rate rises by 3.9%: the National Living Wage to <strong>{r27("21plus")}</strong>, the 18–20 rate to{" "}
          {r27("18to20")}, and the 16–17 and apprentice rates to {r27("16to17")}. For a full-time worker on 37.5 hours a
          week, that is a rise of{" "}
          {gbp(minimumWagePay({ band: "21plus", hoursPerWeek: 37.5, year: "2027/28" }).yearly - fullTime.yearly, 0)} a year
          before tax. Choose &quot;1 April 2027&quot; in the calculator to see your new pay.
        </p>

        <h2>Minimum wage per month and per year (21 and over)</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Hours a week</th>
                <th>Per week</th>
                <th>Per month</th>
                <th>Per year</th>
                <th>Take-home a month</th>
              </tr>
            </thead>
            <tbody>
              {HOURS.map((h) => {
                const p = minimumWagePay({ band: "21plus", hoursPerWeek: h });
                return (
                  <tr key={h}>
                    <td>{h}</td>
                    <td>{gbp(p.weekly)}</td>
                    <td>{gbp(p.monthly)}</td>
                    <td>{gbp(p.yearly, 0)}</td>
                    <td>{gbp(p.takeHomeMonth)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">
          At {r26("21plus")} an hour, 52 paid weeks, England, Wales and Northern Ireland, standard 1257L tax code. A workplace
          pension of 5% would reduce take-home pay a little more.
        </p>

        <h2>Minimum wage for 16, 17, 18, 19 and 20 year olds</h2>
        <ul>
          <li>
            <strong>16 and 17 year olds</strong> (over school leaving age): {r26("16to17")} an hour. A 20-hour week pays{" "}
            {gbp(minimumWagePay({ band: "16to17", hoursPerWeek: 20 }).yearly, 0)} a year — below the Personal Allowance,
            so no Income Tax or National Insurance is due.
          </li>
          <li>
            <strong>18, 19 and 20 year olds</strong>: {r26("18to20")} an hour. A 37.5-hour week pays{" "}
            {gbp(minimumWagePay({ band: "18to20", hoursPerWeek: 37.5 }).yearly, 0)} a year before tax.
          </li>
          <li>
            <strong>21 and over</strong>: the National Living Wage of {r26("21plus")} an hour.
          </li>
        </ul>
        <p>
          The 18–20 rate rose by 8.5% in April 2026, much faster than the adult rate, because the Government plans to bring
          it into line with the National Living Wage over time.
        </p>

        <h2>Is the minimum wage different in London or Scotland?</h2>
        <p>
          No — the legal minimum wage is the same across the whole UK. What differs is the voluntary{" "}
          <strong>Real Living Wage</strong>, set by the Living Wage Foundation from the cost of living, which has a higher
          separate rate for London. Employers that sign up as accredited Living Wage employers pay it to all staff aged 18
          and over; other employers only have to pay the legal minimum. The Foundation announces new rates each autumn.
        </p>

        <h2>When does the minimum wage go up?</h2>
        <p>
          Every year on <strong>1 April</strong>. The Low Pay Commission recommends new rates in the autumn and the
          Government announces them — for April 2027, that happened on 28 October 2026. There is no separate rise in
          August, September or October.
        </p>

        <h2>National Living Wage history</h2>
        <table>
          <thead>
            <tr>
              <th>Year from April</th>
              <th>Adult rate</th>
              <th>Age it applied from</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((h) => (
              <tr key={h.year}>
                <td>{h.year}</td>
                <td>{gbp(h.nlw)}</td>
                <td>{h.age}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>What counts as working time?</h2>
        <p>Your pay is checked against the hours you actually work, including:</p>
        <ul>
          <li>time on training your employer requires;</li>
          <li>travel between jobs or clients during the working day (not your commute);</li>
          <li>time you must be at work and available, even if it is quiet.</li>
        </ul>
        <p>
          Unpaid lunch breaks don&apos;t count. Deductions for uniforms or tools that take you below the minimum are not
          allowed. Free accommodation is the only benefit that can count towards the minimum, up to the daily accommodation
          offset.
        </p>
        <p>
          Paid more than the minimum? See your take-home pay with the{" "}
          <Link href="/hourly-to-salary">hourly to salary calculator</Link> or the{" "}
          <Link href="/monthly-salary-calculator">monthly salary calculator</Link>. Working part-time? Use the{" "}
          <Link href="/pro-rata-salary-calculator">pro rata salary calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
