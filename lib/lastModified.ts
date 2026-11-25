// Real "last updated" dates for the sitemap. Pages whose content changed get the date of that change; everything
// else keeps the date of the last site-wide release. Update this when content changes, rather than stamping every
// page with the build time (which tells Google nothing).
import { SALARY_INSIGHTS } from "./salaryInsights.ts";
import { HOURLY_INSIGHTS } from "./hourlyInsights.ts";
import { salaryPath, SALARY_PAGES } from "./site.ts";
import { HOURLY_COPY } from "./pageCopy.ts";
import { hourlyPath } from "./hourly.ts";

export const BASELINE_DATE = "2026-11-14"; // v12, the last release that touched every calculator

const CHANGED_2026_11_19 = [
  "/",
  "/salary",
  "/guides",
  "/guides/national-insurance-explained",
  "/guides/student-loan-repayments",
  "/guides/salary-sacrifice-pension",
  "/guides/uk-tax-bands-2026-27",
  "/methodology",
  "/author/sharjeel",
  "/data/uk-take-home-pay-2026-27",
  ...SALARY_INSIGHTS.map((i) => salaryPath(i.salary)),
  ...HOURLY_INSIGHTS.map((i) => hourlyPath(i.rate)),
];

const CHANGED_2026_11_20 = ["/", "/guides", "/research/income-tax-threshold-freeze-2026"];

const CHANGED_2026_11_21 = [
  "/national-insurance-calculator",
  "/self-employed-tax-calculator",
  "/company-car-tax-calculator",
  "/guides/national-insurance-explained",
  "/payslip-checker",
  "/electric-car-salary-sacrifice-calculator",
  "/corporation-tax-calculator",
  "/calculators",
  "/methodology",
  "/capital-gains-tax-calculator",
  "/stamp-duty-calculator",
  "/mortgage-calculator",
  "/dividend-tax-calculator",
];

// v21: page copy for 27 pages; median full-time salary updated to April 2026 (in the FAQ on every salary page).
// v22: Child Benefit 53-week correction + "similar salaries" nearest-first fix (touches every salary page).
const CHANGED_2026_11_24 = [
  "/methodology",
  "/child-benefit-calculator",
  ...SALARY_PAGES.map((n) => salaryPath(n)),
  ...Object.keys(HOURLY_COPY).map((r) => hourlyPath(Number(r))),
  hourlyPath(20),
  hourlyPath(21.5),
];

const DATES: Record<string, string> = {
  ...Object.fromEntries(CHANGED_2026_11_19.map((p) => [p, "2026-11-19"])),
  ...Object.fromEntries(CHANGED_2026_11_20.map((p) => [p, "2026-11-20"])),
  ...Object.fromEntries(CHANGED_2026_11_21.map((p) => [p, "2026-11-21"])),
  ...Object.fromEntries(CHANGED_2026_11_24.map((p) => [p, "2026-11-24"])),
};

export function lastModified(path: string): Date {
  return new Date(`${DATES[path] ?? BASELINE_DATE}T00:00:00Z`);
}

export const CHANGED_PATHS = Object.keys(DATES);
