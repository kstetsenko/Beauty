import { CAUTIONS } from "@/lib/cautions";
import { usd, type Match } from "@/lib/match";
import type { City } from "@/lib/types";

const TIER = ["", "$", "$$", "$$$"];

export function ProcedureCard({ match, city }: { match: Match; city: City }) {
  const p = match.procedure;
  const [lo, hi] = p.cost[city];
  const flagged = new Set(match.flagged);

  return (
    <article className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
      {match.flagged.length > 0 && (
        <div role="note" className="mb-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800">
          <strong>⚠ Talk to a doctor first:</strong> you noted something that is often a reason to avoid or delay this
          procedure ({match.flagged.map((c) => CAUTIONS[c].short).join(", ")}).
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-lg leading-snug">{p.name}</h3>
        <span className="shrink-0 text-xs font-semibold rounded-full bg-neutral-100 px-2.5 py-1">{TIER[p.tier]}</span>
      </div>
      <p className="text-sm text-neutral-600 mb-4">{p.summary}</p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm mb-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Typical cost per session*</dt>
          <dd className="font-medium">{usd(lo)} – {usd(hi)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Downtime</dt>
          <dd className="font-medium">{p.downtimeLabel}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Sessions</dt>
          <dd>{p.sessions}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Who should perform it</dt>
          <dd>{p.performedBy}</dd>
        </div>
      </dl>

      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1.5">Not usually recommended with</p>
        <ul className="flex flex-wrap gap-1.5">
          {p.contraindications.map((c) => (
            <li
              key={c}
              className={
                "text-xs rounded-full px-2.5 py-1 border " +
                (flagged.has(c) ? "bg-red-100 border-red-300 text-red-800 font-semibold" : "bg-amber-50 border-amber-200 text-amber-900")
              }
            >
              ⚠ {CAUTIONS[c].short}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-neutral-500">{p.notes}</p>
    </article>
  );
}
