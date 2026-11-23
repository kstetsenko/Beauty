"use client";
import { useState } from "react";
import { GOAL_EVERYDAY, GOAL_LABELS, GOAL_WORDS, PROCEDURES } from "@/lib/procedures";

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/** Search by a treatment or brand name ("Morpheus8", "Dysport") or by everyday words ("sun spots"). Runs on the device. */
export function searchAll(q: string) {
  const n = norm(q);
  if (n.length < 2) return { treatments: [], goals: [] };
  const treatments = PROCEDURES.filter((p) => [p.name, p.what, ...(p.aka ?? [])].some((t) => norm(t).includes(n))).slice(0, 6);
  const goals = Object.keys(GOAL_LABELS).filter((g) => [GOAL_LABELS[g], GOAL_EVERYDAY[g], ...GOAL_WORDS[g]].some((w) => norm(w).includes(n) || n.includes(norm(w))));
  return { treatments, goals };
}

export function TreatmentSearch() {
  const [q, setQ] = useState("");
  const { treatments, goals } = searchAll(q);
  const typed = norm(q).length >= 2;
  return (
    <div className="mt-8">
      <label className="block">
        <span className="block text-sm font-medium mb-2 text-center">Already know what you want?</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search a treatment or a concern, e.g. Morpheus8 or sun spots"
          className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm focus:outline-none focus:border-ink" />
      </label>
      {typed && (
        <div className="rounded-3xl bg-white border border-line mt-2 p-2 text-sm" aria-live="polite">
          {treatments.map((p) => (
            <a key={p.id} href={`/procedures/${p.id}`} className="block rounded-2xl px-3 py-2 hover:bg-sand">
              <span className="font-medium">{p.name}</span>
              <span className="block text-xs text-muted">{p.what}</span>
            </a>
          ))}
          {goals.map((g) => (
            <a key={g} href={`/goals/${g}`} className="block rounded-2xl px-3 py-2 hover:bg-sand">
              <span className="font-medium">Options for {GOAL_LABELS[g].toLowerCase()}</span>
              <span className="block text-xs text-muted">{GOAL_EVERYDAY[g]}</span>
            </a>
          ))}
          {!treatments.length && !goals.length && (
            <p className="px-3 py-2 text-muted">
              Not in our guide. We only list non-surgical face treatments with an FDA-approved product or FDA-cleared device. <a href="/procedures" className="underline">See all treatments</a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
