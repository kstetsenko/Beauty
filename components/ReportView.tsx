"use client";
import { useState } from "react";

type ClinicRow = { id: string; name: string; code: string; visitors: number; website: number; booking: number; calls: number; directions: number; reviews: number; treatments: [string, number][] };
type Report = { month: string; totals: { taps: number; searches: number; visitors: number }; clinics: ClinicRow[]; demand: [string, number][] };

const thisMonth = () => new Date().toISOString().slice(0, 7);
const cell = (v: unknown) => {
  const s = String(v ?? "");
  return `"${(/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`; // guards against spreadsheet formulas
};

function download(name: string, rows: unknown[][]) {
  const csv = "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Owner-only: monthly referral numbers per partner clinic, to send with each invoice. */
export function ReportView() {
  const [key, setKey] = useState("");
  const [month, setMonth] = useState(thisMonth());
  const [rep, setRep] = useState<Report | null>(null);
  const [err, setErr] = useState("");

  async function load(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch(`/api/report?month=${month}`, { headers: { "x-report-key": key } }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    if (!res?.ok) return setErr(data?.error || "Couldn't load the report.");
    setRep(data);
  }

  return (
    <section className="animate-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1.5">Referral report</h1>
        <p className="text-sm text-muted">For the owner only. Shows what this guide sent each clinic in a month: visitors and taps on website, booking, call, directions and reviews. No personal details are collected. Ask clinics how many people mentioned their booking code.</p>
      </div>
      <form onSubmit={load} className="grid gap-3 sm:grid-cols-[1fr_auto_auto] items-end">
        <label className="block min-w-0">
          <span className="block text-xs text-muted mb-1">Report key</span>
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="current-password" required
            className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-ink" />
        </label>
        <label className="block min-w-0">
          <span className="block text-xs text-muted mb-1">Month</span>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} required
            className="w-full rounded-full border border-line bg-white px-4 py-2 text-sm focus:outline-none focus:border-ink" />
        </label>
        <button type="submit" className="btn-main text-sm">Show</button>
      </form>
      {err && <p role="alert" className="text-sm">{err}</p>}

      {rep && (
        <>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[["Visitors", rep.totals.visitors], ["Clinic searches", rep.totals.searches], ["Clinic taps", rep.totals.taps]].map(([l, v]) => (
              <div key={l} className="rounded-2xl bg-white border border-line p-3">
                <p className="text-xl font-semibold">{v}</p>
                <p className="text-[11px] text-muted">{l}</p>
              </div>
            ))}
          </div>

          {rep.clinics.length === 0 ? (
            <p className="text-sm text-muted">No clinic taps this month yet.</p>
          ) : (
            rep.clinics.map((c) => (
              <div key={c.id} className="rounded-3xl bg-white border border-line p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-semibold min-w-0">{c.name}</h2>
                  <button type="button" className="text-sm underline shrink-0"
                    onClick={() => download(`referrals-${c.id}-${rep.month}.csv`, [
                      ["Clinic", c.name], ["Booking code", c.code], ["Month", rep.month], ["Visitors", c.visitors], ["Website taps", c.website],
                      ["Booking taps", c.booking], ["Call taps", c.calls], ["Directions taps", c.directions], ["Reviews taps", c.reviews], [],
                      ["Treatment", "Taps"], ...c.treatments,
                    ])}>
                    CSV
                  </button>
                </div>
                <p className="text-sm text-muted mt-1">
                  {c.visitors} visitors · {c.website} website · {c.booking} booking · {c.calls} call · {c.directions} directions · {c.reviews} reviews taps · code {c.code}
                </p>
                {c.treatments.length > 0 && <p className="text-xs text-muted mt-1">By treatment: {c.treatments.map(([t, n]) => `${t} ${n}`).join(", ")}</p>}
              </div>
            ))
          )}

          {rep.demand.length > 0 && (
            <div>
              <h2 className="font-semibold mb-1">What people searched for</h2>
              <p className="text-xs text-muted mb-2">City | treatment | neighborhood — useful when inviting new partner clinics.</p>
              <ul className="text-sm space-y-1">
                {rep.demand.map(([k, n]) => <li key={k} className="break-words">{n} × {k}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
