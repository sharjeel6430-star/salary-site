"use client";

import { useState } from "react";
import { bonusNi, NI_CATEGORIES, NI_PERIODS, NI_YEAR, type NiCategoryKey, type NiPeriodKey } from "@/lib/nationalInsurance";
import { gbp } from "@/lib/tax";

const num = (s: string) => {
  const v = parseFloat(s.replace(/[£,\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};
const pct = (r: number) => (r === 0 ? "0%" : `${+(r * 100).toFixed(2)}%`);

export default function NationalInsuranceCalculator() {
  const [pay, setPay] = useState("3000");
  const [period, setPeriod] = useState<NiPeriodKey>("month");
  const [cat, setCat] = useState<NiCategoryKey>("A");
  const [bonus, setBonus] = useState("");
  const b = bonusNi(num(pay), num(bonus), period, cat);
  const r = b.withBonus;
  const hasBonus = num(bonus) > 0;
  const per = r.period.key === "year" ? "a year" : r.period.key === "month" ? "a month" : r.period.key === "week" ? "a week" : "this pay period";

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Pay before tax in the pay period</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={pay} onChange={(e) => setPay(e.target.value)} aria-describedby="ni-pay-help" />
            </div>
          </label>
          <label className="field">
            <span>How often you are paid</span>
            <select value={period} onChange={(e) => setPeriod(e.target.value as NiPeriodKey)}>
              {NI_PERIODS.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>National Insurance category letter (on your payslip)</span>
            <select value={cat} onChange={(e) => setCat(e.target.value as NiCategoryKey)}>
              {NI_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Bonus or overtime paid in the same period (optional)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={bonus} placeholder="0" onChange={(e) => setBonus(e.target.value)} />
            </div>
          </label>
          <p className="note" id="ni-pay-help">
            Use pay after any salary sacrifice. NI is worked out separately for each pay period, so a bonus month is taxed
            on that month&apos;s pay alone.
          </p>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Your National Insurance {per}</p>
          <p className="result-big">{gbp(r.employee)}</p>
          <p className="result-sub">Your employer also pays {gbp(r.employer)}</p>
          <dl className="stats">
            <div>
              <dt>Pay after NI</dt>
              <dd>{gbp(r.pay - r.employee)}</dd>
            </div>
            <div>
              <dt>Your NI a year*</dt>
              <dd>{gbp(r.perYear.employee, 0)}</dd>
            </div>
            <div>
              <dt>Employer NI a year*</dt>
              <dd>{gbp(r.perYear.employer, 0)}</dd>
            </div>
          </dl>
          {hasBonus && (
            <p className="result-sub">
              Of your {gbp(num(bonus))} bonus, {gbp(b.employeeOnBonus)} goes in NI. In a normal period you pay{" "}
              {gbp(b.normal.employee)}.
            </p>
          )}
          {r.belowLel && <p className="result-sub">Pay below {gbp(r.period.lel, 0)} in this period does not count towards your State Pension record.</p>}
          <p className="note">*If every pay period is the same as this one{hasBonus ? ", bonus included" : ""}.</p>
        </div>
      </div>
      <h3 className="section-title">How your National Insurance is worked out ({NI_YEAR})</h3>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr><th scope="col">You pay</th><th scope="col">Pay in band</th><th scope="col">Rate</th><th scope="col">NI</th></tr>
          </thead>
          <tbody>
            {r.employeeBands.map((x) => (
              <tr key={x.label}>
                <th scope="row">{x.label} ({x.to === Infinity ? `over ${gbp(x.from, 0)}` : `${gbp(x.from, 0)}–${gbp(x.to, 0)}`})</th>
                <td>{gbp(x.amount)}</td><td>{pct(x.rate)}</td><td>{gbp(x.ni)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-wrap">
        <table className="breakdown compact">
          <thead>
            <tr><th scope="col">Your employer pays</th><th scope="col">Pay in band</th><th scope="col">Rate</th><th scope="col">NI</th></tr>
          </thead>
          <tbody>
            {r.employerBands.map((x) => (
              <tr key={x.label}>
                <th scope="row">{x.label} ({x.to === Infinity ? `over ${gbp(x.from, 0)}` : `${gbp(x.from, 0)}–${gbp(x.to, 0)}`})</th>
                <td>{gbp(x.amount)}</td><td>{pct(x.rate)}</td><td>{gbp(x.ni)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
