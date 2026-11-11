import { CLINICS, NEIGHBORHOODS } from "./clinics";
import { PROCEDURES } from "./procedures";

/** Server-side checks so only known values are ever stored (no free text from the URL or page). */
export const KINDS = ["maps", "site", "call", "book", "directory", "license", "lead"] as const;
export const isKind = (v: unknown): v is (typeof KINDS)[number] => typeof v === "string" && (KINDS as readonly string[]).includes(v);
export const isCity = (v: unknown): v is "nyc" | "miami" => v === "nyc" || v === "miami";
export const clinicById = (v: unknown) => (typeof v === "string" ? CLINICS.find((c) => c.id === v) : undefined);
export const treatmentId = (v: unknown) => (typeof v === "string" && PROCEDURES.some((p) => p.id === v) ? v : null);
/** Neighborhood only if it is one of ours; a typed ZIP or address is never stored. */
export const areaOf = (city: unknown, v: unknown) =>
  isCity(city) && typeof v === "string" && NEIGHBORHOODS[city].includes(v) ? v : null;
export const token = (v: unknown, len: number) => (typeof v === "string" && /^[a-z0-9]+$/.test(v) && v.length <= len ? v : null);
