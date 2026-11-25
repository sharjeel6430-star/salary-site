"use client";

// Height, weight, age and sex inputs shared by the BMI, TDEE and steps calculators (metric or imperial).
import { useState } from "react";
import { feetToCm, stonesToKg, type Sex } from "@/lib/health";

const n = (s: string) => {
  const v = parseFloat(s.replace(/[,\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export function useBody(opts: { weight?: boolean; age?: boolean; sex?: boolean } = {}) {
  const { weight = true, age = true, sex: showSex = true } = opts;
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [cm, setCm] = useState("170");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("7");
  const [kg, setKg] = useState("70");
  const [st, setSt] = useState("11");
  const [lb, setLb] = useState("0");
  const [ageText, setAgeText] = useState("30");
  const [sex, setSex] = useState<Sex>("female");

  const heightCm = units === "metric" ? n(cm) : feetToCm(n(ft), n(inch));
  const weightKg = units === "metric" ? n(kg) : stonesToKg(n(st), n(lb));

  const fields = (
    <>
      <fieldset className="field">
        <legend>Units</legend>
        <div className="segmented">
          <button type="button" aria-pressed={units === "metric"} onClick={() => setUnits("metric")}>
            {weight ? "cm and kg" : "cm"}
          </button>
          <button type="button" aria-pressed={units === "imperial"} onClick={() => setUnits("imperial")}>
            {weight ? "Feet, stones and pounds" : "Feet and inches"}
          </button>
        </div>
      </fieldset>
      {showSex && (
        <fieldset className="field">
          <legend>Sex</legend>
          <div className="segmented">
            <button type="button" aria-pressed={sex === "female"} onClick={() => setSex("female")}>
              Female
            </button>
            <button type="button" aria-pressed={sex === "male"} onClick={() => setSex("male")}>
              Male
            </button>
          </div>
        </fieldset>
      )}
      {age && (
        <label className="field">
          <span>Age</span>
          <div className="input-row">
            <input inputMode="numeric" value={ageText} onChange={(e) => setAgeText(e.target.value)} />
            <span className="suffix">years</span>
          </div>
        </label>
      )}
      {units === "metric" ? (
        <label className="field">
          <span>Height</span>
          <div className="input-row">
            <input inputMode="decimal" value={cm} onChange={(e) => setCm(e.target.value)} />
            <span className="suffix">cm</span>
          </div>
        </label>
      ) : (
        <fieldset className="field">
          <legend>Height</legend>
          <div className="input-row">
            <input inputMode="numeric" aria-label="Height in feet" value={ft} onChange={(e) => setFt(e.target.value)} />
            <span className="suffix">ft</span>
            <input inputMode="decimal" aria-label="Height in inches" value={inch} onChange={(e) => setInch(e.target.value)} />
            <span className="suffix">in</span>
          </div>
        </fieldset>
      )}
      {weight &&
        (units === "metric" ? (
          <label className="field">
            <span>Weight</span>
            <div className="input-row">
              <input inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} />
              <span className="suffix">kg</span>
            </div>
          </label>
        ) : (
          <fieldset className="field">
            <legend>Weight</legend>
            <div className="input-row">
              <input inputMode="numeric" aria-label="Weight in stones" value={st} onChange={(e) => setSt(e.target.value)} />
              <span className="suffix">st</span>
              <input inputMode="decimal" aria-label="Weight in pounds" value={lb} onChange={(e) => setLb(e.target.value)} />
              <span className="suffix">lb</span>
            </div>
          </fieldset>
        ))}
    </>
  );

  return { fields, heightCm, weightKg, age: n(ageText), sex, units };
}
