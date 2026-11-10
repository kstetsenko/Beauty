export type City = "nyc" | "miami";
export type Goal = "lift" | "lines" | "texture" | "glow" | "volume" | "pigment" | "acne" | "contour" | "body" | "hair";
export type Approach = "collagen" | "injectable" | "surface" | "body";
export type Prefer = "natural" | "instant" | "any";
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
  /** Natural (own collagen) vs instant (product) results. Ranks, never filters. */
  prefer?: Prefer;
}

export interface Procedure {
  id: string;
  /** Name people search for (brand or common name). */
  name: string;
  /** Plain-English "what it is" line. */
  what: string;
  approach: Approach;
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
