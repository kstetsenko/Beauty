# Referral tracking — how clinics know customers came from this guide

Goal: every visit we send to a clinic is traceable, **without collecting anyone's name or contact details**,
at no cost, and within US advertising and health-referral rules.

## The flow

Every "Find a clinic" button opens the app's own **clinic finder** (`/clinics?t=<treatment>&city=<city>`).
The person picks a city, a neighborhood or types a ZIP (matched to a neighborhood on their device; never sent).
They see, in order:
1. **Partner clinics** (paid, labeled "Partner", with `PARTNER_NOTE`) — none yet.
2. **Listed clinics** (free) that meet the published criteria (`lib/clinics.ts`, shown on /sources#clinics):
   board-certified doctors on staff (source + date on the card), the treatment on their own site, an address in
   one of our neighborhoods. Chosen neighborhood first, then A–Z — never by fee.
3. **Search on your own** (folded): Google Maps, AAD/ASPS directories, license lookup.

People contact clinics themselves. Each card has Website, Book/Call, Directions and Google reviews.

## What is traced

| Signal | What it proves | Where you see it |
|---|---|---|
| **Booking code** per clinic (e.g. `AG-SPRING`), shown on the card: "mention it when you book" | Actual bookings — the clinic counts how many people said it | Ask the clinic monthly |
| **Tagged website / booking links** (`utm_source=aestheticguide`, `utm_campaign=<treatment>`, `ag_click=<id>`) | Visits in the clinic's *own* Google Analytics | Clinic's analytics + `/report` |
| **Taps** on Website, Book, Call, Directions, Reviews | Interest per clinic and treatment | `/report` |
| **Unique visitors** (random id per browser tab) | How many people looked at each clinic | `/report` |
| **Searches** (treatment × neighborhood) and Google Maps taps | Demand, even where no clinic is listed | `/report` → "What people searched for" |

The code is the same for everyone, so it identifies no one.

## Rules this design follows

- **Flat fee, never per patient, per lead, per booking or per click.** Payments tied to referrals can fall under
  Florida's Patient Brokering Act (Fla. Stat. 817.505) and New York's fee-splitting rules. Get a healthcare
  lawyer's sign-off before charging anything.
- **Free list stays.** Partners are added on top with a "Partner" label (FTC endorsement guides); they never
  remove or reorder free listings or change treatment rankings.
- **No personal data.** No forms; ZIP stays on the device; taps carry no name, IP address or quiz answer.

## One-time setup (free)

1. Free Supabase project (no card) → SQL Editor → paste `supabase/tracking.sql` → Run.
2. Hosting settings (e.g. Vercel): `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` (service_role, server only),
   `REPORT_KEY` (long random password). Redeploy.
3. Open `https://<your-site>/report`, enter the key, pick a month.

Free Supabase projects pause after about a week without activity; add a daily keep-alive (as in other projects)
or open `/report` weekly.

## Adding or re-checking a clinic

1. Board certification: the practice's site or a university directory names board-certified doctors
   (record the page as `credentialSource`). Spot-check one doctor in the AAD/ASPS directory and the state license lookup.
2. Treatments: add only ids whose pages exist on the clinic's site (`offers`).
3. Address in one of our neighborhoods; set `checkedAt` to today; pick a short unique `code` (`AG-…`).
4. Never copy star ratings; `googleUrl` links to their Google listing.
5. Re-check every 6 months; remove clinics that no longer meet the criteria.

## Partners later

Partner = same card with `partner: true`, shown in its own labeled section, plus optional `bookingUrl` and
`phone`. Monthly: `/report` → last month → per clinic CSV → send with the (flat) invoice, and ask how many
people mentioned their code.

## Switching to live Google ratings later (option C)

Keep this curated list; add a Google Cloud API key (billing account required, budget cap advised) and fetch
the rating for each listed clinic by **place ID** when a card is shown. Google allows storing place IDs but not
ratings or reviews, and requires "Google" attribution next to them. See the cost note in the README.
