// Data for /salary-needed-to-live-uk-cities: what one adult needs to earn to live alone in 10 UK cities.
// Every figure is sourced (see lib/sources.ts ids onsRents, ofgemCap, councilTax) or a stated assumption below.
// Update the numbers here and the page (tables, charts, FAQs) updates with them.
import { calculate, type Region } from "./tax.ts";

export const COL_UPDATED = "10 November 2026";
export const COL_UPDATED_ISO = "2026-11-10";
export const COL_RENTS_MONTH = "September 2026";

export interface City {
  slug: string;
  name: string;
  rentArea: string; // area the ONS rent figure covers
  region: Region;
  rentOneBed: number; // ONS PIPR average monthly rent, one bedroom
  rentAll: number; // ONS PIPR average monthly rent, all sizes
  rentChange: number; // annual % change, all sizes
  bandD: number; // 2026/27 Band D council tax, £ a year
  transport: number; // £ a month
}

export const CITIES: City[] = [
  { slug: "london", name: "London", rentArea: "London", region: "ruk", rentOneBed: 1764, rentAll: 2338, rentChange: 3.5, bandD: 2068, transport: 175 },
  { slug: "bristol", name: "Bristol", rentArea: "Bristol", region: "ruk", rentOneBed: 1230, rentAll: 1893, rentChange: 5.7, bandD: 2713.68, transport: 70 },
  { slug: "edinburgh", name: "Edinburgh", rentArea: "Lothian", region: "scotland", rentOneBed: 1036, rentAll: 1411, rentChange: 1.0, bandD: 1626, transport: 70 },
  { slug: "manchester", name: "Manchester", rentArea: "Manchester", region: "ruk", rentOneBed: 1007, rentAll: 1380, rentChange: 4.6, bandD: 2312.04, transport: 70 },
  { slug: "cardiff", name: "Cardiff", rentArea: "Cardiff", region: "ruk", rentOneBed: 910, rentAll: 1179, rentChange: 3.2, bandD: 2013, transport: 70 },
  { slug: "glasgow", name: "Glasgow", rentArea: "Greater Glasgow", region: "scotland", rentOneBed: 845, rentAll: 1266, rentChange: 1.1, bandD: 1706, transport: 70 },
  { slug: "birmingham", name: "Birmingham", rentArea: "Birmingham", region: "ruk", rentOneBed: 834, rentAll: 1106, rentChange: 3.3, bandD: 2362.9, transport: 70 },
  { slug: "newcastle", name: "Newcastle", rentArea: "Newcastle upon Tyne", region: "ruk", rentOneBed: 816, rentAll: 1220, rentChange: 7.9, bandD: 2542.19, transport: 70 },
  { slug: "leeds", name: "Leeds", rentArea: "Leeds", region: "ruk", rentOneBed: 783, rentAll: 1148, rentChange: 4.5, bandD: 2283.73, transport: 70 },
  { slug: "liverpool", name: "Liverpool", rentArea: "Liverpool", region: "ruk", rentOneBed: 688, rentAll: 916, rentChange: 5.4, bandD: 2673.59, transport: 70 },
];

// Energy: Ofgem cap rates for Oct–Dec 2026 x Ofgem "low" typical use (1,800 kWh electricity, 7,500 kWh gas).
const ELEC_KWH = 1800, GAS_KWH = 7500;
const ELEC_P = 26.32, ELEC_SC = 54.83, GAS_P = 7.97, GAS_SC = 29.68; // pence
export const ENERGY_MONTHLY = Math.round((ELEC_KWH * ELEC_P + 365 * ELEC_SC + GAS_KWH * GAS_P + 365 * GAS_SC) / 100 / 12);
export const WATER_MONTHLY = 40;
export const BROADBAND_PHONE_MONTHLY = 45;
export const GROCERIES_MONTHLY = 250;
/** Band B (7/9 of Band D, typical for a one-bed flat) with the 25% single person discount, per month. */
export const councilTaxMonthly = (bandD: number) => Math.round(((bandD * 7) / 9) * 0.75 / 12);

export const COL_ASSUMPTIONS = [
  "One adult renting a one-bedroom home alone, with no car, no children, no student loan and no pension contributions.",
  `Energy is £${ENERGY_MONTHLY} a month: the Ofgem price cap rates for October to December 2026 applied to Ofgem's 'low' typical use (1,800 kWh electricity, 7,500 kWh gas).`,
  "Council tax is Band B (7/9 of the local Band D charge) with the 25% single person discount.",
  `Water £${WATER_MONTHLY}, broadband and mobile £${BROADBAND_PHONE_MONTHLY} and groceries £${GROCERIES_MONTHLY} a month in every city.`,
  "Transport is a London Zones 1–3 annual Travelcard (£2,100) spread over 12 months; elsewhere a £70 monthly city bus pass (Birmingham's nbus monthly ticket is £67 from June 2026).",
  "Minimum salary: essentials take 80% of take-home pay. Comfortable salary: essentials take 50% (the 50/30/20 rule), leaving 30% for wants and 20% for savings.",
];

/** Smallest gross salary, rounded up to the nearest £100, whose take-home pay is at least `netAnnual`. */
export function grossNeeded(netAnnual: number, region: Region): number {
  let lo = 0, hi = 500000;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (calculate({ gross: mid, region }).takeHome >= netAnnual) hi = mid;
    else lo = mid;
  }
  let g = Math.ceil(hi / 100) * 100;
  while (calculate({ gross: g, region }).takeHome < netAnnual) g += 100;
  return g;
}

export interface CityResult extends City {
  councilTax: number;
  essentials: number;
  breakdown: { label: string; value: number }[];
  minSalary: number;
  comfortableSalary: number;
  comfortableMonthlyNet: number;
}

export function cityResults(): CityResult[] {
  return CITIES.map((c) => {
    const councilTax = councilTaxMonthly(c.bandD);
    const breakdown = [
      { label: "Rent", value: c.rentOneBed },
      { label: "Council tax", value: councilTax },
      { label: "Energy", value: ENERGY_MONTHLY },
      { label: "Water", value: WATER_MONTHLY },
      { label: "Broadband & phone", value: BROADBAND_PHONE_MONTHLY },
      { label: "Groceries", value: GROCERIES_MONTHLY },
      { label: "Transport", value: c.transport },
    ];
    const essentials = breakdown.reduce((s, b) => s + b.value, 0);
    const comfortableMonthlyNet = essentials / 0.5;
    return {
      ...c,
      councilTax,
      essentials,
      breakdown,
      minSalary: grossNeeded((essentials / 0.8) * 12, c.region),
      comfortableSalary: grossNeeded(comfortableMonthlyNet * 12, c.region),
      comfortableMonthlyNet,
    };
  }).sort((a, b) => b.comfortableSalary - a.comfortableSalary);
}

// Real photos, free under the Unsplash Licence. Credit is shown on the page.
export const COL_PHOTOS = {
  hero: {
    src: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=75",
    width: 1600,
    height: 1067,
    alt: "Aerial view of the River Thames winding through London",
    credit: "Benjamin Davies",
    creditUrl: "https://unsplash.com/@bendavisual?utm_source=uksalarytools&utm_medium=referral",
    photoUrl: "https://unsplash.com/photos/Oja2ty_9ZLM?utm_source=uksalarytools&utm_medium=referral",
  },
  manchester: {
    src: "https://images.unsplash.com/photo-1611490916757-4402482e161b?auto=format&fit=crop&w=1400&q=75",
    width: 1400,
    height: 886,
    alt: "Aerial view of Manchester city centre buildings",
    credit: "Mylo Kaye",
    creditUrl: "https://unsplash.com/@mylokaye?utm_source=uksalarytools&utm_medium=referral",
    photoUrl: "https://unsplash.com/photos/gGneMriFtW4?utm_source=uksalarytools&utm_medium=referral",
  },
};
