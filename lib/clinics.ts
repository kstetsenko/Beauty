import type { City, Clinic, Procedure } from "./types";

/**
 * Vetted clinic listings. This list ships EMPTY on purpose: add only clinics
 * you have personally checked (board certification, state license, current
 * Google rating). Never invent ratings — copy them from the public Google
 * profile and record the date you checked.
 *
 * Example entry (replace every value; do not publish as-is):
 * {
 *   id: "example-soho",
 *   name: "Example Dermatology",
 *   city: "nyc",
 *   neighborhood: "SoHo",
 *   offers: ["neurotoxin", "ha-filler", "fractional-laser"],
 *   website: "https://example.com",
 *   googleUrl: "https://maps.google.com/?cid=...",
 *   rating: 4.8,
 *   reviewCount: 312,
 *   ratingCheckedAt: "2026-11-01",
 *   credential: "ABD board-certified dermatologists on staff",
 * },
 */
export const CLINICS: Clinic[] = [];

/** Common neighborhoods for one-tap provider searches. */
export const NEIGHBORHOODS: Record<City, string[]> = {
  nyc: ["Upper East Side", "Upper West Side", "Midtown", "Flatiron", "SoHo", "Tribeca", "Financial District", "Williamsburg", "Brooklyn Heights"],
  miami: ["Brickell", "Downtown Miami", "Miami Beach", "Coral Gables", "Design District", "Aventura", "Doral", "Key Biscayne"],
};

export const CITY_LABELS: Record<City, string> = { nyc: "New York City", miami: "Miami" };

/** Where to look for a qualified provider. Users verify credentials themselves. */
export function directoryLinks(city: City, area: string, procedureNames: string[] = []) {
  // No neighborhood chosen: "near me" lets Google Maps use the person's own location.
  const where = area.trim() ? `near ${area.trim()}, ${city === "nyc" ? "New York, NY" : "Miami, FL"}` : "near me";
  const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  return {
    byProcedure: procedureNames.map((n) => ({ short: n, href: maps(`${n.split(" / ")[0]} ${where}`) })),
    directories: [
      { short: "Board-certified dermatologists (AAD)", href: "https://find-a-derm.aad.org/" },
      { short: "Board-certified plastic surgeons (ASPS)", href: "https://www.plasticsurgery.org/find-a-surgeon" },
    ],
    license:
      city === "nyc"
        ? { short: "Check a provider's NY license", href: "https://www.op.nysed.gov/verification-search" }
        : { short: "Check a provider's Florida license", href: "https://mqa-internet.doh.state.fl.us/MQASearchServices/HealthCareProviders" },
  };
}

/** What to search for on the map: prescription creams are prescribed by a dermatologist, not a "provider of" the cream. */
export function mapsTerm(p: Procedure) {
  return p.approach === "topical" ? "dermatologist" : p.name.split(" / ")[0];
}
