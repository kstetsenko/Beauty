"use client";
import { useEffect, useState } from "react";
import { PROCEDURES } from "@/lib/procedures";
import type { Clinic } from "@/lib/types";
import { TrackedLink } from "./TrackedLink";

const fmt = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** One clinic with traceable ways to get in touch. No personal details are collected. */
const LIVE_RATINGS = process.env.NEXT_PUBLIC_RATINGS === "1";
const short = (id: string) => PROCEDURES.find((p) => p.id === id)?.name.split(" / ")[0].split(" (")[0] ?? id;

export function ClinicCard({ c, treatment, list = [] }: { c: Clinic; treatment: string; list?: string[] }) {
  const ev = { clinic: c.id, treatment, city: c.city };
  const [live, setLive] = useState<{ rating: number; count: number | null } | null>(null);
  useEffect(() => {
    if (!LIVE_RATINGS) return;
    fetch(`/api/rating?id=${encodeURIComponent(c.id)}`).then((r) => (r.status === 200 ? r.json() : null)).then(setLive).catch(() => {});
  }, [c.id]);
  const alsoOffers = list.filter((id) => id !== treatment && c.offers.includes(id));
  return (
    <li className="rounded-3xl bg-white border border-line p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-medium min-w-0">{c.name}</p>
        {c.partner && <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">Partner</span>}
      </div>
      <p className="text-xs text-muted">{c.kind} · {c.neighborhood}</p>
      {c.address && <p className="text-xs text-muted">{c.address}</p>}
      <p className="text-xs mt-1.5">
        ✓ {c.credential}{" "}
        <a href={c.credentialSource} target="_blank" rel="noopener noreferrer" className="text-muted underline">as stated by the source</a>
        <span className="text-muted"> · checked {fmt(c.checkedAt)}</span>
      </p>
      {live && (
        <p className="text-sm mt-1">
          {live.rating.toFixed(1)} ★{live.count !== null && ` (${live.count.toLocaleString("en-US")} reviews)`}
          <span className="text-[11px] text-muted"> · live from Google</span>
        </p>
      )}
      {alsoOffers.length > 0 && <p className="text-xs mt-1.5">Also offers from your list: {alsoOffers.map(short).join(", ")}</p>}
      <p className="text-[11px] text-muted mt-1.5">
        Who does the treatment varies by clinic. You can ask who will treat you and look up their license.
      </p>
      {!live && c.rating !== null && c.ratingCheckedAt && (
        <p className="text-sm mt-1">
          {c.rating.toFixed(1)} ★{c.reviewCount !== null && ` (${c.reviewCount.toLocaleString("en-US")} Google reviews)`}
          <span className="text-[11px] text-muted"> · checked {c.ratingCheckedAt}</span>
        </p>
      )}
      <div className="rounded-2xl bg-sand px-3 py-2 mt-3 text-xs">
        When you book, mention code <strong className="tracking-wide">{c.code}</strong> so they know you found them here.
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
        <TrackedLink href={c.website} tag ev={{ ...ev, kind: "site" }} className="btn-soft text-center">Website</TrackedLink>
        {c.bookingUrl ? (
          <TrackedLink href={c.bookingUrl} tag ev={{ ...ev, kind: "book" }} className="btn-soft text-center">Book online</TrackedLink>
        ) : c.phone ? (
          <TrackedLink href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} ev={{ ...ev, kind: "call" }} className="btn-soft text-center">Call</TrackedLink>
        ) : (
          <TrackedLink href={c.googleUrl} ev={{ ...ev, kind: "directions" }} className="btn-soft text-center">Directions</TrackedLink>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-2.5">
        <TrackedLink href={c.googleUrl} ev={{ ...ev, kind: "reviews" }} className="underline">Google reviews</TrackedLink>
        {(c.bookingUrl || c.phone) && <TrackedLink href={c.googleUrl} ev={{ ...ev, kind: "directions" }} className="underline">Directions</TrackedLink>}
        {c.bookingUrl && c.phone && <TrackedLink href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} ev={{ ...ev, kind: "call" }} className="underline">Call {c.phone}</TrackedLink>}
      </div>
    </li>
  );
}
