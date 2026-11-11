import { CITY_LABELS } from "@/lib/clinics";
import { APPROACH_ORDER, GOAL_GUIDE, SUNSCREEN } from "@/lib/learn";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, GOAL_LABELS, PROCEDURES } from "@/lib/procedures";
import { EVIDENCE_LABELS, RESEARCH } from "@/lib/research";
import { TRENDS } from "@/lib/trends";
import type { City, Goal } from "@/lib/types";
import { Dots } from "./ProcedureFacts";

/** All options for one goal, ordered least → most involved, each linking to its page. */
export function GoalGuide({ goal, city }: { goal: Goal; city: City }) {
  const g = GOAL_GUIDE[goal];
  const options = PROCEDURES.filter((p) => p.goals.includes(goal));
  const groups = APPROACH_ORDER.map((a) => ({ a, list: options.filter((p) => p.approach === a) })).filter((x) => x.list.length);
  const trends = TRENDS.filter((t) => t.goals.includes(goal));
  const other: City = city === "nyc" ? "miami" : "nyc";

  return (
    <article className="animate-in space-y-5">
      <a href="/goals" className="text-muted hover:text-ink text-sm">← All goals</a>
      <div>
        <h1 className="text-2xl font-semibold mb-2">{GOAL_LABELS[goal]}: your options</h1>
        <p className="text-sm leading-relaxed">{g.intro}</p>
      </div>

      <div className="flex gap-2 text-sm">
        <span className="rounded-full bg-ink text-white px-3.5 py-1.5">{CITY_LABELS[city]} prices</span>
        <a href={`/goals/${goal}?city=${other}`} className="rounded-full border border-line px-3.5 py-1.5 hover:border-ink">{CITY_LABELS[other]}</a>
      </div>

      {g.foundation && (
        <section className="rounded-3xl bg-blush p-5">
          <h2 className="font-semibold mb-1">Start here: daily basics</h2>
          <p className="text-sm leading-relaxed">
            Broad-spectrum SPF 30+ every day, and a retinoid at night. Dermatologists recommend these before and alongside any
            procedure.
          </p>
          <div className="flex flex-col gap-1 mt-2 text-sm">
            <a href={`/procedures/tretinoin?city=${city}`} className="underline">Prescription retinoid (tretinoin) →</a>
            <a href={SUNSCREEN.url} target="_blank" rel="noopener noreferrer" className="underline">{SUNSCREEN.label} ↗</a>
          </div>
        </section>
      )}

      {groups.map(({ a, list }) => (
        <section key={a}>
          <h2 className="font-semibold">{APPROACHES[a].label}</h2>
          <p className="text-xs text-muted mb-2">{APPROACHES[a].hint}</p>
          <ul className="rounded-3xl bg-white border border-line divide-y divide-line">
            {list.map((p) => (
              <li key={p.id}>
                <a href={`/procedures/${p.id}?city=${city}`} className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-sand">
                  <span className="min-w-0">
                    <span className="block font-medium">{p.name}</span>
                    <span className="block text-xs text-muted">{p.what}</span>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-muted">
                      <span className="flex items-center gap-1.5">Research <Dots value={RESEARCH[p.id].evidence} max={3} label="Evidence" /> {EVIDENCE_LABELS[RESEARCH[p.id].evidence]}</span>
                      <span>Recovery: {downtimeShort(p.downtimeDays).toLowerCase()}</span>
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
        </section>
      ))}

      {trends.map((t) => (
        <section key={t.id} className="rounded-3xl border border-line bg-white p-5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Trending — {t.status}</p>
          <h2 className="font-semibold mt-0.5 mb-1">{t.name}</h2>
          <p className="text-sm leading-relaxed mb-2">{t.why}</p>
          <ul className="space-y-1">
            {t.links.map((l) => (
              <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm underline">{l.label} ↗</a></li>
            ))}
          </ul>
        </section>
      ))}

      <section>
        <h2 className="font-semibold mb-2">Learn more</h2>
        <ul className="space-y-1.5">
          {g.learn.map((l) => (
            <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm underline">{l.label} ↗</a></li>
          ))}
        </ul>
      </section>

      <a href="/" className="btn-main block text-center">Take the 1-minute quiz for a personal shortlist</a>
      <p className="text-[11px] text-muted text-center">
        Educational information only — not medical advice. Prices are typical ranges, not quotes. <a href="/sources" className="underline">How we research</a>
      </p>
    </article>
  );
}

export function GoalIndex() {
  return (
    <section className="animate-in">
      <h1 className="text-2xl font-semibold mb-1.5">Explore by goal</h1>
      <p className="text-sm text-muted mb-6">See every option for a concern, from daily skincare to procedures, with the research behind each.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
          <a key={g} href={`/goals/${g}`} className="tile">
            <span className="font-medium">{GOAL_LABELS[g]}</span>
            <span className="block text-xs text-muted mt-0.5">{PROCEDURES.filter((p) => p.goals.includes(g)).length} options</span>
          </a>
        ))}
      </div>
    </section>
  );
}
