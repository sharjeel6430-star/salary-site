// Shorter, click-focused titles and descriptions for salary and hourly pages chosen from Search Console
// (pages with impressions but few clicks). Added v15, 19 Nov 2026, from Sharjeel's title_meta_updates.csv.
// The figures are worked out from calculate(), so they stay right when rates change. Titles stay at 60
// characters or less, descriptions at 160 or less (tests/metaOverrides.test.ts checks both).
import { calculate, gbp, TAX_YEAR } from "./tax.ts";

export const SALARY_META_PAGES = [24500, 25500, 26500, 27500, 30500, 31500, 32500, 33500, 34500, 35500, 36500, 38500, 39500, 42500, 45500, 47500];
export const HOURLY_META_PAGES = [10.85, 13.5, 14.5, 16.5, 17.5, 18.5, 19.5, 21.5, 24.5, 27.5];

const HOURS = 37.5;

export function salaryMeta(salary: number): { title: string; description: string } | null {
  if (!SALARY_META_PAGES.includes(salary)) return null;
  const r = calculate({ gross: salary });
  const s = gbp(salary, 0);
  return {
    title: `${s} After Tax UK ${TAX_YEAR.label}: ${gbp(r.takeHome, 0)} a Year, ${gbp(r.takeHome / 12, 0)} a Month`,
    description: `${s} a year is ${gbp(r.takeHome, 0)} take-home (${gbp(r.takeHome / 12, 0)} a month, ${gbp(r.takeHome / 52, 0)} a week) after Income Tax and NI in ${TAX_YEAR.label}. See Scotland, student loan and pension figures.`,
  };
}

export function hourlyMeta(rate: number): { title: string; description: string } | null {
  if (!HOURLY_META_PAGES.includes(rate)) return null;
  const annual = rate * HOURS * 52;
  const r = calculate({ gross: annual });
  return {
    title: `${gbp(rate)} an Hour = ${gbp(annual, 0)} a Year (${gbp(r.takeHome, 0)} After Tax) ${TAX_YEAR.label}`,
    description: `${gbp(rate)} an hour is ${gbp(annual, 0)} a year gross on a ${HOURS}-hour week, or ${gbp(r.takeHome / 12, 0)} a month (${gbp(r.takeHome, 0)} a year) take-home after tax and NI in ${TAX_YEAR.label}. Hours table included.`,
  };
}
