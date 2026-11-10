import type { City, Clinic } from "./types";

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

export const CITY_LABELS: Record<City, string> = { nyc: "New York City", miami: "Miami" };

/** Public directories that let users find and verify providers themselves. */
export function directoryLinks(city: City, area: string) {
  const near = area.trim() || (city === "nyc" ? "New York, NY" : "Miami, FL");
  const q = encodeURIComponent(`board certified dermatologist near ${near}`);
  return [
    { short: "Nearby on Google Maps", href: `https://www.google.com/maps/search/?api=1&query=${q}` },
    { short: "Board-certified directory (AAD)", href: "https://find-a-derm.aad.org/" },
    city === "nyc"
      ? { short: "Check a provider's NY license", href: "https://www.op.nysed.gov/verification-search" }
      : { short: "Check a provider's Florida license", href: "https://mqa-internet.doh.state.fl.us/MQASearchServices/HealthCareProviders" },
  ];
}
