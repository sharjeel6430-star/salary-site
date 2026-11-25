import type { Metadata } from "next";
import Link from "next/link";
import { Byline } from "@/components/Byline";
import CompanyCarCalculator from "@/components/CompanyCarCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { companyCarTax, basePercent, CAR_YEAR, FUEL_MULTIPLIER, RANGE_BANDS } from "@/lib/companyCar";
import { gbp } from "@/lib/tax";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

const PATH = "/company-car-tax-calculator";

export const metadata: Metadata = {
  title: shortTitle("/company-car-tax-calculator"),
  description:
    "Company car tax calculator 2026/27: the monthly benefit-in-kind tax on a petrol, diesel, hybrid or electric company car, using HMRC's latest BIK rates.",
  alternates: { canonical: PATH },
};

const ev40 = companyCarTax({ listPrice: 40000, fuel: "electric", salary: 35000 });
const petrol = companyCarTax({ listPrice: 30000, fuel: "petrol", co2: 120, salary: 35000 });

const faqs = [
  {
    q: "How is company car tax worked out?",
    a: `Multiply the car's list price by its benefit-in-kind (BIK) rate, which depends on its CO2 emissions, to get the taxable benefit. You pay Income Tax on that at your normal rate. A £30,000 petrol car at 120g/km has a 30% rate, a £9,000 benefit and costs a basic-rate taxpayer ${gbp(petrol.taxMonth)} a month.`,
  },
  {
    q: "What is the BIK rate for an electric company car in 2026/27?",
    a: `4%. A £40,000 electric car has a taxable benefit of £1,600, which costs a basic-rate taxpayer ${gbp(ev40.taxMonth)} a month. The rate rises to 5% in 2027/28, 7% in 2028/29 and 9% in 2029/30.`,
  },
  {
    q: "What are the company car tax bands for 2026/27?",
    a: "Electric cars are 4%. Plug-in hybrids at 1 to 50g/km are 4% to 16% depending on electric range. Cars at 51g/km or more start at 17% and rise by 1 percentage point for each 5g/km, up to a maximum of 37% at 155g/km and above.",
  },
  {
    q: "Do diesel company cars cost more?",
    a: "Diesel cars that don't meet the RDE2 (Euro 6d) emissions standard have 4 percentage points added to their rate, up to the 37% maximum. All new diesel cars registered from January 2021 had to meet RDE2, so newer diesels usually pay the same as petrol. The V5C shows Euro status 6AJ to 6AR for cars that meet it. Diesel hybrids don't pay the supplement.",
  },
  {
    q: "What is the fuel benefit charge?",
    a: `If your employer pays for fuel you use privately, you're also taxed on a fuel benefit of £${FUEL_MULTIPLIER.toLocaleString("en-GB")} times the car's BIK rate. It doesn't matter how much fuel you actually use, so it's often cheaper to pay for your own private fuel. There's no fuel benefit for charging an electric car.`,
  },
  {
    q: "Can I reduce my company car tax?",
    a: "Choosing a car with lower emissions, or electric, makes the biggest difference. A one-off contribution towards the car (up to £5,000) lowers the list price used, and anything you pay your employer for private use is deducted from the benefit.",
  },
  {
    q: "Do I pay National Insurance on a company car?",
    a: "No. Employees don't pay NI on a company car. Your employer pays Class 1A National Insurance at 15% of the taxable benefit.",
  },
  {
    q: "How is the tax collected?",
    a: "HMRC usually reduces your tax code so the tax is taken from your pay each month. Some employers instead 'payroll' the benefit, adding it to your taxable pay each payday. From 6 April 2027, employers must payroll company car and car fuel benefits.",
  },
];

const BANDS = [51, 55, 60, 65, 70, 75, 80, 90, 100, 110, 120, 130, 140, 150, 155];

export default function CompanyCarPage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("Company Car Tax Calculator", `${SITE_URL}${PATH}`, "FinanceApplication")]} />
      <h1>Company Car Tax Calculator {CAR_YEAR}</h1>
      <Byline />
      <p className="lead">
        Find out how much tax you pay each month on a company car, whether it&apos;s petrol, diesel, hybrid or electric.
      </p>
      <CompanyCarCalculator />
      <div className="prose">
        <h2>Company car tax rates {CAR_YEAR}</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>CO2 emissions</th><th>Electric range</th><th>BIK rate</th></tr></thead>
            <tbody>
              <tr><td>0g/km (fully electric)</td><td>–</td><td>4%</td></tr>
              {RANGE_BANDS.map((b) => (
                <tr key={b.label}><td>1–50g/km</td><td>{b.label}</td><td>{b.pct}%</td></tr>
              ))}
              {BANDS.map((g, i) => {
                const next = BANDS[i + 1];
                const label = g === 155 ? "155g/km and above" : g === 70 ? "70–74g/km" : g === 75 ? "75–79g/km" : `${g}–${(next ?? g + 5) - 1}g/km`;
                return <tr key={g}><td>{label}</td><td>–</td><td>{basePercent(g)}%{g >= 80 && next && next - g > 5 ? ", then +1% each 5g/km" : ""}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">
          Add 4% for diesel cars that don&apos;t meet RDE2, up to 37%. Source: HMRC Employment Income Manual EIM24705, tax year
          2026 to 2027.
        </p>
        <h2>Monthly company car tax examples</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Car</th><th>BIK rate</th><th>Basic-rate taxpayer</th><th>Higher-rate taxpayer</th></tr></thead>
            <tbody>
              {[
                { name: "£40,000 electric", i: { listPrice: 40000, fuel: "electric" as const } },
                { name: "£45,000 plug-in hybrid, 30g/km, 45 miles", i: { listPrice: 45000, fuel: "petrol" as const, co2: 30, electricRange: 45 } },
                { name: "£30,000 petrol, 120g/km", i: { listPrice: 30000, fuel: "petrol" as const, co2: 120 } },
                { name: "£35,000 diesel (RDE2), 130g/km", i: { listPrice: 35000, fuel: "diesel-rde2" as const, co2: 130 } },
                { name: "£50,000 petrol, 160g/km", i: { listPrice: 50000, fuel: "petrol" as const, co2: 160 } },
              ].map((c) => {
                const b = companyCarTax({ ...c.i, salary: 30000 });
                const h = companyCarTax({ ...c.i, salary: 70000 });
                return <tr key={c.name}><td>{c.name}</td><td>{b.percent}%</td><td>{gbp(b.taxMonth)}</td><td>{gbp(h.taxMonth)}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">England, Wales and Northern Ireland rates. Basic rate on a £30,000 salary, higher rate on £70,000.</p>
        <p>
          An electric car through salary sacrifice can cost much less than a lease paid from take-home pay. See the{" "}
          <Link href="/electric-car-salary-sacrifice-calculator">EV salary sacrifice calculator</Link>, or check your tax code
          and payslip with the <Link href="/payslip-checker">payslip checker</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          Sources: HMRC Employment Income Manual EIM24705 (appropriate percentages 2026 to 2027) and EIM25580 (fuel benefit
          multiplier); GOV.UK &quot;Tax on company benefits&quot;. Guidance only, not tax advice.
        </p>
      </div>
    </>
  );
}
