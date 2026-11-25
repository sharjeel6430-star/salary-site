import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "All UK Pay and Tax Calculators 2026/27",
  description: `Every free calculator on ${SITE_NAME}: take-home pay, payslip, hourly, NHS, teachers, pro rata, mortgage, pension, redundancy, mileage and more.`,
  alternates: { canonical: "/calculators" },
};

const GROUPS = ["Employees", "Sectors", "Work patterns", "Life events", "Business", "Everyday"] as const;

export default function Calculators() {
  return (
    <>
      <h1>All calculators</h1>
      <p className="lead">Free UK pay and tax calculators, updated for the 2026/27 tax year, plus everyday calculators for travel, study and health.</p>
      {GROUPS.map((g) => (
        <section key={g}>
          <h2>{g === "Sectors" ? "NHS, doctors and teachers" : g === "Business" ? "Company directors and business" : g === "Life events" ? "Mortgages, family, redundancy and pensions" : g === "Everyday" ? "Everyday calculators" : g}</h2>
          <ul className="guide-list">
            {TOOLS.filter((t) => t.group === g).map((c) => (
              <li key={c.href} className="card">
                <Link href={c.href}>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
