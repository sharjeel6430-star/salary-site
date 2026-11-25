"use client";

// Take-home pay for NHS resident doctors (FY1–ST8) and consultants, with NHS pension.
import { useState } from "react";
import { gbp, pct, Region, StudentPlan } from "@/lib/tax";
import { DOCTOR_GRADES, doctorTakeHome } from "@/lib/doctors";
import { Breakdown, SplitBar } from "./Breakdown";

const n = (s: string) => {
  const v = parseFloat(s.replace(/[£,%\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export default function DoctorCalculator() {
  const [grade, setGrade] = useState("fy1");
  const [ltft, setLtft] = useState("100");
  const [extras, setExtras] = useState("");
  const [region, setRegion] = useState<Region>("ruk");
  const [studentPlan, setStudentPlan] = useState<StudentPlan>("none");
  const [postgraduate, setPostgraduate] = useState(false);
  const [inPension, setInPension] = useState(true);
  const [custom, setCustom] = useState("45000");

  const isCustom = grade === "custom";
  const g = DOCTOR_GRADES.find((x) => x.key === grade) ?? DOCTOR_GRADES[0];
  const label = isCustom ? "Your" : g.label;
  const f = Math.min(100, Math.max(1, n(ltft) || 100)) / 100;
  const basic = (isCustom ? n(custom) : g.salary) * f;
  const pay = basic + n(extras);
  const r = doctorTakeHome(pay, { region, studentPlan, postgraduate, inPension });

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span>Grade</span>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <optgroup label="Resident doctors (2016 contract)">
                {DOCTOR_GRADES.filter((x) => x.group === "resident").map((x) => (
                  <option key={x.key} value={x.key}>
                    {x.label} – {gbp(x.salary, 0)}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Consultants (2003 contract)">
                {DOCTOR_GRADES.filter((x) => x.group === "consultant").map((x) => (
                  <option key={x.key} value={x.key}>
                    {x.label} – {gbp(x.salary, 0)}
                  </option>
                ))}
              </optgroup>
              <option value="custom">Other – enter my basic salary (e.g. Scotland, Wales, NI, SAS)</option>
            </select>
          </label>

          {isCustom && (
            <label className="field">
              <span>Full-time basic salary</span>
              <div className="input-row">
                <span className="prefix">£</span>
                <input inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value)} />
              </div>
            </label>
          )}

          <label className="field">
            <span>Working pattern (% of full time)</span>
            <div className="input-row">
              <input inputMode="decimal" value={ltft} onChange={(e) => setLtft(e.target.value)} aria-label="Percent of full time" />
              <span className="suffix">%</span>
            </div>
          </label>

          <label className="field">
            <span>Extra pay per year (additional hours, nights, weekends, on-call)</span>
            <div className="input-row">
              <span className="prefix">£</span>
              <input inputMode="decimal" placeholder="0" value={extras} onChange={(e) => setExtras(e.target.value)} />
            </div>
          </label>

          <fieldset className="field">
            <legend>Tax rates</legend>
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
              <option value="none">No UK student loan</option>
              <option value="plan1">Plan 1</option>
              <option value="plan2">Plan 2</option>
              <option value="plan4">Plan 4 (Scotland)</option>
              <option value="plan5">Plan 5</option>
            </select>
          </label>

          <label className="check">
            <input type="checkbox" checked={postgraduate} onChange={(e) => setPostgraduate(e.target.checked)} />
            I have a Postgraduate Loan
          </label>
          <label className="check">
            <input type="checkbox" checked={inPension} onChange={(e) => setInPension(e.target.checked)} />
            I pay into the NHS Pension Scheme
          </label>
        </form>

        <div className="calc-result" aria-live="polite">
          <p className="result-label">
            {label} take-home pay{f < 1 ? ` (${Math.round(f * 100)}% LTFT)` : ""}
          </p>
          <p className="result-big">
            {gbp(r.takeHome / 12)}
            <span> / month</span>
          </p>
          <p className="result-sub">
            {gbp(r.takeHome)} a year from {gbp(pay, 0)} gross
          </p>
          <SplitBar r={r} />
          <p className="result-sub">
            {inPension
              ? `NHS Pension: ${pct(r.rate)} tier = ${gbp(r.pension / 12)} a month`
              : "Not in the NHS Pension Scheme"}
          </p>
        </div>
      </div>
      <h3 className="section-title">Breakdown</h3>
      <Breakdown r={r} />
      <p className="note">
        Pay scales shown are for England from 1 April 2026. Doctors in Scotland, Wales and Northern Ireland, and SAS
        doctors, can choose &quot;Other&quot; and enter their own basic salary. Pension is worked out on all pay entered.
      </p>
    </section>
  );
}
