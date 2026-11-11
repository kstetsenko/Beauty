"use client";
import { useState } from "react";
import { CITY_LABELS, CLINICS, directoryLinks } from "@/lib/clinics";
import { downtimeShort, usd, type Match } from "@/lib/match";
import type { Budget, City } from "@/lib/types";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { Dots } from "./ProcedureFacts";

const TIER = ["", "$", "$$", "$$$"];

export function Summary({
  city,
  budget,
  saved,
  onBrowseAgain,
  onRestart,
}: {
  city: City;
  budget?: Budget;
  saved: Match[];
  onBrowseAgain: () => void;
  onRestart: () => void;
}) {
  const [area, setArea] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const where = area.trim() || CITY_LABELS[city];
  const links = directoryLinks(city, area, saved.map((m) => m.procedure.name));
  const ids = saved.map((m) => m.procedure.id);
  const clinics = CLINICS.filter((c) => c.city === city && c.offers.some((o) => ids.includes(o)));

  return (
    <section className="animate-in space-y-7">
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
        <>
          <label className="block">
            <span className="block text-sm font-medium mb-2">Where should we look for providers?</span>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value.slice(0, 60))}
              placeholder={city === "nyc" ? "ZIP or neighborhood, e.g. SoHo" : "ZIP or neighborhood, e.g. Brickell"}
              autoComplete="off"
              className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm focus:outline-none focus:border-ink"
            />
          </label>

          <ul className="space-y-3">
            {saved.map(({ procedure: p }, i) => (
              <li key={p.id} className="rounded-3xl bg-white border border-line p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <a href={`/procedures/${p.id}?city=${city}`} className="font-semibold">{p.name}</a>
                  <span className="text-sm shrink-0">from {usd(p.cost[city][0])}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-muted">
                  <span className="flex items-center gap-1.5">Pain <Dots value={p.pain} max={5} label="Pain" /></span>
                  <span>Recovery: {downtimeShort(p.downtimeDays).toLowerCase()}</span>
                  {budget && p.tier <= budget && <span>✓ Fits your {TIER[budget]} budget</span>}
                </div>
                <a href={links.byProcedure[i].href} target="_blank" rel="noopener noreferrer" className="btn-main block text-center mt-4 text-sm">
                  Find {p.name} providers near {where} ↗
                </a>
                <p className="text-[11px] text-muted text-center mt-1.5">Opens Google Maps with public ratings and reviews</p>
                <a href={`/procedures/${p.id}?city=${city}`} className="block text-center text-sm underline mt-2">
                  Recovery, risks, research & questions to ask
                </a>
              </li>
            ))}
          </ul>

          {clinics.length > 0 && (
            <div>
              <h2 className="font-semibold mb-3">Clinics we&apos;ve checked</h2>
              <ul className="space-y-2.5">
                {clinics.map((c) => (
                  <li key={c.id} className="rounded-3xl bg-white border border-line p-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted">{c.neighborhood} · {c.credential}</p>
                    {c.rating !== null && c.ratingCheckedAt && (
                      <p className="text-sm mt-1">
                        {c.rating.toFixed(1)} ★{c.reviewCount !== null && ` (${c.reviewCount.toLocaleString("en-US")} Google reviews)`}
                        <span className="text-[11px] text-muted"> · checked {c.ratingCheckedAt}</span>
                      </p>
                    )}
                    <div className="flex gap-4 text-sm mt-2">
                      <a href={c.website} target="_blank" rel="noopener noreferrer nofollow" className="underline">See prices & availability ↗</a>
                      <a href={c.googleUrl} target="_blank" rel="noopener noreferrer nofollow" className="underline">Google reviews ↗</a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {saved.length >= 2 ? (
              <a href={`/compare?ids=${ids.slice(0, 3).join(",")}&city=${city}`} className="btn-soft text-center text-sm">Compare side by side</a>
            ) : (
              <a href={`/compare?ids=${ids[0]}&city=${city}`} className="btn-soft text-center text-sm">Compare with another</a>
            )}
            <button type="button" onClick={() => setShowEmail(true)} className="btn-soft text-sm">Email me this guide</button>
          </div>
          {showEmail && <LeadCaptureForm city={city} procedureIds={ids} />}
        </>
      )}

      <div>
        <h2 className="font-semibold mb-1">Check credentials</h2>
        <p className="text-xs text-muted mb-3">Look for a board-certified dermatologist or plastic surgeon, or a med spa supervised by one.</p>
        <div className="grid gap-2.5">
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
        <p className="text-[11px] text-muted mt-3">We don&apos;t receive payment from clinics or directories linked here.</p>
      </div>

      <button type="button" onClick={onRestart} className="block mx-auto text-sm text-muted underline">Start over</button>
    </section>
  );
}
