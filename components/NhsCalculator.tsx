"use client";

import { useState } from "react";
import { calculate, gbp, Region, StudentPlan } from "@/lib/tax";
import { NHS_BANDS, nhsPensionRate } from "@/lib/nhs";
import { Breakdown, SplitBar } from "./Breakdown";

export default function NhsCalculator({ initialBand = "band-5" }: { initialBand?: string }) {
  const [bandSlug, setBandSlug] = useState(initialBand);
  const [pointIdx, setPointIdx] = useState(0);
  const [hours, setHours] = useState("37.5");
  const [inPension, setInPension] = useState(true);
  const [region, setRegion] = useState<Region>("ruk");
  const [studentPlan, setStudentPlan] = useState<StudentPlan>("none");

  const band = NHS_BANDS.find((b) => b.slug === bandSlug) ?? NHS_BANDS[3];
  const point = band.points[Math.min(pointIdx, band.points.length - 1)];
  const h = parseFloat(hours);
  const fraction = Number.isFinite(h) && h > 0 ? Math.min(1, h / 37.5) : 1;
  const gross = point.salary * fraction;
  const rate = inPension ? nhsPensionRate(gross) : 0;
  const r = calculate({
    gross,
    region,
    studentPlan,
    pensionPercent: rate * 100,
    pensionType: "netpay", // NHS pension is deducted before tax but not before NI
    hoursPerWeek: Number.isFinite(h) && h > 0 ? h : 37.5,
  });

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-row">
            <label className="field" style={{ flex: 1 }}>
              <span>Pay band</span>
              <select
                value={bandSlug}
                onChange={(e) => {
                  setBandSlug(e.target.value);
                  setPointIdx(0);
                }}
              >
                {NHS_BANDS.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" style={{ flex: 1 }}>
              <span>Pay point</span>
              <select value={pointIdx} onChange={(e) => setPointIdx(Number(e.target.value))}>
                {band.points.map((p, i) => (
                  <option key={p.label} value={i}>
                    {p.label} – {gbp(p.salary, 0)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Contracted hours per week (full-time = 37.5)</span>
            <input inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} />
          </label>
          <fieldset className="field">
            <legend>Where do you pay tax?</legend>
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
          <label className="check">
            <input type="checkbox" checked={inPension} onChange={(e) => setInPension(e.target.checked)} />
            I pay into the NHS Pension Scheme
          </label>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">
            {band.name} take-home pay ({point.label.toLowerCase()})
          </p>
          <p className="result-big">
            {gbp(r.takeHome / 12)}
            <span> / month</span>
          </p>
          <p className="result-sub">
            {gbp(r.takeHome)} a year from {gbp(gross, 0)} gross
            {fraction < 1 ? ` (${(fraction * 100).toFixed(0)}% of full-time)` : ""}
          </p>
          <SplitBar r={r} />
          {inPension && (
            <p className="result-sub">
              NHS pension: {(rate * 100).toFixed(1)}% tier = {gbp(r.pension / 12)} a month
            </p>
          )}
        </div>
      </div>
      <h3 className="section-title">Breakdown</h3>
      <Breakdown r={r} />
      <p className="note">
        Uses the Agenda for Change pay scales for England from 1 April 2026. Excludes high cost area supplements, unsocial
        hours and overtime.
      </p>
    </section>
  );
}
