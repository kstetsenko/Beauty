export type City = "nyc" | "miami";
export type Goal = "texture" | "lines" | "lift" | "volume" | "pigment" | "redness" | "acne" | "glow" | "breakouts";
/** How the treatment works (mechanism), used to group procedures. */
export type Approach = "energy" | "laser" | "biostim" | "ha" | "toxin" | "skin" | "threads";
/** When results usually show: 1 right away, 2 within days to weeks, 3 gradually over months. */
export type Onset = 1 | 2 | 3;
export type AgeBand = "18-21" | "22-34" | "35-49" | "50-64" | "65+";
export type SkinTone = "light" | "medium" | "deep";
/** Health / skin conditions that change advice (beyond hard contraindications). */
export type Condition = "melasma" | "rosacea" | "cold-sores";
/** Treatments had in the last 6 months. */
export type Recent = "botox" | "filler" | "energy" | "laser" | "peel";
/** Price tier from the NYC starting price (used only to sort by price). */
export type Tier = 1 | 2 | 3;
export type Downtime = "none" | "short" | "any";
export type Caution = "pregnancy" | "active-skin" | "isotretinoin" | "keloid" | "autoimmune" | "blood-thinners";

export interface Location {
  city: City;
  /** 5-digit ZIP or neighborhood text. Optional, never sent to the server. */
  area: string;
}

export interface QuizAnswers {
  goals: Goal[];
  downtime: Downtime;
  /** Self-reported cautions. Kept in the browser only, used to flag cards. */
  cautions: Caution[];
  age?: AgeBand;
  tone?: SkinTone;
  conditions?: Condition[];
  recent?: Recent[];
  /** Treatment ids had in the last 6 months. */
  had?: string[];
}

export interface Procedure {
  id: string;
  /** Name people search for (brand or common name). */
  name: string;
  /** Plain-English "what it is" line. */
  what: string;
  /** Brand names and other names clinics use (searchable). Only real, verifiable product names. */
  aka?: string[];
  approach: Approach;
  onset: Onset;
  /** Works mainly by stimulating the body's own collagen (per the cited studies / mechanism). */
  collagen?: boolean;
  /** Minimum age from FDA authorizations (e.g. fillers and microneedling devices: 22+). */
  minAge?: number;
  summary: string;
  goals: Goal[];
  /** Price tier, derived from the NYC low price. */
  tier: Tier;
  /** Typical price range per visit (or per syringe/area) in USD. Educational estimate only. */
  cost: Record<City, [number, number]>;
  priceUnit: string;
  sessions: string;
  lasts: string;
  downtimeDays: [number, number];
  /** 1 minimal … 5 intense (with numbing as usually done). */
  pain: 1 | 2 | 3 | 4 | 5;
  /** 1 subtle, 2 noticeable, 3 dramatic — typical, not guaranteed. */
  results: 1 | 2 | 3;
  performedBy: string;
  contraindications: Caution[];
  notes: string;
}

export interface Clinic {
  id: string;
  name: string;
  city: City;
  neighborhood: string;
  address?: string;
  /** Treatment ids the clinic's own website lists. */
  offers: string[];
  website: string;
  /** Link to the clinic on Google Maps (reviews and directions). */
  googleUrl: string;
  /** Public Google rating as copied on `ratingCheckedAt`. Null unless verified (we link to reviews instead). */
  rating: number | null;
  reviewCount: number | null;
  ratingCheckedAt: string | null;
  /** What we verified about credentials, and where. */
  credential: string;
  credentialSource: string;
  /** Date (YYYY-MM-DD) the listing criteria were last checked. */
  checkedAt: string;
  /** Paying partner (flat listing fee). Shown with a visible "Partner" label. */
  partner: boolean;
  /** Code people mention when booking, so the clinic can count visits from the guide. Same for everyone. */
  code: string;
  bookingUrl?: string;
  /** Public phone number as the clinic lists it. */
  phone?: string;
  listedSince?: string;
}
