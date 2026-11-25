"use client";

import { useState } from "react";
import Link from "next/link";
import { calculate, gbp } from "@/lib/tax";
import { Breakdown } from "./Breakdown";
import { salaryPath, nearestSalaryPage } from "@/lib/site";

type Mode = "toSalary" | "toHourly";

export default function HourlyConverter({ initialMode = "toSalary" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [rate, setRate] = useState("15");
  const [salary, setSalary] = useState("30000");
  const [hours, setHours] = useState("37.5");
  const [weeks, setWeeks] = useState("52");

  const n = (s: string, d: number) => {
    const v = parseFloat(s.replace(/[£,\s]/g, ""));
    return Number.isFinite(v) && v > 0 ? v : d;
  };
  const hoursN = n(hours, 37.5);
  const weeksN = Math.min(52, n(weeks, 52));
  const annual = mode === "toSalary" ? n(rate, 0) * hoursN * weeksN : n(salary, 0);
  const hourly = annual / (hoursN * weeksN);
  const r = calculate({ gross: annual, hoursPerWeek: hoursN });
  const rounded = Math.round(annual);
  const nearest = nearestSalaryPage(rounded);

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="field">
            <legend>Convert</legend>
            <div className="segmented">
              <button type="button" aria-pressed={mode === "toSalary"} onClick={() => setMode("toSalary")}>
                Hourly → salary
              </button>
              <button type="button" aria-pressed={mode === "toHourly"} onClick={() => setMode("toHourly")}>
                Salary → hourly
              </button>
            </div>
          </fieldset>
          {mode === "toSalary" ? (
            <label className="field">
              <span>Hourly rate</span>
              <div className="input-row">
                <span className="prefix">£</span>
                <input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
              </div>
            </label>
          ) : (
            <label className="field">
              <span>Annual salary</span>
              <div className="input-row">
                <span className="prefix">£</span>
                <input inputMode="decimal" value={salary} onChange={(e) => setSalary(e.target.value)} />
              </div>
            </label>
          )}
          <label className="field">
            <span>Hours per week</span>
            <input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} />
          </label>
          <label className="field">
            <span>Paid weeks per year</span>
            <input inputMode="decimal" value={weeks} onChange={(e) => setWeeks(e.target.value)} />
          </label>
        </form>
        <div className="calc-result" aria-live="polite">
          {mode === "toSalary" ? (
            <>
              <p className="result-label">Annual salary (before tax)</p>
              <p className="result-big">{gbp(annual, 0)}</p>
            </>
          ) : (
            <>
              <p className="result-label">Hourly rate (before tax)</p>
              <p className="result-big">{gbp(hourly)}</p>
            </>
          )}
          <p className="result-sub">
            After tax: {gbp(r.takeHome / (hoursN * weeksN))} an hour · {gbp(r.takeHome / 12)} a month
          </p>
          {nearest && (
            <Link className="result-link" href={salaryPath(nearest)}>
              {nearest === rounded ? "Full" : "Nearest:"} {gbp(nearest, 0)} after tax breakdown →
            </Link>
          )}
        </div>
      </div>
      <h3 className="section-title">Breakdown</h3>
      <Breakdown r={r} />
    </section>
  );
}
