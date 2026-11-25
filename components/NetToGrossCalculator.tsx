"use client";

import { useState } from "react";
import Link from "next/link";
import { calculate, gbp, Region, StudentPlan } from "@/lib/tax";
import { grossForTakeHome } from "@/lib/reverse";
import { salaryPath, nearestSalaryPage } from "@/lib/site";
import { Breakdown } from "./Breakdown";

export default function NetToGrossCalculator({ initialMonthly = 3000 }: { initialMonthly?: number }) {
  const [amount, setAmount] = useState(String(initialMonthly));
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [region, setRegion] = useState<Region>("ruk");
  const [studentPlan, setStudentPlan] = useState<StudentPlan>("none");
  const [pension, setPension] = useState("0");

  const v = parseFloat(amount.replace(/[£,\s]/g, ""));
  const net = Number.isFinite(v) && v > 0 ? (period === "month" ? v * 12 : v) : 0;
  const p = Math.min(50, Math.max(0, parseFloat(pension) || 0));
  const opts = { region, studentPlan, pensionPercent: p, pensionType: "sacrifice" as const };
  const gross = grossForTakeHome(net, opts);
  const r = calculate({ ...opts, gross });
  const nearest = nearestSalaryPage(gross);

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Take-home pay you want</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="Take-home amount" />
              <select value={period} onChange={(e) => setPeriod(e.target.value as "month" | "year")} aria-label="Period">
                <option value="month">a month</option>
                <option value="year">a year</option>
              </select>
            </div>
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
          <label className="field">
            <span>Pension (salary sacrifice, % of salary)</span>
            <input inputMode="decimal" value={pension} onChange={(e) => setPension(e.target.value)} />
          </label>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">Salary you need (before tax)</p>
          <p className="result-big">{gbp(gross, 0)}</p>
          <p className="result-sub">
            {gbp(gross / 12)} a month gross → {gbp(r.takeHome / 12)} a month take-home
          </p>
          {nearest && (
            <Link className="result-link" href={salaryPath(nearest)}>
              See the breakdown for about {gbp(nearest, 0)} →
            </Link>
          )}
        </div>
      </div>
      <h3 className="section-title">Breakdown</h3>
      <Breakdown r={r} />
    </section>
  );
}
