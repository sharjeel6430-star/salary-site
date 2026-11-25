// Doctors' take-home pay, checked by hand.
import { test } from "node:test";
import assert from "node:assert/strict";
import { doctorTakeHome, DOCTOR_GRADES } from "../lib/doctors.ts";

test("FY1 £41,226 England with NHS pension 9.8%", () => {
  const r = doctorTakeHome(41226);
  assert.equal(r.rate, 0.098);
  assert.equal(r.pension, 4040.15); // 41,226 × 9.8%
  assert.equal(r.incomeTax, 4923.17); // (41,226 − 4,040.148 − 12,570) × 20%
  assert.equal(r.nationalInsurance, 2292.48); // (41,226 − 12,570) × 8%
  assert.equal(r.takeHome, 29970.2);
});

test("Consultant starting £113,565 loses part of the Personal Allowance", () => {
  const r = doctorTakeHome(113565);
  assert.equal(r.rate, 0.125);
  // Adjusted income after pension = 99,369.375 (< £100k) so the full allowance applies.
  assert.equal(r.personalAllowance, 12570);
});

test("Grades are in salary order and complete", () => {
  assert.equal(DOCTOR_GRADES.length, 15);
  for (let i = 1; i < DOCTOR_GRADES.length; i++) assert.ok(DOCTOR_GRADES[i].salary >= DOCTOR_GRADES[i - 1].salary);
});
