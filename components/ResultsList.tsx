"use client";
import { useMemo, useState } from "react";
import { CAUTIONS } from "@/lib/cautions";
import { RANK_RULES, downtimeShort, usd, type Match } from "@/lib/match";
import { GOAL_LABELS, ONSET_LABELS } from "@/lib/procedures";
import { EVIDENCE_LABELS, RESEARCH } from "@/lib/research";
import type { City, Goal, Procedure } from "@/lib/types";
import { Disclosure } from "./Disclosure";
import { ApproachTag, DetailSections, Dots } from "./ProcedureFacts";

type Sort = "match" | "evidence" | "price" | "downtime";
type Filter = "event" | "gentle" | "lasting" | "under500" | "strong" | "collagen" | "now" | "nodowntime" | "noneedles" | "lowpain";

const SORTS: [Sort, string][] = [
  ["match", "Best match"],
  ["evidence", "Strongest research"],
  ["price", "Lowest price"],
  ["downtime", "Least downtime"],
];
const FILTERS: [Filter, string][] = [
  ["strong", "Strong research only"],
  ["under500", "Starts under $500"],
  ["lasting", "Lasts a year or more"],
  ["collagen", "Builds your own collagen"],
  ["now", "Results right away"],
  ["nodowntime", "No downtime"],
  ["lowpain", "Low pain"],
  ["noneedles", "No needles"],
];
/** One-tap plans: each sets a filter combination and a sort. */
const PLANS: { label: string; hint: string; filters: Filter[]; sort: Sort }[] = [
  { label: "Event in 2 weeks", hint: "Shows within days, at most a day of recovery", filters: ["event"], sort: "match" },
  { label: "First time", hint: "Low pain, short recovery, not permanent", filters: ["gentle"], sort: "evidence" },
  { label: "Best value", hint: "Starts under $500, best research first", filters: ["under500"], sort: "evidence" },
  { label: "Long-lasting", hint: "Results that last a year or more", filters: ["lasting"], sort: "evidence" },
];
const PERMANENT = new Set(["bellafill"]);
const LASTING = /^(about 1 year|1–2 years|1 year|years|long-lasting|up to about 2 years|about 12–18 months)/i;
const NEEDLES = new Set(["microneedling", "prp", "morpheus8", "subcision"]);
const hasNeedles = (p: Procedure) => ["toxin", "ha", "biostim", "threads"].includes(p.approach) || NEEDLES.has(p.id);
function passes(p: Procedure, f: Filter, city: City) {
  switch (f) {
    case "event": return p.downtimeDays[1] <= 1 && p.onset <= 2;
    case "gentle": return p.pain <= 2 && p.downtimeDays[1] <= 3 && !PERMANENT.has(p.id);
    case "lasting": return LASTING.test(p.lasts);
    case "under500": return p.cost[city][0] < 500;
    case "strong": return RESEARCH[p.id].evidence === 3;
    case "collagen": return !!p.collagen;
    case "now": return p.onset === 1;
    case "nodowntime": return p.downtimeDays[1] === 0;
    case "lowpain": return p.pain <= 2;
    case "noneedles": return !hasNeedles(p);
  }
}

const chip = (on: boolean) =>
  "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors " + (on ? "bg-ink text-white border-ink" : "bg-white border-line hover:border-ink");

/** Ranked, filterable list of matches. Tap a row for details; ♥ to save. */
export function ResultsList({
  matches,
  city,
  saved,
  onToggle,
  onDone,
  hiddenCount,
  goals = [],
}: {
  goals?: Goal[];
  matches: Match[];
  city: City;
  saved: string[];
  onToggle: (id: string) => void;
  onDone: () => void;
  hiddenCount: number;
}) {
  const [sort, setSort] = useState<Sort>("match");
  const [filters, setFilters] = useState<Filter[]>([]);

  const list = useMemo(() => {
    const base = matches.filter((m) => filters.every((f) => passes(m.procedure, f, city)));
    const ev = (m: Match) => RESEARCH[m.procedure.id].evidence;
    const sorted = [...base];
    if (sort === "evidence") sorted.sort((a, b) => ev(b) - ev(a) || b.score - a.score);
    if (sort === "price") sorted.sort((a, b) => a.procedure.cost[city][0] - b.procedure.cost[city][0]);
    if (sort === "downtime") sorted.sort((a, b) => a.procedure.downtimeDays[1] - b.procedure.downtimeDays[1] || ev(b) - ev(a));
    return sorted;
  }, [matches, filters, sort, city]);

  const ranked = sort === "match" && filters.length === 0;
  const bestPerGoal = goals
    .map((g) => ({ g, m: list.find((x) => x.procedure.goals.includes(g)) }))
    .filter((x): x is { g: Goal; m: Match } => !!x.m);
  const card = (m: Match, i: number, top = false) => {
            const p = m.procedure;
            const r = RESEARCH[p.id];
            const isSaved = saved.includes(p.id);
            return (
              <li key={p.id} className="rounded-2xl bg-white border border-line">
                <div className="flex items-start gap-3 px-4 pt-4">
                  <span className="text-xs text-muted w-5 shrink-0 pt-1">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    {top && i === 0 && (
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wide bg-blush rounded-full px-2 py-0.5 mb-1">Top match</span>
                    )}
                    <a href={`/procedures/${p.id}?city=${city}`} className="block font-semibold leading-snug">{p.name}</a>
                    <p className="text-xs text-muted">{p.what}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-muted">
                      <span className="flex items-center gap-1.5"><Dots value={r.evidence} max={3} label="Evidence" /> {EVIDENCE_LABELS[r.evidence]} research</span>
                      <span>from {usd(p.cost[city][0])}</span>
                      <span>Recovery: {downtimeShort(p.downtimeDays).toLowerCase()}</span>
                      <span>{ONSET_LABELS[p.onset]}</span>
                      {p.collagen && <span>Builds collagen</span>}
                    </div>
                    <ul className="mt-2 space-y-0.5 text-xs" aria-label="Why it's ranked here">
                      {m.why.good.slice(0, top ? 3 : 2).map((t) => <li key={t}>✓ {t}</li>)}
                      {m.why.watch.slice(0, top ? 2 : 1).map((t) => <li key={t} className="text-muted">! {t}</li>)}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggle(p.id)}
                    aria-pressed={isSaved}
                    aria-label={isSaved ? `Remove ${p.name} from your list` : `Save ${p.name}`}
                    className={"shrink-0 h-9 w-9 rounded-full border grid place-items-center text-base " + (isSaved ? "bg-ink border-ink text-rose" : "bg-white border-line text-muted")}
                  >
                    ♥
                  </button>
                </div>
                <div className="mt-2 border-t border-line">
                  <Disclosure tone="plain" title={<span className="text-sm">Details & why it fits</span>}>
                    <ApproachTag p={p} />
                    <p className="text-sm leading-relaxed mb-3">{p.summary}</p>
                    {m.notes.length > 0 && (
                      <ul className="mb-3 space-y-1.5 rounded-xl bg-sand p-3">
                        {m.notes.map((n) => (
                          <li key={n.text} className="text-sm">
                            {n.text}
                            {n.source && <a href={n.source.url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted underline">{n.source.label} ↗</a>}
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.flagged.length > 0 && <p className="text-sm mb-3">Not usually advised with {m.flagged.map((c) => CAUTIONS[c].short).join(", ")}.</p>}
                    <DetailSections p={p} city={city} withPrice={false} />
                    <a href={`/procedures/${p.id}?city=${city}`} className="inline-block mt-3 text-sm underline">Open full page →</a>
                  </Disclosure>
                </div>
              </li>
            );
  };

  return (
    <section className="animate-in pb-24">
      <h1 className="text-2xl font-semibold mb-1">Your matches</h1>
      <p className="text-sm text-muted mb-4">
        {matches.length} treatments fit your answers{hiddenCount ? ` (${hiddenCount} hidden for safety — see the end of your list)` : ""}. Tap one for details, ♥ to save.
      </p>
      <Disclosure tone="plain" title={<span className="text-sm">How we rank</span>} hint="Same rules for everyone; clinics can't pay to move up">
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {RANK_RULES.map((r) => <li key={r}>{r}</li>)}
        </ol>
        <p className="text-xs text-muted mt-2">
          Treatments that aren&apos;t advised with your answers are hidden, not ranked. Each card shows its main reasons (✓) and anything to weigh (!).
          Ties go to the option with fewer cautions for you, then stronger research, then lower price.
        </p>
      </Disclosure>
      <div className="mb-4" />

      <p className="text-[11px] text-muted mb-1.5">Quick plans</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {PLANS.map((pl) => {
          const on = pl.filters.every((f) => filters.includes(f)) && filters.length === pl.filters.length && sort === pl.sort;
          return (
            <button key={pl.label} type="button" aria-pressed={on}
              onClick={() => { if (on) { setFilters([]); setSort("match"); } else { setFilters(pl.filters); setSort(pl.sort); } }}
              className={"rounded-2xl border px-3 py-2 text-left transition-colors min-w-0 " + (on ? "bg-ink text-white border-ink" : "bg-white border-line hover:border-ink")}>
              <span className="block text-sm font-medium truncate">{pl.label}</span>
              <span className={"block text-[11px] leading-snug " + (on ? "text-white/80" : "text-muted")}>{pl.hint}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-muted mb-1.5">Sort by</p>
      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-2 [scrollbar-width:none]" role="radiogroup" aria-label="Sort">
        {SORTS.map(([v, l]) => (
          <button key={v} type="button" role="radio" aria-checked={sort === v} onClick={() => setSort(v)} className={chip(sort === v)}>{l}</button>
        ))}
      </div>
      <p className="text-[11px] text-muted mb-1.5 mt-1">Only show</p>
      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-3 [scrollbar-width:none]">
        {FILTERS.map(([v, l]) => {
          const on = filters.includes(v);
          return (
            <button key={v} type="button" aria-pressed={on} onClick={() => setFilters(on ? filters.filter((x) => x !== v) : [...filters, v])} className={chip(on)}>
              {on ? "✓ " : ""}{l}
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">No matches with these filters. Turn one off to see more.</p>
      ) : (
        <>
          {ranked ? (
            <>
              {bestPerGoal.length > 1 && (
                <div className="rounded-2xl bg-blush p-4 mb-4">
                  <p className="text-xs font-medium mb-2">Best for each of your goals</p>
                  <ul className="space-y-1 text-sm">
                    {bestPerGoal.map(({ g, m }) => (
                      <li key={g} className="flex justify-between gap-3"><span className="text-muted min-w-0 truncate">{GOAL_LABELS[g]}</span><a href={`/procedures/${m.procedure.id}?city=${city}`} className="font-medium text-right underline">{m.procedure.name.split(" (")[0]}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              <h2 className="font-semibold mb-2">Your top {Math.min(3, list.length)}</h2>
              <ol className="space-y-3">{list.slice(0, 3).map((m, i) => card(m, i, true))}</ol>
              {list.length > 3 && <h2 className="font-semibold mt-6 mb-2">More options ({list.length - 3})</h2>}
              <ol className="space-y-3">{list.slice(3).map((m, i) => card(m, i + 3))}</ol>
            </>
          ) : (
            <ol className="space-y-3">{list.map((m, i) => card(m, i))}</ol>
          )}
        </>
      )}

      <div className="fixed bottom-0 inset-x-0 z-30 bg-sand/95 backdrop-blur border-t border-line">
        <div className="max-w-md mx-auto px-5 py-3">
          <button type="button" onClick={onDone} className="btn-main text-sm">
            {saved.length ? `Your list (${saved.length}) — find clinics near you →` : "Find clinics for my top matches →"}
          </button>
        </div>
      </div>
    </section>
  );
}
