export type City = "nyc" | "miami";
export type Goal = "texture" | "glow" | "lines" | "volume" | "pigment" | "acne" | "hair" | "contour";
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
}

export interface Procedure {
  id: string;
  name: string;
  summary: string;
  goals: Goal[];
  tier: Budget;
  /** Typical per-session price range in USD, by city. Educational estimate only. */
  cost: Record<City, [number, number]>;
  sessions: string;
  downtimeDays: [number, number];
  downtimeLabel: string;
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
