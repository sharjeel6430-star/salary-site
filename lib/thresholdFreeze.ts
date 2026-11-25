// Model behind /research/income-tax-threshold-freeze-2026: what income tax and NI would be if the personal allowance
// and basic rate limit had been uprated each April by the previous September's CPI (the statutory default in
// ITA 2007 s57 and s21: allowance rounded up to the next £10, basic rate limit to the next £100) instead of frozen.
// England, Wales and Northern Ireland rates. Assumptions, stated on the page: the £100,000 taper point and the
// additional-rate threshold stay as they are; NI primary threshold and upper earnings limit move with the
// allowance and the 40% threshold, as they have been aligned since 2022/23; today's 20/40/45% and 8/2% rates.

export interface FreezeYear {
  year: string; // tax year, e.g. "2026/27"
  cpiSeptBefore: number | null; // CPI % in the September before the tax year starts (null for 2021/22, the base)
  nlw: number; // National Living Wage (21+ from 2024, 23+ before)
}

// ONS CPI 12-month rate, September of the previous calendar year. GOV.UK NLW rates.
export const FREEZE_YEARS: FreezeYear[] = [
  { year: "2021/22", cpiSeptBefore: null, nlw: 8.91 },
  { year: "2022/23", cpiSeptBefore: 3.1, nlw: 9.5 },
  { year: "2023/24", cpiSeptBefore: 10.1, nlw: 10.42 },
  { year: "2024/25", cpiSeptBefore: 6.7, nlw: 11.44 },
  { year: "2025/26", cpiSeptBefore: 1.7, nlw: 12.21 },
  { year: "2026/27", cpiSeptBefore: 3.8, nlw: 12.71 },
  { year: "2027/28", cpiSeptBefore: 3.5, nlw: 13.21 },
];

export const FROZEN = { pa: 12570, brl: 37700, taperFrom: 100000, art: 125140 };
const FT_HOURS = 37.5 * 52;

const roundUp = (x: number, to: number) => Math.ceil(Math.round(x * 100) / 100 / to) * to;

export interface Thresholds { year: string; pa: number; brl: number; higherFrom: number; cumIndex: number }

/** Thresholds each year if uprated by CPI, plus the cumulative CPI index used to inflate pay. */
export function indexedThresholds(): Thresholds[] {
  let pa = FROZEN.pa, brl = FROZEN.brl, idx = 1;
  return FREEZE_YEARS.map((y) => {
    if (y.cpiSeptBefore !== null) {
      const f = 1 + y.cpiSeptBefore / 100;
      pa = roundUp(pa * f, 10);
      brl = roundUp(brl * f, 100);
      idx *= f;
    }
    return { year: y.year, pa, brl, higherFrom: pa + brl, cumIndex: idx };
  });
}

export const thresholdsFor = (year: string) => indexedThresholds().find((t) => t.year === year)!;

/** Income tax (rUK) for a given allowance and basic rate limit. ART is 150,000 before 2023/24. */
export function incomeTax(gross: number, pa: number, brl: number, art = FROZEN.art): number {
  const allowance = Math.max(0, pa - Math.max(0, gross - FROZEN.taperFrom) / 2);
  const taxable = Math.max(0, gross - allowance);
  const basic = Math.min(taxable, brl);
  const higherTop = Math.max(brl, art - allowance);
  const higher = Math.min(Math.max(0, taxable - brl), higherTop - brl);
  const additional = Math.max(0, taxable - higherTop);
  return basic * 0.2 + higher * 0.4 + additional * 0.45;
}

/** Employee NI at today's 8% / 2% with a given primary threshold and upper earnings limit. */
export const employeeNI = (gross: number, pt: number, uel: number) =>
  Math.max(0, Math.min(gross, uel) - pt) * 0.08 + Math.max(0, gross - uel) * 0.02;

export interface ExtraCost { salary: number; extraTax: number; extraNI: number; total: number }

/** Extra tax and NI paid in a year because of the freeze, at a given salary. */
export function extraCost(salary: number, year: string): ExtraCost {
  const t = thresholdsFor(year);
  const extraTax = incomeTax(salary, FROZEN.pa, FROZEN.brl) - incomeTax(salary, t.pa, t.brl);
  const extraNI = employeeNI(salary, FROZEN.pa, FROZEN.pa + FROZEN.brl) - employeeNI(salary, t.pa, t.higherFrom);
  return { salary, extraTax, extraNI, total: extraTax + extraNI };
}

/** The 2021/22 salary above which inflation-matched pay now crosses the frozen 40% threshold. */
export const fortyPercentLine = (year: string) => (FROZEN.pa + FROZEN.brl) / thresholdsFor(year).cumIndex;

export interface RealPayRow { base: number; now: number; bandNow: string; bandIndexed: string; extraTax5yrs: number }

/** Pay that tracked CPI from 2021/22: band now vs with indexed thresholds, and extra tax over 2022/23–2026/27. */
export function sameRealPay(base: number): RealPayRow {
  const ts = indexedThresholds();
  let extra = 0;
  for (const t of ts.filter((x) => x.year >= "2022/23" && x.year <= "2026/27")) {
    const pay = base * t.cumIndex;
    const art = t.year === "2022/23" ? 150000 : FROZEN.art;
    extra += incomeTax(pay, FROZEN.pa, FROZEN.brl, art) - incomeTax(pay, t.pa, t.brl, art);
  }
  const now = thresholdsFor("2026/27");
  const pay = base * now.cumIndex;
  const band = (higherFrom: number) => (pay > higherFrom ? "Higher" : "Basic");
  return { base, now: pay, bandNow: band(FROZEN.pa + FROZEN.brl), bandIndexed: band(now.higherFrom), extraTax5yrs: extra };
}

export interface MinWageRow { year: string; nlw: number; weeksTaxFree: number; taxShare: number; tax: number }

/** Full-time NLW worker: weeks of work before reaching the frozen allowance, and income tax as a share of pay. */
export const minimumWageRows = (): MinWageRow[] =>
  FREEZE_YEARS.map((y) => {
    const pay = y.nlw * FT_HOURS;
    const tax = incomeTax(pay, FROZEN.pa, FROZEN.brl);
    return { year: y.year, nlw: y.nlw, weeksTaxFree: FROZEN.pa / (y.nlw * 37.5), taxShare: (tax / pay) * 100, tax };
  });

export const nlwTaxIndexed = (year: string) => {
  const y = FREEZE_YEARS.find((x) => x.year === year)!;
  const t = thresholdsFor(year);
  return incomeTax(y.nlw * FT_HOURS, t.pa, t.brl);
};
