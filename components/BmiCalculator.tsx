"use client";

import { useState } from "react";
import { bmi, bmiCategory, healthyWeightRange, kgToStones } from "@/lib/health";
import { useBody } from "./BodyFields";

export default function BmiCalculator() {
  const body = useBody();
  const [lower, setLower] = useState(false);

  const value = bmi(body.weightKg, body.heightCm);
  const range = healthyWeightRange(body.heightCm, lower);
  const adult = body.age >= 18;
  const fmtWeight = (kg: number) => {
    if (body.units === "metric") return `${kg.toFixed(1)} kg`;
    const s = kgToStones(kg);
    return `${s.stones} st ${s.lb} lb`;
  };

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          {body.fields}
          <label className="check">
            <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
            <span>I have an Asian, Black African, African-Caribbean or Middle Eastern family background</span>
          </label>
        </form>

        <div className="calc-result" aria-live="polite">
          {value <= 0 ? (
            <p className="result-sub">Enter your height and weight.</p>
          ) : (
            <>
              <p className="result-label">Your BMI</p>
              <p className="result-big">{value.toFixed(1)}</p>
              {adult ? (
                <>
                  <p className="result-sub">
                    Category: <strong>{bmiCategory(value, lower)}</strong>
                  </p>
                  <dl className="stats">
                    <div>
                      <dt>Healthy weight for your height</dt>
                      <dd>
                        {fmtWeight(range.minKg)} to {fmtWeight(range.maxKg)}
                      </dd>
                    </div>
                    <div>
                      <dt>Healthy BMI range</dt>
                      <dd>18.5 to {lower ? "22.9" : "24.9"}</dd>
                    </div>
                  </dl>
                  {body.age >= 65 && <p className="note">BMI can understate body fat in older adults, because muscle is lost with age.</p>}
                </>
              ) : (
                <p className="note">
                  The adult categories do not apply under 18. For children and teenagers BMI is compared with others of the same age and sex and given as a
                  centile. Use the NHS child BMI calculator or ask your GP or school nurse.
                </p>
              )}
              <p className="note">BMI is a screening measure, not a diagnosis. It does not apply during pregnancy and can mislead for very muscular people.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
