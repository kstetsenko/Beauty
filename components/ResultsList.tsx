"use client";
import { useEffect, useMemo, useState } from "react";
import { CAUTIONS } from "@/lib/cautions";
import { RANK_RULES, downtimeShort, priceFrom, type Match } from "@/lib/match";
import { GOAL_LABELS, ONSET_LABELS } from "@/lib/procedures";
import { EVIDENCE_LABELS, RESEARCH } from "@/lib/research";
import type { City, Goal } from "@/lib/types";
import { filterFitsGoals } from "@/lib/relevance";
import { SORTS, applyFilters, availableFilters, availablePlans, sortMatches, type Filter, type Sort } from "@/lib/filters";
import { Disclosure } from "./Disclosure";
import { ApproachTag, DetailSections, Dots } from "./ProcedureFacts";

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
  const [tab, setTab] = useState<Goal | null>(null);

  const list = useMemo(() => sortMatches(applyFilters(matches, filters, city, tab), sort, city), [matches, filters, sort, city, tab]);
  const plans = useMemo(() => availablePlans(matches, city, tab, goals), [matches, city, tab, goals]);
  const chips = useMemo(() => availableFilters(matches, filters, city, tab, goals), [matches, filters, city, tab, goals]);
  const tabs = goals.length > 1 ? goals.map((g) => ({ g, n: matches.filter((m) => m.procedure.goals.includes(g)).length })).filter((t) => t.n > 0) : [];

  // Never leave the person on an empty list: if a goal tab makes the active filters empty, drop them.
  useEffect(() => {
    if (filters.length && list.length === 0) setFilters([]);
  }, [filters, list.length]);

  const ranked = sort === "match" && filters.length === 0;
  // Similar to something still settling from a recent treatment: shown last, under "Later", with the reason.
  const now = list.filter((m) => !m.later);
  const later = list.filter((m) => m.later);
  const bestPerGoal = (tab ? [] : goals)
    .map((g) => ({ g, m: now.find((x) => x.procedure.goals.includes(g)) }))
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
                      <span className="flex items-center gap-1.5"><Dots value={r.evidence} max={3} label="Certainty of evidence" /> {EVIDENCE_LABELS[r.evidence]} certainty</span>
                      <span>{priceFrom(p, city)}</span>
                      <span>Recovery: {downtimeShort(p.downtimeDays).toLowerCase()}</span>
                      <span>{ONSET_LABELS[p.onset]}</span>
                      {p.collagen && filterFitsGoals("collagen", tab ? [tab] : goals) && <span>Builds collagen</span>}
                    </div>
                    {m.later && <p className="mt-2 text-xs rounded-xl bg-sand px-3 py-2">Later: {m.later}</p>}
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
                            {n.source && <a href={n.source.url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted underline">{n.source.label}</a>}
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.flagged.length > 0 && <p className="text-sm mb-3">Not usually advised with {m.flagged.map((c) => CAUTIONS[c].short).join(", ")}.</p>}
                    <DetailSections p={p} city={city} withPrice={false} />
                    <a href={`/procedures/${p.id}?city=${city}`} className="inline-block mt-3 text-sm underline">Open full page</a>
                  </Disclosure>
                </div>
              </li>
            );
  };

  return (
    <section className="animate-in pb-24">
      <h1 className="text-2xl font-semibold mb-1">Your matches</h1>
      <p className="text-sm text-muted mb-4">
        {matches.length} treatment{matches.length === 1 ? "" : "s"} for {goals.map((g) => GOAL_LABELS[g].toLowerCase()).join(", ") || "your goals"} that fit your answers
        {hiddenCount ? ` (${hiddenCount} hidden for safety — see the end of your list)` : ""}. Tap one for details, ♥ to save.
      </p>
      {tabs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-3 [scrollbar-width:none]" role="tablist" aria-label="Your goals">
          <button type="button" role="tab" aria-selected={tab === null} onClick={() => setTab(null)} className={chip(tab === null)}>All your goals ({matches.length})</button>
          {tabs.map(({ g, n }) => (
            <button key={g} type="button" role="tab" aria-selected={tab === g} onClick={() => setTab(g)} className={chip(tab === g)}>{GOAL_LABELS[g]} ({n})</button>
          ))}
        </div>
      )}
      <Disclosure tone="plain" title={<span className="text-sm">How we rank</span>} hint="Same rules for everyone; clinics can't pay to move up">
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {RANK_RULES.map((r) => <li key={r}>{r}</li>)}
        </ol>
        <p className="text-xs text-muted mt-2">
          Treatments that aren&apos;t advised with your answers are hidden, not ranked. Each card shows its main reasons (✓) and anything to weigh (!).
          Ties go to the option with fewer cautions for you, then the higher certainty of evidence, then the lower price.
        </p>
      </Disclosure>
      <div className="mb-4" />

      <p className="text-[11px] text-muted mb-1.5">Quick plans</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {plans.map((pl) => {
          const on = pl.filters.every((f) => filters.includes(f)) && filters.length === pl.filters.length && sort === pl.sort;
          return (
            <button key={pl.label} type="button" aria-pressed={on}
              onClick={() => { if (on) { setFilters([]); setSort("match"); } else { setFilters(pl.filters); setSort(pl.sort); } }}
              className={"rounded-2xl border px-3 py-2 text-left transition-colors min-w-0 " + (on ? "bg-ink text-white border-ink" : "bg-white border-line hover:border-ink")}>
              <span className="flex justify-between gap-2 text-sm font-medium"><span className="truncate">{pl.label}</span><span className={on ? "text-white/80" : "text-muted"}>{pl.count}</span></span>
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
        {chips.map(({ f, label, on, count }) => (
          <button key={f} type="button" aria-pressed={on} onClick={() => setFilters(on ? filters.filter((x) => x !== f) : [...filters, f])} className={chip(on)}>
            {on ? "✓ " : ""}{label}{on ? "" : ` (${count})`}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">Nothing matches every filter. <button type="button" className="underline" onClick={() => { setFilters([]); setSort("match"); }}>Clear filters</button></p>
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
              {now.length > 0 && <h2 className="font-semibold mb-2">Your top {Math.min(3, now.length)}</h2>}
              <ol className="space-y-3">{now.slice(0, 3).map((m, i) => card(m, i, true))}</ol>
              {now.length > 3 && <h2 className="font-semibold mt-6 mb-2">More options ({now.length - 3})</h2>}
              <ol className="space-y-3">{now.slice(3).map((m, i) => card(m, i + 3))}</ol>
            </>
          ) : (
            <ol className="space-y-3">{now.map((m, i) => card(m, i))}</ol>
          )}
          {later.length > 0 && (
            <section className="mt-6" aria-label="Later">
              <h2 className="font-semibold">Later ({later.length})</h2>
              <p className="text-xs text-muted mb-2">Similar to a treatment you had recently that is still settling. Revisit once its results are in.</p>
              <ol className="space-y-3">{later.map((m, i) => card(m, now.length + i))}</ol>
            </section>
          )}
        </>
      )}

      <div className="fixed bottom-0 inset-x-0 z-30 bg-sand/95 backdrop-blur border-t border-line">
        <div className="max-w-md mx-auto px-5 py-3">
          <button type="button" onClick={onDone} className="btn-main text-sm">
            {saved.length ? `Your list (${saved.length}) — find clinics near you` : "Find clinics for my top matches"}
          </button>
        </div>
      </div>
    </section>
  );
}
