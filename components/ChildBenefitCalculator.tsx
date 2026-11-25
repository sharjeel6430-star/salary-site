"use client";

import { useState } from "react";
import { gbp, pct, type Region, type TaxYearKey } from "@/lib/tax";
import { HICBC, childBenefitCharge } from "@/lib/childBenefit";

export default function ChildBenefitCalculator() {
  const [income, setIncome] = useState("70000");
  const [children, setChildren] = useState(2);
  const [pension, setPension] = useState("0");
  const [year, setYear] = useState<TaxYearKey>("2026/27");
  const [region, setRegion] = useState<Region>("ruk");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,%\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const r = childBenefitCharge({ income: n(income), pensionPercent: n(pension), children, year, region });

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Income of the higher earner (salary, bonus and other taxable income)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Number of children you claim for</span>
            <select value={children} onChange={(e) => setChildren(parseInt(e.target.value, 10))}>
              {[1, 2, 3, 4, 5, 6].map((c) => (
                <option key={c} value={c}>
                  {c} {c === 1 ? "child" : "children"}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Pension contributions (% of income)</span>
            <div className="input-row">
              <input inputMode="decimal" value={pension} onChange={(e) => setPension(e.target.value)} />
              <span className="suffix">%</span>
            </div>
          </label>
          <label className="field">
            <span>Tax year</span>
            <select value={year} onChange={(e) => setYear(e.target.value as TaxYearKey)}>
              <option value="2026/27">2026/27 (current)</option>
              <option value="2025/26">2025/26</option>
            </select>
          </label>
          <fieldset className="field">
            <legend>Where does the higher earner live?</legend>
            <div className="segmented">
              <button type="button" aria-pressed={region === "ruk"} onClick={() => setRegion("ruk")}>
                England, Wales, NI
              </button>
              <button type="button" aria-pressed={region === "scotland"} onClick={() => setRegion("scotland")}>
                Scotland
              </button>
            </div>
          </fieldset>
        </form>

        <div className="calc-result" aria-live="polite">
          <p className="result-label">Child Benefit you keep each year</p>
          <p className="result-big">{gbp(r.kept)}</p>
          <p className="result-sub">
            You receive {gbp(r.benefit)} a year for {children} {children === 1 ? "child" : "children"}.{" "}
            {r.charge > 0 ? (
              <>
                The High Income Child Benefit Charge takes back <strong>{r.percent}%</strong>, which is{" "}
                <strong>{gbp(r.charge, 0)}</strong>.
              </>
            ) : (
              <strong>No charge: the higher earner&apos;s adjusted net income is £60,000 or less.</strong>
            )}
          </p>
          <dl className="stats">
            <div>
              <dt>Adjusted net income</dt>
              <dd>{gbp(r.adjustedNetIncome, 0)}</dd>
            </div>
            <div>
              <dt>Charge</dt>
              <dd>{gbp(r.charge, 0)}</dd>
            </div>
            <div>
              <dt>Kept a month</dt>
              <dd>{gbp(r.kept / 12)}</dd>
            </div>
          </dl>
          {r.adjustedNetIncome > HICBC.threshold && r.adjustedNetIncome < HICBC.upper && (
            <p className="result-sub">
              Between £60,000 and £80,000 you lose {pct(r.marginalRate, 0)} of each extra pound to tax, NI and the
              charge. Paying an extra {gbp(r.pensionToAvoid, 0)} a year into your pension would remove the charge
              completely.
            </p>
          )}
          {r.adjustedNetIncome >= HICBC.upper && (
            <p className="note">
              All of the Child Benefit is taken back. You can opt out of the payments to avoid filling in a tax return,
              but keep the claim: it protects the State Pension record of a parent who isn&apos;t working, and gets your
              child a National Insurance number.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
