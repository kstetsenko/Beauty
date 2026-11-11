"use client";

/** Multi-select chips. Tap to toggle; `max` caps the number selected. */
export function Chips<T extends string>({
  options,
  selected,
  onChange,
  max,
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (v: T[]) => void;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o.value);
        const full = !on && max !== undefined && selected.length >= max;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            disabled={full}
            onClick={() => onChange(on ? selected.filter((x) => x !== o.value) : [...selected, o.value])}
            className={
              "rounded-full border px-4 py-2.5 text-sm transition-colors disabled:opacity-40 " +
              (on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink")
            }
          >
            {on ? "✓ " : ""}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
