// Straight-line ("as the crow flies") distance between two points, using the haversine formula.
export const EARTH_RADIUS_KM = 6371.0088;
export const KM_PER_MILE = 1.609344;
export const KM_PER_NAUTICAL_MILE = 1.852;

export interface Point {
  lat: number;
  lon: number;
}

export function haversineKm(a: Point, b: Point): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function distance(a: Point, b: Point): { km: number; miles: number; nautical: number } {
  const km = haversineKm(a, b);
  return { km, miles: km / KM_PER_MILE, nautical: km / KM_PER_NAUTICAL_MILE };
}

// Compass bearing from a to b, in degrees clockwise from north.
export function bearing(a: Point, b: Point): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const y = Math.sin(rad(b.lon - a.lon)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lon - a.lon));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function compass(deg: number): string {
  return ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"][Math.round(deg / 45) % 8];
}

// City and town centre coordinates (WGS84).
export const PLACES: { name: string; lat: number; lon: number }[] = [
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Birmingham", lat: 52.4862, lon: -1.8904 },
  { name: "Manchester", lat: 53.4808, lon: -2.2426 },
  { name: "Leeds", lat: 53.8008, lon: -1.5491 },
  { name: "Glasgow", lat: 55.8642, lon: -4.2518 },
  { name: "Edinburgh", lat: 55.9533, lon: -3.1883 },
  { name: "Liverpool", lat: 53.4084, lon: -2.9916 },
  { name: "Bristol", lat: 51.4545, lon: -2.5879 },
  { name: "Sheffield", lat: 53.3811, lon: -1.4701 },
  { name: "Newcastle upon Tyne", lat: 54.9783, lon: -1.6178 },
  { name: "Cardiff", lat: 51.4816, lon: -3.1791 },
  { name: "Belfast", lat: 54.5973, lon: -5.9301 },
  { name: "Nottingham", lat: 52.9548, lon: -1.1581 },
  { name: "Leicester", lat: 52.6369, lon: -1.1398 },
  { name: "Southampton", lat: 50.9097, lon: -1.4044 },
  { name: "Portsmouth", lat: 50.8198, lon: -1.088 },
  { name: "Brighton", lat: 50.8225, lon: -0.1372 },
  { name: "Plymouth", lat: 50.3755, lon: -4.1427 },
  { name: "Aberdeen", lat: 57.1497, lon: -2.0943 },
  { name: "Dundee", lat: 56.462, lon: -2.9707 },
  { name: "Inverness", lat: 57.4778, lon: -4.2247 },
  { name: "Swansea", lat: 51.6214, lon: -3.9436 },
  { name: "Oxford", lat: 51.752, lon: -1.2577 },
  { name: "Cambridge", lat: 52.2053, lon: 0.1218 },
  { name: "Norwich", lat: 52.6309, lon: 1.2974 },
  { name: "York", lat: 53.96, lon: -1.0873 },
  { name: "Coventry", lat: 52.4068, lon: -1.5197 },
  { name: "Hull", lat: 53.7457, lon: -0.3367 },
  { name: "Stoke-on-Trent", lat: 53.0027, lon: -2.1794 },
  { name: "Derby", lat: 52.9225, lon: -1.4746 },
  { name: "Exeter", lat: 50.7184, lon: -3.5339 },
  { name: "Bath", lat: 51.3811, lon: -2.359 },
  { name: "Reading", lat: 51.4543, lon: -0.9781 },
  { name: "Milton Keynes", lat: 52.0406, lon: -0.7594 },
  { name: "Carlisle", lat: 54.8925, lon: -2.9329 },
  { name: "Dover", lat: 51.1279, lon: 1.3134 },
  { name: "Land's End", lat: 50.0657, lon: -5.7132 },
  { name: "John o' Groats", lat: 58.6373, lon: -3.0689 },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");

export function findPlace(text: string): Point | null {
  const t = norm(text);
  if (!t) return null;
  const p = PLACES.find((x) => norm(x.name) === t) || (t === "newcastle" ? PLACES.find((x) => x.name.startsWith("Newcastle")) : undefined);
  return p ? { lat: p.lat, lon: p.lon } : null;
}

// "51.5074, -0.1278" style coordinates.
export function parseCoordinates(text: string): Point | null {
  const m = text.trim().match(/^(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lon = parseFloat(m[2]);
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

// Loose UK postcode check: "SW1A 1AA", "m1 1ae", "EH11AA".
export function looksLikePostcode(text: string): boolean {
  return /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/.test(text.trim());
}
