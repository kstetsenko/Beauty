import { CAUTIONS } from "@/lib/cautions";
import { downtimeShort, usd } from "@/lib/match";
import { APPROACHES, ONSET_LABELS, PAIN_LABELS, RESULT_LABELS } from "@/lib/procedures";
import { SAFETY } from "@/lib/safety";
import { LEARN } from "@/lib/learn";
import { VIDEOS } from "@/lib/videos";
import { Disclosure } from "./Disclosure";
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

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt className="text-[11px] text-muted">{label}</dt>
    <dd className="text-sm">{children}</dd>
  </div>
);

const ExtLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm underline decoration-line underline-offset-2 hover:decoration-ink">
    {children} ↗
  </a>
);

/**
 * Everything beyond the four key facts, split into tap-to-open sections so
 * people open only what they want. Used on the swipe card and the procedure page.
 */
export function DetailSections({ p, city, withPrice = true }: { p: Procedure; city: City; withPrice?: boolean }) {
  const r = RESEARCH[p.id];
  const safety = SAFETY[p.id];
  const seen = new Set<string>();
  const prices = r.prices.filter((x) => (!x.city || x.city === city) && !seen.has(x.url) && seen.add(x.url));
  const learn = [...(LEARN[p.id] ?? []), ...(safety?.links ?? [])];

  return (
    <div className="rounded-2xl bg-white border border-line">
      <Disclosure tone="plain" title="How it works" hint={APPROACHES[p.approach].label}>
        <dl className="space-y-2.5">
          <Row label="In short">{APPROACHES[p.approach].hint}.</Row>
          {p.aka && <Row label="Also called">{p.aka.join(" · ")}</Row>}
          <Row label="Sessions">{p.sessions}</Row>
          <Row label="Who does it">{p.performedBy}</Row>
          {p.minAge && <Row label="Age">FDA-authorized for adults {p.minAge} and older.</Row>}
        </dl>
      </Disclosure>

      <Disclosure tone="plain" title="Results & recovery" hint={`Results ${ONSET_LABELS[p.onset].toLowerCase()}`}>
        <dl className="space-y-2.5">
          <Row label="When you'll see results">{r.resultsIn}</Row>
          <Row label="How long it lasts">{p.lasts}</Row>
          <Row label="Good to know">{p.notes}</Row>
        </dl>
      </Disclosure>

      <Disclosure tone="plain" title="Side effects & safety" hint={safety ? "Includes rare but serious risks" : "Common side effects"}>
        <dl className="space-y-2.5">
          <Row label="Common">{r.sideEffects}</Row>
          {safety && <Row label="Rare but serious">{safety.serious}</Row>}
          {safety?.getHelpIf && (
            <Row label="Get medical help right away if">{safety.getHelpIf}</Row>
          )}
          <Row label="Not usually advised with">{p.contraindications.length ? p.contraindications.map((c) => CAUTIONS[c].short).join(" · ") : "None listed — ask your provider"}</Row>
        </dl>
      </Disclosure>

      <Disclosure
        tone="plain"
        title="What the research says"
        hint={<span className="inline-flex items-center gap-2"><Dots value={r.evidence} max={3} label="Evidence" /> {EVIDENCE_LABELS[r.evidence]} evidence</span>}
      >
        <p className="text-sm mb-3">{r.evidenceNote}</p>
        {r.studies.length > 0 ? (
          <ul className="space-y-3">
            {r.studies.map((st) => (
              <li key={st.url}>
                <ExtLink href={st.url}>{st.title}</ExtLink>
                <span className="block text-[11px] text-muted mt-0.5">{st.kind} · PubMed</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">No published clinical studies found.</p>
        )}
        <p className="text-[11px] text-muted mt-3">
          Many studies are small or funded by the product&apos;s maker. Research describes groups of people, not you.
        </p>
      </Disclosure>

      {withPrice && (
        <Disclosure tone="plain" title="About the price" hint={priceChecked(p.id, city) ? "From published clinic prices" : "Estimate"}>
          {r.unitPrice && <p className="text-sm mb-2">Per unit: {r.unitPrice[city]}</p>}
          <p className="text-sm mb-2">
            {priceChecked(p.id, city)
              ? `Based on prices published by clinics or RealSelf patient reports, checked ${CHECKED}.`
              : `No clinic in this city publishes a price online, so this is an estimate (checked ${CHECKED}).`}
          </p>
          {prices.length > 0 && (
            <ul className="space-y-1.5">
              {prices.map((x) => <li key={x.url}><ExtLink href={x.url}>{x.label}</ExtLink></li>)}
            </ul>
          )}
          <p className="text-[11px] text-muted mt-2">May not include numbing, consultation fees or touch-ups. A price far below others is a red flag.</p>
        </Disclosure>
      )}

      <Disclosure tone="plain" title="Questions to ask your provider" hint="6 questions">
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          {CONSULT_QUESTIONS.map((q) => <li key={q}>{q}</li>)}
        </ol>
      </Disclosure>

      <Disclosure tone="plain" title="Learn more & videos" hint="AAD, ASPS and FDA guides">
        <ul className="space-y-2">
          {learn.map((l) => <li key={l.url}><ExtLink href={l.url}>{l.label}</ExtLink></li>)}
          {(VIDEOS[p.id] ?? []).map((v) => (
            <li key={v.url}>
              <ExtLink href={v.url}>{v.title}</ExtLink>
              <span className="block text-[11px] text-muted">Video · {v.presenter} · checked {v.checked}</span>
            </li>
          ))}
          <li>
            <ExtLink href={`https://www.youtube.com/results?search_query=${encodeURIComponent(p.name.split(" / ")[0] + " dermatologist explains")}`}>
              Explainer videos on YouTube
            </ExtLink>
            <span className="block text-[11px] text-muted">A YouTube search — not reviewed by us. Check the presenter is a board-certified doctor.</span>
          </li>
        </ul>
      </Disclosure>
    </div>
  );
}

function lastsShort(s: string) {
  const t = s.split(";")[0].replace(/^Up to about /i, "up to ~").replace(/^About /i, "~");
  return t.charAt(0).toLowerCase() + t.slice(1);
}
