// Property purchase taxes for residential property, as at November 2026:
// - England and Northern Ireland: Stamp Duty Land Tax (GOV.UK "Stamp Duty Land Tax: residential property rates";
//   higher rates for additional dwellings 5% on top for purchases of £40,000 or more; 2% non-UK resident surcharge;
//   first-time buyers 0% to £300,000 and 5% to £500,000, no relief above £500,000).
// - Scotland: Land and Buildings Transaction Tax (gov.scot Scottish Budget 2026-27: 0% to £145,000, 2%, 5%, 10%, 12%;
//   first-time buyer nil band £175,000; Additional Dwelling Supplement 8% of the whole price from £40,000).
// - Wales: Land Transaction Tax (gov.wales rates and bands: main rates from 10 October 2022, higher rates from
//   11 December 2024; no first-time buyer relief).

export type Nation = "england" | "scotland" | "wales";
export type BuyerType = "mover" | "first" | "additional";

export interface Band { upTo: number; rate: number }

export const SDLT_STANDARD: Band[] = [
  { upTo: 125000, rate: 0 }, { upTo: 250000, rate: 0.02 }, { upTo: 925000, rate: 0.05 }, { upTo: 1500000, rate: 0.1 }, { upTo: Infinity, rate: 0.12 },
];
export const SDLT_FTB: Band[] = [{ upTo: 300000, rate: 0 }, { upTo: 500000, rate: 0.05 }];
export const SDLT_FTB_CAP = 500000;
export const SDLT_SURCHARGE = 0.05;
export const NON_RESIDENT_SURCHARGE = 0.02;
export const HIGHER_RATES_MIN = 40000;

export const LBTT_STANDARD: Band[] = [
  { upTo: 145000, rate: 0 }, { upTo: 250000, rate: 0.02 }, { upTo: 325000, rate: 0.05 }, { upTo: 750000, rate: 0.1 }, { upTo: Infinity, rate: 0.12 },
];
export const LBTT_FTB: Band[] = [
  { upTo: 175000, rate: 0 }, { upTo: 250000, rate: 0.02 }, { upTo: 325000, rate: 0.05 }, { upTo: 750000, rate: 0.1 }, { upTo: Infinity, rate: 0.12 },
];
export const LBTT_ADS = 0.08;

export const LTT_MAIN: Band[] = [
  { upTo: 225000, rate: 0 }, { upTo: 400000, rate: 0.06 }, { upTo: 750000, rate: 0.075 }, { upTo: 1500000, rate: 0.1 }, { upTo: Infinity, rate: 0.12 },
];
export const LTT_HIGHER: Band[] = [
  { upTo: 180000, rate: 0.05 }, { upTo: 250000, rate: 0.085 }, { upTo: 400000, rate: 0.1 }, { upTo: 750000, rate: 0.125 }, { upTo: 1500000, rate: 0.15 }, { upTo: Infinity, rate: 0.17 },
];

export const TAX_NAME: Record<Nation, string> = {
  england: "Stamp Duty Land Tax",
  scotland: "Land and Buildings Transaction Tax",
  wales: "Land Transaction Tax",
};

export interface BandLine { from: number; to: number; rate: number; amount: number; tax: number }

export function slices(price: number, bands: Band[], add = 0): BandLine[] {
  const out: BandLine[] = [];
  let from = 0;
  for (const b of bands) {
    const amount = Math.max(0, Math.min(price, b.upTo) - from);
    if (amount > 0 || from === 0) out.push({ from, to: b.upTo, rate: b.rate + add, amount, tax: amount * (b.rate + add) });
    from = b.upTo;
    if (price <= b.upTo) break;
  }
  return out;
}

export interface PropertyTaxInput { price: number; nation: Nation; buyer: BuyerType; nonResident?: boolean }

export interface PropertyTaxResult {
  tax: number;
  taxName: string;
  lines: BandLine[];
  supplement: number; // ADS in Scotland (flat 8% of price), included in tax
  effectiveRate: number;
  ftbApplied: boolean;
  ftbSaving: number; // compared with a home mover
  ftbLostOverCap: boolean;
  higherApplied: boolean;
  nonResidentApplied: boolean;
  deadline: string;
}

const sum = (l: BandLine[]) => l.reduce((s, x) => s + x.tax, 0);

export function propertyTax(input: PropertyTaxInput): PropertyTaxResult {
  const price = Math.max(0, input.price || 0);
  const { nation, buyer } = input;
  const higher = buyer === "additional" && price >= HIGHER_RATES_MIN;
  let lines: BandLine[] = [];
  let supplement = 0;
  let ftbApplied = false;
  let ftbLostOverCap = false;
  let nonResidentApplied = false;
  let moverTax = 0;

  if (nation === "england") {
    const nr = input.nonResident ? NON_RESIDENT_SURCHARGE : 0;
    nonResidentApplied = nr > 0 && price >= HIGHER_RATES_MIN;
    const addNr = nonResidentApplied ? nr : 0;
    moverTax = sum(slices(price, SDLT_STANDARD, addNr));
    if (buyer === "first" && price <= SDLT_FTB_CAP) {
      lines = slices(price, SDLT_FTB, addNr);
      ftbApplied = true;
    } else {
      ftbLostOverCap = buyer === "first" && price > SDLT_FTB_CAP;
      lines = slices(price, SDLT_STANDARD, (higher ? SDLT_SURCHARGE : 0) + addNr);
    }
  } else if (nation === "scotland") {
    moverTax = sum(slices(price, LBTT_STANDARD));
    if (buyer === "first") {
      lines = slices(price, LBTT_FTB);
      ftbApplied = true;
    } else {
      lines = slices(price, LBTT_STANDARD);
    }
    if (higher) supplement = price * LBTT_ADS;
  } else {
    moverTax = sum(slices(price, LTT_MAIN));
    lines = slices(price, higher ? LTT_HIGHER : LTT_MAIN);
  }

  const tax = sum(lines) + supplement;
  return {
    tax,
    taxName: TAX_NAME[nation],
    lines,
    supplement,
    effectiveRate: price > 0 ? tax / price : 0,
    ftbApplied,
    ftbSaving: ftbApplied ? Math.max(0, moverTax - sum(lines)) : 0,
    ftbLostOverCap,
    higherApplied: higher,
    nonResidentApplied,
    deadline: nation === "england" ? "14 days" : "30 days",
  };
}
