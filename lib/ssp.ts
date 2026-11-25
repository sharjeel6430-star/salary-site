// Statutory Sick Pay from 6 April 2026 (Employment Rights Act 2025).
// Sources: GOV.UK "Statutory Sick Pay (SSP)" and Acas "Statutory sick pay (SSP)".
// SSP is the lower of £123.25 a week or 80% of average weekly earnings (AWE, normally averaged over the 8 weeks
// before the absence). It is paid from the first qualifying day — there are no waiting days and no Lower Earnings
// Limit — for up to 28 weeks. The daily rate is the weekly rate divided by the number of qualifying days in the week.

export const SSP = {
  from: "6 April 2026",
  weeklyRate: 123.25,
  earningsShare: 0.8,
  maxWeeks: 28,
  previous: { year: "2025/26", weeklyRate: 118.75, lowerEarningsLimit: 125, waitingDays: 3 },
};

export type PayBasis = "week" | "month" | "year";

export const toWeekly = (amount: number, basis: PayBasis) => {
  const a = Math.max(0, amount || 0);
  return basis === "week" ? a : basis === "month" ? (a * 12) / 52 : a / 52;
};

export interface SspInput {
  averageWeeklyEarnings: number;
  qualifyingDaysPerWeek: number; // days you normally work, usually 5
  sickDays: number; // qualifying days off sick in this spell
}

export interface SspResult {
  weeklyRate: number;
  dailyRate: number;
  usesEarningsRate: boolean; // true when 80% of earnings is lower than the flat rate
  daysPaid: number;
  maxDays: number;
  total: number;
  normalPay: number; // what those days would normally pay
  lostPay: number;
  previousRules: number; // what the same absence would have paid under the 2025/26 rules
}

const pence = (n: number) => Math.round(n * 100) / 100;

export function statutorySickPay(input: SspInput): SspResult {
  const awe = Math.max(0, input.averageWeeklyEarnings || 0);
  const qd = Math.max(1, Math.min(7, Math.round(input.qualifyingDaysPerWeek || 5)));
  const sick = Math.max(0, Math.floor(input.sickDays || 0));
  const earningsRate = awe * SSP.earningsShare;
  const weeklyRate = Math.min(SSP.weeklyRate, earningsRate);
  const dailyRate = weeklyRate / qd;
  const maxDays = SSP.maxWeeks * qd;
  const daysPaid = Math.min(sick, maxDays);

  // Old rules: nothing below the Lower Earnings Limit, 3 unpaid waiting days, flat rate.
  const p = SSP.previous;
  const oldDays = awe < p.lowerEarningsLimit ? 0 : Math.max(0, Math.min(sick, maxDays + p.waitingDays) - p.waitingDays);

  return {
    weeklyRate: pence(weeklyRate),
    dailyRate,
    usesEarningsRate: earningsRate < SSP.weeklyRate,
    daysPaid,
    maxDays,
    total: pence(dailyRate * daysPaid),
    normalPay: pence((awe / qd) * sick),
    lostPay: pence((awe / qd) * sick - dailyRate * daysPaid),
    previousRules: pence((p.weeklyRate / qd) * oldDays),
  };
}
