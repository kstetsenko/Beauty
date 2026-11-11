/**
 * Tap-to-open section (native <details>, so it works without JavaScript and
 * with screen readers). Closed by default: users open only what they want.
 */
export function Disclosure({
  title,
  hint,
  children,
  open = false,
  tone = "card",
}: {
  title: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  tone?: "card" | "plain" | "soft";
}) {
  const box =
    tone === "card" ? "rounded-2xl bg-white border border-line" : tone === "soft" ? "rounded-2xl bg-blush" : "border-b border-line last:border-0";
  return (
    <details className={"group " + box} open={open}>
      <summary className="flex items-center justify-between gap-3 cursor-pointer list-none px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block font-medium leading-snug">{title}</span>
          {hint && <span className="block text-xs text-muted mt-0.5">{hint}</span>}
        </span>
        <span aria-hidden="true" className="shrink-0 text-xl leading-none text-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="px-5 pb-5 animate-in">{children}</div>
    </details>
  );
}
