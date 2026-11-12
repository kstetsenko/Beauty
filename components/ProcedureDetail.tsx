import { CITY_LABELS } from "@/lib/clinics";
import { GOAL_LABELS } from "@/lib/procedures";
import type { City, Procedure } from "@/lib/types";
import { ApproachTag, DetailSections, KeyFacts } from "./ProcedureFacts";
import { ForYou } from "./ForYou";

export function ProcedureDetail({ p, city }: { p: Procedure; city: City }) {
  const other: City = city === "nyc" ? "miami" : "nyc";

  return (
    <article className="animate-in">
      <a href="/procedures" className="text-muted hover:text-ink text-sm">Back to treatments that fit you</a>
      <div className="bg-white rounded-3xl border border-line p-6 mt-4">
        <ApproachTag p={p} />
        <h1 className="text-2xl font-semibold leading-snug">{p.name}</h1>
        <p className="text-sm text-muted mb-3">{p.what}</p>
        <p className="text-sm leading-relaxed mb-5">{p.summary}</p>
        <div className="flex gap-2 mb-3 text-sm">
          <span className="rounded-full bg-ink text-white px-3.5 py-1.5">{CITY_LABELS[city]}</span>
          <a href={`/procedures/${p.id}?city=${other}`} className="rounded-full border border-line px-3.5 py-1.5 hover:border-ink">{CITY_LABELS[other]}</a>
        </div>
        <KeyFacts p={p} city={city} />
      </div>
      <ForYou p={p} />
      <p className="text-xs text-muted mt-5 mb-2 px-1">Tap a topic to learn more</p>
      <DetailSections p={p} city={city} />
      <section className="mt-4">
        <h2 className="font-semibold mb-2">See other options for</h2>
        <div className="flex flex-wrap gap-2">
          {p.goals.map((g) => (
            <a key={g} href={`/goals/${g}?city=${city}`} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm hover:border-ink">
              {GOAL_LABELS[g]}
            </a>
          ))}
        </div>
      </section>
      <a href={`/clinics?t=${p.id}&city=${city}`} className="btn-main block text-center mt-5">
        Find a clinic for {p.name.split(" / ")[0]}
      </a>
      <p className="text-[11px] text-muted text-center mt-1.5">Clinics near you that meet our criteria, or search Google Maps yourself.</p>
      <a href={`/compare?ids=${p.id}&city=${city}`} className="btn-soft block text-center mt-3 text-sm">Compare with similar treatments</a>
      <p className="text-[11px] text-muted text-center mt-4">
        *Price ranges are not quotes. Educational information only — not medical advice. Brand names belong to their owners;
        we are not affiliated with any brand, and clinics marked Partner pay only a flat listing fee. <a href="/sources" className="underline">How we research</a>
      </p>
    </article>
  );
}
