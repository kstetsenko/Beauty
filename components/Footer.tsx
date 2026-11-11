import Link from "next/link";

export function Footer() {
  return (
    <footer className="max-w-md w-full mx-auto px-5 py-6 text-[11px] text-muted leading-relaxed text-center">
      <p>For education only — not medical advice. Always consult a board-certified dermatologist or plastic surgeon.</p>
      <p className="mt-1.5 space-x-3">
        <Link href="/privacy" className="underline">Privacy</Link>
        <Link href="/terms" className="underline">Terms</Link>
        <Link href="/insights" className="underline">Core insights</Link>
        <Link href="/sources" className="underline">How we research</Link>
      </p>
    </footer>
  );
}
