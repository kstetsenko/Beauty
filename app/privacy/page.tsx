import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Aesthetic Guide NYC & Miami" };

export default function Privacy() {
  return (
    <article className="prose-sm space-y-4 text-sm leading-relaxed text-ink">
      <h1 className="text-2xl font-semibold text-ink">Privacy Policy</h1>
      <p className="text-xs text-muted">Template — have it reviewed by counsel and fill in the bracketed details before launch.</p>

      <h2 className="font-semibold text-ink">What we collect</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Quiz answers, city and ZIP/neighborhood</strong> stay in your browser for the current visit only. They are not saved or sent to us.</li>
        <li><strong>Health-related answers</strong> (e.g. pregnancy, skin conditions, medications) are used on your device to flag cautions and are never transmitted.</li>
        <li><strong>Email address</strong> — only if you choose to save your guide and tick the consent box. We store your email, city, the names of the procedures in your guide, and the consent wording with a timestamp.</li>
        <li>Your browser stores that you accepted the disclaimer and whether you dismissed the install hint.</li>
      </ul>

      <h2 className="font-semibold text-ink">How we use it</h2>
      <p>To send the guide you requested and educational updates you agreed to. We do not sell or share your personal information, and we do not use it for cross-context behavioral advertising.</p>

      <h2 className="font-semibold text-ink">Your rights (CCPA / GDPR)</h2>
      <p>You can unsubscribe from any email, and you can ask us to access, correct or delete your data by contacting [privacy@yourdomain.com]. We respond within 30 days.</p>

      <h2 className="font-semibold text-ink">Security & retention</h2>
      <p>Data is sent over HTTPS and kept only as long as you remain subscribed, then deleted within [90] days.</p>

      <h2 className="font-semibold text-ink">Contact</h2>
      <p>[Business name, address, privacy@yourdomain.com]</p>
    </article>
  );
}
