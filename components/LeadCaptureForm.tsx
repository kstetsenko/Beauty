"use client";
import { useState } from "react";
import type { City } from "@/lib/types";

export const CONSENT_TEXT =
  "I agree to receive educational guides and updates. My data is handled securely in compliance with privacy standards and will never be sold.";

interface Props {
  city: City;
  /** Procedure ids from the results. Health answers are never sent. */
  procedureIds: string[];
}

export function LeadCaptureForm({ city, procedureIds }: Props) {
  const [email, setEmail] = useState("");
  const [consented, setConsented] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consented || !email || status === "sending") return;
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent: true, consentText: CONSENT_TEXT, city, procedureIds, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200" noValidate={false}>
      <h3 className="font-medium text-neutral-900 mb-1">Save Your Procedure Guide</h3>
      <p className="text-xs text-neutral-500 mb-4">
        Get your personalized breakdown sent straight to your inbox. We only send the procedure names and your city —
        never your health answers.
      </p>

      <label htmlFor="lead-email" className="sr-only">Email address</label>
      <input
        id="lead-email"
        type="email"
        autoComplete="email"
        inputMode="email"
        maxLength={254}
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"
      />

      {/* Honeypot: hidden from people, often filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-neutral-900"
          required
        />
        <span className="text-xs text-neutral-600 leading-normal">
          {CONSENT_TEXT} You can unsubscribe at any time. See our{" "}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </span>
      </label>

      <button
        type="submit"
        disabled={!consented || status === "sending" || status === "success"}
        className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-all"
      >
        {status === "success" ? "Saved Successfully ✓" : status === "sending" ? "Sending…" : "Send My Guide"}
      </button>
      <p role="status" aria-live="polite" className="text-xs mt-2 min-h-[1rem] text-red-700">
        {status === "error" ? message : ""}
      </p>
    </form>
  );
}
