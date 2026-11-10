import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-16">
      <div className="max-w-3xl mx-auto px-4 py-6 text-xs text-neutral-500 leading-relaxed space-y-3">
        <p>
          <strong className="text-neutral-700">Medical disclaimer:</strong> Aesthetic Guide NYC & Miami is for
          educational purposes only and is not medical advice, diagnosis or treatment. Procedure information and price
          ranges are general estimates that vary by provider. Always consult a board-certified dermatologist or
          licensed practitioner before any procedure. Listings are not endorsements. In an emergency, call 911.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/privacy" className="underline hover:text-neutral-800">Privacy Policy</Link>
          <Link href="/terms" className="underline hover:text-neutral-800">Terms of Use</Link>
          <span>© {new Date().getFullYear()} Aesthetic Guide NYC & Miami</span>
        </nav>
      </div>
    </footer>
  );
}
