import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Aesthetic Guide NYC & Miami" };

export default function Privacy() {
  return (
    <article className="prose-sm space-y-4 text-sm leading-relaxed text-ink">
      <h1 className="text-2xl font-semibold text-ink">Privacy Policy</h1>
      <p className="text-xs text-muted">Template — have it reviewed by counsel and fill in the bracketed details before launch. Link-tap counts include the treatment looked at; counsel should confirm whether any state consumer-health-data notice applies (e.g. Washington&apos;s My Health My Data Act).</p>

      <h2 className="font-semibold text-ink">What we collect</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Quiz answers</strong> (city, goals, age range, skin tone, health notes, treatments you had recently) are kept only in your current browser tab so every page can use them, and are deleted when you close the tab or tap &ldquo;Start over&rdquo;. They are never sent to us. ZIP/neighborhood is not stored.</li>
        <li><strong>Health-related answers</strong> (e.g. pregnancy, skin conditions, medications) are used on your device only, to hide treatments that usually aren&apos;t advised, and are never transmitted.</li>
        <li><strong>Email address</strong> — only if you choose to save your guide and tick the consent box. We store your email, city, the names of the procedures in your guide, and the consent wording with a timestamp.</li>
        <li><strong>ZIP code</strong> — if you type one in the clinic finder, it is matched to a neighborhood on your device and never sent or stored.</li>
        <li><strong>Link taps</strong> — when you open the clinic finder or tap a clinic, Google Maps, directory or license link, we count it: the kind of link, the treatment, city, neighborhood (only if you picked one from our list), the page, and a random number for this browser tab. No name, no IP address, no typed ZIP code, no quiz answers. Clinic website links carry a tag (e.g. <code>utm_source=aestheticguide</code>) so the clinic can see the visit came from us.</li>
        <li>Your browser stores that you accepted the disclaimer and whether you dismissed the install hint.</li>
      </ul>

      <h2 className="font-semibold text-ink">How we use it</h2>
      <p>To send the guide you requested and educational updates you agreed to, and to report to clinics how many visits came from this guide (counts only — we never collect your name or contact details in the clinic finder). We do not sell or share your personal information, and we do not use it for cross-context behavioral advertising.</p>

      <h2 className="font-semibold text-ink">Your rights (CCPA / GDPR)</h2>
      <p>You can unsubscribe from any email, and you can ask us to access, correct or delete your data by contacting [privacy@yourdomain.com]. We respond within 30 days.</p>

      <h2 className="font-semibold text-ink">Security & retention</h2>
      <p>Data is sent over HTTPS. Email sign-ups are kept only as long as you remain subscribed, then deleted within [90] days. Link-tap counts contain no personal details.</p>

      <h2 className="font-semibold text-ink">Contact</h2>
      <p>[Business name, address, privacy@yourdomain.com]</p>
    </article>
  );
}
