"use client";

import { useState } from "react";
import { gbp, type Region } from "@/lib/tax";
import { PENSION, projectPension, type Basis } from "@/lib/pension";

export default function PensionCalculator() {
  const [age, setAge] = useState("30");
  const [retireAge, setRetireAge] = useState("68");
  const [salary, setSalary] = useState("35000");
  const [employee, setEmployee] = useState("5");
  const [employer, setEmployer] = useState("3");
  const [basis, setBasis] = useState<Basis>("qualifying");
  const [pot, setPot] = useState("10000");
  const [growth, setGrowth] = useState("3");
  const [statePension, setStatePension] = useState(true);
  const [region, setRegion] = useState<Region>("ruk");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,%\s]/g, ""));
    return Number.isFinite(v) && v >= 0 ? v : 0;
  };

  const r = projectPension({
    age: n(age),
    retireAge: n(retireAge),
    salary: n(salary),
    employeePct: n(employee),
    employerPct: n(employer),
    basis,
    currentPot: n(pot),
    growthPct: n(growth),
    statePension,
    region,
  });
  const marks = r.timeline.filter((t, i) => i > 0 && ((t.age % 5 === 0) || i === r.timeline.length - 1));

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-row">
            <label className="field">
              <span>Your age</span>
              <input inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
            </label>
            <label className="field">
              <span>Retire at</span>
              <input inputMode="numeric" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} />
            </label>
          </div>
          <label className="field">
            <span>Annual salary (before tax)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
          </label>
          <div className="input-row">
            <label className="field">
              <span>You pay</span>
              <div className="input-row">
                <input inputMode="decimal" value={employee} onChange={(e) => setEmployee(e.target.value)} />
                <span className="suffix">%</span>
              </div>
            </label>
            <label className="field">
              <span>Employer pays</span>
              <div className="input-row">
                <input inputMode="decimal" value={employer} onChange={(e) => setEmployer(e.target.value)} />
                <span className="suffix">%</span>
              </div>
            </label>
          </div>
          <label className="field">
            <span>Contributions are a % of</span>
            <select value={basis} onChange={(e) => setBasis(e.target.value as Basis)}>
              <option value="qualifying">Qualifying earnings (£6,240–£50,270)</option>
              <option value="full">Full salary</option>
            </select>
          </label>
          <label className="field">
            <span>Pension pot so far</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={pot} onChange={(e) => setPot(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span>Investment growth after inflation and charges</span>
            <select value={growth} onChange={(e) => setGrowth(e.target.value)}>
              <option value="1">1% a year (cautious)</option>
              <option value="2">2% a year</option>
              <option value="3">3% a year (middle)</option>
              <option value="4">4% a year</option>
              <option value="5">5% a year (optimistic)</option>
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={statePension} onChange={(e) => setStatePension(e.target.checked)} />
            <span>Include the full new State Pension</span>
          </label>
          <fieldset className="field">
            <legend>Where do you live? (for tax relief)</legend>
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
          <p className="result-label">Estimated pension pot at {Math.max(n(age), n(retireAge))} (in today&apos;s money)</p>
          <p className="result-big">{gbp(r.pot, 0)}</p>
          <p className="result-sub">
            That could pay about <strong>{gbp(r.totalIncome, 0)} a year</strong>
            {statePension ? ` (${gbp(r.drawdownIncome, 0)} from your pot plus ${gbp(r.statePension, 0)} State Pension)` : ""}
            , or {gbp(r.totalIncome / 12, 0)} a month before tax.
          </p>
          <dl className="stats">
            <div>
              <dt>Tax-free cash (25%)</dt>
              <dd>{gbp(r.taxFreeLump, 0)}</dd>
            </div>
            <div>
              <dt>Paid in</dt>
              <dd>{gbp(r.totalContributions, 0)}</dd>
            </div>
            <div>
              <dt>Investment growth</dt>
              <dd>{gbp(r.growth, 0)}</dd>
            </div>
          </dl>
          <p className="result-sub">
            This year you pay {gbp(r.employeeYear, 0)} and your employer adds {gbp(r.employerYear, 0)}. After tax relief,
            your contribution costs you about {gbp(r.netCostYear, 0)} ({gbp(r.netCostYear / 12, 0)} a month).
          </p>
          {r.belowMinimum && (
            <p className="note">
              That is below the auto-enrolment minimum of 8% of qualifying earnings, with at least 3% from your employer.
            </p>
          )}
          {r.employeeYear + r.employerYear > PENSION.annualAllowance && (
            <p className="note">Contributions above £60,000 a year (the annual allowance) can trigger a tax charge.</p>
          )}
        </div>
      </div>
      {marks.length > 0 && (
        <>
          <h3 className="section-title">How your pot could grow</h3>
          <div className="table-wrap">
            <table className="breakdown compact">
              <thead>
                <tr>
                  <th scope="col">Age</th>
                  <th scope="col">Total paid in</th>
                  <th scope="col">Pot value</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((t) => (
                  <tr key={t.age}>
                    <th scope="row">{t.age}</th>
                    <td>{gbp(t.contributions, 0)}</td>
                    <td>{gbp(t.pot, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="muted">
        Figures are in today&apos;s money: growth is after inflation, and your salary stays the same in real terms. Income
        assumes you draw 4% of the pot a year. This is an estimate, not financial advice.
      </p>
    </section>
  );
}
