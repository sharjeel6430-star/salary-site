// NHS doctors' basic pay in England from 1 April 2026 (3.5% DDRB award, 2016 resident doctor contract
// with the 2026 nodal point reform; 2003 consultant contract).
// Sources: BMA "Pay scales for resident doctors in England" and "Pay scales for consultants in England",
// both based on NHS Employers Pay and Conditions Circular (M&D) 1/2026 R2.
import { calculate, type Region, type StudentPlan } from "./tax.ts";
import { nhsPensionRate } from "./nhs.ts";

export type DoctorGroup = "resident" | "consultant";

export interface DoctorGrade {
  key: string;
  label: string;
  nodal: string; // nodal point or threshold
  salary: number; // full-time basic pay
  group: DoctorGroup;
}

export const DOCTOR_GRADES: DoctorGrade[] = [
  { key: "fy1", label: "FY1", nodal: "Nodal point 1", salary: 41226, group: "resident" },
  { key: "fy2", label: "FY2", nodal: "Nodal point 2", salary: 47610, group: "resident" },
  { key: "st1", label: "CT1 / ST1", nodal: "Nodal point 3a", salary: 55355, group: "resident" },
  { key: "st2", label: "CT2 / ST2", nodal: "Nodal point 3b", salary: 55355, group: "resident" },
  { key: "st3", label: "CT3 / ST3", nodal: "Nodal point 4a", salary: 67325, group: "resident" },
  { key: "st4", label: "CT4 / ST4", nodal: "Nodal point 4b", salary: 67998, group: "resident" },
  { key: "st5", label: "ST5", nodal: "Nodal point 4c", salary: 67998, group: "resident" },
  { key: "st6", label: "ST6", nodal: "Nodal point 5a", salary: 76582, group: "resident" },
  { key: "st7", label: "ST7", nodal: "Nodal point 5b", salary: 77348, group: "resident" },
  { key: "st8", label: "ST8", nodal: "Nodal point 5c", salary: 77348, group: "resident" },
  { key: "con1", label: "Consultant (starting)", nodal: "Threshold 1", salary: 113565, group: "consultant" },
  { key: "con2a", label: "Consultant (3+ years)", nodal: "Threshold 2a", salary: 120249, group: "consultant" },
  { key: "con2b", label: "Consultant (4+ years)", nodal: "Threshold 2b", salary: 123672, group: "consultant" },
  { key: "con3", label: "Consultant (8+ years)", nodal: "Threshold 3", salary: 135645, group: "consultant" },
  { key: "con4", label: "Consultant (14+ years)", nodal: "Threshold 4", salary: 150569, group: "consultant" },
];

export const getDoctorGrade = (key: string) => DOCTOR_GRADES.find((g) => g.key === key);

// NHS Pension is a net pay arrangement: tax relief, but NI and student loan on full pay.
// The tier is set by actual pensionable pay.
export function doctorTakeHome(
  pay: number,
  opts: { region?: Region; studentPlan?: StudentPlan; postgraduate?: boolean; inPension?: boolean } = {}
) {
  const rate = opts.inPension === false ? 0 : nhsPensionRate(pay);
  return {
    rate,
    ...calculate({
      gross: pay,
      region: opts.region ?? "ruk",
      studentPlan: opts.studentPlan ?? "none",
      postgraduate: opts.postgraduate,
      pensionPercent: rate * 100,
      pensionType: "netpay",
      hoursPerWeek: 40,
    }),
  };
}
