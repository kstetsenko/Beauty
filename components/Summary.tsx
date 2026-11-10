"use client";
import { useState } from "react";
import { directoryLinks } from "@/lib/clinics";
import { downtimeShort, usd, type Match } from "@/lib/match";
import type { City } from "@/lib/types";
import { LeadCaptureForm } from "./LeadCaptureForm";

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
  const links = directoryLinks(city, area);

  return (
    <section className="animate-in space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1.5">Your list</h1>
        <p className="text-sm text-muted">Topics to bring to a dermatologist — not recommendations.</p>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-3xl bg-white border border-line p-6 text-center">
          <p className="text-sm text-muted mb-4">You didn&apos;t save anything yet.</p>
          <button type="button" onClick={onBrowseAgain} className="btn-main">Look again</button>
        </div>
      ) : (
        <ul className="rounded-3xl bg-white border border-line divide-y divide-line">
          {saved.map(({ procedure: p }) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <span className="font-medium text-sm">{p.name}</span>
              <span className="text-xs text-muted text-right shrink-0">
                {usd(p.cost[city][0])}+<br />{downtimeShort(p.downtimeDays)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div>
        <h2 className="font-semibold mb-3">Find a dermatologist</h2>
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
          {links.slice(0, 2).map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="tile flex items-center justify-between">
              <span className="text-sm font-medium">{l.short}</span>
              <span aria-hidden="true" className="text-muted">↗</span>
            </a>
          ))}
          <a href={links[2].href} target="_blank" rel="noopener noreferrer" className="text-xs text-muted underline text-center mt-1">
            {links[2].short}
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
