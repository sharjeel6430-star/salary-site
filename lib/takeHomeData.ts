// Take-home pay for every £1,000 from £15,000 to £150,000 in the current tax year, from calculate().
// Used by /data/uk-take-home-pay-2026-27 (page) and its CSV download, so the two always match the calculators.
import { calculate } from "./tax.ts";

export interface TakeHomeRow {
  salary: number;
  incomeTax: number;
  ni: number;
  takeHome: number;
  monthly: number;
  effectiveRate: number; // %, 1 dp
  marginalRate: number; // %, tax + NI on the next £1
  scotlandTakeHome: number;
  scotlandDiff: number; // Scottish take-home minus rest-of-UK take-home
  plan2: number;
  plan5: number;
}

export const DATA_FROM = 15000;
export const DATA_TO = 150000;
export const DATA_STEP = 1000;
export const DATA_PATH = "/data/uk-take-home-pay-2026-27";
export const DATA_CSV_PATH = `${DATA_PATH}.csv`;

const r1 = (x: number) => Math.round(x * 10) / 10;

export function takeHomeRow(s: number): TakeHomeRow {
  const r = calculate({ gross: s });
  const sc = calculate({ gross: s, region: "scotland" });
  return {
    salary: s,
    incomeTax: r.incomeTax,
    ni: r.nationalInsurance,
    takeHome: r.takeHome,
    monthly: r.takeHome / 12,
    effectiveRate: r1(r.effectiveRate * 100),
    marginalRate: r1(r.marginalRate * 100),
    scotlandTakeHome: sc.takeHome,
    scotlandDiff: sc.takeHome - r.takeHome,
    plan2: calculate({ gross: s, studentPlan: "plan2" }).studentLoan,
    plan5: calculate({ gross: s, studentPlan: "plan5" }).studentLoan,
  };
}

export function takeHomeTable(): TakeHomeRow[] {
  const rows: TakeHomeRow[] = [];
  for (let s = DATA_FROM; s <= DATA_TO; s += DATA_STEP) rows.push(takeHomeRow(s));
  return rows;
}

/** Lowest whole-pound salary at which a Scottish taxpayer takes home less than the rest of the UK. */
export function scotlandCrossover(): number {
  for (let s = 20000; s < 60000; s++) {
    if (calculate({ gross: s, region: "scotland" }).takeHome < calculate({ gross: s }).takeHome) return s;
  }
  return NaN;
}

/** Headline figures shown at the top of the data page. */
export function headlineFacts() {
  const th = (g: number) => calculate({ gross: g }).takeHome;
  const taperTop = 125140;
  const gain = th(taperTop) - th(100000);
  return {
    taperMarginal: Math.round(calculate({ gross: 110000 }).marginalRate * 100),
    taperTop,
    taperGain: gain,
    taperKeepPence: Math.round((gain / (taperTop - 100000)) * 100),
    scotlandCrossover: scotlandCrossover(),
    doublingRatio: Math.round((th(60000) / th(30000)) * 10) / 10,
  };
}

const m2 = (x: number) => (Math.round(x * 100) / 100).toFixed(2);

export function takeHomeCsv(): string {
  const head = "salary,income_tax,ni,take_home,monthly,effective_rate,marginal_rate,scotland_take_home,scotland_diff,plan2,plan5";
  const lines = takeHomeTable().map((r) =>
    [r.salary, m2(r.incomeTax), m2(r.ni), m2(r.takeHome), m2(r.monthly), r.effectiveRate.toFixed(1), r.marginalRate.toFixed(1), m2(r.scotlandTakeHome), m2(r.scotlandDiff), m2(r.plan2), m2(r.plan5)].join(",")
  );
  return [head, ...lines].join("\n") + "\n";
}
