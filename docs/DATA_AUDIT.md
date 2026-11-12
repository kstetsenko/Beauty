# Data audit — where every fact comes from

Last full review: November 2026. This file explains the provenance of each kind of data so it can be
re-checked. Nothing in the app should be added without a source of the kind listed here.

## Kinds of data and their sources
| Data | Source | Notes |
|---|---|---|
| Price ranges | Published clinic price pages in NYC/Miami, or RealSelf patient-reported averages | Shown as "From clinic prices" only when a page for that city publishes a price; otherwise "Estimate" |
| Studies | PubMed / PubMed Central (titles copied from the index) | Found via search results; links should be clicked through once before launch (this session's network could not open PubMed directly) |
| Evidence rating (Strong / Some / Limited) | Editorial summary of the cited studies | Strong = RCTs or meta-analysis of RCTs; Some = systematic reviews or consistent controlled studies; Limited = small/uncontrolled/maker-linked or none |
| Rare-but-serious risks, warning signs | FDA labels and safety communications; CDC MMWR | `lib/safety.ts` |
| Age limits (22+) | FDA consumer pages on fillers and microneedling devices | |
| Accutane guidance | 2017 JAMA Dermatology consensus; AAD (microneedling) | |
| Timeline dates | FDA documents, company announcements and reviews (each linked) | Only dates confirmed by a source are shown |
| Learning links | AAD, ASPS, FDA, CDC, NIH StatPearls | No clinic marketing |
| Pain (1–5), results (1–3), sessions, how long it lasts, recovery days | **Editorial estimates** from the cited studies, AAD pages and provider information | Labeled as general estimates on the "How we research" page |
| Intensity groups | Calculated from recovery days and pain | `lib/insights.ts` |

## Per-treatment status
| Treatment | NYC price (Published = clinic page or RealSelf) | Miami price | Studies cited | Evidence |
|---|---|---|---|---|
| Sofwave | Published | Estimate | 2 | Limited |
| Ultherapy | Published | Estimate | 2 | Some |
| Thermage FLX | Published | Estimate | 2 | Limited |
| Morpheus8 | Estimate | Estimate | 2 | Some |
| CO2 Laser | Estimate | Estimate | 2 | Some |
| Fraxel | Published | Estimate | 2 | Some |
| Halo Laser | Estimate | Estimate | 1 | Limited |
| Moxi | Estimate | Estimate | 2 | Limited |
| Clear + Brilliant | Published | Estimate | 2 | Limited |
| Microneedling | Published | Estimate | 2 | Limited |
| PRP Microneedling | Published | Published | 2 | Limited |
| Sculptra | Estimate | Estimate | 2 | Some |
| Botox / Dysport / Daxxify | Published | Published | 3 | Strong |
| Cheek Filler | Published | Estimate | 2 | Strong |
| Radiesse | Published | Estimate | 2 | Some |
| Skinvive | Estimate | Estimate | 1 | Limited |
| PDO Thread Lift | Published | Estimate | 2 | Limited |
| HydraFacial | Published | Estimate | 0 | Limited |
| Dermaplaning | Published | Published | 1 | Limited |
| Chemical Peel | Estimate | Published | 2 | Some |
| IPL / BBL Photofacial | Estimate | Estimate | 2 | Some |
| Pico Laser | Estimate | Estimate | 2 | Some |
| Under-Eye Filler | Published | Estimate | 2 | Strong |
| Pulsed Dye Laser (Vbeam) | Estimate | Estimate | 2 | Some |
| Microdermabrasion | Estimate | Published | 2 | Limited |
| Erbium Laser Resurfacing | Published | Estimate | 2 | Some |
| Emface | Estimate | Estimate | 1 | Limited |
| Laser Genesis | Estimate | Estimate | 1 | Limited |
| Tixel | Published | Estimate | 1 | Limited |
| LED Light Therapy | Published | Estimate | 2 | Limited |
| Subcision | Estimate | Estimate | 2 | Some |
| Smile-Line Filler | Published | Estimate | 2 | Strong |
| Bellafill | Estimate | Estimate | 3 | Some |
| TCA CROSS | Estimate | Estimate | 3 | Some |
| Aerolase (650-µs laser) | Estimate | Estimate | 2 | Some |
| Laser Toning (Q-switched Nd:YAG) | Published | Estimate | 2 | Some |
| Photodynamic Therapy (PDT) | Estimate | Estimate | 2 | Some |
| KTP Laser (Excel V) | Estimate | Estimate | 2 | Some |
| Microcurrent Facial | Published (Fresha listings) | Published (Fresha listings) | 1 | Limited |

## Known gaps
- Several Miami prices (and some NYC) are estimates because clinics do not publish them.
- HydraFacial and dermaplaning have no clinical trials; the app says so.
- Scope is face beauty treatments only: hair removal, tattoo removal, fat reduction, veins and sweating were removed.
- Not included because no reliable human evidence or primary source was found: Opus Plasma, polynucleotides (injectable).
  Aerolase (evidence is for active acne) would need a "breakouts" goal.
- Pain/results ratings are editorial and should be reviewed by a board-certified dermatologist.

## Link check history
- 2026-11-11 (first weekly run): 3 dead price pages replaced or removed (Skinly Fraxel → new URL; Ethos Spa Miami lip filler removed → Miami estimate; Kassir erbium → Tribeca Park Dermatology). RealSelf Miami Ultherapy page now redirects to a directory → Miami estimate. Redirected links updated. RealSelf, GoodRx and AEDIT block automated checks (403/429) — verify those manually.
- 2026-11-11 (second run): earlier dead links confirmed fixed. RealSelf Miami Fraxel page now redirects to a directory → Miami estimate. The check script now uses the current PubMed Central address. NY license lookup (op.nysed.gov) blocks automated checks — verify manually.

## Scope and goal review (2026-11-11)
- **Removed** (reshaping, not rejuvenation): lip filler, non-surgical nose job, masseter Botox (jaw slimming).
  The "Jawline, Chin & Nose" goal went with them; sagging along the jaw is covered by "Lifting & Firmness".
  "Volume & Lips" is now "Lost Volume" (cheeks and under-eyes).
- **Rule:** a treatment appears under a goal only if the studies cited for it (lib/research.ts) or its FDA
  approval/clearance support that goal. Goals removed because the cited evidence doesn't cover them:

| Treatment | Removed from | Why |
|---|---|---|
| Ultherapy | Jawline | Goal retired; lifting kept |
| Thermage | Texture | Studies cover tightening and wrinkles; added Lines |
| Morpheus8 | Lifting | Cited reviews cover acne scars and texture |
| Microneedling | Glow | Evidence is for acne scars and photoaging (texture, lines) |
| PRP | Texture, Glow | Evidence is only for acne scars, combined with microneedling |
| Sculptra | Lifting | Evidence is for volume restoration and wrinkles |
| Cheek Filler | Lifting, Jawline | Evidence is for midface volume; jaw/chin products are reshaping |
| Radiesse | Lifting, Jawline | Evidence is for smile lines and volume |
| HydraFacial, Dermaplaning | Texture | No clinical trials; kept only as "glow" facials |
| Chemical Peel | Acne scars | Cited evidence covers melasma and active acne, not scars |
| Pico laser | Acne scars | Cited studies cover wrinkles, pigment and photoaging; added Lines |
| Tretinoin | Acne scars | (Later removed: prescription creams are out of scope) |
| EMFACE | Lifting | The one study measured wrinkles only |

- **Questions to ask a provider** are now written per treatment (lib/questions.ts), from that treatment's own
  sessions, risks and safety notices. `npm run check` fails if a treatment has fewer than 3 or a question repeats.

## In-clinic services only; new treatments and goal (2026-11-11)
- **Removed** prescription creams (tretinoin, redness creams, melasma creams, azelaic acid): the guide now lists
  in-clinic services only. General advice keeps daily SPF.
- **Added** 8 in-clinic treatments, each with PubMed studies and an evidence label (weak evidence is shown as such):
  smile-line filler, Bellafill, TCA CROSS, Aerolase, laser toning, photodynamic therapy, KTP (Excel V), microcurrent.
  No NYC/Miami clinic page published prices for Bellafill, TCA CROSS, Aerolase, PDT or KTP, so those are national
  ranges labeled "Estimate".
- **New goal "Breakouts"** (active acne): Aerolase, PDT, chemical peels (systematic review of RCTs), pulsed dye laser
  and IPL (randomized split-face trial). The goal page quotes the AAD guideline: evidence was too limited to formally
  recommend procedures for acne.
- **Quick plans** on the results list (Event in 2 weeks, First time, Best value, Long-lasting) are filters over
  existing data: recovery days, pain, onset, starting price, evidence and the "how long it lasts" text.

## Clinic listings (2026-11-12)
Five clinics listed after checking the practice's own pages (or a university / profile page for credentials):
Spring Street Dermatology (SoHo), Tribeca Park Dermatology (Tribeca), Laser & Skin Surgery Center of New York
(Murray Hill), Miami Skin Institute (Coral Gables), UHealth Dermatology — Miami Beach. Only treatments named on
their pages are linked. No star ratings are copied. **Owner to spot-check before launch:** one doctor per clinic in
the state license lookup and AAD directory, and their Google reviews. No Brickell clinic could be verified yet.

## Clinic coverage and health questions (2026-11-12)
- Added 6 clinics (5 NYC, 1 Miami), each with address, credential source and only treatments named on their own
  pages. NYC: 37/39 treatments have a checked clinic (not yet: dermaplaning, microcurrent). Miami: 13/39.
  Where no checked clinic exists, the clinic finder shows a labeled "not checked by us" Google Maps search instead of an
  empty state. `npm run check` prints the current coverage.
- New quiz health questions, each from a product label: severe or lidocaine allergy (FDA filler labeling), bovine collagen
  allergy (Bellafill FDA labeling), pacemaker or implanted electronic device (Thermage labeling), porphyria or light
  sensitivity (Levulan/PDT FDA label). Sources listed on "How we research".
