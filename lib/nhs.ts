// NHS Agenda for Change pay scales (England) from 1 April 2026 — source: NHS Employers "Pay scales for 2026/27".
// NHS Pension Scheme member contribution tiers from 1 April 2026 — source: NHS Employers.

export interface PayPoint {
  label: string; // "Entry", "Intermediate", "Top"
  salary: number;
}

export interface NhsBand {
  slug: string; // "band-5"
  name: string; // "Band 5"
  points: PayPoint[];
  roles: string;
}

export const NHS_BANDS: NhsBand[] = [
  { slug: "band-2", name: "Band 2", points: [{ label: "All staff", salary: 25272 }], roles: "Healthcare assistants, domestic support workers, porters" },
  { slug: "band-3", name: "Band 3", points: [{ label: "Entry", salary: 25760 }, { label: "Top", salary: 27476 }], roles: "Senior healthcare assistants, clinical support workers, administrators" },
  { slug: "band-4", name: "Band 4", points: [{ label: "Entry", salary: 28392 }, { label: "Top", salary: 31157 }], roles: "Assistant practitioners, nursing associates, senior administrators" },
  { slug: "band-5", name: "Band 5", points: [{ label: "Entry", salary: 32073 }, { label: "Intermediate", salary: 34592 }, { label: "Top", salary: 39043 }], roles: "Newly qualified nurses, paramedics, physiotherapists, radiographers" },
  { slug: "band-6", name: "Band 6", points: [{ label: "Entry", salary: 39959 }, { label: "Intermediate", salary: 42170 }, { label: "Top", salary: 48117 }], roles: "Senior nurses, specialist nurses, experienced allied health professionals" },
  { slug: "band-7", name: "Band 7", points: [{ label: "Entry", salary: 49387 }, { label: "Intermediate", salary: 51932 }, { label: "Top", salary: 56515 }], roles: "Advanced practitioners, ward managers, clinical specialists" },
  { slug: "band-8a", name: "Band 8a", points: [{ label: "Entry", salary: 57528 }, { label: "Intermediate", salary: 60417 }, { label: "Top", salary: 64750 }], roles: "Modern matrons, consultant therapists, senior managers" },
  { slug: "band-8b", name: "Band 8b", points: [{ label: "Entry", salary: 66582 }, { label: "Intermediate", salary: 70896 }, { label: "Top", salary: 77368 }], roles: "Heads of service, consultant nurses, senior clinical leads" },
  { slug: "band-8c", name: "Band 8c", points: [{ label: "Entry", salary: 79504 }, { label: "Intermediate", salary: 84346 }, { label: "Top", salary: 91609 }], roles: "Senior heads of service, deputy directors" },
  { slug: "band-8d", name: "Band 8d", points: [{ label: "Entry", salary: 94356 }, { label: "Intermediate", salary: 100140 }, { label: "Top", salary: 108814 }], roles: "Directors and associate directors" },
  { slug: "band-9", name: "Band 9", points: [{ label: "Entry", salary: 112782 }, { label: "Intermediate", salary: 119583 }, { label: "Top", salary: 129783 }], roles: "Chief officers and executive directors" },
];

export const NHS_PENSION_TIERS = [
  { upTo: 13259, rate: 0.052 },
  { upTo: 28854, rate: 0.065 },
  { upTo: 35155, rate: 0.083 },
  { upTo: 52778, rate: 0.098 },
  { upTo: 67668, rate: 0.107 },
  { upTo: Infinity, rate: 0.125 },
];

// The whole of your pensionable pay is charged at the rate for your tier.
export function nhsPensionRate(pensionablePay: number): number {
  return NHS_PENSION_TIERS.find((t) => pensionablePay <= t.upTo)!.rate;
}

export const getBand = (slug: string) => NHS_BANDS.find((b) => b.slug === slug);
