// Downloadable CSV behind /data/uk-take-home-pay-2026-27, built at build time from lib/takeHomeData.ts.
export const dynamic = "force-static";
import { takeHomeCsv } from "@/lib/takeHomeData";

export function GET() {
  return new Response(takeHomeCsv(), { headers: { "Content-Type": "text/csv; charset=utf-8" } });
}
