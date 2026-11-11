"use client";
import { useState } from "react";
import { LEAD_CONSENT } from "@/lib/clinics";
import { PROCEDURES } from "@/lib/procedures";
import type { Clinic } from "@/lib/types";

const PROTO = process.env.NEXT_PUBLIC_PROTOTYPE === "1";
const field = "w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-ink";

/**
 * Consultation request to one partner clinic. Sends only what the person types here,
 * never quiz or health answers. Returns a reference number that the person and the
 * clinic both see, so the referral can be traced.
 */
export function LeadRequestForm({ clinic, treatment }: { clinic: Clinic; treatment: string }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", when: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<{ s: "idle" | "sending" | "done" | "error"; ref?: string; msg?: string }>({ s: "idle" });
  const tname = PROCEDURES.find((p) => p.id === treatment)?.name ?? "a consultation";
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || state.s === "sending") return;
    if (PROTO) return setState({ s: "done", ref: "AG-DEMO00" });
    setState({ s: "sending" });
    try {
      let tab = "";
      try { tab = sessionStorage.getItem("ag_tab") ?? ""; } catch { /* private mode */ }
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, clinic: clinic.id, treatment, consent: true, tab }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState({ s: "done", ref: data.ref });
    } catch (err) {
      setState({ s: "error", msg: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    }
  }

  if (state.s === "done") {
    return (
      <div className="rounded-2xl bg-blush p-4 mt-3 text-sm animate-in" role="status">
        <p className="font-medium">Request sent to {clinic.name} ✓</p>
        <p className="mt-1">Your reference: <strong className="tracking-wide">{state.ref}</strong></p>
        <p className="text-xs text-muted mt-1">
          {PROTO ? "Prototype — nothing was sent. " : ""}The clinic will contact you. Mention this reference when you book.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2.5 animate-in">
      <p className="text-xs text-muted">About {tname} at {clinic.name}. Don&apos;t include health details here — discuss them with the clinic.</p>
      <label className="block"><span className="sr-only">Your name</span>
        <input required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" value={f.name} onChange={set("name")} className={field} />
      </label>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <label className="block min-w-0"><span className="sr-only">Email</span>
          <input type="email" maxLength={120} autoComplete="email" placeholder="Email" value={f.email} onChange={set("email")} className={field} />
        </label>
        <label className="block min-w-0"><span className="sr-only">Phone</span>
          <input type="tel" maxLength={30} autoComplete="tel" placeholder="Phone" value={f.phone} onChange={set("phone")} className={field} />
        </label>
      </div>
      <label className="block"><span className="sr-only">Best time to reach you</span>
        <input maxLength={80} placeholder="Best time to reach you (optional)" value={f.when} onChange={set("when")} className={field} />
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} /></label>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-0.5 h-5 w-5 shrink-0 accent-ink" />
        <span className="text-xs text-muted leading-normal">{LEAD_CONSENT} <a href="/privacy" className="underline">Privacy</a></span>
      </label>
      <button type="submit" disabled={!consent || !f.name || (!f.email && !f.phone) || state.s === "sending"} className="btn-main w-full text-sm">
        {state.s === "sending" ? "Sending…" : "Send request"}
      </button>
      <p className="text-[11px] text-muted text-center">Add an email or a phone number.</p>
      {state.s === "error" && <p role="alert" className="text-xs text-center">{state.msg}</p>}
    </form>
  );
}
