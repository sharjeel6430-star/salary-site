// Brand and domain.
export const SITE_NAME = "UK Salary Tools";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.uksalarytools.co.uk").replace(/\/$/, "");

export const SITE_TAGLINE = "Free UK salary, tax and take-home pay calculators for 2026/27";
export const CONTACT_EMAIL = "hello@uksalarytools.co.uk";

// Google AdSense publisher ID.
export const ADSENSE_CLIENT = "ca-pub-9421649089099149";

// Salary pages that are pre-built and listed in the sitemap.
export const SALARY_PAGES: number[] = (() => {
  const set = new Set<number>();
  for (let s = 10000; s <= 150000; s += 1000) set.add(s);
  for (let s = 15500; s <= 59500; s += 1000) set.add(s); // half-thousands where search demand is highest
  [160000, 175000, 180000, 200000, 250000, 300000, 400000, 500000].forEach((s) => set.add(s));
  return [...set].sort((a, b) => a - b);
})();

export const POPULAR_SALARIES = [20000, 25000, 28000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 70000, 80000, 100000, 125000];

export const MIN_SALARY = 1000;
export const MAX_SALARY = 1000000;

// URL for a salary page, e.g. /salary/40000-after-tax (matches "40000 after tax" searches).
export const salaryPath = (n: number) => `/salary/${n}-after-tax`;

// The pre-built salary page closest to any amount, so links never point at a page that doesn't exist.
// Returns null when no page is reasonably close (more than 10% or £1,000 away).
export function nearestSalaryPage(n: number): number | null {
  if (!Number.isFinite(n) || n <= 0) return null;
  const best = SALARY_PAGES.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a));
  return Math.abs(best - n) <= Math.max(1000, n * 0.1) ? best : null;
}

// "40k", "15.5k" — the short form people type into Google.
export const kLabel = (n: number) => `${Number((n / 1000).toFixed(1))}k`;

// Minimum wage rates from 1 April 2026 (GOV.UK). Full history and April 2027 rates: lib/minimumWage.ts.
// Median gross annual pay, full-time employees: ONS Annual Survey of Hours and Earnings, April 2026 (provisional, published 22 Oct 2026).
export const MEDIAN_FULL_TIME = { amount: 40911, date: "April 2026" };

export const MIN_WAGE = { nlw: 12.71, age18to20: 10.85, age16to17: 8.0, apprentice: 8.0 };

// Who writes and checks the site (author page, bylines and structured data).
export const AUTHOR = {
  name: "Sharjeel",
  jobTitle: "Founder and editor",
  path: "/author/sharjeel",
  image: "/sharjeel.jpg",
  linkedin: "https://www.linkedin.com/in/sharjeel-iqbal-75a7147b/",
};
export const ORG_ID = `${SITE_URL}/#org`;
export const PERSON_ID = `${SITE_URL}${AUTHOR.path}#person`;
