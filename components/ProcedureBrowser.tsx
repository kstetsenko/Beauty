"use client";
import { useState } from "react";
import { CITY_LABELS } from "@/lib/clinics";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, PROCEDURES } from "@/lib/procedures";
import type { Approach, City } from "@/lib/types";
import { TRENDS } from "@/lib/trends";
import { Dots } from "./ProcedureFacts";

const pill = (on: boolean) =>
  "shrink-0 rounded-full px-3.5 py-1.5 text-sm border transition-colors " +
  (on ? "bg-ink text-white border-ink" : "bg-white border-line hover:border-ink");

export function ProcedureBrowser() {
  const [city, setCity] = useState<City>("nyc");
  const [group, setGroup] = useState<Approach | "all">("all");
  const list = PROCEDURES.filter((p) => group === "all" || p.approach === group);

  return (
    <div className="animate-in">
      <h1 className="text-2xl font-semibold mb-1.5">All procedures</h1>
      <p className="text-sm text-muted mb-5">Tap one to learn more.</p>

      <div className="flex gap-2 mb-3" role="radiogroup" aria-label="City for prices">
        {(Object.keys(CITY_LABELS) as City[]).map((c) => (
          <button key={c} type="button" role="radio" aria-checked={city === c} onClick={() => setCity(c)} className={pill(city === c)}>
            {CITY_LABELS[c]}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-5 px-5 [scrollbar-width:none]">
        <button type="button" onClick={() => setGroup("all")} aria-pressed={group === "all"} className={pill(group === "all")}>All</button>
        {(Object.keys(APPROACHES) as Approach[]).map((a) => (
          <button key={a} type="button" onClick={() => setGroup(a)} aria-pressed={group === a} className={pill(group === a)}>
            {APPROACHES[a].short}
          </button>
        ))}
      </div>
      {group !== "all" && <p className="text-xs text-muted mb-3">{APPROACHES[group].hint}</p>}

      <ul className="rounded-3xl bg-white border border-line divide-y divide-line">
        {list.map((p) => (
          <li key={p.id}>
            <a href={`/procedures/${p.id}?city=${city}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-sand">
              <span className="min-w-0">
                <span className="block font-medium">{p.name}</span>
                <span className="block text-xs text-muted truncate">{p.what}</span>
                <span className="flex items-center gap-3 mt-1.5 text-[11px] text-muted">
                  <span className="flex items-center gap-1.5">Pain <Dots value={p.pain} max={5} label="Pain" /></span>
                  <span>{downtimeShort(p.downtimeDays)}</span>
                </span>
              </span>
              <span className="text-sm shrink-0 text-right">
                from {usd(p.cost[city][0])}
                <span className="block text-muted" aria-hidden="true">›</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      {group === "all" && TRENDS.map((t) => (
        <div key={t.id} className="rounded-3xl border border-line bg-white p-5 mt-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Trending — {t.status}</p>
          <p className="font-semibold mt-0.5 mb-1">{t.name}</p>
          <p className="text-sm leading-relaxed mb-2">{t.why}</p>
          {t.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="block text-sm underline">{l.label} ↗</a>
          ))}
        </div>
      ))}
      <p className="text-[11px] text-muted text-center mt-3">Prices checked against published clinic prices where available — not quotes. <a href="/sources" className="underline">How we check</a></p>
    </div>
  );
}
