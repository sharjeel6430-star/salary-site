// The two extra FAQs on the 20 most visited hourly pages, worked out from the rates so they stay right.
import { calculate, gbp, TAX_YEAR } from "./tax.ts";
import { MIN_WAGE } from "./site.ts";

export const NLW_NEXT = 13.21; // National Living Wage from 1 April 2027 (lib/minimumWage.ts)
const HOURS = 37.5;

// "£16.50", "£28", "£12.71"
export const rateLabel = (rate: number) => (Number.isInteger(rate) ? gbp(rate, 0) : gbp(rate));
// 0.21 -> "21p", 1.86 -> "£1.86"
const money = (x: number) => (x < 1 ? `${Math.round(x * 100)}p` : gbp(x));

export function minimumWageAnswer(rate: number): string {
  const nlw = MIN_WAGE.nlw;
  const r = rateLabel(rate);
  if (Math.abs(rate - nlw) < 0.001)
    return `It is the minimum wage for workers aged 21 and over from 1 April 2026. It rises to ${gbp(NLW_NEXT)} an hour on 1 April 2027.`;
  if (rate < nlw) {
    const under = `No, not if you're 21 or over. The National Living Wage is ${gbp(nlw)} an hour from 1 April 2026 (${gbp(NLW_NEXT)} from April 2027). ${r} is ${money(nlw - rate)} an hour below it`;
    if (Math.abs(rate - MIN_WAGE.age18to20) < 0.001) return `${under}. It is exactly the minimum for 18 to 20 year olds.`;
    if (rate > MIN_WAGE.age18to20) return `${under}, though above the ${gbp(MIN_WAGE.age18to20)} minimum for 18 to 20 year olds.`;
    return `${under}.`;
  }
  const pct = Math.round(((rate - nlw) / nlw) * 100);
  const next = rate >= NLW_NEXT ? `and still above the ${gbp(NLW_NEXT)} rate due in April 2027` : `but ${money(NLW_NEXT - rate)} below the ${gbp(NLW_NEXT)} rate due in April 2027`;
  return `Yes. ${r} is ${money(rate - nlw)} an hour (${pct}%) above the ${gbp(nlw)} National Living Wage for ${TAX_YEAR.label}, ${next}.`;
}

export function payRiseAnswer(rate: number): string {
  const annual = rate * HOURS * 52;
  const extra = calculate({ gross: annual + HOURS * 52 }).takeHome - calculate({ gross: annual }).takeHome;
  const keep = Math.round(extra / (HOURS * 52) * 100);
  const higherFrom = TAX_YEAR.personalAllowance + TAX_YEAR.bands.ruk[0].upTo;
  const crosses = annual < higherFrom && annual + HOURS * 52 > higherFrom;
  return `About ${gbp(extra, 0)} a year after tax and National Insurance (${gbp(extra / 12, 0)} a month) on a full-time ${HOURS}-hour week. ${
    crosses
      ? `The rise takes you over the ${gbp(higherFrom, 0)} higher-rate threshold, so you keep about ${keep}p of every extra pound.`
      : `At this pay you keep ${keep}p of every extra pound.`
  }`;
}
