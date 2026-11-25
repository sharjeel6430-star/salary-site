// SVG charts for /salary-needed-to-live-uk-cities. Server-rendered, no JavaScript needed.
import type { CityResult } from "@/lib/costOfLiving";

const money = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");

/** Comfortable salary per city (dark bar) with the minimum salary as the lighter inner bar. */
export function SalaryNeededChart({ data }: { data: CityResult[] }) {
  const max = Math.max(...data.map((d) => d.comfortableSalary));
  const rowH = 34, labelW = 104, valueW = 78, width = 720;
  const barW = width - labelW - valueW;
  const height = data.length * rowH + 30;
  return (
    <figure className="col-figure">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="col-salary-title" className="col-chart">
        <title id="col-salary-title">Salary needed to live alone in 10 UK cities, 2026/27</title>
        {data.map((d, i) => {
          const y = i * rowH + 4;
          const w = (d.comfortableSalary / max) * barW;
          const wMin = (d.minSalary / max) * barW;
          return (
            <g key={d.slug}>
              <text x={labelW - 10} y={y + 19} textAnchor="end" className="col-label">{d.name}</text>
              <rect x={labelW} y={y + 4} width={w} height={22} rx={4} className="col-bar-comfort" />
              <rect x={labelW} y={y + 4} width={wMin} height={22} rx={4} className="col-bar-min" />
              <text x={labelW + w + 8} y={y + 19} className="col-value">{money(d.comfortableSalary)}</text>
            </g>
          );
        })}
        <g transform={`translate(${labelW}, ${height - 12})`}>
          <rect width={12} height={12} y={-10} rx={2} className="col-bar-min" />
          <text x={18} className="col-legend">Minimum salary</text>
          <rect x={140} width={12} height={12} y={-10} rx={2} className="col-bar-comfort" />
          <text x={158} className="col-legend">Comfortable salary (50/30/20)</text>
        </g>
      </svg>
      <figcaption className="muted">
        Gross salary needed for one person renting a one-bed home alone. Source: UK Salary Tools analysis of ONS, Ofgem
        and council tax data, November 2026.
      </figcaption>
    </figure>
  );
}

/** Stacked bar: where the monthly essentials go in each city. */
export function CostBreakdownChart({ data }: { data: CityResult[] }) {
  const max = Math.max(...data.map((d) => d.essentials));
  const rowH = 32, labelW = 104, valueW = 66, width = 720;
  const barW = width - labelW - valueW;
  const labels = data[0].breakdown.map((b) => b.label);
  const height = data.length * rowH + 52;
  return (
    <figure className="col-figure">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="col-cost-title" className="col-chart">
        <title id="col-cost-title">Monthly essential costs by city, split by category</title>
        {data.map((d, i) => {
          const y = i * rowH + 4;
          let x = labelW;
          return (
            <g key={d.slug}>
              <text x={labelW - 10} y={y + 18} textAnchor="end" className="col-label">{d.name}</text>
              {d.breakdown.map((b, j) => {
                const w = (b.value / max) * barW;
                const rect = (
                  <rect key={b.label} x={x} y={y + 4} width={Math.max(0, w - 1)} height={20} className={`col-seg-${j}`}>
                    <title>{`${d.name} – ${b.label}: ${money(b.value)}`}</title>
                  </rect>
                );
                x += w;
                return rect;
              })}
              <text x={x + 8} y={y + 18} className="col-value">{money(d.essentials)}</text>
            </g>
          );
        })}
        <g transform={`translate(${labelW}, ${height - 30})`}>
          {labels.map((l, j) => (
            <g key={l} transform={`translate(${(j % 4) * 150}, ${Math.floor(j / 4) * 18})`}>
              <rect width={11} height={11} y={-9} rx={2} className={`col-seg-${j}`} />
              <text x={16} className="col-legend">{l}</text>
            </g>
          ))}
        </g>
      </svg>
      <figcaption className="muted">
        Monthly essentials for one adult in a one-bed home. Rent is the ONS average for a one-bedroom property,
        September 2026.
      </figcaption>
    </figure>
  );
}
