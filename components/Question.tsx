"use client";

export interface Option<T> {
  value: T;
  label: string;
  hint?: string;
}

/** One question per screen. Tapping an option answers and moves on. */
export function Question<T extends string | number>({
  title,
  sub,
  options,
  selected,
  onPick,
  columns = 1,
}: {
  title: string;
  sub?: string;
  options: Option<T>[];
  selected?: T;
  onPick: (v: T) => void;
  columns?: 1 | 2;
}) {
  return (
    <section className="animate-in">
      <h1 className="text-2xl font-semibold leading-tight mb-1.5">{title}</h1>
      {sub && <p className="text-sm text-muted mb-6">{sub}</p>}
      {!sub && <div className="mb-6" />}
      <div className={columns === 2 ? "grid grid-cols-2 gap-2.5" : "grid gap-2.5"}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onPick(o.value)}
            aria-pressed={selected === o.value}
            className={"tile " + (selected === o.value ? "!border-ink bg-blush" : "")}
          >
            <span className="block font-medium">{o.label}</span>
            {o.hint && <span className="block text-xs text-muted mt-0.5">{o.hint}</span>}
          </button>
        ))}
      </div>
    </section>
  );
}
