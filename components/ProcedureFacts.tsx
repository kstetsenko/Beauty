import { CAUTIONS } from "@/lib/cautions";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, ONSET_LABELS, PAIN_LABELS, RESULT_LABELS } from "@/lib/procedures";
import { SAFETY } from "@/lib/safety";
import { LEARN } from "@/lib/learn";
import { CONSULT_QUESTIONS, CHECKED, EVIDENCE_LABELS, RESEARCH, priceChecked } from "@/lib/research";
import type { City, Procedure } from "@/lib/types";

export function Dots({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <span className="flex items-center gap-1" role="img" aria-label={`${label}: ${value} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={"h-1.5 w-4 rounded-full " + (i < value ? "bg-ink" : "bg-line")} />
      ))}
    </span>
  );
}

export function ApproachTag({ p }: { p: Procedure }) {
  return (
    <span className="flex flex-wrap gap-1.5 mb-3">
      <span className="text-[11px] font-medium rounded-full bg-blush px-2.5 py-1">{APPROACHES[p.approach].label}</span>
      <span className="text-[11px] rounded-full border border-line px-2.5 py-1">Results: {ONSET_LABELS[p.onset].toLowerCase()}</span>
    </span>
  );
}

/** The four key numbers: price, recovery, pain, results. */
export function KeyFacts({ p, city }: { p: Procedure; city: City }) {
  const [lo, hi] = p.cost[city];
  return (
    <dl className="grid grid-cols-2 gap-2.5">
      <div className="rounded-2xl bg-sand p-3">
        <dt className="text-[11px] text-muted">Price*</dt>
        <dd className="font-semibold">{usd(lo)}–{usd(hi).replace("$", "")}</dd>
        <dd className="text-[11px] text-muted">{p.priceUnit}</dd>
        <dd className="text-[11px] text-muted mt-0.5">{priceChecked(p.id, city) ? "✓ From clinic prices" : "Estimate"}</dd>
      </div>
      <div className="rounded-2xl bg-sand p-3">
        <dt className="text-[11px] text-muted">Recovery</dt>
        <dd className="font-semibold">{downtimeShort(p.downtimeDays)}</dd>
        <dd className="text-[11px] text-muted">Lasts {lastsShort(p.lasts)}</dd>
      </div>
      <div className="rounded-2xl bg-sand p-3">
        <dt className="text-[11px] text-muted mb-1.5">Pain</dt>
        <dd><Dots value={p.pain} max={5} label="Pain" /></dd>
        <dd className="text-[11px] text-muted mt-1">{PAIN_LABELS[p.pain]}</dd>
      </div>
      <div className="rounded-2xl bg-sand p-3">
        <dt className="text-[11px] text-muted mb-1.5">Results</dt>
        <dd><Dots value={p.results} max={3} label="Results" /></dd>
        <dd className="text-[11px] text-muted mt-1">{RESULT_LABELS[p.results]}</dd>
      </div>
    </dl>
  );
}

export function MoreFacts({ p, city }: { p: Procedure; city: City }) {
  const r = RESEARCH[p.id];
  return (
    <dl className="space-y-2.5 text-sm">
      <div><dt className="text-[11px] text-muted">How it works</dt><dd>{APPROACHES[p.approach].label} — {APPROACHES[p.approach].hint.charAt(0).toLowerCase() + APPROACHES[p.approach].hint.slice(1)}.</dd></div>
      <div><dt className="text-[11px] text-muted">When you&apos;ll see results</dt><dd>{r.resultsIn}</dd></div>
      <div><dt className="text-[11px] text-muted">Common side effects</dt><dd>{r.sideEffects}</dd></div>
      {SAFETY[p.id] && (
        <div>
          <dt className="text-[11px] text-muted">Rare but serious</dt>
          <dd>{SAFETY[p.id].serious}</dd>
          {SAFETY[p.id].getHelpIf && <dd className="mt-1"><strong className="font-medium">Get medical help right away if:</strong> {SAFETY[p.id].getHelpIf}</dd>}
        </div>
      )}
      {p.minAge && <div><dt className="text-[11px] text-muted">Age</dt><dd>FDA-authorized for adults {p.minAge} and older.</dd></div>}
      {r.unitPrice && <div><dt className="text-[11px] text-muted">Price per unit</dt><dd>{r.unitPrice[city]}</dd></div>}
      <div>
        <dt className="text-[11px] text-muted mb-1">Research behind it</dt>
        <dd className="flex items-center gap-2"><Dots value={r.evidence} max={3} label="Evidence" /> <span>{EVIDENCE_LABELS[r.evidence]} evidence</span></dd>
        <dd className="text-muted text-xs mt-1">{r.evidenceNote}</dd>
      </div>
      <div><dt className="text-[11px] text-muted">Sessions</dt><dd>{p.sessions}</dd></div>
      <div><dt className="text-[11px] text-muted">How long it lasts</dt><dd>{p.lasts}</dd></div>
      <div><dt className="text-[11px] text-muted">Who does it</dt><dd>{p.performedBy}</dd></div>
      <div>
        <dt className="text-[11px] text-muted">Not usually advised with</dt>
        <dd>{p.contraindications.map((c) => CAUTIONS[c].short).join(" · ")}</dd>
      </div>
      <div><dt className="text-[11px] text-muted">Good to know</dt><dd>{p.notes}</dd></div>
    </dl>
  );
}

function lastsShort(s: string) {
  const t = s.split(";")[0].replace(/^Up to about /i, "up to ~").replace(/^About /i, "~");
  return t.charAt(0).toLowerCase() + t.slice(1);
}

/** Studies, price sources and consultation questions (procedure page). */
export function ResearchSection({ p, city }: { p: Procedure; city: City }) {
  const r = RESEARCH[p.id];
  const seen = new Set<string>();
  const prices = r.prices.filter((x) => (!x.city || x.city === city) && !seen.has(x.url) && seen.add(x.url));
  return (
    <div className="space-y-4">
      {(LEARN[p.id]?.length || SAFETY[p.id]) && (
        <section className="bg-white rounded-3xl border border-line p-6">
          <h2 className="font-semibold mb-1">Learn more</h2>
          <p className="text-xs text-muted mb-3">Plain-language guides from medical organizations and the FDA.</p>
          <ul className="space-y-2">
            {[...(LEARN[p.id] ?? []), ...(SAFETY[p.id]?.links ?? [])].map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm underline decoration-line underline-offset-2 hover:decoration-ink">{l.label} ↗</a>
              </li>
            ))}
          </ul>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(p.name.split(" / ")[0] + " dermatologist explains")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm underline mt-3"
          >
            Watch explainer videos on YouTube ↗
          </a>
          <p className="text-[11px] text-muted">A YouTube search — videos are not reviewed by us. Check the presenter is a board-certified doctor.</p>
        </section>
      )}
      <section className="bg-white rounded-3xl border border-line p-6">
        <h2 className="font-semibold mb-1">What the research says</h2>
        <p className="flex items-center gap-2 text-sm mb-1"><Dots value={r.evidence} max={3} label="Evidence" /> {EVIDENCE_LABELS[r.evidence]} evidence</p>
        <p className="text-sm text-muted mb-4">{r.evidenceNote}</p>
        {r.studies.length > 0 ? (
          <ul className="space-y-3">
            {r.studies.map((st) => (
              <li key={st.url}>
                <a href={st.url} target="_blank" rel="noopener noreferrer" className="text-sm underline decoration-line underline-offset-2 hover:decoration-ink">{st.title}</a>
                <span className="block text-[11px] text-muted mt-0.5">{st.kind} · PubMed ↗</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">No published clinical studies found.</p>
        )}
        <p className="text-[11px] text-muted mt-4">
          Links open the study summary on PubMed (U.S. National Library of Medicine). Many studies are small or funded by the
          product&apos;s maker. Research describes groups of people, not you — ask your provider what applies to your skin.
        </p>
      </section>

      <section className="bg-white rounded-3xl border border-line p-6">
        <h2 className="font-semibold mb-1">Where the price comes from</h2>
        <p className="text-sm text-muted mb-3">
          {priceChecked(p.id, city)
            ? `Based on prices published by clinics or RealSelf patient reports, checked ${CHECKED}.`
            : `No clinic in this city publishes a price online, so this is an estimate (checked ${CHECKED}).`}
        </p>
        {prices.length > 0 && (
          <ul className="space-y-2">
            {prices.map((x) => (
              <li key={x.url}>
                <a href={x.url} target="_blank" rel="noopener noreferrer nofollow" className="text-sm underline decoration-line underline-offset-2 hover:decoration-ink">{x.label} ↗</a>
              </li>
            ))}
          </ul>
        )}
        <p className="text-[11px] text-muted mt-3">
          Prices change often and may not include numbing, consultation fees or touch-ups. Sources are listed for reference
          only and are not endorsements.
        </p>
      </section>

      <section className="bg-white rounded-3xl border border-line p-6">
        <h2 className="font-semibold mb-3">Questions to ask at your consultation</h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          {CONSULT_QUESTIONS.map((q) => <li key={q}>{q}</li>)}
        </ol>
        <p className="text-[11px] text-muted mt-3">A price far below others is a red flag — it can mean diluted or non-genuine product.</p>
      </section>
    </div>
  );
}
