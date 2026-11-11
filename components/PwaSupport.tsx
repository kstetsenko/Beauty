"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "install_hint_dismissed";

/** Registers the service worker and shows an "Add to Home Screen" hint. */
export function PwaSupport() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PROTOTYPE === "1") return;
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    let dismissed = false;
    try {
      dismissed = !!localStorage.getItem(DISMISS_KEY);
    } catch {}
    if (standalone || dismissed) return;

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
    if (isIos) {
      setIos(true);
      setHidden(false);
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setHidden(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    setHidden(true);
  };

  if (hidden || (!ios && !deferred)) return null;

  return (
    <div className="fixed bottom-3 inset-x-3 z-40 mx-auto max-w-sm rounded-2xl bg-white border border-line p-4 shadow-lg flex items-center gap-3">
      <p className="text-sm flex-1">
        {ios ? (
          <>Install this guide: tap <strong>Share</strong> <span aria-hidden="true">⎋</span> then <strong>Add to Home Screen</strong>.</>
        ) : (
          <>Install this guide on your device for quick access.</>
        )}
      </p>
      {deferred && (
        <button
          type="button"
          className="text-sm font-medium bg-ink text-white rounded-full px-4 py-1.5"
          onClick={async () => {
            await deferred.prompt();
            await deferred.userChoice.catch(() => null);
            setDeferred(null);
            dismiss();
          }}
        >
          Install
        </button>
      )}
      <button type="button" aria-label="Dismiss" onClick={dismiss} className="text-muted hover:text-ink px-1">✕</button>
    </div>
  );
}
