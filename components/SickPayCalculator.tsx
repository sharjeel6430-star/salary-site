"use client";

import { useState } from "react";
import { gbp } from "@/lib/tax";
import { SSP, statutorySickPay, toWeekly, type PayBasis } from "@/lib/ssp";

export default function SickPayCalculator() {
  const [pay, setPay] = useState("2400");
  const [basis, setBasis] = useState<PayBasis>("month");
  const [days, setDays] = useState("5");
  const [sick, setSick] = useState("3");

  const n = (s: string) => {
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const awe = toWeekly(n(pay), basis);
  const qd = Math.max(1, Math.min(7, Math.round(n(days) || 5)));
  const r = statutorySickPay({ averageWeeklyEarnings: awe, qualifyingDaysPerWeek: qd, sickDays: n(sick) });

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Your average pay before tax (last 8 weeks)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={pay} onChange={(e) => setPay(e.target.value)} />
              <select value={basis} onChange={(e) => setBasis(e.target.value as PayBasis)} aria-label="Pay period">
                <option value="week">per week</option>
                <option value="month">per month</option>
                <option value="year">per year</option>
              </select>
            </div>
          </label>
          <label className="field">
            <span>Days you normally work each week (qualifying days)</span>
            <select value={qd} onChange={(e) => setDays(e.target.value)}>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Working days off sick</span>
            <div className="input-row">
              <input inputMode="numeric" value={sick} onChange={(e) => setSick(e.target.value)} />
              <span className="suffix">days</span>
            </div>
          </label>
        </form>

        <div className="calc-result" aria-live="polite">
          <p className="result-label">Statutory Sick Pay for this absence</p>
          <p className="result-big">{gbp(r.total)}</p>
          <p className="result-sub">
            {r.daysPaid} {r.daysPaid === 1 ? "day" : "days"} × {gbp(r.dailyRate)} a day. Your weekly SSP rate is{" "}
            <strong>{gbp(r.weeklyRate)}</strong>
            {r.usesEarningsRate ? ` — 80% of your average weekly earnings of ${gbp(awe)}, as that is less than £123.25.` : " (the full rate)."}
          </p>
          <dl className="stats">
            <div>
              <dt>Normal pay for these days</dt>
              <dd>{gbp(r.normalPay, 0)}</dd>
            </div>
            <div>
              <dt>SSP</dt>
              <dd>{gbp(r.total, 0)}</dd>
            </div>
            <div>
              <dt>Difference</dt>
              <dd>{gbp(r.lostPay, 0)}</dd>
            </div>
          </dl>
          <p className="result-sub">
            Under the rules before {SSP.from} this absence would have paid {gbp(r.previousRules)}
            {awe < SSP.previous.lowerEarningsLimit
              ? " — nothing, because you earn under the old £125 a week limit."
              : " — the first 3 days were unpaid waiting days."}
          </p>
          {n(sick) > r.maxDays && (
            <p className="note">
              SSP stops after 28 weeks ({r.maxDays} working days). After that you may be able to claim Universal Credit or
              Employment and Support Allowance.
            </p>
          )}
        </div>
      </div>
      <p className="muted">
        SSP is the legal minimum. Many employers pay more under a company sick pay scheme — check your contract. SSP is
        paid through payroll and Income Tax and National Insurance are taken from it in the usual way.
      </p>
    </section>
  );
}
