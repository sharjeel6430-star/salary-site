import type { Metadata } from "next";
import { Byline } from "@/components/Byline";
import Link from "next/link";
import FuelCostCalculator from "@/components/FuelCostCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { fuelCost, mpgToL100km } from "@/lib/fuel";
import { gbp } from "@/lib/tax";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

export const metadata: Metadata = {
  title: shortTitle("/fuel-cost-calculator"),
  description:
    "Enter distance, MPG and pump price to see what a journey costs in fuel. Works for petrol, diesel and electric cars, with cost per mile and commute totals.",
  alternates: { canonical: "/fuel-cost-calculator" },
};

const faqs = [
  {
    q: "Is a UK gallon the same as a US gallon?",
    a: "No. A UK gallon is 4.546 litres and a US gallon is 3.785 litres, so US mpg figures look lower for the same car.",
  },
  {
    q: "How do I convert MPG to litres per 100 km?",
    a: "Divide 282.5 by the UK mpg figure. 45 mpg is about 6.3 litres per 100 km. The calculator accepts either unit.",
  },
  {
    q: "Can I claim fuel for business trips?",
    a: "If you use your own car for work, you claim the HMRC mileage rate (55p a mile in 2026/27) rather than the fuel itself. See the mileage calculator.",
  },
  {
    q: "Does this work for electric cars?",
    a: "Yes. Choose Electric, then enter your car's miles per kWh and the price you pay per kWh at home or at a public charger.",
  },
  {
    q: "Can I look up my fuel cost by registration?",
    a: "Some tools look up a car's official MPG from its number plate. That gives the lab test figure, which most drivers do not reach. Measuring your own MPG and entering it here is more accurate.",
  },
];

const MPGS = [30, 40, 50, 60];
const DISTANCES = [10, 25, 50, 100, 200, 400];
const PRICE = 145;

export default function Page() {
  const ex = fuelCost({ miles: 200, mpg: 45, pencePerLitre: PRICE });
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("Fuel Cost Calculator", `${SITE_URL}/fuel-cost-calculator`, "FinanceApplication")]} />
      <h1>Fuel Cost Calculator UK</h1>
      <Byline />
      <p className="lead">
        Enter your distance, your car&apos;s miles per gallon and the price per litre. The calculator shows the fuel you will use, the total cost and the cost
        per mile.
      </p>
      <FuelCostCalculator />

      <div className="prose">
        <h2>The formula</h2>
        <p>
          UK fuel economy is quoted in miles per gallon but fuel is sold in litres, so the sum needs one conversion. One UK gallon is 4.546 litres.
        </p>
        <p>
          <strong>Cost = miles ÷ mpg × 4.546 × price per litre</strong>
        </p>
        <p>
          <strong>Example:</strong> a 200-mile trip in a car doing 45 mpg, with fuel at £1.45 a litre (an example price). 200 ÷ 45 = 4.44 gallons, which is{" "}
          {ex.litres.toFixed(1)} litres, costing <strong>{gbp(ex.cost)}</strong>, or about {(ex.costPerMile * 100).toFixed(1)}p a mile.
        </p>

        <h2>Fuel cost by distance and MPG</h2>
        <p>At an example price of {PRICE}p a litre. Enter your own pump price above for an exact figure.</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Distance</th>
                {MPGS.map((m) => (
                  <th key={m}>{m} mpg</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DISTANCES.map((d) => (
                <tr key={d}>
                  <td>{d} miles</td>
                  {MPGS.map((m) => (
                    <td key={m}>{gbp(fuelCost({ miles: d, mpg: m, pencePerLitre: PRICE }).cost)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Finding your real MPG</h2>
        <p>The official figure for your car is measured in a lab test and most drivers get less. To measure your own:</p>
        <ol>
          <li>Fill the tank and reset the trip meter.</li>
          <li>Drive as normal until you next fill up.</li>
          <li>Note the miles driven and the litres it took to refill.</li>
          <li>Miles divided by litres, multiplied by 4.546, is your MPG.</li>
        </ol>

        <h2>MPG to litres per 100 km</h2>
        <table>
          <thead>
            <tr>
              <th>UK mpg</th>
              <th>Litres per 100 km</th>
            </tr>
          </thead>
          <tbody>
            {[25, 30, 35, 40, 45, 50, 60, 70].map((m) => (
              <tr key={m}>
                <td>{m}</td>
                <td>{mpgToL100km(m).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>What changes your fuel cost</h2>
        <ul>
          <li>
            <strong>Speed.</strong> Fuel use climbs sharply above 60 to 70 mph.
          </li>
          <li>
            <strong>Short trips.</strong> A cold engine uses more fuel.
          </li>
          <li>
            <strong>Load and roof boxes.</strong> Extra weight and drag both cost fuel.
          </li>
          <li>
            <strong>Tyre pressure.</strong> Under-inflated tyres raise consumption.
          </li>
          <li>
            <strong>Where you fill up.</strong> Motorway services usually charge well above supermarket forecourts.
          </li>
        </ul>

        <h2>Cost of a commute</h2>
        <p>
          Enter your one-way distance, tick Return trip and add the number of days you travel each week. A 15-mile each-way commute at{" "}
          {(ex.costPerMile * 100).toFixed(1)}p a mile is {gbp(30 * ex.costPerMile)} a day, about {gbp(30 * ex.costPerMile * 230, 0)} over 230 working days. If
          the journey is for work rather than your commute, see what you can claim with the <Link href="/mileage-calculator">mileage calculator</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
      </div>
    </>
  );
}
