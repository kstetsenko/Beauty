"use client";
import { useState } from "react";
import { CITY_LABELS } from "@/lib/clinics";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, PROCEDURES } from "@/lib/procedures";
import type { Approach, City } from "@/lib/types";
import { TRENDS } from "@/lib/trends";
import { personalize, type Profile } from "@/lib/profile";
import { GOAL_LABELS } from "@/lib/procedures";
import type { Goal } from "@/lib/types";
import { NotShown, ProfileBar, ProfileGate } from "./ProfileGate";
import { Dots } from "./ProcedureFacts";

const pill = (on: boolean) =>
  "shrink-0 rounded-full px-3.5 py-1.5 text-sm border transition-colors " +
  (on ? "bg-ink text-white border-ink" : "bg-white border-line hover:border-ink");

export function ProcedureBrowser() {
  return <ProfileGate what="browse treatments">{(profile) => <BrowserFor profile={profile} />}</ProfileGate>;
}

function BrowserFor({ profile }: { profile: Profile }) {
  const city: City = profile.city;
  const [group, setGroup] = useState<Approach | "all">("all");
  const [q, setQ] = useState("");
  const { shown, hidden, outside } = personalize(profile, Object.keys(GOAL_LABELS) as Goal[]);
  const fit = shown.map((m) => m.procedure).sort((a, b) => PROCEDURES.indexOf(a) - PROCEDURES.indexOf(b));
  const groups = (Object.keys(APPROACHES) as Approach[]).filter((a) => fit.some((p) => p.approach === a));
  const needle = q.trim().toLowerCase();
  const list = fit.filter(
    (p) =>
      (group === "all" || p.approach === group) &&
      (!needle || [p.name, p.what, ...(p.aka ?? [])].some((t) => t.toLowerCase().includes(needle))),
  );

  return (
    <div className="animate-in">
      <h1 className="text-2xl font-semibold mb-1.5">Treatments that fit you</h1>
      <p className="text-sm text-muted mb-4">{fit.length} of {PROCEDURES.length} treatments fit your answers. Tap one to learn more.</p>
      <ProfileBar profile={profile} />
      <label className="block mb-3">
        <span className="sr-only">Search treatments</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value.slice(0, 40))}
          placeholder="Search, e.g. BBL, PicoWay, filler"
          className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm focus:outline-none focus:border-ink"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-5 px-5 [scrollbar-width:none]">
        <button type="button" onClick={() => setGroup("all")} aria-pressed={group === "all"} className={pill(group === "all")}>All</button>
        {groups.map((a) => (
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
                <span className="block text-xs text-muted truncate">{p.what}{needle && p.aka?.some((t) => t.toLowerCase().includes(needle)) ? ` · also called ${p.aka.find((t) => t.toLowerCase().includes(needle))}` : ""}</span>
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
      {list.length === 0 && <p className="text-sm text-muted text-center py-6">No treatments that fit you match &ldquo;{q}&rdquo;. It may be hidden for safety or outside your budget — see below.</p>}
      <div className="mt-4"><NotShown hidden={hidden} outside={outside} /></div>
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
