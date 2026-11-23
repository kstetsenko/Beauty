import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use — Aesthetic Guide NYC & Miami" };

export default function Terms() {
  return (
    <article className="space-y-4 text-sm leading-relaxed text-ink">
      <h1 className="text-2xl font-semibold text-ink">Terms of Use</h1>
      <p className="text-xs text-muted">Template — have it reviewed by counsel before launch.</p>

      <h2 className="font-semibold text-ink">Educational use only</h2>
      <p>All content is general information. It is not medical advice, diagnosis or treatment, and it does not create a doctor–patient relationship. Always consult a board-certified dermatologist, plastic surgeon or other licensed medical provider about your own situation.</p>

      <h2 className="font-semibold text-ink">No instructions</h2>
      <p>The guide describes treatments and reports what product labels, FDA records and published studies say. It never tells you how to prepare, what to stop or start, or when to have a treatment. Your provider gives you before-treatment and aftercare instructions.</p>

      <h2 className="font-semibold text-ink">Not a referral service</h2>
      <p>We do not refer patients to any provider, book appointments or pass your details to clinics. We receive no payment for any referral, booking, visit or patient, and no share of what you pay a clinic. Clinics marked &ldquo;Partner&rdquo; pay a flat listing fee that does not depend on visits, bookings or patients.</p>

      <h2 className="font-semibold text-ink">Prices and listings</h2>
      <p>Price ranges are rough estimates and may be out of date. Provider listings and links to third-party directories are for convenience and are not endorsements, referrals or guarantees. Clinics marked &ldquo;Partner&rdquo; pay a flat listing fee to appear; they do not pay per patient and do not affect which treatments are shown or how they are ranked. Any rating shown comes from Google and is labeled as such. Full-course and yearly costs are our arithmetic from typical prices and session counts, not quotes. Verify credentials and licensing yourself.</p>

      <h2 className="font-semibold text-ink">Credentials</h2>
      <p>&ldquo;Board-certified&rdquo; and other credentials are shown as stated by each clinic or a university directory on the date checked, with a link to that statement. We have not independently verified them. You can check a doctor&apos;s certification at the ABMS Certification Matters site and a license with the New York Office of the Professions or the Florida Department of Health license lookup.</p>

      <h2 className="font-semibold text-ink">FDA status and off-label use</h2>
      <p>We describe each treatment&apos;s FDA approval or clearance with a link to the source. When a treatment is listed for a goal its FDA approval or clearance doesn&apos;t cover, we say so; that is called off-label use. FDA status can change; check the source link.</p>

      <h2 className="font-semibold text-ink">Not for emergencies</h2>
      <p>If you have signs of a serious reaction after a treatment — such as vision changes, skin turning white or dusky, trouble breathing or swallowing — call 911 or go to an emergency room.</p>

      <h2 className="font-semibold text-ink">Results and safety information</h2>
      <p>Results, recovery and risks vary from person to person, and nothing here is a promise of any result. Study summaries, FDA status and safety notices are accurate as of the date checked and can change. The quiz only hides treatments that are commonly not advised for the answers you give; it cannot assess your health.</p>

      <h2 className="font-semibold text-ink">Clinics</h2>
      <p>We are not a medical provider and do not provide, supervise or guarantee any treatment. Clinics, including Partner clinics, are independent businesses responsible for their own services, pricing, licensing and care. Clinics are listed because they meet published criteria (see &ldquo;How we research&rdquo;), not as endorsements. You contact clinics directly; we don&apos;t pass your details to them.</p>

      <h2 className="font-semibold text-ink">Links and trademarks</h2>
      <p>Links to other websites (including Google Maps, PubMed, the FDA and professional societies) are provided for information; we don&apos;t control their content. Brand names are trademarks of their owners and are used only to identify treatments; we are not affiliated with any brand.</p>

      <h2 className="font-semibold text-ink">Eligibility</h2>
      <p>This service is intended for adults 18 and older. We do not knowingly collect information from children.</p>

      <h2 className="font-semibold text-ink">Accessibility</h2>
      <p>See our <a href="/accessibility" className="underline">accessibility statement</a> to report a barrier or ask for information in another format.</p>

      <h2 className="font-semibold text-ink">Limitation of liability</h2>
      <p>To the extent permitted by law, we are not liable for decisions made or procedures undertaken based on this content, or for the services of any clinic.</p>

      <h2 className="font-semibold text-ink">Changes and contact</h2>
      <p>We may update these terms; the date below shows the latest version. Governing law: [State]. Contact: [Business name, address, email]. Last updated: [date].</p>
    </article>
  );
}
