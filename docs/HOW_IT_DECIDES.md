# How the guide decides — every step, in plain words

| Step / dimension | Rule | Where in code | Tested by |
|---|---|---|---|
| **City** (first question) | Sets prices and clinics shown | `components/Guide.tsx` | e2e quiz |
| **Goals** (second) | Everything after is limited to these goals | `lib/profile.ts` `personalize` | unit match, e2e quiz |
| **Which treatments are included** | Only FDA-approved products or FDA-cleared devices, each verified with a source (`lib/basis.ts`); peels, dermaplaning, PRP, subcision, TCA CROSS, HydraFacial, microdermabrasion, Halo, MOXI and Laser Genesis were removed (no FDA approval exists, or no clearance record found) | `lib/basis.ts` | unit data |
| **Which treatments appear for a goal** | Only if its FDA approval/clearance (`lib/basis.ts`) or the cited studies (`lib/research.ts`) cover that goal | `lib/procedures.ts` `goals` | unit data/match |
| **Age, skin tone** | Hides treatments below the FDA-authorized age (fillers, microneedling 22+); IPL hidden for deep skin tones; lasers get a dark-mark caution on medium/deep tones (−2/−3) | `lib/match.ts`, `lib/advice.ts` | unit match |
| **Health questions** | Only questions that affect a treatment for your goals; each hides what the label or guideline rules out, with the reason | `lib/relevance.ts`, `lib/cautions.ts` | unit filters, e2e quiz |
| **Conditions** | Melasma: laser toning +3, peels/Sylfirm X +1, lasers that can darken melasma −3 with a warning. Rosacea: pulsed dye, KTP and IPL +3 | `lib/match.ts` `rank` | unit match |
| **Recent treatments** | Same-group single-session treatments still settling → "Later" with reason; others get a timing note | `lib/match.ts` `laterReason` | unit later, e2e quiz |
| **Ranking** | +3 per goal treated; +2 per level of evidence certainty; +1–3 results only if certainty is at least moderate; condition boosts and risk penalties; ties: fewer cautions → stronger research → lower price | `lib/match.ts` `rank` | unit match |
| **Reasons on each card** | FDA basis first (if any), goals it is used for, certainty of evidence, results (only if moderate or high), "its FDA clearance doesn't cover …", cautions | `lib/match.ts`, `lib/basis.ts` | unit match |
| **Certainty of evidence** | High = randomized controlled trials or pooled analyses; Moderate = systematic reviews or consistent smaller studies; Low = small/uncontrolled/manufacturer-funded studies or none | `lib/research.ts` | unit data |
| **Prices** | Clinic page → "From clinic prices"; national range → "Estimate"; none → "Price not available at the moment" (sorts last, never "under $500") | `lib/match.ts` `priceFrom/priceLow` | unit data |
| **Plans and filters** | Shown only if they fit your goals and leave ≥1 option | `lib/filters.ts`, `lib/relevance.ts` | unit filters, e2e clicks |
| **Compare** | Same goal only, up to 3; ends with "Find a clinic" for each | `components/CompareView.tsx` | e2e pages |
| **Clinics** | Listed if own pages show board-certified doctors + the treatment; neighborhood first, then A–Z; partners can't reorder; no checked clinic → labeled Google Maps search | `lib/clinics.ts` | unit clinics, e2e clinics |
| **Privacy** | Quiz answers stay in the tab; taps store no personal data | `lib/profile.ts`, `app/api/track` | unit api, e2e clinics |
