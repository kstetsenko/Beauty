import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accessibility — Aesthetic Guide NYC & Miami" };

export default function Accessibility() {
  return (
    <article className="space-y-4 text-sm leading-relaxed text-ink">
      <h1 className="text-2xl font-semibold">Accessibility</h1>
      <p>
        We want everyone to be able to use this guide. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at
        level AA: the pages work with a keyboard and screen readers, text can be enlarged, buttons have labels, and the
        layout fits small phone screens without sideways scrolling. Every release is tested on phone and desktop widths.
      </p>
      <p>
        If something is hard to use, or you need any information in another format, please tell us using the feedback
        button at the bottom of each page or by email at [accessibility@yourdomain.com]. We aim to reply within 5 business days.
      </p>
      <p className="text-xs text-muted">Last reviewed: [date].</p>
    </article>
  );
}
