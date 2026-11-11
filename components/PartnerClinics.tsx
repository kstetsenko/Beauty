"use client";
import { useState } from "react";
import { PARTNER_NOTE, partnersFor } from "@/lib/clinics";
import type { City, Clinic } from "@/lib/types";
import { TrackedLink } from "./TrackedLink";
import { LeadRequestForm } from "./LeadRequestForm";

/** Partner clinics for a treatment, each with traceable ways to get in touch. Renders nothing if there are none. */
export function PartnerClinics({ city, treatment, area = "" }: { city: City; treatment: string; area?: string }) {
  const list = partnersFor(city, [treatment], area);
  if (list.length === 0) return null;
  return (
    <div className="mt-4">
      <p className="text-xs font-medium mb-2">Partner clinics offering this</p>
      <ul className="space-y-2.5">
        {list.map((c) => <PartnerCard key={c.id} c={c} treatment={treatment} />)}
      </ul>
      <p className="text-[11px] text-muted mt-2">{PARTNER_NOTE}</p>
    </div>
  );
}

function PartnerCard({ c, treatment }: { c: Clinic; treatment: string }) {
  const [open, setOpen] = useState(false);
  const ev = { clinic: c.id, treatment, city: c.city };
  return (
    <li className="rounded-3xl bg-white border border-line p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-medium min-w-0">{c.name}</p>
        <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">Partner</span>
      </div>
      <p className="text-xs text-muted">{c.neighborhood} · {c.credential}</p>
      {c.rating !== null && c.ratingCheckedAt && (
        <p className="text-sm mt-1">
          {c.rating.toFixed(1)} ★{c.reviewCount !== null && ` (${c.reviewCount.toLocaleString("en-US")} Google reviews)`}
          <span className="text-[11px] text-muted"> · checked {c.ratingCheckedAt}</span>
        </p>
      )}
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="btn-main w-full text-sm mt-3">
        Request a consultation
      </button>
      {open && <LeadRequestForm clinic={c} treatment={treatment} />}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-3">
        <TrackedLink href={c.website} tag ev={{ ...ev, kind: "site" }} className="underline">Website ↗</TrackedLink>
        {c.bookingUrl && <TrackedLink href={c.bookingUrl} tag ev={{ ...ev, kind: "book" }} className="underline">Book online ↗</TrackedLink>}
        {c.phone && <TrackedLink href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} ev={{ ...ev, kind: "call" }} className="underline">Call {c.phone}</TrackedLink>}
        <a href={c.googleUrl} target="_blank" rel="noopener noreferrer nofollow" className="underline">Google reviews ↗</a>
      </div>
    </li>
  );
}
