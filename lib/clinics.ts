import type { City, Clinic, Procedure } from "./types";

const maps = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/**
 * Clinics listed in the clinic finder. Listing criteria (published on /sources):
 * 1. Board-certified dermatologists or plastic surgeons on staff, as stated on the practice's own site
 *    or a university directory (credentialSource).
 * 2. The practice's own site lists the treatment (offers).
 * 3. An address in one of our neighborhoods.
 * Ratings are never copied: each card links to Google reviews instead. Order: chosen neighborhood first, then A–Z.
 * Partners (partner: true) pay a flat monthly fee and are labeled; the free list stays.
 * Re-check every listing at least every 6 months (checkedAt).
 */
export const CLINICS: Clinic[] = [
  {
    id: "spring-street-derm", name: "Spring Street Dermatology", city: "nyc", neighborhood: "SoHo",
    address: "75 Spring Street, Floor 2, New York, NY 10012",
    offers: ["botox", "cheek-filler", "smile-filler", "peel", "ipl", "microneedling", "sofwave", "pdt", "ktp"],
    website: "https://springstderm.com/", googleUrl: maps("Spring Street Dermatology 75 Spring Street New York NY"),
    rating: null, reviewCount: null, ratingCheckedAt: null,
    credential: "Board-certified dermatologists", credentialSource: "https://springstderm.com/about/",
    checkedAt: "2026-11-12", partner: false, code: "AG-SPRING",
  },
  {
    id: "tribeca-park-derm", name: "Tribeca Park Dermatology", city: "nyc", neighborhood: "Tribeca",
    offers: ["botox", "cheek-filler", "smile-filler", "clear-brilliant", "laser-toning", "erbium"],
    website: "https://triparkderm.com/", googleUrl: maps("Tribeca Park Dermatology New York NY"),
    rating: null, reviewCount: null, ratingCheckedAt: null,
    credential: "Dermatologists who are Fellows of the AAD (FAAD)", credentialSource: "https://triparkderm.com/",
    checkedAt: "2026-11-12", partner: false, code: "AG-TRIBECA",
  },
  {
    id: "laser-skin-surgery-ny", name: "Laser & Skin Surgery Center of New York", city: "nyc", neighborhood: "Murray Hill",
    address: "317 East 34th Street, New York, NY 10016",
    offers: ["botox", "cheek-filler", "smile-filler", "microneedling", "ktp"],
    website: "https://www.laserskinsurgery.com/", googleUrl: maps("Laser & Skin Surgery Center of New York 317 East 34th Street"),
    rating: null, reviewCount: null, ratingCheckedAt: null,
    credential: "Treatments performed by board-certified dermatologists", credentialSource: "https://www.laserskinsurgery.com/contact/new-york-city/",
    checkedAt: "2026-11-12", partner: false, code: "AG-LSSC", phone: "(212) 941-5055",
  },
  {
    id: "miami-skin-institute", name: "Miami Skin Institute", city: "miami", neighborhood: "Coral Gables",
    address: "135 San Lorenzo Ave, PH 870, Coral Gables, FL 33146",
    offers: ["botox", "cheek-filler", "smile-filler", "sculptra", "ultherapy", "fraxel", "pdl"],
    website: "https://www.miamiskininstitute.com/", googleUrl: maps("Miami Skin Institute 135 San Lorenzo Ave Coral Gables FL"),
    rating: null, reviewCount: null, ratingCheckedAt: null,
    credential: "Board-certified dermatologist (founder and medical director)", credentialSource: "https://www.hauteliving.com/hautemd/doctor/dr-s-manjula-jegasothy",
    checkedAt: "2026-11-12", partner: false, code: "AG-MSI",
  },
  {
    id: "uhealth-miami-beach", name: "UHealth Dermatology — Miami Beach", city: "miami", neighborhood: "Miami Beach",
    address: "1045 5th Street, Suite 305, Miami Beach, FL 33139",
    offers: ["botox", "cheek-filler", "smile-filler", "peel", "microneedling", "threads"],
    website: "https://umiamihealth.org/en/locations/uhealth-miami-beach", googleUrl: maps("UHealth Dermatology 1045 5th Street Miami Beach FL"),
    rating: null, reviewCount: null, ratingCheckedAt: null,
    credential: "Board-certified dermatologists (University of Miami)", credentialSource: "https://umiamihealth.org/en/treatments-and-services/dermatology/cosmetic-dermatology",
    checkedAt: "2026-11-12", partner: false, code: "AG-UMBEACH", phone: "305-243-6704",
  },
];

/** Shown next to partner clinics. Keep it true: partners pay a flat listing fee, never per patient. */
export const PARTNER_NOTE =
  "Partner clinics pay us a flat monthly listing fee. They don't pay per patient, and they don't change which treatments we show or how we rank them. Always check a provider's credentials yourself.";

/** Shown under the free list. */
export const LISTING_NOTE =
  "Listed for free because they meet our criteria: board-certified doctors on staff and the treatment on their own website. Not an endorsement — check reviews, credentials and prices yourself.";

const byArea = (area: string) => (a: Clinic, b: Clinic) =>
  Number(b.neighborhood === area) - Number(a.neighborhood === area) || a.name.localeCompare(b.name);

/** Clinics in a city offering the treatment: partners and free listings, chosen neighborhood first, then A–Z (never by fee). */
export function clinicsFor(city: City, treatment: string, area = "") {
  const all = CLINICS.filter((c) => c.city === city && c.offers.includes(treatment));
  return { partners: all.filter((c) => c.partner).sort(byArea(area)), listed: all.filter((c) => !c.partner).sort(byArea(area)) };
}

/**
 * ZIP code → neighborhood, matched on the person's device only (a typed ZIP is never sent or stored).
 * Approximate: ZIPs that span areas are assigned to the main one.
 */
export const ZIPS: Record<City, Record<string, string>> = {
  nyc: {
    "10021": "Upper East Side", "10028": "Upper East Side", "10065": "Upper East Side", "10075": "Upper East Side", "10128": "Upper East Side", "10162": "Upper East Side",
    "10023": "Upper West Side", "10024": "Upper West Side", "10025": "Upper West Side", "10069": "Upper West Side",
    "10017": "Midtown", "10018": "Midtown", "10019": "Midtown", "10020": "Midtown", "10022": "Midtown", "10036": "Midtown",
    "10016": "Murray Hill", "10010": "Flatiron", "10012": "SoHo", "10013": "Tribeca", "10007": "Tribeca",
    "10004": "Financial District", "10005": "Financial District", "10006": "Financial District", "10038": "Financial District", "10280": "Financial District",
    "11211": "Williamsburg", "11249": "Williamsburg", "11201": "Brooklyn Heights",
  },
  miami: {
    "33129": "Brickell", "33130": "Brickell", "33131": "Brickell", "33128": "Downtown Miami", "33132": "Downtown Miami",
    "33139": "Miami Beach", "33140": "Miami Beach", "33141": "Miami Beach", "33134": "Coral Gables", "33146": "Coral Gables",
    "33137": "Design District", "33180": "Aventura", "33122": "Doral", "33166": "Doral", "33172": "Doral", "33178": "Doral", "33149": "Key Biscayne",
  },
};

/** Common neighborhoods for one-tap provider searches. */
export const NEIGHBORHOODS: Record<City, string[]> = {
  nyc: ["Upper East Side", "Upper West Side", "Midtown", "Murray Hill", "Flatiron", "SoHo", "Tribeca", "Financial District", "Williamsburg", "Brooklyn Heights"],
  miami: ["Brickell", "Downtown Miami", "Miami Beach", "Coral Gables", "Design District", "Aventura", "Doral", "Key Biscayne"],
};

export const CITY_LABELS: Record<City, string> = { nyc: "New York City", miami: "Miami" };

/** Where to look for a qualified provider. Users verify credentials themselves. */
export function directoryLinks(city: City, area: string, procedureNames: string[] = []) {
  // No neighborhood chosen: "near me" lets Google Maps use the person's own location.
  const where = area.trim() ? `near ${area.trim()}, ${city === "nyc" ? "New York, NY" : "Miami, FL"}` : "near me";
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
  return p.name.split(" / ")[0].replace(/ \(.*\)$/, "");
}
