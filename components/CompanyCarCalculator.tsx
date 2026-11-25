"use client";

import { useState } from "react";
import Link from "next/link";
import { companyCarTax, FUEL_TYPES, CAR_YEAR, type FuelType } from "@/lib/companyCar";
import { gbp, type Region } from "@/lib/tax";

const num = (s: string) => {
  const v = parseFloat(s.replace(/[£,\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export default function CompanyCarCalculator() {
  const [price, setPrice] = useState("40000");
  const [fuel, setFuel] = useState<FuelType>("electric");
  const [co2, setCo2] = useState("120");
  const [range, setRange] = useState("40");
  const [salary, setSalary] = useState("45000");
  const [region, setRegion] = useState<Region>("ruk");
  const [cc, setCc] = useState("");
  const [pu, setPu] = useState("");
  const [months, setMonths] = useState("12");
  const [freeFuel, setFreeFuel] = useState(false);
  const co2n = fuel === "electric" ? 0 : num(co2);
  const r = companyCarTax({
    listPrice: num(price), fuel, co2: co2n, electricRange: num(range), salary: num(salary), region,
    capitalContribution: num(cc), privateUsePayments: num(pu), monthsAvailable: Number(months), freeFuel,
  });
  const isHybrid = fuel !== "electric" && co2n >= 1 && co2n <= 50;

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Car list price (including options, VAT and delivery)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Fuel type</span>
            <select value={fuel} onChange={(e) => setFuel(e.target.value as FuelType)}>
              {FUEL_TYPES.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
          </label>
          {fuel !== "electric" && (
            <label className="field">
              <span>CO2 emissions (g/km, from the V5C or your employer)</span>
              <div className="input-row">
                <input inputMode="numeric" value={co2} onChange={(e) => setCo2(e.target.value)} />
                <span className="suffix">g/km</span>
              </div>
            </label>
          )}
          {isHybrid && (
            <label className="field">
              <span>Electric-only range (miles)</span>
              <div className="input-row">
                <input inputMode="numeric" value={range} onChange={(e) => setRange(e.target.value)} />
                <span className="suffix">miles</span>
              </div>
            </label>
          )}
          <label className="field">
            <span>Your salary and other taxable pay for the year</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Where you live</span>
            <select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
              <option value="ruk">England, Wales or Northern Ireland</option>
              <option value="scotland">Scotland</option>
            </select>
          </label>
          <details className="more">
            <summary>More options</summary>
            <label className="field">
              <span>One-off payment you made towards the car (up to £5,000 counts)</span>
              <div className="input-row">
                <span className="prefix">£</span>
                <input inputMode="decimal" value={cc} placeholder="0" onChange={(e) => setCc(e.target.value)} />
              </div>
            </label>
            <label className="field">
              <span>Amount you pay your employer each year for private use</span>
              <div className="input-row">
                <span className="prefix">£</span>
                <input inputMode="decimal" value={pu} placeholder="0" onChange={(e) => setPu(e.target.value)} />
              </div>
            </label>
            <label className="field">
              <span>Months you have the car this tax year</span>
              <select value={months} onChange={(e) => setMonths(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => 12 - i).map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            {fuel !== "electric" && (
              <label className="check">
                <input type="checkbox" checked={freeFuel} onChange={(e) => setFreeFuel(e.target.checked)} />
                My employer pays for fuel I use privately
              </label>
            )}
          </details>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Company car tax a month</p>
          <p className="result-big">{gbp(r.taxMonth)}</p>
          <p className="result-sub">{gbp(r.taxYear)} a year in {CAR_YEAR}, collected through your tax code</p>
          <dl className="stats">
            <div>
              <dt>BIK rate</dt>
              <dd>{r.percent}%</dd>
            </div>
            <div>
              <dt>Taxable benefit</dt>
              <dd>{gbp(r.totalBenefit, 0)}</dd>
            </div>
            <div>
              <dt>Taxed at</dt>
              <dd>{(r.marginalRate * 100).toFixed(0)}%</dd>
            </div>
          </dl>
          {r.fuelBenefit > 0 && (
            <p className="result-sub">Free fuel adds {gbp(r.fuelTaxYear, 0)} a year of that. Paying for your own private fuel removes it.</p>
          )}
        </div>
      </div>
      <h3 className="section-title">How it&apos;s worked out</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <tbody>
            <tr><th scope="row">List price used{num(cc) > 0 ? " (after your contribution)" : ""}</th><td>{gbp(r.priceUsed, 0)}</td></tr>
            <tr><th scope="row">Benefit-in-kind rate</th><td>{r.percent}%</td></tr>
            <tr><th scope="row">Car benefit{Number(months) < 12 ? ` (${months} months)` : ""}{num(pu) > 0 ? ", less your payments" : ""}</th><td>{gbp(r.carBenefit)}</td></tr>
            {r.fuelBenefit > 0 && <tr><th scope="row">Fuel benefit (£29,200 × {r.percent}%)</th><td>{gbp(r.fuelBenefit)}</td></tr>}
            <tr><th scope="row"><b>Income Tax on the benefit</b></th><td><b>{gbp(r.taxYear)}</b></td></tr>
            <tr><th scope="row">Your employer pays Class 1A NI (15%)</th><td>{gbp(r.employerClass1A)}</td></tr>
          </tbody>
        </table>
      </div>
      <p className="note">
        You don&apos;t pay National Insurance on a company car. Comparing a salary sacrifice scheme for an electric car? Use
        the <Link href="/electric-car-salary-sacrifice-calculator">EV salary sacrifice calculator</Link>.
      </p>
    </section>
  );
}
