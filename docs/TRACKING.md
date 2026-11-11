# Referral tracking — how clinics know customers came from this guide

Goal: every customer we send to a partner clinic can be traced, at no cost, in a way that
fits US advertising and health-referral rules.

## The flow

Every "Find a clinic" button opens the app's own **clinic finder** (`/clinics?t=<treatment>&city=<city>`),
not Google Maps. There, in this order:
1. **Partner clinics** for that treatment and area (traceable contact options below).
2. **"Connect me with a clinic"**: the person leaves name + email/phone; you get the request with a reference
   number and pass it to one partner clinic near them. Promise shown to them (`CONNECT_PROMISE`): a reply within
   2 business days, or "we don't have one there yet". **You must keep that promise.**
3. **Search on your own** (folded): Google Maps, AAD/ASPS directories, license lookup — all counted.

Each finder visit is counted (treatment × city × neighborhood), so `/report` shows demand even before any
clinic signs up. Use it when pitching clinics: "42 people looked for Morpheus8 near Brickell last month".

## What is traced (ranked by strength of proof)

| # | Method | What it proves | Where you see it |
|---|---|---|---|
| 1 | **Consultation / "connect me" request** | A dated lead with a reference number (e.g. `AG-7K2P9M`) that both the person and the clinic see | `/report` → per clinic, with CSV |
| 2 | **Tagged website / booking links** | The visit, in the clinic's *own* Google Analytics: source `aestheticguide`, medium `referral`, campaign = treatment, plus `ag_click=<id>` that matches our log | Clinic's analytics + `/report` |
| 3 | **Call taps** | Someone tapped the clinic's phone number from the guide (not that the call connected) | `/report` |
| 4 | **Unique visitors** | Distinct browser tabs that tapped anything for that clinic | `/report` |
| — | **Finder visits and Google Maps taps** | Not tied to a clinic. Counted as *demand* (treatment × neighborhood) to show prospective partners | `/report` → "What people searched for" |

Later (not built yet): **referral codes**. The reference number already works as one: ask
clinics to note it at booking. Tracked phone numbers cost money, so they are left out.

## Rules this design follows

- **Flat listing fee, not per patient.** Paying per patient referred can fall under Florida's
  Patient Brokering Act (Fla. Stat. 817.505) and New York's fee-splitting rules for licensed
  professionals. The tracking proves value to clinics; it is *not* a per-patient invoice.
  Get a healthcare lawyer's sign-off before any per-lead or per-booking pricing.
- **Visible "Partner" label** and a plain note on every partner card (FTC endorsement guides):
  `PARTNER_NOTE` in `lib/clinics.ts`. Partners never change treatment ranking or research;
  partner clinics are sorted by chosen neighborhood, then A–Z, never by fee.
- **Health data never leaves the browser.** Requests contain only what the person types plus
  the clinic and treatment; the form tells them not to include health details. Link taps carry
  no personal data and no IP address. See `/privacy`.
- **Consent** wording (`LEAD_CONSENT`) is stored with every request.

## One-time setup (free)

1. Create a free project at supabase.com (no card needed). Separate from any other project.
2. SQL Editor → paste `supabase/tracking.sql` → Run.
3. In the hosting settings (e.g. Vercel → Project → Settings → Environment Variables) add
   `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (service_role key; server only) and `REPORT_KEY`
   (a long random password). Redeploy.
4. Open `https://<your-site>/report`, enter the key, pick a month.

Without these settings the site still works: taps are not saved and the request form says
requests aren't open yet. Partner cards only appear once a partner is added (step below).

## Adding a partner clinic

1. Check board certification (AAD / ASPS directories) and the state license (links in the app).
2. Sign a flat-fee listing agreement. Agree that they record our reference numbers and check
   their analytics for source `aestheticguide`.
3. Add an entry to `CLINICS` in `lib/clinics.ts` with `partner: true` (see the example there).
   `offers` must use treatment ids from `lib/procedures.ts`. Ratings only if copied from Google
   with the date.
4. Until there is an email service, forward new requests to the clinic yourself from `/report`
   (or ask the clinic to check it with you weekly). A free email service (e.g. Resend's free tier)
   can be added later to send them automatically to `leadEmail`.

## Weekly routine

`/report` → this month → **"Connect me" requests** → pass each new one to one partner clinic near them (by email,
with the reference number), or reply that there isn't one yet. Do this within 2 business days.

## Monthly routine

`/report` → pick last month → per clinic: visitors, website/booking/call taps, requests →
**CSV** → send with the invoice. Mark requests the clinic confirms as booked (Supabase table
`leads`, column `status`).
