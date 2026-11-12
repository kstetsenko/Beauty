"use client";
import { useState } from "react";
import { INTENSITY, FACTS, TIMELINE, intensity } from "@/lib/insights";
import { PROCEDURES } from "@/lib/procedures";
import { TRENDS } from "@/lib/trends";
import { Disclosure } from "./Disclosure";

const nameOf = (id: string) => PROCEDURES.find((p) => p.id === id)?.name ?? id;
const TABS = [
  ["facts", "Fast facts"],
  ["timeline", "How long it's been around"],
  ["intensity", "How intensive"],
] as const;

export function Insights() {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("facts");
  const [fact, setFact] = useState(0);
  const f = FACTS[fact];

  return (
    <article className="animate-in space-y-5">
      <div>
        <h1 className="text-2xl font-semibold mb-1.5">Core insights</h1>
        <p className="text-sm text-muted">Proven facts, track records and intensity. Every fact links to its source.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 [scrollbar-width:none]" role="tablist">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={"shrink-0 rounded-full px-3.5 py-1.5 text-sm border " + (tab === id ? "bg-ink text-white border-ink" : "bg-white border-line")}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "facts" && (
        <section key={fact} className="animate-in">
          <div className="rounded-3xl bg-white border border-line p-6 min-h-[11rem] flex flex-col">
            <p className="text-[11px] text-muted mb-2">Fact {fact + 1} of {FACTS.length}</p>
            <p className="text-lg leading-snug flex-1">{f.fact}</p>
            <a href={f.source.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted underline mt-3">Source: {f.source.label} ↗</a>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button type="button" disabled={fact === 0} onClick={() => setFact(fact - 1)} className="btn-soft">← Previous</button>
            <button type="button" onClick={() => setFact((fact + 1) % FACTS.length)} className="btn-main">
              {fact + 1 === FACTS.length ? "Start again" : "Next fact →"}
            </button>
          </div>
        </section>
      )}

      {tab === "timeline" && (
        <section className="animate-in">
          <p className="text-xs text-muted mb-3 px-1">
            First U.S. approval or clearance. A longer track record means more safety data — newer isn&apos;t automatically
            better. Tap a year for details.
          </p>
          <div className="rounded-2xl bg-white border border-line">
            {TIMELINE.map((m) => (
              <Disclosure key={m.year + m.title} tone="plain" title={<><span className="text-muted font-normal mr-2">{m.year}</span>{m.title}</>}>
                <p className="text-sm text-muted leading-snug">{m.detail}</p>
                <p className="text-sm mt-2 flex flex-wrap gap-x-3">
                  {m.ids.map((id) => <a key={id} href={`/procedures/${id}`} className="underline">{nameOf(id)} →</a>)}
                </p>
                <a href={m.source.url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted underline mt-2">Source: {m.source.label} ↗</a>
              </Disclosure>
            ))}
            {TRENDS.map((t) => (
              <Disclosure key={t.id} tone="plain" title={<><span className="text-muted font-normal mr-2">Now</span>{t.name}: {t.status.toLowerCase()}</>}>
                <p className="text-sm text-muted leading-snug">{t.why}</p>
                {t.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-muted underline mt-1">{l.label} ↗</a>
                ))}
              </Disclosure>
            ))}
          </div>
          <p className="text-[11px] text-muted mt-3 px-1">
            We list only dates we could confirm; HydraFacial, Halo, Moxi, thread lifts, Thermage, Sculptra, Emface, Tixel, subcision and microdermabrasion are
            left off until verified.
          </p>
        </section>
      )}

      {tab === "intensity" && (
        <section className="animate-in space-y-2.5">
          <p className="text-xs text-muted px-1">From typical recovery time and pain in our data — your provider and settings change this. Tap a level.</p>
          {([1, 2, 3] as const).map((level) => {
            const list = PROCEDURES.filter((p) => intensity(p) === level);
            const [title, hint] = INTENSITY[level].split(" — ");
            return (
              <Disclosure key={level} title={title} hint={`${list.length} treatments · ${hint}`}>
                <div className="flex flex-wrap gap-2">
                  {list.map((p) => (
                    <a key={p.id} href={`/procedures/${p.id}`} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm hover:border-ink">{p.name}</a>
                  ))}
                </div>
              </Disclosure>
            );
          })}
        </section>
      )}

      <a href="/" className="btn-main block text-center">Find what fits you — about a minute</a>
      <p className="text-[11px] text-muted text-center">
        Educational information only — not medical advice. <a href="/sources" className="underline">How we research</a>
      </p>
    </article>
  );
}
