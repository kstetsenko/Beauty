import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use — Aesthetic Guide NYC & Miami" };

export default function Terms() {
  return (
    <article className="space-y-4 text-sm leading-relaxed text-ink">
      <h1 className="text-2xl font-semibold text-ink">Terms of Use</h1>
      <p className="text-xs text-muted">Template — have it reviewed by counsel before launch.</p>

      <h2 className="font-semibold text-ink">Educational use only</h2>
      <p>All content is general information. It is not medical advice, diagnosis or treatment, and it does not create a doctor–patient relationship. Always consult a board-certified dermatologist or licensed practitioner about your own situation.</p>

      <h2 className="font-semibold text-ink">Prices and listings</h2>
      <p>Price ranges are rough estimates and may be out of date. Provider listings and links to third-party directories are for convenience and are not endorsements, referrals or guarantees. Ratings are copied from public sources on the date shown. Verify credentials and licensing yourself.</p>

      <h2 className="font-semibold text-ink">Eligibility</h2>
      <p>This service is intended for adults 18 and older.</p>

      <h2 className="font-semibold text-ink">Limitation of liability</h2>
      <p>To the extent permitted by law, we are not liable for decisions made or procedures undertaken based on this content.</p>
    </article>
  );
}
