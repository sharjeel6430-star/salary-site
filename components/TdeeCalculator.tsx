"use client";

import { useState } from "react";
import { ACTIVITY_LEVELS, tdee, type ActivityId } from "@/lib/health";
import { useBody } from "./BodyFields";

const kcal = (x: number) => Math.round(x).toLocaleString("en-GB");

export default function TdeeCalculator() {
  const body = useBody();
  const [activity, setActivity] = useState<ActivityId>("light");
  const r = tdee({ sex: body.sex, kg: body.weightKg, cm: body.heightCm, age: body.age, activity });

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          {body.fields}
          <label className="field">
            <span>Activity level</span>
            <select value={activity} onChange={(e) => setActivity(e.target.value as ActivityId)}>
              {ACTIVITY_LEVELS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} – {a.description}
                </option>
              ))}
            </select>
          </label>
        </form>

        <div className="calc-result" aria-live="polite">
          {r.bmr <= 0 ? (
            <p className="result-sub">Enter your age, height and weight.</p>
          ) : body.age < 18 ? (
            <p className="note">This formula is for adults. Under-18s are still growing and need a different approach: please ask a GP or school nurse.</p>
          ) : (
            <>
              <p className="result-label">Your TDEE (maintenance calories)</p>
              <p className="result-big">{kcal(r.tdee)} kcal a day</p>
              <p className="result-sub">
                Basal metabolic rate (BMR): <strong>{kcal(r.bmr)} kcal</strong> a day at complete rest.
              </p>
              <table className="result-table">
                <thead>
                  <tr>
                    <th scope="col">Activity level</th>
                    <th scope="col">Calories a day</th>
                  </tr>
                </thead>
                <tbody>
                  {ACTIVITY_LEVELS.map((a) => (
                    <tr key={a.id}>
                      <th scope="row">
                        {a.id === activity ? <strong>{a.label}</strong> : a.label} (× {a.factor})
                      </th>
                      <td>{kcal(r.bmr * a.factor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="note">An estimate from the Mifflin-St Jeor equation. Your true figure can be a few hundred calories either side.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
