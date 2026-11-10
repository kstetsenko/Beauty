"use client";
import { useEffect, useState } from "react";

/** Bump when the notice text changes so everyone sees it again. */
const KEY = "disclaimer_acknowledged_v2";

export function DisclaimerModal() {
  // Open by default (including the server render) so content is never
  // reachable before the notice; closes at once for returning users.
  const [isOpen, setIsOpen] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) setIsOpen(false);
    } catch {}
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const agree = () => {
    if (!confirmed) return;
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {}
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dm-title"
        aria-describedby="dm-body"
        className="max-w-sm w-full bg-white rounded-3xl p-6 shadow-xl animate-in"
      >
        <h2 id="dm-title" className="text-lg font-semibold mb-2">Before you start</h2>
        <p id="dm-body" className="text-sm text-muted leading-relaxed mb-5">
          This guide is for education only. It isn&apos;t medical advice. Always see a board-certified dermatologist
          before any procedure.
        </p>
        <label className="flex items-start gap-3 text-sm mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
          />
          <span>
            I&apos;m 18+ and agree to the <a href="/terms" className="underline">Terms</a> and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </span>
        </label>
        <button onClick={agree} disabled={!confirmed} className="btn-main">
          I understand
        </button>
      </div>
    </div>
  );
}
