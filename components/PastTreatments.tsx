"use client";
import { useState } from "react";
import { PROCEDURES } from "@/lib/procedures";
import type { Approach } from "@/lib/types";

const GROUPS: { label: string; approaches: Approach[] }[] = [
  { label: "Injectables", approaches: ["toxin", "ha", "biostim", "threads"] },
  { label: "Lasers & light", approaches: ["laser"] },
  { label: "Tightening & RF devices", approaches: ["energy"] },
  { label: "Facials, peels & needling", approaches: ["skin"] },
];
const short = (name: string) => name.split(" / ")[0];

/** Pick any treatments had recently, from the full list — grouped, with search (names and brand names). */
export function PastTreatments({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const hit = (id: string) => {
    if (!term) return true;
    const p = PROCEDURES.find((x) => x.id === id)!;
    return [p.name, p.what, ...(p.aka ?? [])].some((t) => t.toLowerCase().includes(term));
  };
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const chip = (on: boolean) =>
    "rounded-full border px-3 py-1.5 text-xs transition-colors " + (on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink");

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="sr-only">Search treatments</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value.slice(0, 40))}
          placeholder="Search, e.g. Dysport, Voluma, Fraxel"
          autoComplete="off"
          className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm focus:outline-none focus:border-ink"
        />
      </label>
      {selected.length > 0 && (
        <p className="text-xs text-muted">Selected: {selected.length}</p>
      )}
      {GROUPS.map((g) => {
        const items = PROCEDURES.filter((p) => g.approaches.includes(p.approach) && hit(p.id));
        if (!items.length) return null;
        return (
          <div key={g.label}>
            <p className="text-xs font-medium mb-2">{g.label}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((p) => {
                const on = selected.includes(p.id);
                return (
                  <button key={p.id} type="button" aria-pressed={on} onClick={() => toggle(p.id)} className={chip(on)}>
                    {on ? "✓ " : ""}{short(p.name)}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {term && !PROCEDURES.some((p) => hit(p.id)) && (
        <p className="text-sm text-muted">Not in our list. You can skip this — just tell your provider about it.</p>
      )}
    </div>
  );
}
