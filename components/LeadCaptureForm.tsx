"use client";
import { useState } from "react";
import type { City } from "@/lib/types";

export const CONSENT_TEXT =
  "I agree to receive educational guides and updates. My data is handled securely in compliance with privacy standards and will never be sold.";

interface Props {
  city: City;
  /** Saved procedure ids. Health answers are never sent. */
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
    if (process.env.NEXT_PUBLIC_PROTOTYPE === "1") {
      // Shareable prototype: there is no server, so nothing is sent.
      setStatus("success");
      return;
    }
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent: true, consentText: CONSENT_TEXT, city, procedureIds, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <p className="rounded-3xl bg-blush p-5 text-center text-sm font-medium animate-in">
        {process.env.NEXT_PUBLIC_PROTOTYPE === "1" ? "Prototype — in the live app this would email your guide. Nothing was sent." : "Sent ✓ Check your inbox."}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-line p-5 space-y-4 animate-in">
      <label htmlFor="lead-email" className="sr-only">Email address</label>
      <input
        id="lead-email"
        type="email"
        autoComplete="email"
        inputMode="email"
        maxLength={254}
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-full border border-line px-5 py-3 text-sm focus:outline-none focus:border-ink"
      />

      {/* Honeypot: hidden from people, often filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
          required
        />
        <span className="text-xs text-muted leading-normal">
          {CONSENT_TEXT} Unsubscribe anytime. <a href="/privacy" className="underline">Privacy</a>
        </span>
      </label>

      <button type="submit" disabled={!consented || !email || status === "sending"} className="btn-main">
        {status === "sending" ? "Sending…" : "Send my list"}
      </button>
      {status === "error" && <p role="alert" className="text-xs text-center">{message}</p>}
    </form>
  );
}
