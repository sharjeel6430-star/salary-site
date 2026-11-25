// Teacher pay scales for England, 2026/27 (3.5% award accepted by the government; from September 2026).
// Sources: NEU pay scales (England), checked against London area scales. Final figures are confirmed in the STPCD.
// Teachers' Pension Scheme member contribution tiers from 1 April 2026 — source: Teachers' Pensions.
import { calculate, type Region, type StudentPlan } from "./tax.ts";

export type TeacherArea = "england" | "fringe" | "outer" | "inner";

export const TEACHER_AREAS: { key: TeacherArea; label: string }[] = [
  { key: "england", label: "England (outside London)" },
  { key: "fringe", label: "London Fringe" },
  { key: "outer", label: "Outer London" },
  { key: "inner", label: "Inner London" },
];

export const TEACHER_POINTS = ["M1", "M2", "M3", "M4", "M5", "M6", "U1", "U2", "U3"] as const;
export type TeacherPoint = (typeof TEACHER_POINTS)[number];

export const TEACHER_PAY: Record<TeacherArea, Record<TeacherPoint, number>> = {
  england: { M1: 34069, M2: 36042, M3: 38400, M4: 40941, M5: 43529, M6: 46940, U1: 49134, U2: 50956, U3: 52835 },
  fringe: { M1: 35602, M2: 37647, M3: 39979, M4: 42513, M5: 45070, M6: 48479, U1: 50625, U2: 52442, U3: 54328 },
  outer: { M1: 39196, M2: 41246, M3: 43403, M4: 45673, M5: 48438, M6: 52241, U1: 54047, U2: 56047, U3: 58120 },
  inner: { M1: 41729, M2: 43713, M3: 45787, M4: 47961, M5: 50666, M6: 54131, U1: 59650, U2: 62581, U3: 64684 },
};

export const TPS_TIERS = [
  { upTo: 36198.99, rate: 0.074 },
  { upTo: 48727.99, rate: 0.089 },
  { upTo: 57776.99, rate: 0.099 },
  { upTo: 76572.99, rate: 0.105 },
  { upTo: 104413.99, rate: 0.116 },
  { upTo: Infinity, rate: 0.12 },
];

export function tpsRate(salary: number) {
  return TPS_TIERS.find((t) => salary <= t.upTo)!.rate;
}

// Teachers' pension is a net pay arrangement: tax relief, but NI on the full salary.
export function teacherTakeHome(
  salary: number,
  opts: { region?: Region; studentPlan?: StudentPlan; inPension?: boolean; hoursPerWeek?: number } = {}
) {
  const rate = opts.inPension === false ? 0 : tpsRate(salary);
  return {
    rate,
    ...calculate({
      gross: salary,
      region: opts.region ?? "ruk",
      studentPlan: opts.studentPlan ?? "none",
      pensionPercent: rate * 100,
      pensionType: "netpay",
      hoursPerWeek: opts.hoursPerWeek,
    }),
  };
}
