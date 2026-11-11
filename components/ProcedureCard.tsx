"use client";
import { useRef, useState } from "react";
import { CAUTIONS } from "@/lib/cautions";
import type { Match } from "@/lib/match";
import { ApproachTag, KeyFacts, MoreFacts } from "./ProcedureFacts";
import type { Budget, City } from "@/lib/types";

/** A single procedure card. Swipe right / tap ♡ to save, swipe left / tap Skip to pass. */
export function ProcedureCard({
  match,
  city,
  onSave,
  onSkip,
}: {
  match: Match;
  city: City;
  budget?: Budget;
  onSave: () => void;
  onSkip: () => void;
}) {
  const p = match.procedure;
  const [open, setOpen] = useState(false);
  const [dx, setDx] = useState(0);
  const start = useRef<number | null>(null);

  const end = () => {
    if (dx > 90) onSave();
    else if (dx < -90) onSkip();
    start.current = null;
    setDx(0);
  };

  return (
    <div className="animate-in">
      <article
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          start.current = e.clientX;
        }}
        onPointerMove={(e) => start.current !== null && setDx(e.clientX - start.current)}
        onPointerUp={end}
        onPointerCancel={() => {
          start.current = null;
          setDx(0);
        }}
        style={{ transform: dx ? `translateX(${dx}px) rotate(${dx / 30}deg)` : undefined, touchAction: "pan-y" }}
        className={"bg-white rounded-3xl border border-line p-6 shadow-sm select-none " + (dx ? "" : "transition-transform")}
      >
        <ApproachTag p={p} />
        <h2 className="text-xl font-semibold leading-snug">{p.name}</h2>
        <p className="text-sm text-muted mb-3">{p.what}</p>
        <p className="text-sm leading-relaxed mb-5">{p.summary}</p>

        <div className="mb-4"><KeyFacts p={p} city={city} /></div>

        {match.flagged.length > 0 && (
          <p className="text-sm mb-3">
            <span className="text-rose" aria-hidden="true">●</span> Ask your doctor first — not usually advised with{" "}
            {match.flagged.map((c) => CAUTIONS[c].short.toLowerCase()).join(", ")}.
          </p>
        )}

        {match.notes.length > 0 && (
          <div className="rounded-2xl border border-line p-3 mb-3">
            <p className="text-[11px] text-muted mb-1.5">Based on your answers</p>
            <ul className="space-y-2">
              {match.notes.map((n) => (
                <li key={n.text} className="text-sm leading-snug">
                  {n.text}
                  {n.source && (
                    <a href={n.source.url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted underline mt-0.5">
                      {n.source.label} ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="text-sm underline text-muted">
          {open ? "Less" : "More details"}
        </button>
        {open && (
          <div className="mt-4 animate-in">
            <MoreFacts p={p} city={city} />
            <a href={`/procedures/${p.id}?city=${city}`} className="inline-block mt-3 text-sm underline">Studies, price sources & questions to ask →</a>
          </div>
        )}
      </article>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button type="button" onClick={onSkip} className="btn-soft">Skip</button>
        <button type="button" onClick={onSave} className="btn-main"><span className="text-rose">♥</span> Save</button>
      </div>
      <p className="text-[11px] text-muted text-center mt-3">*Typical local price range, not a quote. <a href="/sources" className="underline">How we check</a></p>
    </div>
  );
}
