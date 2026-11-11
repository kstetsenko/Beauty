"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { CITY_LABELS } from "@/lib/clinics";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, ONSET_LABELS, PAIN_LABELS, PROCEDURES, RESULT_LABELS } from "@/lib/procedures";
import { EVIDENCE_LABELS, RESEARCH, priceChecked } from "@/lib/research";
import type { City, Procedure } from "@/lib/types";
import { Dots } from "./ProcedureFacts";

const ROWS: { label: string; cell: (p: Procedure, c: City) => React.ReactNode }[] = [
  { label: "Price", cell: (p, c) => <>{usd(p.cost[c][0])}–{usd(p.cost[c][1]).replace("$", "")}<span className="block text-[11px] text-muted">{p.priceUnit}{priceChecked(p.id, c) ? "" : " · estimate"}</span></> },
  { label: "Research", cell: (p) => <><Dots value={RESEARCH[p.id].evidence} max={3} label="Evidence" /><span className="block text-[11px] text-muted mt-1">{EVIDENCE_LABELS[RESEARCH[p.id].evidence]}</span></> },
  { label: "Results", cell: (p) => <><Dots value={p.results} max={3} label="Results" /><span className="block text-[11px] text-muted mt-1">{RESULT_LABELS[p.results]}</span></> },
  { label: "Pain", cell: (p) => <><Dots value={p.pain} max={5} label="Pain" /><span className="block text-[11px] text-muted mt-1">{PAIN_LABELS[p.pain]}</span></> },
  { label: "Recovery", cell: (p) => downtimeShort(p.downtimeDays) },
  { label: "Results show", cell: (p) => ONSET_LABELS[p.onset] },
  { label: "Sessions", cell: (p) => p.sessions },
  { label: "Lasts", cell: (p) => p.lasts },
  { label: "How it works", cell: (p) => APPROACHES[p.approach].label },
];

export function CompareView() {
  const params = useSearchParams();
  const router = useRouter();
  const city: City = params.get("city") === "miami" ? "miami" : "nyc";
  const ids = (params.get("ids") || "").split(",").filter((id) => PROCEDURES.some((p) => p.id === id)).slice(0, 3);
  const chosen = ids.map((id) => PROCEDURES.find((p) => p.id === id)!);

  const update = (next: string[], c: City = city) =>
    router.replace(`/compare?ids=${next.join(",")}&city=${c}`, { scroll: false });

  return (
    <div className="animate-in">
      <h1 className="text-2xl font-semibold mb-1.5">Compare treatments</h1>
      <p className="text-sm text-muted mb-4">Pick up to 3. Prices for {CITY_LABELS[city]}.</p>

      <div className="flex gap-2 mb-3">
        {(Object.keys(CITY_LABELS) as City[]).map((c) => (
          <button key={c} type="button" onClick={() => update(ids, c)} aria-pressed={city === c}
            className={"rounded-full px-3.5 py-1.5 text-sm border " + (city === c ? "bg-ink text-white border-ink" : "bg-white border-line")}>
            {CITY_LABELS[c]}
          </button>
        ))}
      </div>

      <label className="block mb-5">
        <span className="sr-only">Add a treatment</span>
        <select
          value=""
          disabled={ids.length >= 3}
          onChange={(e) => e.target.value && update([...ids, e.target.value])}
          className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm disabled:opacity-50"
        >
          <option value="">{ids.length >= 3 ? "Remove one to add another" : "+ Add a treatment"}</option>
          {PROCEDURES.filter((p) => !ids.includes(p.id)).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </label>

      {chosen.length === 0 ? (
        <p className="text-sm text-muted text-center py-8">Add treatments above to see them side by side.</p>
      ) : (
        <div className="rounded-3xl bg-white border border-line overflow-hidden">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="w-[26%] p-3 text-left text-[11px] font-normal text-muted align-bottom">Treatment</th>
                {chosen.map((p) => (
                  <th key={p.id} className="p-3 text-left align-top font-semibold">
                    <a href={`/procedures/${p.id}?city=${city}`} className="block leading-snug break-words">{p.name}</a>
                    <button type="button" onClick={() => update(ids.filter((x) => x !== p.id))} className="text-[11px] text-muted underline font-normal mt-1">
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-3 text-left text-[11px] font-normal text-muted align-top">{r.label}</th>
                  {chosen.map((p) => (
                    <td key={p.id} className="p-3 align-top break-words">{r.cell(p, city)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-[11px] text-muted text-center mt-3">
        Typical ranges, not quotes or guarantees. <a href="/sources" className="underline">How we research</a>
      </p>
    </div>
  );
}
