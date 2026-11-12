# Aesthetic Guide NYC & Miami — Status Report

**Date:** November 12, 2026 · **Built:** November 10–12, 2026 (24 releases)
**Prototype (shareable):** https://claude.ai/artifact/86ywCAZGFFtDE1bhHJfzBm
**Code:** github.com/kstetsenko/Beauty (branch `main`)

---

## 1. In one paragraph

Aesthetic Guide is an educational web app that helps people in New York City and Miami choose in-clinic face
treatments. A 5-question quiz (about a minute) covers city, goals, age, skin tone, health conditions and recent
treatments. The guide then ranks the treatments that are safe for that person, explains why each one is ranked
where it is, and points them to clinics that meet published criteria. Every price, study and safety claim links to
its source. Clinic visits can be traced through tagged links, booking codes and tap counts without collecting
anyone's name. The app is complete as a working prototype with automated tests. It is not yet live on its own
web address.

---

## 2. Senior developer view — what was built and how

**Stack.** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS. The app installs on phones like an app.
Strict security headers are in place. A separate build produces a single-file prototype for sharing.

**Structure.**
| Area | Where | What it holds |
|---|---|---|
| Treatment data | `lib/procedures.ts`, `lib/research.ts` | 39 treatments: prices per city, sessions, recovery, pain, results, contraindications; PubMed studies, evidence rating, price sources |
| Safety and advice | `lib/safety.ts`, `lib/advice.ts`, `lib/cautions.ts` | FDA and CDC risks; personal notes by skin tone, conditions and recent treatments, each with a source; 10 health questions taken from labels |
| Matching and ranking | `lib/match.ts`, `lib/profile.ts` | Hides unsafe options and gives the reason; transparent score (goals, research, results, fit), with ✓ reasons and ! cautions |
| Learning | `lib/learn.ts`, `lib/questions.ts` | AAD and ASPS links; goal guides; 3–4 provider questions written for each treatment |
| Clinics and tracking | `lib/clinics.ts`, `lib/tracking.ts`, `app/api/track`, `app/api/report`, `lib/store.ts` | 11 checked clinics, booking codes, ZIP → neighborhood matching on the device, tagged links, tap logging, owner-only report |
| UI | `components/`, `app/` | Quiz, ranked results with quick plans, goal guides, compare, treatment pages, clinic finder, report page |
| Quality | `tests/unit`, `tests/e2e`, `.github/workflows/ci.yml` | 238 unit/data tests, 204 browser tests, CI on every push |
| Data freshness | `scripts/weekly-check.mjs`, weekly GitHub workflow | Every Monday: broken links, new PubMed papers, stale prices → a GitHub issue for review |

**Key engineering decisions.**
- **Health data never leaves the browser.** Quiz answers live in that browser tab only. Tracking stores no names, IP
  addresses, typed ZIP codes or quiz answers; the API validates every field against known values.
- **Sources over opinions.** Data without a confirmed source is labeled "Estimate" or left out. Research strength
  is shown on every treatment.
- **Transparent ranking.** One scoring function with published rules. Ties go to the option with fewer cautions.
- **Regression safety.** `npm run verify` runs types, unit and data tests, the safety matrix, the build, the
  prototype and browser tests at 390px and 1100px. CI runs the same on GitHub. Every bug fix must add a test.

**Technical debt and risks.**
- Not deployed yet: no domain, no live database, so tap counts are not being saved.
- Free Supabase projects pause after about 7 days idle; a keep-alive is needed.
- Some price and clinic sources block automated checks; they must be opened by hand.
- Clinic listings must be re-checked every 6 months (`checkedAt`).

---

## 3. CEO view — product, position and decisions

**What we offer users:** every in-clinic face treatment, ranked for their skin, with the evidence, and no paid
rankings. No other guide we know of combines safety filtering, evidence strength and local prices in one place.

**Decisions made so far**
| Decision | Why |
|---|---|
| Face treatments only, in-clinic services only | Focused, credible scope; removed hair/tattoo/body, reshaping (lips, nose, jaw) and prescription creams |
| Never make anything up | Credibility is the product; legal protection |
| Clinic listing by published criteria, free; "Partner" listings for a flat fee only | Trust plus revenue within patient-brokering and fee-splitting rules |
| No forms that collect contact details (for now) | Privacy, less legal exposure, lower friction |
| Option A (curated clinics) now, live Google ratings (C) later | Free now; C when traffic justifies it |

**Current state**
- Product: feature-complete prototype. 39 treatments, 9 goals, 10 health questions, 87 pages.
- Clinics: NYC has a checked clinic for 37 of 39 treatments; Miami for 13 of 39. Every other combination shows a
  labeled Google Maps search instead.
- Quality: 442 automated tests passing.

**Top risks:** legal review not done; Miami clinic coverage thin; clinic details need a human spot-check;
health-privacy rules (consumer health data laws) could apply once identities are collected.

---

## 4. Marketing director view — audience, message, funnel

**Audience:** adults 22–65 in NYC and Miami considering Botox, fillers, lasers, skin tightening, facials and
acne-scar treatments; first-timers who feel overwhelmed and research-minded repeat clients.

**Message:** "Every in-clinic face treatment, ranked for your skin — with the evidence." Supporting points:
safe-for-you filtering, real local prices, research strength, no paid rankings.

**Funnel and what we can measure today**
1. Visit → quiz (5 questions, about a minute)
2. Ranked results → quick plans (Event in 2 weeks, First time, Best value, Long-lasting) → save to list
3. Clinic finder → website / call / directions / reviews (tagged and counted) → booking code at the clinic

Measured once hosting is live: visitors, searches by treatment and neighborhood (a demand map), taps per clinic,
and booking codes reported by clinics. No emails are collected yet, so no remarketing list.

**Assets ready:** shareable prototype link; feedback button (becomes GitHub issues); "How we research" page as a
trust anchor; partner disclosure language.

**Recommended next marketing steps**
- Collect tester feedback on the prototype (5–10 people per city).
- Launch with neighborhood pages (e.g. "Morpheus8 near Brickell") once clinic coverage improves.
- Add an opt-in "email me my list" (Option C) to start an owned audience.
- Use the demand report as the sales deck for clinics ("212 people looked for X near you last month").
- No influencer or celebrity content (legal risk, decided earlier).

---

## 5. CFO view — costs, revenue model, unit economics

**Spend to date:** $0 in tools. Everything uses free tiers or open-source software.

**Running costs at 10–50 users a week**
| Item | Cost |
|---|---|
| Hosting (Vercel free plan) | $0 now. The free plan is meant for non-commercial use, so plan about $20/month (Vercel Pro) or another host once you sell listings. |
| Database (Supabase free) | $0. Under 1 MB a month of tap data; the 500 MB free limit lasts years. |
| Live Google ratings (Option C, later) | Likely $0 within Google's free monthly allowance; needs a card on file and a budget cap (about $5) |
| Email (Option C, later) | $0 on a free tier at this volume |
| Domain | about $10–20 a year |
| Legal review (recommended before charging) | one-off, quote needed from a healthcare lawyer |

**Revenue model, staying within the rules**
- **Phase 1 (now):** free listings, collect demand and tap data for 2–3 months.
- **Phase 2:** "Partner" listings at a flat monthly fee (labeled; the free list stays; rankings never change).
- **Phase 3:** flat-fee extras such as a "credentials verified" badge, featured neighborhood placement, or labeled
  sponsored education.
- **Not allowed:** fees per lead, booking, click or patient, or a share of what patients pay (Florida Patient
  Brokering Act, New York fee-splitting rules).

**What to measure before pricing:** monthly visitors, clinic searches per neighborhood, taps per clinic, and
booking codes reported. Price partner listings once the report shows consistent demand per clinic.

---

## 6. Open decisions for you

1. **Customer identity:** B (personal booking codes, no personal data), C (optional "email me my list"), D (optional
   sign-in by email link). Recommendation: B now, then C, then D. Not E (email required).
2. **When to add live Google ratings (C):** recommended at about 200 users a week or when selling partner listings.
3. **Healthcare lawyer:** before charging clinics or collecting emails.

## 7. Next steps (in order)

| # | Step | Who | Effort |
|---|---|---|---|
| 1 | Spot-check the 11 clinics (license lookup, Google reviews) | You | ~25 min |
| 2 | Share the prototype with testers; collect feedback | You | 1 week |
| 3 | Create free Supabase project, run `supabase/tracking.sql`, deploy to Vercel with 3 settings, buy a domain | You (with my help) | 1–2 hours |
| 4 | Fill in the Terms and Privacy blanks (business name, address, state, contact) | You | 30 min |
| 5 | Decide customer identity option (B/C/D); I build it with tests | You → me | 1 day |
| 6 | Add a database keep-alive | Me | 15 min |
| 7 | Grow Miami clinic coverage (owner checks or Option C) | You / me | ongoing |
| 8 | Healthcare lawyer review (partner model, Terms, Privacy, health-data notices) | You | 1 meeting |
| 9 | After 2–3 months of data: set flat partner pricing and approach clinics with the demand report | You | — |
| 10 | Weekly: review the data-check issue; monthly: report CSV per clinic | You | 15 min/week |
