import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import MileageCalculator from "@/components/MileageCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { approvedAmount, mileageClaim } from "@/lib/mileage";
import { gbp } from "@/lib/tax";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/mileage-calculator"),
  description:
    "Work out your business mileage claim at the 2026/27 HMRC rates: 55p for the first 10,000 miles, 25p after. See what you can claim back in tax relief.",
  alternates: { canonical: "/mileage-calculator" },
};

const faqs = [
  {
    q: "Is the HMRC mileage rate 45p or 55p?",
    a: "55p a mile for cars and vans for business journeys from 6 April 2026, for the first 10,000 miles in the tax year. The 45p rate applied in 2025/26 and earlier years.",
  },
  {
    q: "Does 55p cover fuel only?",
    a: "No. It is meant to cover fuel, insurance, servicing, tyres and depreciation, so you cannot claim those separately.",
  },
  {
    q: "How do I claim mileage tax relief?",
    a: "Employees claim online through HMRC, or on a Self Assessment return if they already file one. You can go back four tax years.",
  },
  {
    q: "Does my commute count as business mileage?",
    a: "No. Ordinary travel between your home and your permanent workplace is not business mileage. Trips to clients, other sites and temporary workplaces are.",
  },
  {
    q: "Can I use these rates for a company car?",
    a: "No. These rates are for a vehicle you own or lease yourself. Company cars use HMRC's separate advisory fuel rates.",
  },
  {
    q: "Will the rates change again?",
    a: "The Government has said it will review the rates for years after 2026/27. Check GOV.UK before relying on these figures for 2027/28.",
  },
];

const MILES = [1000, 2500, 5000, 8000, 10000, 12000, 15000, 20000];

export default function Page() {
  const example = mileageClaim({ vehicle: "car", miles: 8000, employerPencePerMile: 30, taxRatePct: 20 });
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("Mileage Calculator", `${SITE_URL}/mileage-calculator`, "FinanceApplication")]} />
      <h1>Mileage Calculator UK 2026/27</h1>
      <Byline />
      <p className="lead">
        Work out your business mileage claim at the HMRC rates: <strong>55p a mile for the first 10,000 miles</strong> and 25p after that. See how much can be
        paid tax-free and the tax relief you can claim if your employer pays less.
      </p>
      <MileageCalculator />

      <div className="prose">
        <h2>HMRC mileage rates for 2026/27</h2>
        <p>The approved rate for cars and vans rose from 45p to 55p from 6 April 2026, the first change since 2011.</p>
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>First 10,000 business miles</th>
              <th>Over 10,000 miles</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cars and vans</td>
              <td>55p</td>
              <td>25p</td>
            </tr>
            <tr>
              <td>Motorcycles</td>
              <td>24p</td>
              <td>24p</td>
            </tr>
            <tr>
              <td>Bicycles</td>
              <td>20p</td>
              <td>20p</td>
            </tr>
          </tbody>
        </table>
        <p>
          The 10,000-mile count covers the whole tax year, 6 April to 5 April, and resets each April. Electric and hybrid cars you own use the same rates as
          petrol and diesel. Employers can also pay 5p a mile for each colleague you carry on a business trip.
        </p>

        <h2>Mileage claim by miles driven (car or van)</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Business miles</th>
                <th>2026/27 approved amount</th>
                <th>2025/26 approved amount</th>
                <th>Tax relief at 20% if nothing is paid</th>
              </tr>
            </thead>
            <tbody>
              {MILES.map((m) => (
                <tr key={m}>
                  <td>{m.toLocaleString("en-GB")}</td>
                  <td>{gbp(approvedAmount("car", m), 0)}</td>
                  <td>{gbp(approvedAmount("car", m, "2025"), 0)}</td>
                  <td>{gbp(approvedAmount("car", m) * 0.2, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How to calculate a mileage claim</h2>
        <p>Multiply your first 10,000 business miles by 55p, and any miles above that by 25p.</p>
        <p>
          <strong>Example:</strong> 12,000 business miles by car in 2026/27 is 10,000 × 55p = £5,500, plus 2,000 × 25p = £500. The approved amount is{" "}
          <strong>{gbp(approvedAmount("car", 12000), 0)}</strong>. Your employer can pay you up to this with no tax or National Insurance.
        </p>

        <h2>If your employer pays less than 55p</h2>
        <p>
          You can claim Mileage Allowance Relief on the shortfall. You do not get the shortfall itself back. You get tax relief on it at your rate of Income Tax.
        </p>
        <p>
          <strong>Example:</strong> 8,000 business miles, employer pays 30p. The approved amount is {gbp(example.approved, 0)}, your employer pays{" "}
          {gbp(example.paid, 0)}, and the shortfall is {gbp(example.shortfall, 0)}. A basic-rate taxpayer gets 20% of that, <strong>{gbp(example.taxRelief, 0)}</strong>
          , back. A higher-rate taxpayer gets 40%, {gbp(example.shortfall * 0.4, 0)}.
        </p>
        <p>If your employer pays more than the approved amount, the excess is taxed as income.</p>

        <h2>What counts as business mileage</h2>
        <ul>
          <li>
            <strong>Counts:</strong> travel to clients, between workplaces, to a temporary workplace, and to training or meetings away from your normal base.
          </li>
          <li>
            <strong>Does not count:</strong> your ordinary commute between home and your permanent workplace, and private journeys.
          </li>
          <li>
            <strong>Company cars:</strong> these rates are for your own vehicle. Company cars use the separate advisory fuel rates.
          </li>
        </ul>
        <p>Keep a log of each trip: date, start and end point, purpose and miles.</p>

        <h2>Self-employed mileage</h2>
        <p>
          Sole traders can use the same flat rates under simplified expenses instead of claiming actual vehicle costs. Once you choose flat rates for a vehicle
          you must keep using them for that vehicle.
        </p>
        <p>
          To see what a journey costs you in fuel alone, use the <Link href="/fuel-cost-calculator">fuel cost calculator</Link>. To see how relief changes your
          pay, try the <Link href="/">take home pay calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
