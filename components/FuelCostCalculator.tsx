"use client";

import { useState } from "react";
import { gbp } from "@/lib/tax";
import { KM_PER_MILE, evCost, fuelCost, l100kmToMpg, mpgToL100km } from "@/lib/fuel";

const n = (s: string) => {
  const v = parseFloat(s.replace(/[£,p\s]/g, ""));
  return Number.isFinite(v) && v > 0 ? v : 0;
};

export default function FuelCostCalculator() {
  const [fuel, setFuel] = useState<"liquid" | "ev">("liquid");
  const [distance, setDistance] = useState("200");
  const [unit, setUnit] = useState<"miles" | "km">("miles");
  const [economy, setEconomy] = useState("45");
  const [ecoUnit, setEcoUnit] = useState<"mpg" | "l100">("mpg");
  const [price, setPrice] = useState("145");
  const [miKwh, setMiKwh] = useState("3.5");
  const [kwhPrice, setKwhPrice] = useState("28");
  const [returnTrip, setReturnTrip] = useState(false);
  const [people, setPeople] = useState("1");
  const [tripsPerWeek, setTripsPerWeek] = useState("");

  const oneWay = unit === "miles" ? n(distance) : n(distance) / KM_PER_MILE;
  const miles = oneWay * (returnTrip ? 2 : 1);
  const mpg = ecoUnit === "mpg" ? n(economy) : l100kmToMpg(n(economy));
  const persons = Math.max(1, Math.round(n(people) || 1));
  const liquid = fuelCost({ miles, mpg, pencePerLitre: n(price), people: persons });
  const ev = evCost({ miles, milesPerKwh: n(miKwh), pencePerKwh: n(kwhPrice) });
  const cost = fuel === "liquid" ? liquid.cost : ev.cost;
  const perMile = fuel === "liquid" ? liquid.costPerMile : ev.costPerMile;
  const weekly = n(tripsPerWeek) * cost;

  return (
    <section className="card">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="field">
            <legend>Fuel</legend>
            <div className="segmented">
              <button type="button" aria-pressed={fuel === "liquid"} onClick={() => setFuel("liquid")}>
                Petrol or diesel
              </button>
              <button type="button" aria-pressed={fuel === "ev"} onClick={() => setFuel("ev")}>
                Electric
              </button>
            </div>
          </fieldset>
          <label className="field">
            <span>Journey distance (one way)</span>
            <div className="input-row">
              <input inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} />
              <select aria-label="Distance unit" value={unit} onChange={(e) => setUnit(e.target.value as "miles" | "km")}>
                <option value="miles">miles</option>
                <option value="km">km</option>
              </select>
            </div>
          </label>
          {fuel === "liquid" ? (
            <>
              <label className="field">
                <span>Fuel economy</span>
                <div className="input-row">
                  <input inputMode="decimal" value={economy} onChange={(e) => setEconomy(e.target.value)} />
                  <select aria-label="Economy unit" value={ecoUnit} onChange={(e) => setEcoUnit(e.target.value as "mpg" | "l100")}>
                    <option value="mpg">mpg (UK)</option>
                    <option value="l100">litres per 100 km</option>
                  </select>
                </div>
              </label>
              <label className="field">
                <span>Fuel price</span>
                <div className="input-row">
                  <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <span className="suffix">p per litre</span>
                </div>
              </label>
            </>
          ) : (
            <>
              <label className="field">
                <span>Efficiency</span>
                <div className="input-row">
                  <input inputMode="decimal" value={miKwh} onChange={(e) => setMiKwh(e.target.value)} />
                  <span className="suffix">miles per kWh</span>
                </div>
              </label>
              <label className="field">
                <span>Electricity price</span>
                <div className="input-row">
                  <input inputMode="decimal" value={kwhPrice} onChange={(e) => setKwhPrice(e.target.value)} />
                  <span className="suffix">p per kWh</span>
                </div>
              </label>
            </>
          )}
          <label className="check">
            <input type="checkbox" checked={returnTrip} onChange={(e) => setReturnTrip(e.target.checked)} /> Return trip (there and back)
          </label>
          <label className="field">
            <span>People sharing the cost</span>
            <div className="input-row">
              <input inputMode="numeric" value={people} onChange={(e) => setPeople(e.target.value)} />
              <span className="suffix">people</span>
            </div>
          </label>
          <label className="field">
            <span>Times you make this journey a week (optional)</span>
            <div className="input-row">
              <input inputMode="decimal" value={tripsPerWeek} placeholder="e.g. 5" onChange={(e) => setTripsPerWeek(e.target.value)} />
              <span className="suffix">a week</span>
            </div>
          </label>
        </form>

        <div className="calc-result" aria-live="polite">
          <p className="result-label">{fuel === "liquid" ? "Fuel cost" : "Charging cost"} of this journey</p>
          <p className="result-big">{gbp(cost)}</p>
          <p className="result-sub">
            {miles.toLocaleString("en-GB", { maximumFractionDigits: 1 })} miles{returnTrip ? " there and back" : ""}, using{" "}
            {fuel === "liquid" ? `${liquid.litres.toFixed(1)} litres` : `${ev.kwh.toFixed(1)} kWh`}.
          </p>
          <dl className="stats">
            <div>
              <dt>Cost per mile</dt>
              <dd>{(perMile * 100).toFixed(1)}p</dd>
            </div>
            {persons > 1 && (
              <div>
                <dt>Each of {persons} people</dt>
                <dd>{gbp(cost / persons)}</dd>
              </div>
            )}
            {fuel === "liquid" && mpg > 0 && (
              <div>
                <dt>{ecoUnit === "mpg" ? "Litres per 100 km" : "UK mpg"}</dt>
                <dd>{ecoUnit === "mpg" ? mpgToL100km(mpg).toFixed(1) : mpg.toFixed(1)}</dd>
              </div>
            )}
          </dl>
          {weekly > 0 && (
            <p className="result-sub">
              {n(tripsPerWeek)} times a week: <strong>{gbp(weekly)}</strong> a week, about {gbp((weekly * 52) / 12, 0)} a month and {gbp(weekly * 52, 0)} a
              year.
            </p>
          )}
          <p className="note">Use the pump price you actually pay. Official MPG figures are lab results; most cars do less on the road.</p>
        </div>
      </div>
    </section>
  );
}
