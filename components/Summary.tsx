"use client";
import { useState } from "react";
import { directoryLinks } from "@/lib/clinics";
import { downtimeShort, usd, type Match } from "@/lib/match";
import type { City } from "@/lib/types";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { Dots } from "./ProcedureFacts";

export function Summary({
  city,
  saved,
  onBrowseAgain,
  onRestart,
}: {
  city: City;
  saved: Match[];
  onBrowseAgain: () => void;
  onRestart: () => void;
}) {
  const [area, setArea] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const links = directoryLinks(city, area, saved.map((m) => m.procedure.name));

  return (
    <section className="animate-in space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1.5">Your list</h1>
        <p className="text-sm text-muted">Ideas to discuss at a consultation — not recommendations.</p>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-3xl bg-white border border-line p-6 text-center">
          <p className="text-sm text-muted mb-4">You didn&apos;t save anything yet.</p>
          <button type="button" onClick={onBrowseAgain} className="btn-main">Look again</button>
        </div>
      ) : (
        <ul className="rounded-3xl bg-white border border-line divide-y divide-line">
          {saved.map(({ procedure: p }) => (
            <li key={p.id} className="px-5 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <a href={`/procedures/${p.id}`} className="font-medium">{p.name}</a>
                <span className="text-sm shrink-0">from {usd(p.cost[city][0])}</span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-[11px] text-muted">
                <span className="flex items-center gap-1.5">Pain <Dots value={p.pain} max={5} label="Pain" /></span>
                <span>{downtimeShort(p.downtimeDays)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div>
        <h2 className="font-semibold mb-1">Find a provider</h2>
        <p className="text-xs text-muted mb-3">
          Look for a board-certified dermatologist or plastic surgeon, or a med spa run under one.
        </p>
        <label className="block mb-3">
          <span className="sr-only">ZIP code or neighborhood (optional)</span>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value.slice(0, 60))}
            placeholder="ZIP or neighborhood (optional)"
            autoComplete="off"
            className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm focus:outline-none focus:border-ink"
          />
        </label>
        <div className="grid gap-2.5">
          {links.byProcedure.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="tile flex items-center justify-between py-3.5">
              <span className="text-sm"><span className="font-medium">{l.short}</span> <span className="text-muted">near you</span></span>
              <span aria-hidden="true" className="text-muted">↗</span>
            </a>
          ))}
          {links.directories.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="tile flex items-center justify-between py-3.5">
              <span className="text-sm font-medium">{l.short}</span>
              <span aria-hidden="true" className="text-muted">↗</span>
            </a>
          ))}
          <a href={links.license.href} target="_blank" rel="noopener noreferrer" className="text-xs text-muted underline text-center mt-1">
            {links.license.short}
          </a>
        </div>
      </div>

      {saved.length > 0 &&
        (showEmail ? (
          <LeadCaptureForm city={city} procedureIds={saved.map((m) => m.procedure.id)} />
        ) : (
          <button type="button" onClick={() => setShowEmail(true)} className="btn-soft">Email me my list</button>
        ))}

      <button type="button" onClick={onRestart} className="block mx-auto text-sm text-muted underline">Start over</button>
    </section>
  );
}
