"use client";

import { useState } from "react";
import { gbp, pct, type Region, type StudentPlan } from "@/lib/tax";
import { CAR_TYPES, evSacrifice, type CarType } from "@/lib/ev";

export default function EvSacrificeCalculator() {
  const [salary, setSalary] = useState("45000");
  const [monthly, setMonthly] = useState("500");
  const [listPrice, setListPrice] = useState("40000");
  const [carType, setCarType] = useState<CarType>("ev");
  const [region, setRegion] = useState<Region>("ruk");
  const [studentPlan, setStudentPlan] = useState<StudentPlan>("none");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const r = evSacrifice({
    salary: n(salary),
    monthlySacrifice: n(monthly),
    listPrice: n(listPrice),
    carType,
    region,
    studentPlan,
  });
  const after = r.after.takeHome - r.bikTax;

  const rows = [
    { label: "Gross salary", b: r.before.gross, a: r.after.gross },
    { label: "Income Tax (incl. BIK tax)", b: r.before.incomeTax, a: r.after.incomeTax + r.bikTax },
    { label: "National Insurance", b: r.before.nationalInsurance, a: r.after.nationalInsurance },
    ...(studentPlan !== "none" ? [{ label: "Student loan", b: r.before.studentLoan, a: r.after.studentLoan }] : []),
    { label: "Take-home pay", b: r.before.takeHome, a: after, strong: true },
  ];

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Annual salary (before the car)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Monthly salary sacrifice cost (from your scheme quote)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Car list price (P11D value)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={listPrice} onChange={(e) => setListPrice(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Type of car</span>
            <select value={carType} onChange={(e) => setCarType(e.target.value as CarType)}>
              {CAR_TYPES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label} – {Math.round(c.pct * 100)}% BIK
                </option>
              ))}
            </select>
          </label>
          <fieldset className="field">
            <legend>Where do you live?</legend>
            <div className="segmented">
              <button type="button" aria-pressed={region === "ruk"} onClick={() => setRegion("ruk")}>
                England, Wales, NI
              </button>
              <button type="button" aria-pressed={region === "scotland"} onClick={() => setRegion("scotland")}>
                Scotland
              </button>
            </div>
          </fieldset>
          <label className="field">
            <span>Student loan</span>
            <select value={studentPlan} onChange={(e) => setStudentPlan(e.target.value as StudentPlan)}>
              <option value="none">No student loan</option>
              <option value="plan1">Plan 1</option>
              <option value="plan2">Plan 2</option>
              <option value="plan4">Plan 4 (Scotland)</option>
              <option value="plan5">Plan 5</option>
            </select>
          </label>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Real cost of the car to you</p>
          <p className="result-big">{gbp(r.netCostMonth)} a month</p>
          <p className="result-sub">
            Instead of {gbp(r.annualSacrifice / 12)} a month from your take-home pay —{" "}
            <strong>
              you save {gbp(r.savingYear / 12)} a month ({pct(r.savingPercent, 0)})
            </strong>
          </p>
          <dl className="stats">
            <div>
              <dt>Tax saved</dt>
              <dd>{gbp(r.taxSaved, 0)}</dd>
            </div>
            <div>
              <dt>NI saved</dt>
              <dd>{gbp(r.niSaved, 0)}</dd>
            </div>
            <div>
              <dt>BIK tax</dt>
              <dd>{gbp(r.bikTax, 0)}</dd>
            </div>
          </dl>
          <p className="result-sub">
            Taxable benefit: {gbp(r.bikValue, 0)} a year ({Math.round(r.bikPercent * 100)}% of {gbp(n(listPrice), 0)}). Your
            employer saves {gbp(r.employerNISaved, 0)} in employer NI.
          </p>
          {r.belowMinimumWage && (
            <p className="note">
              Warning: after the sacrifice your pay would fall below the National Living Wage for a 37.5-hour week. Schemes
              cannot take your pay below the minimum wage, so check this with your employer.
            </p>
          )}
        </div>
      </div>
      <h3 className="section-title">Before and after the car (yearly)</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Before</th>
              <th scope="col">With the car</th>
              <th scope="col">Difference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className={row.strong ? "total" : undefined}>
                <th scope="row">{row.label}</th>
                <td>{gbp(row.b)}</td>
                <td>{gbp(row.a)}</td>
                <td>{gbp(row.a - row.b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
