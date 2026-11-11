# Aesthetic Guide NYC & Miami

An educational, evidence-based guide to aesthetic treatments in New York City and Miami.
A 1-minute quiz builds a personal profile (goals, age, skin tone, health notes, recent
treatments). Every page then shows only treatments that are safe and realistic for
that person, with research, prices, risks and ways to find providers nearby.

Built with Next.js (App Router), TypeScript and Tailwind CSS. Installable as a web app (PWA).

**Shareable prototype:** https://claude.ai/artifact/86ywCAZGFFtDE1bhHJfzBm (rebuild with `npm run prototype`).

## Run locally
```bash
npm install
npm run dev                    # http://localhost:3000
npm run build && npm start     # production mode (service worker active)
npm run typecheck              # TypeScript check
npm run prototype              # single-file prototype → prototype/dist/index.html
npm run data-check             # the weekly data check, without opening an issue
```

## Deploy (Vercel)
1. Import this GitHub repo in Vercel (framework preset: Next.js).
2. Environment variables (all optional — see `.env.example`):
   - `SUBSCRIBE_WEBHOOK_URL` / `SUBSCRIBE_WEBHOOK_TOKEN` — where "Email me this guide" sign-ups go.
   - `FEEDBACK_GITHUB_REPO` + `FEEDBACK_GITHUB_TOKEN` — visitor feedback becomes GitHub issues labeled `feedback`
     (use a fine-grained token with *Issues: read & write* on this repo only). Or `FEEDBACK_WEBHOOK_URL`.
   - `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` + `REPORT_KEY` — referral tracking and the owner-only `/report` page
     (free Supabase project; run `supabase/tracking.sql` once). See `docs/TRACKING.md`.
3. Add your domain. HTTPS is automatic.

## Project structure
| Folder / file | What it holds |
|---|---|
| `lib/procedures.ts` | **Every treatment**: name, brand aliases, category, goals, prices per city, sessions, recovery, pain, results, contraindications |
| `lib/research.ts` | Per treatment: price sources, evidence rating, PubMed studies, side effects, when results show; `CHECKED` date |
| `lib/safety.ts` | Rare-but-serious risks and "get help if" signs (FDA labels / safety notices, CDC) |
| `lib/learn.ts` | AAD / ASPS / FDA learning links; goal guides; option order |
| `lib/advice.ts` | Personal notes from quiz answers (skin tone, melasma, rosacea, cold sores, Accutane, recent treatments) — each with a source |
| `lib/match.ts` | Matching and **safety filtering** (`safetyReasons`, `matchProcedures`) |
| `lib/profile.ts` | The person's answers (kept in the browser tab only) and `personalize()` used by every page |
| `lib/insights.ts`, `lib/trends.ts` | Core-insights timeline and facts; "trending but not FDA-approved" cautions |
| `lib/clinics.ts` | Directory links, neighborhoods, the (empty) partner clinic list, `PARTNER_NOTE` and consent wording |
| `lib/tracking.ts`, `lib/store.ts` | Referral tracking: tap logging, UTM tags, storage (Supabase or local file) — see `docs/TRACKING.md` |
| `components/` | UI: quiz (`Guide`), cards, procedure page, goal guides, compare, browser, feedback form |
| `app/` | Pages and API routes (`/api/subscribe`, `/api/feedback`, `/api/track`, `/api/lead`, `/api/report`); owner-only `/report` |
| `prototype/` | Single-file prototype build (hash router + small shims) |
| `scripts/weekly-check.mjs` | Weekly link / PubMed / freshness check |
| `.github/workflows/weekly-data-check.yml` | Runs the check every Monday and opens an issue |
| `docs/DATA_AUDIT.md` | Which facts come from which kind of source, and what is an editorial estimate |

## Editing data
- **Add a treatment:** add an entry in `lib/procedures.ts`, then the same `id` in `lib/research.ts` (required),
  and optionally `lib/safety.ts` and `lib/learn.ts`. `npm run typecheck` tells you if something is missing.
- **Update prices:** change `cost` in `lib/procedures.ts`, add the page you checked to `prices` in
  `lib/research.ts` (tag `city` only if it publishes a price for that city), and update `CHECKED`.
- **Add a study:** only peer-reviewed papers you have found on PubMed; use `pm("PMID")` or `pmc("PMC…")`.
- After any change: `npm run build`, then `npm run prototype` and republish the prototype.

## Weekly data refresh
`.github/workflows/weekly-data-check.yml` runs every Monday (and on demand from the Actions tab). It opens an issue listing
broken or moved source links, new PubMed papers per treatment from the past week, and a warning when prices are over
90 days old. It **never edits data automatically**: a person reviews and updates, so nothing unverified is published.

## Evidence rules
See `app/sources/page.tsx` (the "How we research" page) and `docs/DATA_AUDIT.md`. In short: prices from published clinic
pages or RealSelf patient averages (otherwise labeled "Estimate"); studies only from PubMed; safety from FDA/CDC; learning
links from AAD/ASPS/FDA; no ratings, dates or claims we could not confirm.
