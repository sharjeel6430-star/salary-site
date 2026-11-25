// HMRC Approved Mileage Allowance Payments (AMAP) for using your own vehicle on business.
// 2026/27: cars and vans rose from 45p to 55p for the first 10,000 business miles (announced 21 May 2026,
// backdated to 6 April 2026). Source: GOV.UK, Travel: mileage and fuel rates and allowances.
export type Vehicle = "car" | "motorcycle" | "bicycle";
export type MileageYear = "2026" | "2025";

export const MILEAGE_LIMIT = 10000;
export const PASSENGER_RATE = 0.05;

export const MILEAGE_RATES: Record<MileageYear, { label: string; rates: Record<Vehicle, { first: number; after: number }> }> = {
  "2026": {
    label: "2026/27",
    rates: { car: { first: 0.55, after: 0.25 }, motorcycle: { first: 0.24, after: 0.24 }, bicycle: { first: 0.2, after: 0.2 } },
  },
  "2025": {
    label: "2025/26",
    rates: { car: { first: 0.45, after: 0.25 }, motorcycle: { first: 0.24, after: 0.24 }, bicycle: { first: 0.2, after: 0.2 } },
  },
};

export function approvedAmount(vehicle: Vehicle, miles: number, year: MileageYear = "2026"): number {
  const m = Math.max(0, miles || 0);
  const r = MILEAGE_RATES[year].rates[vehicle];
  return Math.min(m, MILEAGE_LIMIT) * r.first + Math.max(0, m - MILEAGE_LIMIT) * r.after;
}

export interface MileageResult {
  approved: number; // the most that can be paid free of tax and NI
  firstBandMiles: number;
  laterMiles: number;
  paid: number; // what the employer pays
  shortfall: number; // approved amount not paid by the employer: Mileage Allowance Relief is claimed on this
  taxRelief: number; // shortfall x your Income Tax rate
  taxableExcess: number; // employer paid more than the approved amount
  passengerPayment: number; // tax-free only if the employer pays it; no relief if they do not
}

export function mileageClaim(opts: {
  vehicle: Vehicle;
  miles: number;
  employerPencePerMile?: number;
  taxRatePct?: number;
  passengerMiles?: number;
  year?: MileageYear;
}): MileageResult {
  const miles = Math.max(0, opts.miles || 0);
  const approved = approvedAmount(opts.vehicle, miles, opts.year || "2026");
  const paid = (miles * Math.max(0, opts.employerPencePerMile || 0)) / 100;
  const shortfall = Math.max(0, approved - paid);
  return {
    approved,
    firstBandMiles: Math.min(miles, MILEAGE_LIMIT),
    laterMiles: Math.max(0, miles - MILEAGE_LIMIT),
    paid,
    shortfall,
    taxRelief: (shortfall * Math.max(0, opts.taxRatePct || 0)) / 100,
    taxableExcess: Math.max(0, paid - approved),
    passengerPayment: Math.max(0, opts.passengerMiles || 0) * PASSENGER_RATE,
  };
}
