export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { SALARY_PAGES, SITE_URL, salaryPath } from "@/lib/site";
import { GUIDES } from "@/lib/guides";
import { NHS_BANDS } from "@/lib/nhs";
import { HOURLY_RATES, hourlyPath } from "@/lib/hourly";
import { NOINDEX_TOOLS, TOOLS } from "@/lib/tools";
import { MONTHLY_TARGETS, monthlyPath } from "@/lib/reverse";
import { lastModified } from "@/lib/lastModified";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = TOOLS.filter((t) => !NOINDEX_TOOLS.includes(t.href)).map((t) => (t.href === "/" ? "" : t.href));
  const lists = ["/salary", "/hourly", "/take-home", "/nhs-pay-bands", "/guides", "/calculators", "/about", "/methodology", "/author/sharjeel", "/data/uk-take-home-pay-2026-27", "/research/income-tax-threshold-freeze-2026", "/contact", "/privacy", "/terms"];
  return [
    ...tools.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: lastModified(p || "/"), priority: p === "" ? 1 : 0.9 })),
    { url: `${SITE_URL}/salary-needed-to-live-uk-cities`, lastModified: lastModified("/salary-needed-to-live-uk-cities"), priority: 0.8 },
    ...lists.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: lastModified(p), priority: 0.6 })),
    ...NHS_BANDS.map((b) => ({ url: `${SITE_URL}/nhs-pay-bands/${b.slug}`, lastModified: lastModified(`/nhs-pay-bands/${b.slug}`), priority: 0.8 })),
    ...GUIDES.map((g) => ({ url: `${SITE_URL}/guides/${g.slug}`, lastModified: lastModified(`/guides/${g.slug}`), priority: 0.6 })),
    ...SALARY_PAGES.map((s) => ({ url: `${SITE_URL}${salaryPath(s)}`, lastModified: lastModified(salaryPath(s)), priority: 0.8 })),
    ...MONTHLY_TARGETS.map((m) => ({ url: `${SITE_URL}${monthlyPath(m)}`, lastModified: lastModified(monthlyPath(m)), priority: 0.7 })),
    ...HOURLY_RATES.map((r) => ({ url: `${SITE_URL}${hourlyPath(r)}`, lastModified: lastModified(hourlyPath(r)), priority: 0.5 })),
  ];
}
