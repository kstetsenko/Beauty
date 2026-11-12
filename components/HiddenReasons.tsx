import type { Source } from "@/lib/cautions";

/** "Not usually advised with: pregnancy (source)" — every reason links to the label or guideline behind it. */
export function HiddenReasons({ reasons, sources }: { reasons: string[]; sources: Source[] }) {
  return (
    <ul className="mt-1 space-y-1 text-xs text-muted">
      {reasons.map((r, i) => (
        <li key={r}>
          Not usually advised with {r.charAt(0).toLowerCase() + r.slice(1)}.{" "}
          {sources[i] && (
            <a href={sources[i].url} target="_blank" rel="noopener noreferrer" className="underline">Source: {sources[i].label}</a>
          )}
        </li>
      ))}
    </ul>
  );
}
