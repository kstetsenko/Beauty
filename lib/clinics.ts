import type { City, Clinic, Procedure } from "./types";

/**
 * Clinic listings. This list ships EMPTY on purpose. Add a clinic only after you
 * have checked it yourself (board certification, state license) and, for partners,
 * signed a flat-fee listing agreement (see docs/TRACKING.md). Never invent ratings:
 * copy them from the public Google profile and record the date you checked.
 *
 * Example entry (replace every value; do not publish as-is):
 * {
 *   id: "example-soho",                // short, lowercase; used in reports and links
 *   name: "Example Dermatology",
 *   city: "nyc",
 *   neighborhood: "SoHo",              // use a name from NEIGHBORHOODS when possible
 *   offers: ["botox", "morpheus8"],    // treatment ids from lib/procedures.ts
 *   website: "https://example.com",
 *   googleUrl: "https://maps.google.com/?cid=...",
 *   rating: 4.8, reviewCount: 312, ratingCheckedAt: "2026-11-01",   // or null, null, null
 *   credential: "ABD board-certified dermatologists on staff",
 *   partner: true,
 *   bookingUrl: "https://example.com/book",
 *   phone: "+1 212 555 0100",
 *   leadEmail: "frontdesk@example.com",
 *   listedSince: "2026-12-01",
 * },
 */
export const CLINICS: Clinic[] = [];

/** Shown next to partner clinics. Keep it true: partners pay a flat listing fee, never per patient. */
export const PARTNER_NOTE =
  "Partner clinics pay us a flat monthly listing fee. They don't pay per patient, and they don't change which treatments we show or how we rank them. Always check a provider's credentials yourself.";

/** Stored with every consultation request, word for word. */
export const LEAD_CONSENT =
  "I agree that Aesthetic Guide shares my name, contact details and the treatment I picked with this clinic so they can contact me about a consultation.";

/** For "connect me" requests not addressed to one clinic. */
export const CONNECT_CONSENT =
  "I agree that Aesthetic Guide shares my name, contact details, the treatment and the area I picked with one partner clinic near me so they can contact me about a consultation.";
/** What we promise people who ask to be connected. The owner must keep this promise. */
export const CONNECT_PROMISE = "We'll reply within 2 business days with a partner clinic near you, or let you know if we don't have one there yet.";

/** Partner clinics in a city offering any of the treatments; the chosen neighborhood first, then A–Z (never by fee). */
export function partnersFor(city: City, treatmentIds: string[], area = "") {
  return CLINICS.filter((c) => c.partner && c.city === city && c.offers.some((o) => treatmentIds.includes(o))).sort(
    (a, b) => Number(b.neighborhood === area) - Number(a.neighborhood === area) || a.name.localeCompare(b.name),
  );
}

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
      { short: "Board-certified plastic surgeons (ASPS)", href: "https://find.plasticsurgery.org/" },
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
