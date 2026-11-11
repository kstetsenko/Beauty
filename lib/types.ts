export type City = "nyc" | "miami";
export type Goal = "texture" | "lines" | "lift" | "volume" | "pigment" | "redness" | "acne" | "glow" | "contour" | "hair" | "veins" | "sweat" | "tattoo";
/** How the treatment works (mechanism), used to group procedures. */
export type Approach = "topical" | "energy" | "laser" | "biostim" | "ha" | "toxin" | "fat" | "skin" | "threads" | "vein";
/** When results usually show: 1 right away, 2 within days to weeks, 3 gradually over months. */
export type Onset = 1 | 2 | 3;
export type AgeBand = "18-21" | "22-34" | "35-49" | "50-64" | "65+";
export type SkinTone = "light" | "medium" | "deep";
/** Health / skin conditions that change advice (beyond hard contraindications). */
export type Condition = "melasma" | "rosacea" | "cold-sores";
/** Treatments had in the last 6 months. */
export type Recent = "botox" | "filler" | "energy" | "laser" | "peel";
export type Budget = 1 | 2 | 3;
export type Downtime = "none" | "short" | "any";
export type Caution = "pregnancy" | "active-skin" | "isotretinoin" | "keloid" | "autoimmune" | "blood-thinners";

export interface Location {
  city: City;
  /** 5-digit ZIP or neighborhood text. Optional, never sent to the server. */
  area: string;
}

export interface QuizAnswers {
  goals: Goal[];
  budget: Budget;
  downtime: Downtime;
  /** Self-reported cautions. Kept in the browser only, used to flag cards. */
  cautions: Caution[];
  age?: AgeBand;
  tone?: SkinTone;
  conditions?: Condition[];
  recent?: Recent[];
}

export interface Procedure {
  id: string;
  /** Name people search for (brand or common name). */
  name: string;
  /** Plain-English "what it is" line. */
  what: string;
  approach: Approach;
  onset: Onset;
  /** Minimum age from FDA authorizations (e.g. fillers and microneedling devices: 22+). */
  minAge?: number;
  summary: string;
  goals: Goal[];
  /** Budget tier, derived from the NYC low price. */
  tier: Budget;
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
  /** Procedure ids the clinic lists as offered. */
  offers: string[];
  website: string;
  /** Link to the clinic's public Google Maps / Business profile. */
  googleUrl: string;
  /** Public Google rating as copied on `ratingCheckedAt`. Null until verified. */
  rating: number | null;
  reviewCount: number | null;
  ratingCheckedAt: string | null;
  /** Board certification you verified (e.g. "ABD dermatologist on staff"). */
  credential: string;
}
