import { test } from "node:test";
import assert from "node:assert/strict";
import { classify, weightedAverage, overallAverage, requiredFinalYear } from "../lib/grades.ts";
import { approvedAmount, mileageClaim } from "../lib/mileage.ts";
import { fuelCost, mpgToL100km, l100kmToMpg, mpgFromFill, evCost } from "../lib/fuel.ts";
import { bmi, bmiCategory, healthyWeightRange, bmr, tdee, strideMetres, stepsToDistance, milesToSteps, stonesToKg, feetToCm, kgToStones } from "../lib/health.ts";
import { distance, findPlace, parseCoordinates, looksLikePostcode, bearing, compass } from "../lib/distance.ts";

const close = (a: number, b: number, e = 0.01) => assert.ok(Math.abs(a - b) < e, `${a} != ${b}`);

// ---------- University grades ----------
test("grades: credit-weighted module average (68/20, 72/20, 64/40 = 67%)", () => {
  const r = weightedAverage([{ mark: 68, credits: 20 }, { mark: 72, credits: 20 }, { mark: 64, credits: 40 }]);
  close(r!.average, 67);
  assert.equal(r!.credits, 80);
  assert.equal(weightedAverage([{ mark: 60, credits: 0 }]), null);
});

test("grades: classification boundaries", () => {
  assert.equal(classify(70).short, "First");
  assert.equal(classify(69.9).short, "2:1");
  assert.equal(classify(60).short, "2:1");
  assert.equal(classify(59.99).short, "2:2");
  assert.equal(classify(40).short, "Third");
  assert.equal(classify(39.9).short, "Fail");
});

test("grades: year weighting and the mark needed in final year", () => {
  close(overallAverage(62, 68, 0.4), 65.6);
  close(overallAverage(62, 68, 0.25), 66.5);
  close(requiredFinalYear(58, 0.4, 60)!, 61.333, 0.001);
  assert.equal(requiredFinalYear(58, 1, 60), null);
  // Scoring the required mark gives exactly the target.
  close(overallAverage(58, requiredFinalYear(58, 0.4, 70)!, 0.4), 70);
});

// ---------- HMRC mileage ----------
test("mileage: 12,000 car miles in 2026/27 = £6,000 (55p then 25p)", () => {
  close(approvedAmount("car", 12000), 6000);
  close(approvedAmount("car", 10000), 5500);
  close(approvedAmount("car", 12000, "2025"), 5000); // 45p in 2025/26
  close(approvedAmount("motorcycle", 12000), 2880);
  close(approvedAmount("bicycle", 500), 100);
});

test("mileage: relief when the employer pays less, tax when they pay more", () => {
  const r = mileageClaim({ vehicle: "car", miles: 8000, employerPencePerMile: 30, taxRatePct: 20 });
  close(r.approved, 4400);
  close(r.paid, 2400);
  close(r.shortfall, 2000);
  close(r.taxRelief, 400);
  close(mileageClaim({ vehicle: "car", miles: 8000, employerPencePerMile: 30, taxRatePct: 40 }).taxRelief, 800);
  const over = mileageClaim({ vehicle: "car", miles: 1000, employerPencePerMile: 60, taxRatePct: 20 });
  close(over.taxableExcess, 50);
  close(over.shortfall, 0);
  close(mileageClaim({ vehicle: "car", miles: 100, passengerMiles: 100 }).passengerPayment, 5);
});

// ---------- Fuel ----------
test("fuel: 200 miles at 45 mpg and 145p a litre = £29.30", () => {
  const r = fuelCost({ miles: 200, mpg: 45, pencePerLitre: 145 });
  close(r.litres, 20.205, 0.001);
  close(r.cost, 29.3, 0.01);
  close(r.costPerMile, 0.1465, 0.0001);
  close(fuelCost({ miles: 200, mpg: 45, pencePerLitre: 145, people: 4 }).perPerson, 7.32, 0.01);
  assert.equal(fuelCost({ miles: 200, mpg: 0, pencePerLitre: 145 }).cost, 0);
});

test("fuel: unit conversions", () => {
  close(mpgToL100km(45), 6.277, 0.001);
  close(l100kmToMpg(mpgToL100km(45)), 45, 0.0001);
  close(mpgFromFill(400, 40), 45.46, 0.01);
  close(evCost({ miles: 100, milesPerKwh: 4, pencePerKwh: 28 }).cost, 7);
});

// ---------- BMI, TDEE, steps ----------
test("BMI: 70 kg at 175 cm = 22.9, NHS categories", () => {
  close(bmi(70, 175), 22.857, 0.001);
  assert.equal(bmiCategory(18.4), "Underweight");
  assert.equal(bmiCategory(18.5), "Healthy weight");
  assert.equal(bmiCategory(24.9), "Healthy weight");
  assert.equal(bmiCategory(25), "Overweight");
  assert.equal(bmiCategory(30), "Obese");
  assert.equal(bmiCategory(40), "Severely obese");
  assert.equal(bmiCategory(24, true), "Overweight"); // lower thresholds: 23 and 27.5
  assert.equal(bmiCategory(28, true), "Obese");
  const range = healthyWeightRange(175);
  close(range.minKg, 56.66, 0.01);
  close(range.maxKg, 76.56, 0.01);
});

test("BMI: imperial conversions", () => {
  close(stonesToKg(11, 0), 69.853, 0.001);
  close(feetToCm(5, 9), 175.26, 0.001);
  assert.deepEqual(kgToStones(70), { stones: 11, lb: 0 });
  assert.deepEqual(kgToStones(76.2), { stones: 12, lb: 0 });
});

test("TDEE: Mifflin-St Jeor (woman 30, 65 kg, 165 cm, lightly active = 1,884 kcal)", () => {
  close(bmr({ sex: "female", kg: 65, cm: 165, age: 30 }), 1370.25);
  close(bmr({ sex: "male", kg: 80, cm: 180, age: 40 }), 1730);
  const r = tdee({ sex: "female", kg: 65, cm: 165, age: 30, activity: "light" });
  close(r.tdee, 1884.09, 0.01);
  assert.equal(bmr({ sex: "male", kg: 0, cm: 180, age: 40 }), 0);
});

test("steps: 170 cm walker takes about 2,290 steps a mile", () => {
  const stride = strideMetres(170, "female");
  close(stride, 0.7021, 0.0001);
  const r = stepsToDistance(10000, stride);
  close(r.miles, 4.363, 0.001);
  close(r.stepsPerMile, 2292.2, 0.1);
  close(milesToSteps(r.miles, stride), 10000, 0.001);
  assert.ok(strideMetres(170, "female", "run") > stride);
});

// ---------- Distance ----------
test("distance: London to Edinburgh is about 332 miles in a straight line", () => {
  const d = distance(findPlace("London")!, findPlace("edinburgh")!);
  close(d.miles, 332, 2);
  close(d.km, 534, 3);
  close(distance(findPlace("London")!, findPlace("London")!).km, 0);
  assert.equal(compass(bearing(findPlace("London")!, findPlace("Edinburgh")!)), "north");
  assert.equal(compass(bearing(findPlace("London")!, findPlace("Bristol")!)), "west");
});

test("distance: input parsing", () => {
  assert.deepEqual(parseCoordinates("51.5074, -0.1278"), { lat: 51.5074, lon: -0.1278 });
  assert.equal(parseCoordinates("London"), null);
  assert.equal(parseCoordinates("95, 0"), null);
  assert.ok(looksLikePostcode("SW1A 1AA"));
  assert.ok(looksLikePostcode("m11ae"));
  assert.ok(!looksLikePostcode("Manchester"));
  assert.ok(findPlace("Newcastle"));
  assert.equal(findPlace("Atlantis"), null);
});
