"use client";

import { useState } from "react";
import { gbp } from "@/lib/tax";
import { MILEAGE_LIMIT, MILEAGE_RATES, mileageClaim, type MileageYear, type Vehicle } from "@/lib/mileage";

const n = (s: string) => {
  const v = parseFloat(s.replace(/[£,p\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};
const TAX_RATES = [
  { v: 20, label: "20% – basic rate" },
  { v: 40, label: "40% – higher rate" },
  { v: 45, label: "45% – additional rate" },
  { v: 19, label: "19% – Scottish starter rate" },
  { v: 21, label: "21% – Scottish intermediate rate" },
  { v: 42, label: "42% – Scottish higher rate" },
  { v: 48, label: "48% – Scottish top rate" },
];

export default function MileageCalculator() {
  const [vehicle, setVehicle] = useState<Vehicle>("car");
  const [year, setYear] = useState<MileageYear>("2026");
  const [miles, setMiles] = useState("8000");
  const [employer, setEmployer] = useState("");
  const [taxRate, setTaxRate] = useState(20);
  const [passengerMiles, setPassengerMiles] = useState("");

  const r = mileageClaim({ vehicle, miles: n(miles), employerPencePerMile: n(employer), taxRatePct: taxRate, passengerMiles: n(passengerMiles), year });
  const rates = MILEAGE_RATES[year].rates[vehicle];
  const p = (x: number) => `${Math.round(x * 100)}p`;

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="field">
            <legend>Vehicle (your own, not a company car)</legend>
            <div className="segmented" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              <button type="button" aria-pressed={vehicle === "car"} onClick={() => setVehicle("car")}>
                Car or van
              </button>
              <button type="button" aria-pressed={vehicle === "motorcycle"} onClick={() => setVehicle("motorcycle")}>
                Motorcycle
              </button>
              <button type="button" aria-pressed={vehicle === "bicycle"} onClick={() => setVehicle("bicycle")}>
                Bicycle
              </button>
            </div>
          </fieldset>
          <fieldset className="field">
            <legend>Tax year</legend>
            <div className="segmented">
              <button type="button" aria-pressed={year === "2026"} onClick={() => setYear("2026")}>
                2026/27
              </button>
              <button type="button" aria-pressed={year === "2025"} onClick={() => setYear("2025")}>
                2025/26
              </button>
            </div>
          </fieldset>
          <label className="field">
            <span>Business miles in the tax year</span>
            <div className="input-row">
              <input inputMode="decimal" value={miles} onChange={(e) => setMiles(e.target.value)} />
              <span className="suffix">miles</span>
            </div>
          </label>
          <label className="field">
            <span>What your employer pays per mile (0 if nothing)</span>
            <div className="input-row">
              <input inputMode="decimal" value={employer} placeholder="0" onChange={(e) => setEmployer(e.target.value)} />
              <span className="suffix">p per mile</span>
            </div>
          </label>
          <label className="field">
            <span>Your highest Income Tax rate</span>
            <select value={taxRate} onChange={(e) => setTaxRate(parseInt(e.target.value, 10))}>
              {TAX_RATES.map((t) => (
                <option key={t.v} value={t.v}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          {vehicle === "car" && (
            <label className="field">
              <span>Miles carrying a colleague on business (optional)</span>
              <div className="input-row">
                <input inputMode="decimal" value={passengerMiles} placeholder="0" onChange={(e) => setPassengerMiles(e.target.value)} />
                <span className="suffix">miles</span>
              </div>
            </label>
          )}
        </form>

        <div className="calc-result" aria-live="polite">
          <p className="result-label">HMRC approved amount ({MILEAGE_RATES[year].label})</p>
          <p className="result-big">{gbp(r.approved)}</p>
          <p className="result-sub">
            {r.firstBandMiles.toLocaleString("en-GB")} miles at {p(rates.first)}
            {r.laterMiles > 0 && rates.after !== rates.first ? ` plus ${r.laterMiles.toLocaleString("en-GB")} miles at ${p(rates.after)}` : ""}. Your employer
            can pay up to this free of tax and National Insurance.
          </p>
          <dl className="stats">
            <div>
              <dt>Paid by employer</dt>
              <dd>{gbp(r.paid)}</dd>
            </div>
            <div>
              <dt>Shortfall you can claim relief on</dt>
              <dd>{gbp(r.shortfall)}</dd>
            </div>
            <div>
              <dt>Tax relief at {taxRate}%</dt>
              <dd>{gbp(r.taxRelief)}</dd>
            </div>
          </dl>
          {r.taxableExcess > 0 && (
            <p className="note">
              Your employer pays {gbp(r.taxableExcess)} more than the approved amount. The extra is taxed as pay and there is no relief to claim.
            </p>
          )}
          {r.shortfall > 0 && (
            <p className="result-sub">
              You do not get the {gbp(r.shortfall)} itself back. Mileage Allowance Relief reduces your tax bill by <strong>{gbp(r.taxRelief)}</strong>.
            </p>
          )}
          {r.passengerPayment > 0 && (
            <p className="result-sub">
              Passenger payment: your employer can also pay up to {gbp(r.passengerPayment)} tax-free (5p a mile). You cannot claim relief if they do not pay it.
            </p>
          )}
          {vehicle === "car" && n(miles) > MILEAGE_LIMIT && <p className="result-sub">The rate drops after {MILEAGE_LIMIT.toLocaleString("en-GB")} miles in a tax year.</p>}
        </div>
      </div>
    </section>
  );
}
