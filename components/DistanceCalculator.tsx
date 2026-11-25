"use client";

import { useState } from "react";
import { PLACES, bearing, compass, distance, findPlace, looksLikePostcode, parseCoordinates, type Point } from "@/lib/distance";

type Resolved = { point: Point; label: string };

// Places and coordinates are worked out in the browser. Postcodes are looked up with the free postcodes.io service.
async function resolve(text: string): Promise<Resolved> {
  const t = text.trim();
  if (!t) throw new Error("Enter a place, postcode or coordinates.");
  const coords = parseCoordinates(t);
  if (coords) return { point: coords, label: `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` };
  const place = findPlace(t);
  if (place) return { point: place, label: PLACES.find((p) => p.lat === place.lat && p.lon === place.lon)?.name || t };
  if (looksLikePostcode(t)) {
    let res: Response;
    try {
      res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(t.replace(/\s+/g, ""))}`);
    } catch {
      throw new Error("The postcode lookup could not be reached. Check your connection, or enter coordinates instead.");
    }
    if (res.status === 404) throw new Error(`"${t}" is not a recognised UK postcode.`);
    if (!res.ok) throw new Error("The postcode lookup is not available right now. Enter coordinates instead.");
    const data = await res.json();
    const r = data?.result;
    if (!r || typeof r.latitude !== "number" || typeof r.longitude !== "number") throw new Error(`No location is held for "${t}".`);
    return { point: { lat: r.latitude, lon: r.longitude }, label: r.postcode || t.toUpperCase() };
  }
  throw new Error(`"${t}" was not recognised. Use a full UK postcode, one of the listed towns, or coordinates such as 51.5074, -0.1278.`);
}

export default function DistanceCalculator() {
  const [from, setFrom] = useState("London");
  const [to, setTo] = useState("Edinburgh");
  const [result, setResult] = useState<{ a: Resolved; b: Resolved } | null>(() => {
    const a = findPlace("London")!;
    const b = findPlace("Edinburgh")!;
    return { a: { point: a, label: "London" }, b: { point: b, label: "Edinburgh" } };
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function calculate() {
    setBusy(true);
    setError("");
    try {
      const [a, b] = await Promise.all([resolve(from), resolve(to)]);
      setResult({ a, b });
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const d = result ? distance(result.a.point, result.b.point) : null;

  return (
    <section className="card">
      <div className="calc-grid">
        <form
          className="calc-form"
          onSubmit={(e) => {
            e.preventDefault();
            calculate();
          }}
        >
          <label className="field">
            <span>From (postcode, town or coordinates)</span>
            <input list="crow-places" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="field">
            <span>To (postcode, town or coordinates)</span>
            <input list="crow-places" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <datalist id="crow-places">
            {PLACES.map((p) => (
              <option key={p.name} value={p.name} />
            ))}
          </datalist>
          <button type="submit" className="link-btn" disabled={busy}>
            {busy ? "Working it out…" : "Calculate distance"}
          </button>
          <p className="muted">Examples: SW1A 1AA · Manchester · 55.9533, -3.1883</p>
        </form>

        <div className="calc-result" aria-live="polite">
          {error && <p className="note">{error}</p>}
          {d && result && (
            <>
              <p className="result-label">
                {result.a.label} to {result.b.label}, as the crow flies
              </p>
              <p className="result-big">{d.miles.toFixed(1)} miles</p>
              <p className="result-sub">{d.km.toFixed(1)} km</p>
              <dl className="stats">
                <div>
                  <dt>Nautical miles</dt>
                  <dd>{d.nautical.toFixed(1)}</dd>
                </div>
                <div>
                  <dt>Direction</dt>
                  <dd>{d.km < 0.05 ? "–" : `${compass(bearing(result.a.point, result.b.point))} (${Math.round(bearing(result.a.point, result.b.point))}°)`}</dd>
                </div>
                <div>
                  <dt>Typical road distance</dt>
                  <dd>
                    {(d.miles * 1.2).toFixed(0)} to {(d.miles * 1.4).toFixed(0)} miles
                  </dd>
                </div>
              </dl>
              <p className="note">Straight-line distance over the Earth&apos;s surface. The road estimate is a rule of thumb, not a route.</p>
            </>
          )}
          {!d && !error && <p className="result-sub">Enter two locations and press Calculate distance.</p>}
        </div>
      </div>
    </section>
  );
}
