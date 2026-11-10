import { CAUTIONS } from "@/lib/cautions";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, PAIN_LABELS, RESULT_LABELS } from "@/lib/procedures";
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
    <span className="inline-block text-[11px] font-medium rounded-full bg-blush px-2.5 py-1 mb-3">
      {APPROACHES[p.approach].short}
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

export function MoreFacts({ p }: { p: Procedure }) {
  return (
    <dl className="space-y-2.5 text-sm">
      <div><dt className="text-[11px] text-muted">How it works</dt><dd>{APPROACHES[p.approach].label}</dd></div>
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
