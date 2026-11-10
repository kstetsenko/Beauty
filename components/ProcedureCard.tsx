"use client";
import { useRef, useState } from "react";
import { CAUTIONS } from "@/lib/cautions";
import { downtimeShort, usd, type Match } from "@/lib/match";
import type { City } from "@/lib/types";

/** A single procedure card. Swipe right / tap ♡ to save, swipe left / tap Skip to pass. */
export function ProcedureCard({
  match,
  city,
  onSave,
  onSkip,
}: {
  match: Match;
  city: City;
  onSave: () => void;
  onSkip: () => void;
}) {
  const p = match.procedure;
  const [lo, hi] = p.cost[city];
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
        <h2 className="text-xl font-semibold leading-snug mb-2">{p.name}</h2>
        <p className="text-sm text-muted leading-relaxed mb-5">{p.summary}</p>

        <dl className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl bg-sand p-3">
            <dt className="text-[11px] text-muted">Per visit*</dt>
            <dd className="font-semibold">{usd(lo)}–{usd(hi).replace("$", "")}</dd>
          </div>
          <div className="rounded-2xl bg-sand p-3">
            <dt className="text-[11px] text-muted">Recovery</dt>
            <dd className="font-semibold">{downtimeShort(p.downtimeDays)}</dd>
          </div>
        </dl>

        {match.flagged.length > 0 && (
          <p className="text-sm mb-3">
            <span className="text-rose" aria-hidden="true">●</span> Ask your doctor first — you mentioned{" "}
            {match.flagged.map((c) => CAUTIONS[c].short.toLowerCase()).join(", ")}.
          </p>
        )}

        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="text-sm underline text-muted">
          {open ? "Less" : "More details"}
        </button>
        {open && (
          <dl className="mt-3 space-y-2 text-sm animate-in">
            <div><dt className="text-[11px] text-muted">Sessions</dt><dd>{p.sessions}</dd></div>
            <div><dt className="text-[11px] text-muted">Who does it</dt><dd>{p.performedBy}</dd></div>
            <div>
              <dt className="text-[11px] text-muted">Not usually advised with</dt>
              <dd>{p.contraindications.map((c) => CAUTIONS[c].short).join(" · ")}</dd>
            </div>
            <div><dt className="text-[11px] text-muted">Good to know</dt><dd>{p.notes}</dd></div>
          </dl>
        )}
      </article>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button type="button" onClick={onSkip} className="btn-soft">Skip</button>
        <button type="button" onClick={onSave} className="btn-main"><span className="text-rose">♥</span> Save</button>
      </div>
      <p className="text-[11px] text-muted text-center mt-3">*Typical local estimate, not a quote.</p>
    </div>
  );
}
