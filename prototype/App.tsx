import { useEffect, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import About from "@/app/about/page";
import Privacy from "@/app/privacy/page";
import Sources from "@/app/sources/page";
import Terms from "@/app/terms/page";
import { CompareView } from "@/components/CompareView";
import { ClinicFinder } from "@/components/ClinicFinder";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { Footer } from "@/components/Footer";
import { GoalGuide, GoalIndex } from "@/components/GoalGuide";
import { Guide } from "@/components/Guide";
import { Insights } from "@/components/Insights";
import { ProcedureBrowser } from "@/components/ProcedureBrowser";
import { ProcedureDetail } from "@/components/ProcedureDetail";
import { GOAL_LABELS, PROCEDURES } from "@/lib/procedures";
import type { Goal } from "@/lib/types";
import { fromHash, navigate, subscribe } from "./router";

function Page() {
  const hash = useSyncExternalStore(subscribe, () => location.hash, () => "");
  const r = fromHash(hash);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [hash]);

  switch (r.name) {
    case "procedures":
      return <ProcedureBrowser />;
    case "procedure": {
      const p = PROCEDURES.find((x) => x.id === r.id);
      return p ? <ProcedureDetail p={p} city={r.city} /> : <Guide />;
    }
    case "goals":
      return <GoalIndex />;
    case "goal":
      return GOAL_LABELS[r.goal] ? <GoalGuide goal={r.goal as Goal} city={r.city} /> : <GoalIndex />;
    case "compare":
      return <CompareView />;
    case "clinics":
      return <ClinicFinder key={hash} treatment={r.t} city={r.city} area={r.area} />;
    case "insights":
      return <Insights />;
    case "sources":
      return <Sources />;
    case "privacy":
      return <Privacy />;
    case "terms":
      return <Terms />;
    case "about":
      return <About />;
    default:
      // Re-mount the quiz when returning home so it starts fresh.
      return <Guide key={hash} />;
  }
}

function App() {
  // Route in-app links (/procedures, /compare?…) through the hash router.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href");
      if (!a || !href || a.target === "_blank" || !href.startsWith("/")) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="bg-ink text-white text-[11px] text-center py-1.5 px-3">Prototype for testing — not the live app</div>
      <header className="max-w-md w-full mx-auto px-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <a href="/" className="text-sm font-semibold tracking-tight">
            Aesthetic Guide <span className="text-muted font-normal hidden sm:inline">NYC &amp; Miami</span>
          </a>
          <span className="flex gap-3 text-xs text-muted">
            <a href="/goals" className="hover:text-ink">Goals</a>
              <a href="/procedures" className="hover:text-ink">All treatments</a>
            <a href="/compare" className="hover:text-ink">Compare</a>
          </span>
        </div>
      </header>
      <main className="flex-1 w-full max-w-md mx-auto px-5 py-6 flex flex-col">
        <Page />
      </main>
      <Footer />
      <DisclaimerModal />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
