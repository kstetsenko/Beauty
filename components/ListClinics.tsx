"use client";
import { CITY_LABELS, clinicsForList } from "@/lib/clinics";
import { PROCEDURES } from "@/lib/procedures";
import type { City } from "@/lib/types";
import { TrackedLink } from "./TrackedLink";

const short = (id: string) => PROCEDURES.find((p) => p.id === id)?.name.split(" / ")[0].split(" (")[0] ?? id;

/** Clinics that offer the most treatments on the person's list (from each clinic's own website). */
export function ListClinics({ city, ids }: { city: City; ids: string[] }) {
  const rows = clinicsForList(city, ids);
  const none = ids.filter((id) => !rows.some((r) => r.matches.includes(id)));
  if (!ids.length) return null;
  return (
    <div>
      <h2 className="font-semibold mb-1">Clinics that offer your list</h2>
      <p className="text-xs text-muted mb-3">Checked clinics in {CITY_LABELS[city]}, most matches first. Based on each clinic&apos;s own website.</p>
      {rows.length > 0 ? (
        <ul className="space-y-2" aria-label="Clinics that offer your list">
          {rows.map(({ clinic: c, matches }) => (
            <li key={c.id} className="rounded-2xl bg-white border border-line px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <TrackedLink href={c.website} tag ev={{ kind: "site", clinic: c.id, treatment: matches[0], city }} className="font-medium underline min-w-0">{c.name}</TrackedLink>
                <span className="shrink-0 text-xs font-medium">{matches.length} of {ids.length}</span>
              </div>
              <p className="text-xs text-muted">{c.neighborhood}{c.partner ? " · Partner" : ""}</p>
              <p className="text-xs mt-1">Offers: {matches.map(short).join(", ")}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">We haven&apos;t checked a clinic for these treatments in {CITY_LABELS[city]} yet.</p>
      )}
      {none.length > 0 && rows.length > 0 && (
        <p className="text-[11px] text-muted mt-2">Not yet at a checked clinic: {none.map(short).join(", ")}. Use &ldquo;Find a clinic&rdquo; on that treatment to search Google Maps.</p>
      )}
    </div>
  );
}
