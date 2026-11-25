import type { Metadata } from "next";
import Link from "next/link";
import { Byline } from "@/components/Byline";
import StampDutyCalculator from "@/components/StampDutyCalculator";
import { JsonLd, Faqs, faqSchema, webAppSchema } from "@/components/JsonLd";
import { propertyTax } from "@/lib/stampDuty";
import { gbp } from "@/lib/tax";
import { SITE_URL } from "@/lib/site";
import { shortTitle } from "@/lib/titleOverrides";

const PATH = "/stamp-duty-calculator";

export const metadata: Metadata = {
  title: shortTitle("/stamp-duty-calculator"),
  description:
    "Stamp duty calculator 2026: how much you pay in England, Northern Ireland, Scotland (LBTT) or Wales (LTT), for first-time buyers, home movers and second homes.",
  alternates: { canonical: PATH },
};

const e = (price: number, buyer: "mover" | "first" | "additional", nation: "england" | "scotland" | "wales" = "england") => propertyTax({ price, buyer, nation }).tax;

const faqs = [
  {
    q: "How much is stamp duty in 2026?",
    a: `In England and Northern Ireland you pay 0% on the first £125,000, 2% on the portion from £125,001 to £250,000, 5% from £250,001 to £925,000, 10% from £925,001 to £1.5 million and 12% above that. A £295,000 home costs ${gbp(e(295000, "mover"), 0)} in stamp duty.`,
  },
  {
    q: "Do first-time buyers pay stamp duty?",
    a: `Not on the first £300,000. First-time buyers pay 5% on the portion from £300,001 to £500,000, so a £400,000 first home costs ${gbp(e(400000, "first"), 0)}. If the price is over £500,000 there's no relief and the normal rates apply. Everyone buying with you must also be a first-time buyer.`,
  },
  {
    q: "How much stamp duty on a second home or buy-to-let?",
    a: `In England and Northern Ireland you pay 5% on top of every band if you'll own more than one home and the property costs £40,000 or more. A £250,000 buy-to-let costs ${gbp(e(250000, "additional"), 0)}. If the new home replaces your main residence, you can reclaim the extra if you sell the old one within 3 years.`,
  },
  {
    q: "What is the stamp duty in Scotland?",
    a: `Scotland charges Land and Buildings Transaction Tax (LBTT): 0% to £145,000, 2% to £250,000, 5% to £325,000, 10% to £750,000 and 12% above. First-time buyers pay nothing on the first £175,000, saving up to £600. Additional homes pay an 8% Additional Dwelling Supplement on the whole price. A £300,000 home costs ${gbp(e(300000, "mover", "scotland"), 0)}.`,
  },
  {
    q: "What is the stamp duty in Wales?",
    a: `Wales charges Land Transaction Tax (LTT): 0% to £225,000, 6% to £400,000, 7.5% to £750,000, 10% to £1.5 million and 12% above. There's no first-time buyer relief, but the higher starting threshold covers most first homes. A £300,000 home costs ${gbp(e(300000, "mover", "wales"), 0)}.`,
  },
  {
    q: "Do non-UK residents pay more stamp duty?",
    a: "Yes, in England and Northern Ireland buyers who weren't in the UK for at least 183 days in the 12 months before buying pay a 2% surcharge on top of the other rates, including the additional-property rates.",
  },
  {
    q: "When do I pay stamp duty?",
    a: "Your solicitor normally files the return and pays on completion. In England and Northern Ireland the deadline is 14 days after completion; in Scotland and Wales it's 30 days.",
  },
  {
    q: "Can I add stamp duty to my mortgage?",
    a: "Not directly: stamp duty is due at completion, so most buyers pay it from savings. Some borrow a little more to cover it, which increases the loan-to-value. Check the monthly cost with the mortgage calculator.",
  },
];

const PRICES = [200000, 250000, 300000, 350000, 400000, 500000, 750000, 1000000];

export default function StampDutyPage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs), webAppSchema("Stamp Duty Calculator", `${SITE_URL}${PATH}`, "FinanceApplication")]} />
      <h1>Stamp Duty Calculator 2026</h1>
      <Byline />
      <p className="lead">
        Work out the stamp duty on a home in England or Northern Ireland, or the equivalent tax in Scotland and Wales, for
        first-time buyers, home movers and additional properties.
      </p>
      <StampDutyCalculator />
      <div className="prose">
        <h2>Stamp duty by price</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Price</th><th>Home mover</th><th>First-time buyer</th><th>Additional property</th><th>Scotland</th><th>Wales</th></tr></thead>
            <tbody>
              {PRICES.map((p) => (
                <tr key={p}>
                  <td>{gbp(p, 0)}</td>
                  <td>{gbp(e(p, "mover"), 0)}</td>
                  <td>{gbp(e(p, "first"), 0)}</td>
                  <td>{gbp(e(p, "additional"), 0)}</td>
                  <td>{gbp(e(p, "mover", "scotland"), 0)}</td>
                  <td>{gbp(e(p, "mover", "wales"), 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">England and Northern Ireland unless stated. Scotland and Wales columns are for home movers.</p>
        <h2>Stamp duty rates in England and Northern Ireland</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Portion of the price</th><th>Main home</th><th>First-time buyer</th><th>Additional property</th></tr></thead>
            <tbody>
              <tr><td>Up to £125,000</td><td>0%</td><td>0%</td><td>5%</td></tr>
              <tr><td>£125,001 to £250,000</td><td>2%</td><td>0%</td><td>7%</td></tr>
              <tr><td>£250,001 to £300,000</td><td>5%</td><td>0%</td><td>10%</td></tr>
              <tr><td>£300,001 to £500,000</td><td>5%</td><td>5%</td><td>10%</td></tr>
              <tr><td>£500,001 to £925,000</td><td>5%</td><td>No relief: main home rates</td><td>10%</td></tr>
              <tr><td>£925,001 to £1.5 million</td><td>10%</td><td>No relief</td><td>15%</td></tr>
              <tr><td>Over £1.5 million</td><td>12%</td><td>No relief</td><td>17%</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Planning the purchase? See your monthly repayments and how much you could borrow with the{" "}
          <Link href="/mortgage-calculator">mortgage calculator</Link>, and the{" "}
          <Link href="/salary-needed-to-live-uk-cities">salary needed to live in UK cities</Link>. Selling a second property?
          Work out the <Link href="/capital-gains-tax-calculator">Capital Gains Tax</Link>.
        </p>
        <h2>Frequently asked questions</h2>
        <Faqs faqs={faqs} />
        <p className="muted">
          Sources: GOV.UK &quot;Stamp Duty Land Tax: residential property rates&quot; and &quot;Higher rates of Stamp Duty Land
          Tax&quot;; gov.scot Scottish Budget 2026 to 2027 (LBTT rates and bands); gov.wales &quot;Land Transaction Tax rates and
          bands&quot;. Residential purchases by individuals only; doesn&apos;t cover leases, mixed-use property or companies.
          Guidance only, not tax or legal advice.
        </p>
      </div>
    </>
  );
}
