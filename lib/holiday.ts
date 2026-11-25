// UK statutory holiday entitlement (GOV.UK "Holiday entitlement"):
// 5.6 weeks a year, capped at 28 days. Bank holidays can be included in the 28 days.
// Irregular-hours and part-year workers (leave years from 1 April 2024) accrue 12.07% of hours worked.

export const STATUTORY_WEEKS = 5.6;
export const STATUTORY_CAP_DAYS = 28;
export const IRREGULAR_ACCRUAL = 0.1207;

export interface HolidayInput {
  daysPerWeek: number; // days the employee works each week
  hoursPerWeek?: number; // hours the employee works each week
  fullTimeDays?: number; // company full-time week, usually 5
  fullTimeEntitlement?: number; // company full-time days INCLUDING bank holidays (statutory = 28)
  months?: number; // months of the holiday year worked (starters/leavers), 1–12
}

export function proRataHoliday(i: HolidayInput) {
  const days = Math.min(7, Math.max(0, i.daysPerWeek || 0));
  const ftDays = Math.min(7, Math.max(1, i.fullTimeDays || 5));
  const months = Math.min(12, Math.max(0, i.months ?? 12));
  const hours = Math.max(0, i.hoursPerWeek || 0);

  const statutoryDays = Math.min(STATUTORY_CAP_DAYS, STATUTORY_WEEKS * days);
  // No company scheme given -> statutory only.
  const companyDays =
    i.fullTimeEntitlement == null ? statutoryDays : (Math.max(0, i.fullTimeEntitlement) * Math.min(days, ftDays)) / ftDays;
  const yearDays = Math.max(statutoryDays, companyDays);
  const partYearDays = (yearDays * months) / 12;
  const hoursPerDay = days > 0 && hours > 0 ? hours / days : 0;

  const round1 = (n: number) => Math.round(n * 10) / 10;
  return {
    statutoryDays: round1(statutoryDays),
    companyDays: round1(companyDays),
    yearDays: round1(yearDays),
    days: round1(partYearDays),
    hours: hoursPerDay > 0 ? round1(partYearDays * hoursPerDay) : null,
    weeks: days > 0 ? round1(partYearDays / days) : 0,
    usesStatutory: statutoryDays >= companyDays,
  };
}

export function irregularHoursHoliday(hoursWorked: number) {
  return Math.round(Math.max(0, hoursWorked || 0) * IRREGULAR_ACCRUAL * 10) / 10;
}
