// Capital Gains Tax for individuals, tax year 2026/27.
// Sources: GOV.UK "Capital Gains Tax rates and allowances" (annual exempt amount £3,000; 18% and 24%; 18% for
// Business Asset Disposal Relief and Investors' Relief from 6 April 2026); GOV.UK "Capital Gains Tax: what you pay it on,
// rates and allowances" worked examples. The rate depends on taxable income: gains inside the unused basic rate band
// (UK-wide £37,700, used for Scottish taxpayers too) are taxed at 18%, the rest at 24%.
import { personalAllowanceFor, TAX_YEAR } from "./tax.ts";

export const CGT_YEAR = "2026/27";
export const ANNUAL_EXEMPT_AMOUNT = 3000;
export const CGT_LOW = 0.18;
export const CGT_HIGH = 0.24;
export const BADR_RATE = 0.18;
export const BADR_LIFETIME_LIMIT = 1_000_000;
export const BASIC_RATE_BAND = TAX_YEAR.bands.ruk[0].upTo; // 37,700

export type AssetType = "shares" | "residential" | "crypto" | "business" | "other";
export const ASSET_TYPES: { key: AssetType; label: string }[] = [
  { key: "shares", label: "Shares or funds (outside an ISA or pension)" },
  { key: "residential", label: "Residential property that isn't your main home" },
  { key: "crypto", label: "Cryptoassets" },
  { key: "business", label: "Business assets" },
  { key: "other", label: "Other assets (antiques, land, commercial property)" },
];

export interface CgtInput {
  income: number; // income before tax for the year (salary, pension, profits, rent)
  salePrice: number;
  purchasePrice: number;
  costs?: number; // buying and selling costs, improvements
  assetType?: AssetType;
  badr?: boolean; // gain qualifies for Business Asset Disposal Relief
  otherGains?: number; // other gains already made this tax year
  lossesThisYear?: number; // losses made in this tax year (used in full)
  lossesBroughtForward?: number; // unused losses from earlier years (used only down to the allowance)
}

export interface CgtResult {
  gain: number; // this asset; negative is a loss
  totalGains: number;
  netGains: number; // after losses
  allowanceUsed: number;
  taxableGains: number;
  basicBandLeft: number;
  at18: number;
  at24: number;
  atBadr: number;
  tax: number;
  taxOnThisAsset: number; // tax with this asset minus tax without it
  keep: number; // sale price minus purchase, costs and tax on this asset
  effectiveRate: number; // tax on this asset as a share of its gain
  lossCarriedForward: number;
  broughtForwardUsed: number;
  reportWithin60Days: boolean;
}

interface Core { tax: number; at18: number; at24: number; atBadr: number; taxable: number; net: number; allowance: number; bfUsed: number; lossCf: number }

function core(income: number, normalGains: number, badrGains: number, lossesThisYear: number, lossesBf: number): Core {
  const taxableIncome = Math.max(0, income - personalAllowanceFor(income));
  const band = Math.max(0, BASIC_RATE_BAND - taxableIncome);
  // Losses and the allowance go against the gains taxed at the highest rate first: normal gains before BADR gains.
  let normal = normalGains, badr = badrGains;
  let loss = lossesThisYear;
  const take = (amt: number) => { const t = Math.min(amt, loss); loss -= t; return t; };
  normal -= take(normal); badr -= take(badr);
  const lossCfThisYear = loss;
  const net = normal + badr;
  const bfUsed = Math.min(lossesBf, Math.max(0, net - ANNUAL_EXEMPT_AMOUNT));
  let bf = bfUsed;
  const takeBf = (amt: number) => { const t = Math.min(amt, bf); bf -= t; return t; };
  normal -= takeBf(normal); badr -= takeBf(badr);
  let aea = ANNUAL_EXEMPT_AMOUNT;
  const takeAea = (amt: number) => { const t = Math.min(amt, aea); aea -= t; return t; };
  normal -= takeAea(normal); badr -= takeAea(badr);
  const allowance = ANNUAL_EXEMPT_AMOUNT - aea;
  // BADR gains use the basic rate band before other gains.
  const bandAfterBadr = Math.max(0, band - badr);
  const at18 = Math.min(normal, bandAfterBadr);
  const at24 = normal - at18;
  const tax = badr * BADR_RATE + at18 * CGT_LOW + at24 * CGT_HIGH;
  return { tax, at18, at24, atBadr: badr, taxable: normal + badr, net, allowance, bfUsed, lossCf: lossCfThisYear + (lossesBf - bfUsed) };
}

export function capitalGainsTax(input: CgtInput): CgtResult {
  const income = Math.max(0, input.income || 0);
  const gain = (input.salePrice || 0) - (input.purchasePrice || 0) - Math.max(0, input.costs || 0);
  const other = Math.max(0, input.otherGains || 0);
  const lossesThisYear = Math.max(0, input.lossesThisYear || 0) + Math.max(0, -gain);
  const lossesBf = Math.max(0, input.lossesBroughtForward || 0);
  const g = Math.max(0, gain);
  const badrGain = input.badr ? g : 0;
  const normalGain = input.badr ? 0 : g;

  const withIt = core(income, other + normalGain, badrGain, lossesThisYear, lossesBf);
  const without = core(income, other, 0, Math.max(0, input.lossesThisYear || 0), lossesBf);
  const taxOnThisAsset = withIt.tax - without.tax;
  const taxableIncome = Math.max(0, income - personalAllowanceFor(income));

  return {
    gain,
    totalGains: g + other,
    netGains: withIt.net,
    allowanceUsed: withIt.allowance,
    taxableGains: withIt.taxable,
    basicBandLeft: Math.max(0, BASIC_RATE_BAND - taxableIncome),
    at18: withIt.at18,
    at24: withIt.at24,
    atBadr: withIt.atBadr,
    tax: withIt.tax,
    taxOnThisAsset,
    keep: (input.salePrice || 0) - (input.purchasePrice || 0) - Math.max(0, input.costs || 0) - taxOnThisAsset,
    effectiveRate: g > 0 ? taxOnThisAsset / g : 0,
    lossCarriedForward: withIt.lossCf,
    broughtForwardUsed: withIt.bfUsed,
    reportWithin60Days: input.assetType === "residential" && withIt.tax > 0,
  };
}
