// Corporation Tax (financial year from 1 April 2026) and dividend tax (2026/27).
// Sources: GOV.UK "Rates and allowances: Corporation Tax"; dividend rates from 6 April 2026.
import { TAX_YEAR, personalAllowanceFor } from "./tax.ts";

export const CORPORATION_TAX = {
  label: "FY2026 (from 1 April 2026)",
  smallRate: 0.19,
  mainRate: 0.25,
  lowerLimit: 50000,
  upperLimit: 250000,
  marginalFraction: 3 / 200,
};

export interface CorpTaxInput {
  profits: number; // taxable profits for the accounting period
  months?: number; // length of accounting period, 1–12
  associated?: number; // number of associated companies (not counting this one)
}

export function corporationTax({ profits, months = 12, associated = 0 }: CorpTaxInput) {
  const p = Math.max(0, profits || 0);
  const m = Math.min(12, Math.max(1, months || 12));
  const divisor = 1 + Math.max(0, Math.floor(associated || 0));
  const lower = (CORPORATION_TAX.lowerLimit * m) / 12 / divisor;
  const upper = (CORPORATION_TAX.upperLimit * m) / 12 / divisor;

  let tax: number;
  let marginalRelief = 0;
  let band: "small" | "marginal" | "main";
  if (p <= lower) {
    tax = p * CORPORATION_TAX.smallRate;
    band = "small";
  } else if (p >= upper) {
    tax = p * CORPORATION_TAX.mainRate;
    band = "main";
  } else {
    // Augmented profits assumed equal to taxable profits (no exempt distributions).
    marginalRelief = CORPORATION_TAX.marginalFraction * (upper - p);
    tax = p * CORPORATION_TAX.mainRate - marginalRelief;
    band = "marginal";
  }
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    profits: p,
    lower: round2(lower),
    upper: round2(upper),
    tax: round2(tax),
    marginalRelief: round2(marginalRelief),
    afterTax: round2(p - tax),
    effectiveRate: p > 0 ? tax / p : 0,
    band,
  };
}

export const DIVIDENDS = {
  label: "2026/27",
  allowance: 500,
  basicRate: 0.1075,
  higherRate: 0.3575,
  additionalRate: 0.3935,
};

export interface DividendInput {
  salary: number; // other taxable (non-savings) income, e.g. salary
  dividends: number;
  includeNI?: boolean; // employee NI on the salary
}

// Dividends are taxed on top of other income, using UK-wide bands (also for Scottish taxpayers).
export function dividendTax({ salary, dividends, includeNI = true }: DividendInput) {
  const s = Math.max(0, salary || 0);
  const d = Math.max(0, dividends || 0);
  const pa = personalAllowanceFor(s + d);
  const taxableSalary = Math.max(0, s - pa);
  const paLeft = Math.max(0, pa - s);
  const taxableDivs = Math.max(0, d - paLeft);

  const basicTop = TAX_YEAR.bands.ruk[0].upTo; // 37,700 of taxable income
  const higherTop = TAX_YEAR.bands.ruk[1].upTo; // 125,140

  // Salary tax (England, Wales and NI rates) with the tapered allowance.
  const salaryTax =
    Math.min(taxableSalary, basicTop) * 0.2 +
    Math.max(0, Math.min(taxableSalary, higherTop) - basicTop) * 0.4 +
    Math.max(0, taxableSalary - higherTop) * 0.45;

  // Walk the dividends through the bands, starting where the salary ends.
  let pos = taxableSalary;
  let remaining = taxableDivs;
  let allowanceLeft = DIVIDENDS.allowance;
  const lines = { allowance: 0, basic: 0, higher: 0, additional: 0 };
  const tax = { basic: 0, higher: 0, additional: 0 };
  const take = (limit: number) => Math.max(0, Math.min(remaining, limit - pos));

  // The £500 allowance is taxed at 0% but still uses up band space.
  const allow = Math.min(allowanceLeft, remaining);
  lines.allowance = allow;
  pos += allow;
  remaining -= allow;
  allowanceLeft -= allow;

  const inBasic = take(basicTop);
  lines.basic = inBasic;
  tax.basic = inBasic * DIVIDENDS.basicRate;
  pos += inBasic;
  remaining -= inBasic;

  const inHigher = take(higherTop);
  lines.higher = inHigher;
  tax.higher = inHigher * DIVIDENDS.higherRate;
  pos += inHigher;
  remaining -= inHigher;

  lines.additional = remaining;
  tax.additional = remaining * DIVIDENDS.additionalRate;

  const divTax = tax.basic + tax.higher + tax.additional;
  const { primaryThreshold, upperEarningsLimit, mainRate, upperRate } = TAX_YEAR.ni;
  const ni = includeNI
    ? Math.max(0, Math.min(s, upperEarningsLimit) - primaryThreshold) * mainRate +
      Math.max(0, s - upperEarningsLimit) * upperRate
    : 0;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    salary: s,
    dividends: d,
    personalAllowance: pa,
    paUsedOnDividends: Math.min(paLeft, d),
    lines,
    dividendTax: round2(divTax),
    taxBreakdown: { basic: round2(tax.basic), higher: round2(tax.higher), additional: round2(tax.additional) },
    salaryTax: round2(salaryTax),
    ni: round2(ni),
    totalTax: round2(divTax + salaryTax + ni),
    takeHome: round2(s + d - divTax - salaryTax - ni),
  };
}
