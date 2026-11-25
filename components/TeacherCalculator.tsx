"use client";

import { useState } from "react";
import { gbp, Region, StudentPlan } from "@/lib/tax";
import { TEACHER_AREAS, TEACHER_PAY, TEACHER_POINTS, TeacherArea, TeacherPoint, teacherTakeHome } from "@/lib/teachers";
import { Breakdown, SplitBar } from "./Breakdown";

export default function TeacherCalculator() {
  const [area, setArea] = useState<TeacherArea>("england");
  const [point, setPoint] = useState<TeacherPoint>("M1");
  const [fte, setFte] = useState("100");
  const [inPension, setInPension] = useState(true);
  const [studentPlan, setStudentPlan] = useState<StudentPlan>("none");
  const region: Region = "ruk";

  const f = Math.min(100, Math.max(1, parseFloat(fte) || 100)) / 100;
  const fullSalary = TEACHER_PAY[area][point];
  const gross = fullSalary * f;
  const r = teacherTakeHome(gross, { region, studentPlan, inPension, hoursPerWeek: 32.5 * f });

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-row">
            <label className="field" style={{ flex: 1 }}>
              <span>Pay area</span>
              <select value={area} onChange={(e) => setArea(e.target.value as TeacherArea)}>
                {TEACHER_AREAS.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" style={{ flex: 1 }}>
              <span>Pay point</span>
              <select value={point} onChange={(e) => setPoint(e.target.value as TeacherPoint)}>
                {TEACHER_POINTS.map((p) => (
                  <option key={p} value={p}>
                    {p} – {gbp(TEACHER_PAY[area][p], 0)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>Contract (% of full-time)</span>
            <input inputMode="decimal" value={fte} onChange={(e) => setFte(e.target.value)} />
          </label>
          <label className="field">
            <span>Student loan</span>
            <select value={studentPlan} onChange={(e) => setStudentPlan(e.target.value as StudentPlan)}>
              <option value="none">No student loan</option>
              <option value="plan1">Plan 1</option>
              <option value="plan2">Plan 2</option>
              <option value="plan5">Plan 5</option>
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={inPension} onChange={(e) => setInPension(e.target.checked)} />
            I pay into the Teachers&apos; Pension Scheme
          </label>
        </form>
        <div className="calc-result" aria-live="polite">
          <p className="result-label">
            {point} take-home pay ({TEACHER_AREAS.find((a) => a.key === area)!.label})
          </p>
          <p className="result-big">
            {gbp(r.takeHome / 12)}
            <span> / month</span>
          </p>
          <p className="result-sub">
            {gbp(r.takeHome)} a year from {gbp(gross, 0)} gross
            {f < 1 ? ` (${Math.round(f * 100)}% contract)` : ""}
          </p>
          <SplitBar r={r} />
          {inPension && (
            <p className="result-sub">
              Teachers&apos; Pension: {(r.rate * 100).toFixed(1)}% tier = {gbp(r.pension / 12)} a month
            </p>
          )}
        </div>
      </div>
      <h3 className="section-title">Breakdown</h3>
      <Breakdown r={r} />
      <p className="note">
        Hourly figures assume a 32.5-hour week (directed time is 1,265 hours a year). Pay scales are for
        England; Wales, Scotland and Northern Ireland have their own.
      </p>
    </section>
  );
}
