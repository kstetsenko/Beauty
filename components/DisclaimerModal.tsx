"use client";
import { useEffect, useRef, useState } from "react";

/** Bump when the notice text changes so everyone sees it again. */
const KEY = "disclaimer_acknowledged_v1";

export function DisclaimerModal() {
  // Open by default (including the server render) so content is never
  // reachable before the notice; closes at once for returning users.
  const [isOpen, setIsOpen] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const boxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) setIsOpen(false);
    } catch {
      /* storage blocked: keep asking each visit */
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    boxRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleAcknowledge = () => {
    if (!confirmed) return;
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        aria-describedby="disclaimer-body"
        className="max-w-md w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 shadow-2xl border border-neutral-100"
      >
        <h2 id="disclaimer-title" className="text-xl font-semibold text-neutral-900 mb-2">
          Educational Notice & Terms
        </h2>
        <div id="disclaimer-body" className="text-sm text-neutral-600 mb-4 leading-relaxed space-y-2">
          <p>
            This platform is an independent educational directory. It does <strong>not</strong> provide medical
            advice, diagnosis, or treatment, and it does not endorse any provider.
          </p>
          <p>
            Always consult a board-certified dermatologist or licensed practitioner before undergoing any aesthetic
            procedure. Prices shown are general estimates, not quotes.
          </p>
          <p>If you have a medical emergency, call 911.</p>
        </div>
        <label className="flex items-start gap-2.5 bg-neutral-50 p-3 rounded-lg text-xs text-neutral-600 mb-5 cursor-pointer">
          <input
            ref={boxRef}
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-neutral-900"
          />
          <span>
            I am 18 or older and I understand this app is for informational and educational discovery only. I agree
            to the <a href="/terms" className="underline">Terms</a> and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </span>
        </label>
        <button
          onClick={handleAcknowledge}
          disabled={!confirmed}
          className="w-full bg-neutral-900 text-white font-medium py-3 rounded-xl hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
}
