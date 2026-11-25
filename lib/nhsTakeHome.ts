import { calculate } from "./tax";
import { nhsPensionRate } from "./nhs";

// Full-time NHS take-home pay, England/Wales/NI tax, with NHS pension.
export function nhsTakeHome(salary: number, region: "ruk" | "scotland" = "ruk") {
  const rate = nhsPensionRate(salary);
  return { rate, ...calculate({ gross: salary, region, pensionPercent: rate * 100, pensionType: "netpay" }) };
}
