"use client";
import { useState } from "react";
import { directoryLinks } from "@/lib/clinics";
import { downtimeShort, priceFrom, type Hidden, type Match } from "@/lib/match";
import { GOAL_LABELS } from "@/lib/procedures";
import type { City, Goal } from "@/lib/types";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { Disclosure } from "./Disclosure";
import { HiddenReasons } from "./HiddenReasons";
import { Dots } from "./ProcedureFacts";
import { TrackedLink } from "./TrackedLink";


export function Summary({
  city,
  goals = [],
  hidden = [],
  saved,
  onBrowseAgain,
  onRestart,
}: {
  city: City;
  goals?: Goal[];
  hidden?: Hidden[];
  saved: Match[];
  onBrowseAgain: () => void;
  onRestart: () => void;
}) {
  const [showEmail, setShowEmail] = useState(false);
  const links = directoryLinks(city, "");
  const ids = saved.map((m) => m.procedure.id);
  // Compare only like with like: saved treatments that share one of the user's goals.
  const compareGroups = goals
    .map((g) => ({ g, list: saved.filter((m) => m.procedure.goals.includes(g)).map((m) => m.procedure.id) }))
    .filter((x) => x.list.length >= 2);

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
          <ul className="space-y-3">
            {saved.map(({ procedure: p }) => (
              <li key={p.id} className="rounded-3xl bg-white border border-line p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <a href={`/procedures/${p.id}?city=${city}`} className="font-semibold">{p.name}</a>
                  <span className="text-sm shrink-0">{priceFrom(p, city)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-muted">
                  <span className="flex items-center gap-1.5">Pain <Dots value={p.pain} max={5} label="Pain" /></span>
                  <span>Recovery: {downtimeShort(p.downtimeDays).toLowerCase()}</span>
                </div>
                <a href={`/clinics?t=${p.id}&city=${city}`} className="btn-main block text-center mt-4 text-sm">
                  Find a clinic for {p.name.split(" / ")[0]}
                </a>
                <a href={`/procedures/${p.id}?city=${city}`} className="block text-center text-sm underline mt-2">
                  Recovery, risks and research
                </a>
              </li>
            ))}
          </ul>

          {compareGroups.length > 0 && (
            <div className="grid gap-2">
              {compareGroups.map(({ g, list }) => (
                <a key={g} href={`/compare?goal=${g}&ids=${list.slice(0, 3).join(",")}&city=${city}`} className="btn-soft text-center text-sm">
                  Compare your {GOAL_LABELS[g].toLowerCase()} options
                </a>
              ))}
            </div>
          )}
          <button type="button" onClick={() => setShowEmail(true)} className="btn-soft text-sm">Email me this guide</button>
          {showEmail && <LeadCaptureForm city={city} procedureIds={ids} />}
        </>
      )}

      {goals.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">See every option for your goals</h2>
          <div className="flex flex-wrap gap-2">
            {goals.map((g) => (
              <a key={g} href={`/goals/${g}?city=${city}`} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm hover:border-ink">
                {GOAL_LABELS[g]}
              </a>
            ))}
          </div>
        </div>
      )}

      {hidden.length > 0 && (
        <Disclosure title={`Hidden for your safety (${hidden.length})`} hint="Treatments that usually aren't advised with your answers">
          <ul className="space-y-2.5">
            {hidden.map(({ procedure: p, reasons, sources }) => (
              <li key={p.id} className="text-sm">
                <a href={`/procedures/${p.id}?city=${city}`} className="font-medium underline">{p.name}</a>
                <HiddenReasons reasons={reasons} sources={sources} />
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted mt-3">A dermatologist can tell you whether any of these could still be right for you.</p>
        </Disclosure>
      )}

      <Disclosure title="Check a provider's credentials" hint="Board certification and license lookups">
        <p className="text-xs text-muted mb-3">Look for a board-certified dermatologist or plastic surgeon, or a med spa supervised by one.</p>
        <div className="grid gap-2">
          {links.directories.map((l) => (
            <TrackedLink key={l.href} href={l.href} ev={{ kind: "directory", city }} className="text-sm underline">{l.short}</TrackedLink>
          ))}
          <TrackedLink href={links.license.href} ev={{ kind: "license", city }} className="text-sm underline">{links.license.short}</TrackedLink>
        </div>
        <p className="text-[11px] text-muted mt-3">We don&apos;t receive payment from the directories or license sites linked here.</p>
      </Disclosure>

      <button type="button" onClick={onRestart} className="block mx-auto text-sm text-muted underline">Start over</button>
    </section>
  );
}
