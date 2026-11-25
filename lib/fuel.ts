// Fuel cost of a journey. UK fuel economy is quoted in miles per (imperial) gallon; fuel is sold in litres.
export const LITRES_PER_UK_GALLON = 4.54609;
export const LITRES_PER_US_GALLON = 3.78541;
export const KM_PER_MILE = 1.609344;

export const mpgToL100km = (mpg: number) => (mpg > 0 ? (100 * LITRES_PER_UK_GALLON) / (mpg * KM_PER_MILE) : 0);
export const l100kmToMpg = (l: number) => (l > 0 ? (100 * LITRES_PER_UK_GALLON) / (l * KM_PER_MILE) : 0);

// Your real MPG from a brim-to-brim fill: miles driven and litres needed to refill.
export const mpgFromFill = (miles: number, litres: number) => (litres > 0 ? (miles / litres) * LITRES_PER_UK_GALLON : 0);

export interface FuelResult {
  miles: number;
  litres: number;
  cost: number;
  costPerMile: number;
  perPerson: number;
}

export function fuelCost(opts: { miles: number; mpg: number; pencePerLitre: number; people?: number }): FuelResult {
  const miles = Math.max(0, opts.miles || 0);
  const mpg = Math.max(0, opts.mpg || 0);
  const litres = mpg > 0 ? (miles / mpg) * LITRES_PER_UK_GALLON : 0;
  const cost = (litres * Math.max(0, opts.pencePerLitre || 0)) / 100;
  const people = Math.max(1, Math.round(opts.people || 1));
  return { miles, litres, cost, costPerMile: miles > 0 ? cost / miles : 0, perPerson: cost / people };
}

// Electric cars: efficiency in miles per kWh, price in pence per kWh.
export function evCost(opts: { miles: number; milesPerKwh: number; pencePerKwh: number }): { kwh: number; cost: number; costPerMile: number } {
  const miles = Math.max(0, opts.miles || 0);
  const kwh = opts.milesPerKwh > 0 ? miles / opts.milesPerKwh : 0;
  const cost = (kwh * Math.max(0, opts.pencePerKwh || 0)) / 100;
  return { kwh, cost, costPerMile: miles > 0 ? cost / miles : 0 };
}
