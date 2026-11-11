import Link from "next/link";
import { FeedbackForm } from "./FeedbackForm";

export function Footer() {
  return (
    <footer className="max-w-md w-full mx-auto px-5 py-6 text-[11px] text-muted leading-relaxed text-center">
      <p>For education only — not medical advice. Always consult a board-certified dermatologist or plastic surgeon.</p>
      <nav className="mt-1.5 flex flex-wrap justify-center gap-x-3 gap-y-1">
        <Link href="/privacy" className="underline">Privacy</Link>
        <Link href="/terms" className="underline">Terms</Link>
        <Link href="/insights" className="underline">Core insights</Link>
        <Link href="/sources" className="underline">How we research</Link>
      </nav>
      <div className="mt-3 text-sm">
        <FeedbackForm />
      </div>
    </footer>
  );
}
