"use client";
import { CITY_LABELS } from "@/lib/clinics";
import { courseCost, yearlyCost } from "@/lib/cost";
import { downtimeShort, priceRange } from "@/lib/match";
import { PROCEDURES, RESULT_LABELS } from "@/lib/procedures";
import { EVIDENCE_LABELS, RESEARCH } from "@/lib/research";
import type { City } from "@/lib/types";
import { ListClinics } from "./ListClinics";

/** A shortlist anyone can open or print. Built only from treatment ids and a city in the link. */
export function SharedList({ city, ids }: { city: City; ids: string[] }) {
  const list = ids.map((id) => PROCEDURES.find((p) => p.id === id)).filter((p): p is (typeof PROCEDURES)[number] => !!p).slice(0, 10);
  return (
    <article className="animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1.5">Treatment shortlist</h1>
        <p className="text-sm text-muted">{CITY_LABELS[city]} prices. Ideas to discuss at a consultation, not recommendations or medical advice.</p>
      </div>
      {list.length === 0 ? (
        <p className="text-sm">This list is empty. <a href="/" className="underline">Find your options</a></p>
      ) : (
        <ul className="space-y-3">
          {list.map((p) => (
            <li key={p.id} className="rounded-3xl bg-white border border-line p-4 break-inside-avoid">
              <a href={`/procedures/${p.id}?city=${city}`} className="font-semibold underline decoration-line">{p.name}</a>
              <p className="text-xs text-muted">{p.what}</p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                <dt className="text-muted">Price</dt><dd>{priceRange(p, city)} {p.cost[city] ? p.priceUnit : ""}</dd>
                {courseCost(p, city) && (<><dt className="text-muted">Full course (estimate)</dt><dd>{courseCost(p, city)}</dd></>)}
                {yearlyCost(p, city) && (<><dt className="text-muted">A year (estimate)</dt><dd>{yearlyCost(p, city)}</dd></>)}
                <dt className="text-muted">Recovery</dt><dd>{downtimeShort(p.downtimeDays)}</dd>
                <dt className="text-muted">Expected results</dt><dd>{RESULT_LABELS[p.results]}{RESEARCH[p.id].evidence === 1 ? " (estimate)" : ""}</dd>
                <dt className="text-muted">Certainty of evidence</dt><dd>{EVIDENCE_LABELS[RESEARCH[p.id].evidence]}</dd>
                <dt className="text-muted">Lasts</dt><dd>{p.lasts}</dd>
              </dl>
            </li>
          ))}
        </ul>
      )}
      {list.length > 0 && <ListClinics city={city} ids={list.map((p) => p.id)} />}
      <button type="button" onClick={() => window.print()} className="btn-main print:hidden">Print or save as PDF</button>
      <p className="text-[11px] text-muted">
        Educational information only, not medical advice. Prices are typical ranges, not quotes. Your provider will give you before-treatment
        and aftercare instructions. Always consult a board-certified dermatologist or plastic surgeon about your own situation.
      </p>
    </article>
  );
}
