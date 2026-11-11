"use client";
import { useState } from "react";

const PROTOTYPE = process.env.NEXT_PUBLIC_PROTOTYPE === "1";

/** Short feedback box. On the website it sends to /api/feedback; in the shared prototype it helps people post a comment. */
export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "copied" | "error">("idle");
  const [error, setError] = useState("");

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="underline">
        Send feedback
      </button>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 3) return;
    if (PROTOTYPE) {
      // Copy in the background; some browsers never resolve the clipboard request.
      try {
        navigator.clipboard?.writeText(message.trim()).catch(() => {});
      } catch {}
      setStatus("copied");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email, website, page: location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "sent") return <p className="text-sm text-ink">Thank you — your feedback was sent.</p>;
  if (status === "copied")
    return (
      <p className="text-sm text-ink text-left">
        Copied. In this prototype, please paste it as a <strong>comment</strong> using the page&apos;s Comment button (top of
        the screen) so the owner sees it.
      </p>
    );

  return (
    <form onSubmit={submit} className="text-left space-y-2 rounded-2xl bg-white border border-line p-4 text-ink animate-in">
      <label className="block">
        <span className="block text-sm font-medium mb-1">What could be better?</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
          rows={4}
          required
          className="w-full rounded-xl border border-line px-3 py-2 text-sm focus:outline-none focus:border-ink"
          placeholder="Anything confusing, missing or wrong?"
        />
      </label>
      {!PROTOTYPE && (
        <label className="block">
          <span className="block text-xs text-muted mb-1">Email (optional, only if you want a reply)</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value.slice(0, 254))} className="w-full rounded-full border border-line px-4 py-2 text-sm focus:outline-none focus:border-ink" />
        </label>
      )}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <p className="text-[11px] text-muted">Please don&apos;t include health details or other personal information.</p>
      <button type="submit" disabled={message.trim().length < 3 || status === "sending"} className="btn-main text-sm py-2.5">
        {PROTOTYPE ? "Copy my feedback" : status === "sending" ? "Sending…" : "Send feedback"}
      </button>
      {status === "error" && <p role="alert" className="text-xs">{error}</p>}
    </form>
  );
}
