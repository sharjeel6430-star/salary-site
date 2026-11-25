"use client";
// Charts and full table for /data/uk-take-home-pay-2026-27. The rows are worked out at build time and passed in,
// so the page is complete without JavaScript; scripts only add the hover readout and "jump to salary".
import { useMemo, useRef, useState } from "react";
import type { TakeHomeRow } from "@/lib/takeHomeData";

const f0 = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");
const f2 = (n: number) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const k = (v: number) => `£${v / 1000}k`;

const W = 900, FROM = 15000, SPAN = 135000;

export function TakeHomeChart({ rows }: { rows: TakeHomeRow[] }) {
  const L = 56, R = 50, T = 14, B = 34, w = W - L - R, H = 320, h = H - T - B;
  const x = (v: number) => L + ((v - FROM) / SPAN) * w;
  const y = (v: number) => T + h - (v / 100000) * h;
  const y2 = (v: number) => T + h - (v / 70) * h;
  const [hover, setHover] = useState<TakeHomeRow | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const takePath = rows.map((r, i) => `${i ? "L" : "M"}${x(r.salary).toFixed(1)} ${y(r.takeHome).toFixed(1)}`).join("");
  const margPath = rows.map((r, i) => `${i ? "L" : "M"}${x(r.salary).toFixed(1)} ${y2(r.marginalRate).toFixed(1)}`).join("");
  const move = (e: React.MouseEvent<SVGSVGElement>) => {
    const b = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - b.left) / b.width) * W;
    const v = Math.round((((px - L) / w) * SPAN + FROM) / 1000) * 1000;
    setHover(rows.find((r) => r.salary === v) ?? null);
  };
  return (
    <figure className="data-figure">
      <div className="data-legend">
        <span><i className="lg-take" />Take-home pay (left axis)</span>
        <span><i className="lg-marg" />Marginal rate: tax + NI on the next £1 (right axis)</span>
      </div>
      <div className="data-scroll"><svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="data-chart" role="img" aria-labelledby="th-chart-title" onMouseMove={move} onMouseLeave={() => setHover(null)}>
        <title id="th-chart-title">Take-home pay and marginal tax rate for salaries from £15,000 to £150,000, 2026/27</title>
        {[0, 25000, 50000, 75000, 100000].map((v) => (
          <g key={v}>
            <line x1={L} x2={L + w} y1={y(v)} y2={y(v)} className="grid" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end">{k(v)}</text>
          </g>
        ))}
        {[0, 10, 20, 30, 40, 50, 60, 70].map((v) => <text key={v} x={L + w + 8} y={y2(v) + 4}>{v}%</text>)}
        {[20000, 40000, 60000, 80000, 100000, 120000, 140000].map((v) => <text key={v} x={x(v)} y={T + h + 20} textAnchor="middle">{k(v)}</text>)}
        {([[50270, "40% band"], [100000, "Allowance taper"], [125140, "45%"]] as const).map(([v, l]) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={T} y2={T + h} className="marker" />
            <text x={x(v) + 4} y={T + 11}>{l}</text>
          </g>
        ))}
        <path d={takePath} className="line-take" />
        <path d={margPath} className="line-marg" />
        {hover && <line x1={x(hover.salary)} x2={x(hover.salary)} y1={T} y2={T + h} className="cursor" />}
      </svg></div>
      <p className="data-readout" aria-live="polite">
        {hover
          ? <><b>{f0(hover.salary)}</b>: {f0(hover.takeHome)} take-home a year, {f2(hover.monthly)} a month, marginal rate {hover.marginalRate}%</>
          : "Hover over or tap the chart to read any salary."}
      </p>
    </figure>
  );
}

export function ScotlandChart({ rows }: { rows: TakeHomeRow[] }) {
  const L = 56, R = 20, T = 10, B = 30, w = W - L - R, H = 220, h = H - T - B;
  const x = (v: number) => L + ((v - FROM) / SPAN) * w;
  const y = (v: number) => T + ((500 - v) / 6500) * h;
  const line = rows.map((r, i) => `${i ? "L" : "M"}${x(r.salary).toFixed(1)} ${y(r.scotlandDiff).toFixed(1)}`).join("");
  return (
    <figure className="data-figure">
      <div className="data-legend"><span><i className="lg-scot" />Scottish take-home minus rest-of-UK take-home, per year</span></div>
      <div className="data-scroll"><svg viewBox={`0 0 ${W} ${H}`} className="data-chart" role="img" aria-labelledby="sc-chart-title">
        <title id="sc-chart-title">How much more or less a Scottish taxpayer takes home each year, by salary, 2026/27</title>
        {[0, -2000, -4000, -6000].map((v) => (
          <g key={v}>
            <line x1={L} x2={L + w} y1={y(v)} y2={y(v)} className={v ? "grid" : "axis"} />
            <text x={L - 8} y={y(v) + 4} textAnchor="end">{v < 0 ? "−" : ""}£{Math.abs(v / 1000)}k</text>
          </g>
        ))}
        {[20000, 40000, 60000, 80000, 100000, 120000, 140000].map((v) => <text key={v} x={x(v)} y={T + h + 18} textAnchor="middle">{k(v)}</text>)}
        <path d={`${line}L${x(150000)} ${y(0)}L${x(15000)} ${y(0)}Z`} className="area-scot" />
        <path d={line} className="line-scot" />
      </svg></div>
    </figure>
  );
}

export function TakeHomeTable({ rows }: { rows: TakeHomeRow[] }) {
  const [q, setQ] = useState("");
  const target = useMemo(() => {
    const v = Math.round(Number(q) / 1000) * 1000;
    return rows.some((r) => r.salary === v) ? v : null;
  }, [q, rows]);
  const wrap = useRef<HTMLDivElement>(null);
  const jump = (val: string) => {
    setQ(val);
    const v = Math.round(Number(val) / 1000) * 1000;
    const row = wrap.current?.querySelector<HTMLTableRowElement>(`#s${v}`);
    if (row && wrap.current) wrap.current.scrollTop = row.offsetTop - wrap.current.clientHeight / 2;
  };
  return (
    <>
      <label className="data-jump">
        Jump to salary £{" "}
        <input type="number" inputMode="numeric" step={1000} min={15000} max={150000} placeholder="e.g. 42000" value={q} onChange={(e) => jump(e.target.value)} />
      </label>
      <div className="table-wrap data-table" ref={wrap}>
        <table className="breakdown compact">
          <thead>
            <tr>
              <th scope="col">Salary</th><th scope="col">Income Tax</th><th scope="col">NI</th><th scope="col">Take-home / yr</th>
              <th scope="col">/ month</th><th scope="col">Effective</th><th scope="col">Marginal</th><th scope="col">Scotland ±</th>
              <th scope="col">Plan 2</th><th scope="col">Plan 5</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.salary} id={`s${r.salary}`} className={r.salary === target ? "hl" : undefined}>
                <th scope="row"><a href={`/salary/${r.salary}-after-tax`}>{f0(r.salary)}</a></th>
                <td>{f2(r.incomeTax)}</td><td>{f2(r.ni)}</td><td><b>{f2(r.takeHome)}</b></td><td>{f2(r.monthly)}</td>
                <td>{r.effectiveRate.toFixed(1)}%</td><td>{r.marginalRate.toFixed(0)}%</td>
                <td className={r.scotlandDiff < 0 ? "neg" : "pos"}>{r.scotlandDiff < 0 ? "−" : "+"}{f2(Math.abs(r.scotlandDiff))}</td>
                <td>{f0(r.plan2)}</td><td>{f0(r.plan5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
