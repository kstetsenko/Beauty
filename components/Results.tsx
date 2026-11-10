"use client";
import { CITY_LABELS } from "@/lib/clinics";
import { matchProcedures } from "@/lib/match";
import type { Location, QuizAnswers } from "@/lib/types";
import { ClinicList } from "./ClinicList";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { ProcedureCard } from "./ProcedureCard";

export function Results({
  location,
  answers,
  onEdit,
  onRestart,
}: {
  location: Location;
  answers: QuizAnswers;
  onEdit: () => void;
  onRestart: () => void;
}) {
  const matches = matchProcedures(answers);
  const ids = matches.map((m) => m.procedure.id);

  return (
    <div className="space-y-8">
      <section aria-labelledby="res-h">
        <h2 id="res-h" className="text-2xl font-semibold mb-1">Your Educational Guide</h2>
        <p className="text-sm text-neutral-600">
          {matches.length} procedure{matches.length === 1 ? "" : "s"} to learn about in {CITY_LABELS[location.city]}
          {location.area ? ` near ${location.area}` : ""}. These are topics to discuss with a doctor, not recommendations.
        </p>
        <div className="flex gap-3 mt-3 text-sm">
          <button type="button" onClick={onEdit} className="underline">Edit answers</button>
          <button type="button" onClick={onRestart} className="underline">Start over</button>
        </div>
      </section>

      {matches.length === 0 ? (
        <p className="bg-white rounded-2xl border border-neutral-200 p-5 text-sm">
          Nothing matches all of your filters. Try a higher budget tier or more flexible downtime — or{" "}
          <button type="button" onClick={onEdit} className="underline">edit your answers</button>.
        </p>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => (
            <ProcedureCard key={m.procedure.id} match={m} city={location.city} />
          ))}
          <p className="text-xs text-neutral-500">
            * Rough local estimates for one session, gathered from public pricing. Actual prices depend on the provider,
            product amount and area treated. Always ask for a written quote.
          </p>
        </div>
      )}

      <ClinicList city={location.city} area={location.area} procedureIds={ids} />

      {matches.length > 0 && <LeadCaptureForm city={location.city} procedureIds={ids} />}
    </div>
  );
}
