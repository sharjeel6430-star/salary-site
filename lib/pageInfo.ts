// Decides, from the URL, which official sources and related calculators to show at the foot of a page.
import type { SourceId } from "./sources";

// plain: the page is not about tax, so the footer box leaves out the "2026/27 tax year" wording.
type Info = { sources: SourceId[]; related: string[]; plain?: boolean };

const EMPLOYEE = ["/", "/monthly-salary-calculator", "/net-to-gross-salary-calculator", "/scotland-salary-calculator", "/salary-sacrifice-calculator", "/hourly-to-salary", "/pro-rata-salary-calculator"];

const RULES: { match: (p: string) => boolean; info: Info }[] = [
  // The home page already lists every calculator, so only the sources box is shown there.
  { match: (p) => p === "/", info: { sources: ["employer", "scotland"], related: [] } },
  { match: (p) => p.startsWith("/mileage"), info: { sources: ["mileage", "employer"], related: ["/fuel-cost-calculator", "/", "/payslip-checker", "/electric-car-salary-sacrifice-calculator"] } },
  { match: (p) => p.startsWith("/fuel-cost"), info: { sources: ["mileage"], related: ["/mileage-calculator", "/as-the-crow-flies-distance-calculator", "/electric-car-salary-sacrifice-calculator", "/"], plain: true } },
  { match: (p) => p.startsWith("/as-the-crow"), info: { sources: ["postcodes"], related: ["/fuel-cost-calculator", "/mileage-calculator", "/steps-to-miles-calculator", "/"], plain: true } },
  { match: (p) => p.startsWith("/university-grade"), info: { sources: [], related: ["/", "/monthly-salary-calculator", "/minimum-wage-calculator", "/compare-salaries"], plain: true } },
  { match: (p) => p.startsWith("/bmi"), info: { sources: ["nhsBmi"], related: ["/tdee-calculator", "/steps-to-miles-calculator", "/statutory-sick-pay-calculator", "/"], plain: true } },
  { match: (p) => p.startsWith("/tdee"), info: { sources: ["nhsCalories"], related: ["/bmi-calculator", "/steps-to-miles-calculator", "/", "/fuel-cost-calculator"], plain: true } },
  { match: (p) => p.startsWith("/steps-to-miles"), info: { sources: ["nhsActivity"], related: ["/tdee-calculator", "/bmi-calculator", "/as-the-crow-flies-distance-calculator", "/"], plain: true } },
  { match: (p) => p.startsWith("/doctor"), info: { sources: ["doctorPay", "consultantPay", "mdCircular", "nhsPension", "employer"], related: ["/nhs-take-home-pay-calculator", "/compare-salaries", "/net-to-gross-salary-calculator", "/scotland-salary-calculator"] } },
  { match: (p) => p.startsWith("/capital-gains-tax-calculator"), info: { sources: ["cgt", "cgtExamples", "employer"], related: ["/dividend-tax-calculator", "/stamp-duty-calculator", "/self-employed-tax-calculator", "/corporation-tax-calculator"] } },
  { match: (p) => p.startsWith("/stamp-duty-calculator"), info: { sources: ["sdlt", "sdltHigher", "lbtt", "ltt"], related: ["/mortgage-calculator", "/salary-needed-to-live-uk-cities", "/capital-gains-tax-calculator", "/"] } },
  { match: (p) => p.startsWith("/national-insurance-calculator"), info: { sources: ["employer", "niCategories"], related: ["/", "/payslip-checker", "/self-employed-tax-calculator", "/salary-sacrifice-calculator"] } },
  { match: (p) => p.startsWith("/self-employed-tax-calculator"), info: { sources: ["selfEmployedNi", "employer", "scotland", "payOnAccount", "mtd"], related: ["/", "/national-insurance-calculator", "/corporation-tax-calculator", "/dividend-tax-calculator"] } },
  { match: (p) => p.startsWith("/company-car-tax-calculator"), info: { sources: ["bik", "fuelBenefit", "employer", "scotland"], related: ["/electric-car-salary-sacrifice-calculator", "/", "/payslip-checker", "/mileage-calculator"] } },
  { match: (p) => p.startsWith("/research/"), info: { sources: ["employer", "onsCpi", "freeze2031", "nmw", "nmw2027"], related: ["/", "/salary", "/minimum-wage-calculator", "/compare-salaries"] } },
  { match: (p) => p.startsWith("/data/"), info: { sources: ["employer", "scotland"], related: ["/", "/salary", "/scotland-salary-calculator", "/compare-salaries"] } },
  { match: (p) => p.startsWith("/nhs"), info: { sources: ["nhsPay", "nhsPension", "employer"], related: ["/pro-rata-salary-calculator", "/compare-salaries", "/teacher-take-home-pay-calculator", "/salary-sacrifice-calculator"] } },
  { match: (p) => p.startsWith("/teacher"), info: { sources: ["teacherPay", "tps", "employer"], related: ["/nhs-take-home-pay-calculator", "/pro-rata-salary-calculator", "/salary-sacrifice-calculator", "/net-to-gross-salary-calculator"] } },
  { match: (p) => p.startsWith("/corporation-tax"), info: { sources: ["corp"], related: ["/dividend-tax-calculator", "/", "/salary-sacrifice-calculator", "/net-to-gross-salary-calculator"] } },
  { match: (p) => p.startsWith("/dividend-tax"), info: { sources: ["dividends", "employer"], related: ["/corporation-tax-calculator", "/", "/salary-sacrifice-calculator", "/scotland-salary-calculator"] } },
  { match: (p) => p.startsWith("/pro-rata-holiday"), info: { sources: ["holiday"], related: ["/pro-rata-salary-calculator", "/hourly-to-salary", "/", "/teacher-take-home-pay-calculator"] } },
  { match: (p) => p.startsWith("/pro-rata-salary"), info: { sources: ["employer", "scotland"], related: ["/pro-rata-holiday-calculator", "/hourly-to-salary", "/", "/net-to-gross-salary-calculator"] } },
  { match: (p) => p.startsWith("/payslip"), info: { sources: ["employer", "taxCodes", "scotland"], related: ["/", "/monthly-salary-calculator", "/statutory-sick-pay-calculator", "/minimum-wage-calculator"] } },
  { match: (p) => p.startsWith("/statutory-sick-pay"), info: { sources: ["ssp", "employer"], related: ["/payslip-checker", "/", "/redundancy-pay-calculator", "/minimum-wage-calculator"] } },
  { match: (p) => p.startsWith("/minimum-wage"), info: { sources: ["nmw", "nmw2027", "livingWage", "employer"], related: ["/hourly-to-salary", "/monthly-salary-calculator", "/pro-rata-salary-calculator", "/"] } },
  { match: (p) => p.startsWith("/mortgage"), info: { sources: ["employer", "scotland"], related: ["/", "/compare-salaries", "/pension-calculator", "/net-to-gross-salary-calculator"] } },
  { match: (p) => p.startsWith("/child-benefit"), info: { sources: ["childBenefit", "hicbc", "employer"], related: ["/salary-sacrifice-calculator", "/pension-calculator", "/compare-salaries", "/"] } },
  { match: (p) => p.startsWith("/redundancy"), info: { sources: ["redundancy", "employer", "scotland"], related: ["/", "/pension-calculator", "/net-to-gross-salary-calculator", "/pro-rata-holiday-calculator"] } },
  { match: (p) => p.startsWith("/pension-calculator"), info: { sources: ["workplacePension", "statePension", "pensionTax", "employer"], related: ["/salary-sacrifice-calculator", "/child-benefit-calculator", "/", "/nhs-take-home-pay-calculator"] } },
  { match: (p) => p === "/hourly/13-50-an-hour", info: { sources: ["employer", "nmw", "livingWage"], related: ["/minimum-wage-calculator", "/pro-rata-salary-calculator", "/", "/net-to-gross-salary-calculator"] } },
  { match: (p) => p.startsWith("/hourly"), info: { sources: ["employer", "nmw"], related: ["/minimum-wage-calculator", "/pro-rata-salary-calculator", "/", "/net-to-gross-salary-calculator"] } },
  { match: (p) => p.startsWith("/scotland"), info: { sources: ["employer", "scotland"], related: ["/", "/net-to-gross-salary-calculator", "/salary-sacrifice-calculator", "/nhs-take-home-pay-calculator"] } },
  { match: (p) => p.startsWith("/take-home") || p.startsWith("/net-to-gross"), info: { sources: ["employer", "scotland"], related: ["/", "/scotland-salary-calculator", "/salary-sacrifice-calculator", "/hourly-to-salary"] } },
  { match: (p) => p.startsWith("/compare-salaries"), info: { sources: ["employer", "scotland"], related: ["/", "/net-to-gross-salary-calculator", "/salary-sacrifice-calculator", "/scotland-salary-calculator"] } },
  { match: (p) => p.startsWith("/monthly-salary"), info: { sources: ["employer", "scotland"], related: ["/", "/net-to-gross-salary-calculator", "/hourly-to-salary", "/compare-salaries"] } },
  { match: (p) => p.startsWith("/electric-car"), info: { sources: ["bik", "employer", "nmw"], related: ["/salary-sacrifice-calculator", "/", "/monthly-salary-calculator", "/net-to-gross-salary-calculator"] } },
  { match: (p) => p.startsWith("/salary-sacrifice"), info: { sources: ["employer", "scotland"], related: ["/electric-car-salary-sacrifice-calculator", "/", "/net-to-gross-salary-calculator", "/nhs-take-home-pay-calculator", "/teacher-take-home-pay-calculator"] } },
  { match: (p) => p.startsWith("/salary-needed"), info: { sources: ["onsRents", "ofgemCap", "councilTax", "employer", "scotland"], related: ["/", "/net-to-gross-salary-calculator", "/scotland-salary-calculator", "/compare-salaries"] } },
  { match: (p) => p.startsWith("/salary/"), info: { sources: ["employer", "scotland", "ashe"], related: EMPLOYEE } },
  { match: (p) => p.startsWith("/salary") || p.startsWith("/guides"), info: { sources: ["employer", "scotland"], related: EMPLOYEE } },
];

// Pages that are not calculators or content: no footer box.
const SKIP = ["/about", "/contact", "/privacy", "/terms", "/calculators", "/methodology", "/author/sharjeel"];

export function pageInfo(path: string): Info | null {
  const p = path.replace(/\/$/, "") || "/";
  if (SKIP.includes(p)) return null;
  const rule = RULES.find((r) => r.match(p));
  if (!rule) return null;
  return { sources: rule.info.sources, related: rule.info.related.filter((h) => h !== p).slice(0, 4), plain: rule.info.plain };
}
