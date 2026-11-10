const LABELS = ["City", "Quiz", "Results"];

export function Steps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2 text-xs font-medium mb-6" aria-label="Progress">
      {LABELS.map((l, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "now" : "next";
        return (
          <li key={l} className="flex items-center gap-2 min-w-0" aria-current={state === "now" ? "step" : undefined}>
            <span
              className={
                "h-6 w-6 shrink-0 rounded-full grid place-items-center " +
                (state === "next" ? "bg-neutral-200 text-neutral-500" : "bg-neutral-900 text-white")
              }
            >
              {state === "done" ? "✓" : n}
            </span>
            <span className={"truncate " + (state === "next" ? "text-neutral-400" : "text-neutral-900")}>{l}</span>
            {n < LABELS.length && <span className="w-6 sm:w-10 h-px bg-neutral-300 shrink-0" />}
          </li>
        );
      })}
    </ol>
  );
}
