// National Minimum Wage and National Living Wage.
// Sources: GOV.UK "National Minimum Wage and National Living Wage rates" (April 2025 and April 2026 rates) and
// Low Pay Commission "Minimum wage rates for 2027" (April 2027 rates, confirmed by the Government on 28 October 2026).
import { calculate, type Region, type TaxYearKey } from "./tax.ts";

export type AgeBand = "21plus" | "18to20" | "16to17" | "apprentice";

export const AGE_BANDS: { key: AgeBand; label: string; short: string }[] = [
  { key: "21plus", label: "21 or over (National Living Wage)", short: "21 and over" },
  { key: "18to20", label: "18 to 20", short: "18 to 20" },
  { key: "16to17", label: "16 to 17", short: "16 to 17" },
  { key: "apprentice", label: "Apprentice (under 19, or in first year)", short: "Apprentice" },
];

export type WageYearKey = "2025/26" | "2026/27" | "2027/28";

export interface WageYear {
  key: WageYearKey;
  from: string; // date the rates start
  rates: Record<AgeBand, number>;
  accommodationOffset: number; // maximum daily amount
  taxYear: TaxYearKey; // tax year used for take-home pay
  announced?: boolean; // confirmed but not yet in force
}

export const WAGE_YEARS: WageYear[] = [
  {
    key: "2025/26",
    from: "1 April 2025",
    rates: { "21plus": 12.21, "18to20": 10.0, "16to17": 7.55, apprentice: 7.55 },
    accommodationOffset: 10.66,
    taxYear: "2025/26",
  },
  {
    key: "2026/27",
    from: "1 April 2026",
    rates: { "21plus": 12.71, "18to20": 10.85, "16to17": 8.0, apprentice: 8.0 },
    accommodationOffset: 11.1,
    taxYear: "2026/27",
  },
  {
    key: "2027/28",
    from: "1 April 2027",
    rates: { "21plus": 13.21, "18to20": 11.27, "16to17": 8.31, apprentice: 8.31 },
    accommodationOffset: 11.53,
    // 2027/28 tax thresholds are not built into the site yet, so take-home pay uses 2026/27 tax rules.
    taxYear: "2026/27",
    announced: true,
  },
];

export const CURRENT_WAGE_YEAR: WageYearKey = "2026/27";

export const wageYear = (key: WageYearKey = CURRENT_WAGE_YEAR) =>
  WAGE_YEARS.find((y) => y.key === key) ?? WAGE_YEARS[1];

export const minimumRate = (band: AgeBand, year: WageYearKey = CURRENT_WAGE_YEAR) => wageYear(year).rates[band];

// The band someone is in from their age. Apprentices aged 19+ past their first year get the rate for their age.
export function ageBandFor(age: number, apprenticeEligible = false): AgeBand | null {
  if (!Number.isFinite(age) || age < 16) return null;
  if (apprenticeEligible) return "apprentice";
  if (age >= 21) return "21plus";
  if (age >= 18) return "18to20";
  return "16to17";
}

export interface MinWageInput {
  band: AgeBand;
  hoursPerWeek: number;
  year?: WageYearKey;
  region?: Region;
}

export interface MinWagePay {
  hourly: number;
  weekly: number;
  monthly: number;
  yearly: number;
  takeHomeYear: number;
  takeHomeMonth: number;
  takeHomeWeek: number;
  incomeTax: number;
  nationalInsurance: number;
  taxYearUsed: TaxYearKey;
}

export function minimumWagePay(input: MinWageInput): MinWagePay {
  const y = wageYear(input.year);
  const hourly = y.rates[input.band];
  const hours = Math.max(0, Math.min(100, input.hoursPerWeek || 0));
  const weekly = hourly * hours;
  const yearly = weekly * 52;
  const t = calculate({ gross: yearly, region: input.region ?? "ruk", year: y.taxYear });
  return {
    hourly,
    weekly,
    monthly: yearly / 12,
    yearly,
    takeHomeYear: t.takeHome,
    takeHomeMonth: t.takeHome / 12,
    takeHomeWeek: t.takeHome / 52,
    incomeTax: t.incomeTax,
    nationalInsurance: t.nationalInsurance,
    taxYearUsed: y.taxYear,
  };
}

export type PayPeriod = "hour" | "week" | "month" | "year";

export interface PayCheck {
  hourlyPaid: number;
  minimum: number;
  difference: number; // positive = above the minimum
  shortfallPerYear: number; // 0 when paid enough
  paidEnough: boolean;
}

// Is someone paid at least the minimum wage? Converts weekly, monthly or yearly pay to an hourly rate.
export function checkPay(opts: {
  band: AgeBand;
  amount: number;
  period: PayPeriod;
  hoursPerWeek: number;
  year?: WageYearKey;
}): PayCheck {
  const hours = opts.hoursPerWeek > 0 ? opts.hoursPerWeek : 0;
  const amount = Math.max(0, opts.amount || 0);
  let hourlyPaid = 0;
  if (opts.period === "hour") hourlyPaid = amount;
  else if (hours > 0) {
    const weekly = opts.period === "week" ? amount : opts.period === "month" ? (amount * 12) / 52 : amount / 52;
    hourlyPaid = weekly / hours;
  }
  const minimum = minimumRate(opts.band, opts.year);
  const difference = hourlyPaid - minimum;
  // Small tolerance so £12.71 entered as £12.709999 still passes.
  const paidEnough = difference >= -0.005;
  return {
    hourlyPaid,
    minimum,
    difference,
    shortfallPerYear: paidEnough ? 0 : -difference * hours * 52,
    paidEnough,
  };
}
